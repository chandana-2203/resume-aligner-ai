import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Health check
app.get('/make-server-bfaeb875/health', (c) => {
  return c.json({ status: 'ok' });
});

// Define strict JSON schema for Gemini response
const responseSchema = {
  type: 'object',
  properties: {
    alignedResume: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        title: { type: 'string' },
        summary: { type: 'string' },
        experience: {
          type: 'array',
          items: { type: 'string' }
        },
        education: { type: 'string' }
      },
      required: ['name', 'title', 'summary', 'experience', 'education']
    },
    matchedSkills: {
      type: 'array',
      items: { type: 'string' }
    },
    suggestedAdditions: {
      type: 'array',
      items: { type: 'string' }
    },
    improvements: {
      type: 'array',
      items: { type: 'string' }
    },
    companyInsights: { type: 'string' }
  },
  required: ['alignedResume', 'matchedSkills', 'suggestedAdditions', 'improvements', 'companyInsights']
};

// Align resume endpoint
app.post('/make-server-bfaeb875/align', async (c) => {
  try {
    const { resumeText, jobDescription, alignmentLevel } = await c.req.json();

    if (!resumeText || !jobDescription) {
      return c.json({ error: 'Missing required fields: resumeText and jobDescription' }, 400);
    }

    // Get Gemini API key from environment - EXPLICIT CHECK
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.log('ERROR: GEMINI_API_KEY not found in environment variables');
      return c.json({ 
        error: 'Gemini API key not configured. Please set the GEMINI_API_KEY environment variable.',
        code: 'MISSING_API_KEY'
      }, 500);
    }

    console.log(`Aligning resume with alignment level: ${alignmentLevel}%`);

    // Construct the prompt based on alignment level
    const aggressiveness = alignmentLevel >= 70 ? 'aggressive' : alignmentLevel >= 40 ? 'moderate' : 'conservative';
    
    const prompt = `You are an expert resume optimization AI. Your job is to align a candidate's resume to a specific job description.

Alignment style: ${aggressiveness}
- Conservative: Make minimal changes, preserve original content, add subtle enhancements
- Moderate: Balance between preserving original and optimizing for the job
- Aggressive: Significantly rewrite content to match job requirements, add inferred skills

Original Resume:
${resumeText}

Job Description:
${jobDescription}

Alignment Level: ${alignmentLevel}%

Please optimize this resume for the job description and return a JSON object with the following structure:
{
  "alignedResume": {
    "name": "string",
    "title": "string", 
    "summary": "string (include [INFERRED] tags if you added content not in original)",
    "experience": ["bullet1", "bullet2 [ENHANCED]", ...],
    "education": "string"
  },
  "matchedSkills": ["skill1", "skill2", ...],
  "suggestedAdditions": ["skill1", "skill2", ...],
  "improvements": ["improvement1", "improvement2", ...],
  "companyInsights": "A paragraph about what this company looks for based on the job description"
}

Use [INFERRED] tags for content you created that wasn't in the original resume.
Use [ENHANCED] tags for bullets you significantly improved.`;

    // Retry logic with exponential backoff for rate limits
    let lastError;
    const maxRetries = 3;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`Retry attempt ${attempt + 1}/${maxRetries}, waiting ${waitTime}ms`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.7,
          }
        });

        console.log('Calling Gemini API...');
        
        // Call Gemini API
        const result = await model.generateContent(prompt);
        const response = result.response;
        
        // Get raw text response
        const rawText = response.text();
        console.log('Gemini API raw response length:', rawText.length);

        // ROBUST JSON PARSING with try-catch
        let parsedResult;
        try {
          parsedResult = JSON.parse(rawText);
          console.log('Successfully parsed JSON response');
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError.message);
          console.error('Raw response that failed to parse:', rawText);
          
          // If parsing fails, try to extract JSON from response
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              parsedResult = JSON.parse(jsonMatch[0]);
              console.log('Successfully extracted and parsed JSON from response');
            } catch (secondParseError) {
              throw new Error(`Failed to parse Gemini response as JSON. Raw response: ${rawText.substring(0, 200)}...`);
            }
          } else {
            throw new Error(`Gemini response is not valid JSON. Raw response: ${rawText.substring(0, 200)}...`);
          }
        }

        // Validate required fields
        if (!parsedResult.alignedResume || !parsedResult.matchedSkills || !parsedResult.improvements) {
          console.error('Invalid response structure:', parsedResult);
          throw new Error('Gemini response missing required fields');
        }

        console.log('Successfully aligned resume with Gemini');

        // Store alignment in KV store for history
        const timestamp = new Date().toISOString();
        const historyKey = `alignment:${timestamp}`;
        await kv.set(historyKey, {
          resumeText: resumeText.substring(0, 500),
          jobDescription: jobDescription.substring(0, 500),
          alignmentLevel,
          result: parsedResult,
          timestamp
        });

        return c.json(parsedResult);
        
      } catch (apiError) {
        console.error(`Gemini API error (attempt ${attempt + 1}):`, apiError.message);
        lastError = apiError;
        
        // Check for specific error types
        if (apiError.message?.includes('429') || apiError.message?.includes('quota')) {
          if (attempt < maxRetries - 1) {
            console.log('Rate limit detected, will retry...');
            continue;
          }
          return c.json({ 
            error: 'Gemini API rate limit reached. Please wait a moment and try again.',
            code: 'RATE_LIMIT'
          }, 429);
        }
        
        if (apiError.message?.includes('401') || apiError.message?.includes('API key')) {
          return c.json({ 
            error: 'Invalid Gemini API key. Please check your API key at https://aistudio.google.com/app/apikey',
            code: 'INVALID_KEY'
          }, 401);
        }
        
        if (attempt < maxRetries - 1) {
          console.log('Network error, will retry...');
          continue;
        }
      }
    }
    
    // If all retries failed
    throw lastError || new Error('Failed after all retry attempts');

  } catch (error) {
    console.error(`Error in /align endpoint: ${error.message}`);
    console.error('Full error:', error);
    return c.json({ 
      error: `Internal server error: ${error.message}`,
      code: 'INTERNAL_ERROR'
    }, 500);
  }
});

// Get alignment history
app.get('/make-server-bfaeb875/history', async (c) => {
  try {
    const history = await kv.getByPrefix('alignment:');
    return c.json({ history: history.map(h => h.value) });
  } catch (error) {
    console.log(`Error fetching history: ${error.message}`);
    return c.json({ error: `Failed to fetch history: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);
