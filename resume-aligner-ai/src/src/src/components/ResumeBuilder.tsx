import React, { useState } from 'react';
import { Upload, FileText, Sparkles, Download, Copy, HelpCircle, Check, Loader2, Building2, Target, Zap, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Slider } from '../../components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { Skeleton } from '../../components/ui/skeleton';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../lib/supabase';

interface ResumeBuilderProps {
  selectedTemplate: string;
  userName: string;
  onSignOut: () => void;
}

export default function ResumeBuilder({ selectedTemplate, userName, onSignOut }: ResumeBuilderProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAligned, setHasAligned] = useState(false);
  const [alignment, setAlignment] = useState([50]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bullets, setBullets] = useState('');
  const [education, setEducation] = useState('');

  // AI Response states
  const [alignedResume, setAlignedResume] = useState<any>(null);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [suggestedAdditions, setSuggestedAdditions] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [companyInsights, setCompanyInsights] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleAlign = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Build resume text from either uploaded/pasted text or form fields
      let finalResumeText = resumeText;
      if (!finalResumeText && name) {
        finalResumeText = `${name}\n${title}\n\nExperience:\n${bullets}\n\nEducation:\n${education}`;
      }

      if (!finalResumeText || !jobDescription) {
        setError('Please provide both a resume and job description');
        setIsLoading(false);
        return;
      }

      // Get API key from environment variable
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setError('⚠️ Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
        setIsLoading(false);
        return;
      }

      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Alignment configuration
      const aggressiveness = alignment[0] >= 70 ? 'aggressive' : alignment[0] >= 40 ? 'moderate' : 'conservative';
      
      const prompt = `You are an expert resume optimization AI. Your job is to align a candidate's resume to a specific job description.

Alignment style: ${aggressiveness}
- Conservative: Make minimal changes, preserve original content, add subtle enhancements
- Moderate: Balance between preserving original and optimizing for the job
- Aggressive: Significantly rewrite content to match job requirements, add inferred skills

Template Style: ${selectedTemplate}

Original Resume:
${finalResumeText}

Job Description:
${jobDescription}

Alignment Level: ${alignment[0]}%

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

      // Define strict JSON schema for response
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

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.7,
        }
      });

      console.log('🚀 Calling Gemini API...');
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const rawText = response.text();
      
      console.log('✅ Received response from Gemini');

      // Parse JSON response with error handling
      let parsedResult;
      try {
        parsedResult = JSON.parse(rawText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw response:', rawText);
        
        // Try to extract JSON from response
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse Gemini response as JSON');
        }
      }

      // Validate required fields
      if (!parsedResult.alignedResume || !parsedResult.matchedSkills) {
        throw new Error('Invalid response structure from Gemini');
      }

      console.log('📋 Successfully aligned resume:', parsedResult);
      
      setAlignedResume(parsedResult.alignedResume);
      setMatchedSkills(parsedResult.matchedSkills || []);
      setSuggestedAdditions(parsedResult.suggestedAdditions || []);
      setImprovements(parsedResult.improvements || []);
      setCompanyInsights(parsedResult.companyInsights || '');
      setHasAligned(true);
    } catch (err: any) {
      console.error('❌ Error aligning resume:', err);
      setError(`Error: ${err.message || 'Failed to align resume'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!alignedResume) return;
    
    const markdown = `# ${alignedResume.name}
${alignedResume.title}

## Professional Summary
${alignedResume.summary}

## Experience
${alignedResume.experience.map((exp: string) => `- ${exp}`).join('\n')}

## Education
${alignedResume.education}`;
    
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!alignedResume) return;
    
    const markdown = `# ${alignedResume.name}\n${alignedResume.title}\n\n## Professional Summary\n${alignedResume.summary}\n\n## Experience\n${alignedResume.experience.map((exp: string) => `- ${exp}`).join('\n')}\n\n## Education\n${alignedResume.education}`;
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aligned-resume.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    if (!alignedResume) return;
    
    const pdfContent = `# ${alignedResume.name}
${alignedResume.title}

## Professional Summary
${alignedResume.summary}

## Experience
${alignedResume.experience.map((exp: string) => `- ${exp}`).join('\n')}

## Education
${alignedResume.education}`;
    
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aligned-resume.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
  };

  const getTemplateBadgeColor = () => {
    switch (selectedTemplate) {
      case 'modern-minimal':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'classic-professional':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'creative-bold':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 text-gray-800">
      {/* Header */}
      <header className="border-b border-purple-100 backdrop-blur-sm bg-white/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-200 to-pink-200 rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-gray-800">Resume Aligner ✨</h1>
                <p className="text-sm text-gray-600">Hey {userName}! Let's optimize that resume 💼</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getTemplateBadgeColor()}>
                {selectedTemplate === 'modern-minimal' && '✨ Modern Minimal'}
                {selectedTemplate === 'classic-professional' && '📄 Classic Professional'}
                {selectedTemplate === 'creative-bold' && '🎨 Creative Bold'}
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2 text-gray-500 hover:text-purple-600 transition-colors">
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>We got you! 💪 Upload your resume and paste the job description to start optimizing</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - same as before */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            {/* Resume Input */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Your Resume 📄
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Upload what you have or start fresh—no judgment! ✌️
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 bg-purple-50">
                    <TabsTrigger value="upload" className="data-[state=active]:bg-purple-200 data-[state=active]:text-purple-800">Upload</TabsTrigger>
                    <TabsTrigger value="build" className="data-[state=active]:bg-purple-200 data-[state=active]:text-purple-800">Build</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-4 mt-4">
                    <div className="border-2 border-dashed border-purple-200 rounded-2xl p-8 text-center hover:border-purple-300 transition-colors cursor-pointer bg-purple-50/50">
                      <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                        <p className="text-gray-800 mb-1">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500">PDF or TXT (max 5MB)</p>
                      </label>
                    </div>
                    
                    <div>
                      <Label htmlFor="paste-resume" className="text-gray-800 mb-2 block">Or paste your resume</Label>
                      <Textarea
                        id="paste-resume"
                        placeholder="Paste your resume text here..."
                        className="min-h-[200px] bg-white border-purple-200 text-gray-800 placeholder:text-gray-400 focus:border-purple-400 rounded-xl"
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="build" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-800 mb-2 block">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="bg-white border-purple-200 text-gray-800 placeholder:text-gray-400 focus:border-purple-400 rounded-xl"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="title" className="text-gray-800 mb-2 block">Job Title</Label>
                      <Input
                        id="title"
                        placeholder="Senior Software Engineer"
                        className="bg-white border-purple-200 text-gray-800 placeholder:text-gray-400 focus:border-purple-400 rounded-xl"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bullets" className="text-gray-800 mb-2 block">Experience Bullets</Label>
                      <Textarea
                        id="bullets"
                        placeholder="• Led development team of 5 engineers&#10;• Improved system performance by 40%&#10;• Shipped 3 major features"
                        className="min-h-[120px] bg-white border-purple-200 text-gray-800 placeholder:text-gray-400 focus:border-purple-400 rounded-xl"
                        value={bullets}
                        onChange={(e) => setBullets(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="education" className="text-gray-800 mb-2 block">Education</Label>
                      <Textarea
                        id="education"
                        placeholder="BS Computer Science, Stanford University"
                        className="bg-white border-purple-200 text-gray-800 placeholder:text-gray-400 focus:border-purple-400 rounded-xl"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-500" />
                  Job Description 🎯
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Copy-paste the role you're crushing on!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the full job description here..."
                  className="min-h-[200px] bg-white border-emerald-200 text-gray-800 placeholder:text-gray-400 focus:border-emerald-400 rounded-xl"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* AI Options */}
            <Card className="bg-white/80 backdrop-blur-sm border-pink-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-pink-500" />
                  AI Magic Settings ⚡
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Customize how we optimize your resume—you're in control!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-gray-800 flex items-center gap-2">
                      Alignment Aggressiveness
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="inline-flex">
                              <HelpCircle className="w-4 h-4 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Higher values make more aggressive changes to match the job description. Lower values preserve more of your original content.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <span className="text-purple-600">{alignment[0]}%</span>
                  </div>
                  <Slider
                    value={alignment}
                    onValueChange={setAlignment}
                    max={100}
                    step={10}
                    className="[&_[role=slider]]:bg-purple-400 [&_[role=slider]]:border-purple-300"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Conservative</span>
                    <span>Aggressive</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    onClick={handleAlign}
                    disabled={isLoading || (!resumeText && !name)}
                    className="bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-purple-900 shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Aligning...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Align Resume
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    disabled={isLoading}
                  >
                    Get Suggestions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Output (same as original) */}
          <div className="space-y-6">
            {/* Aligned Resume Preview */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">Aligned Resume</CardTitle>
                <CardDescription className="text-gray-600">
                  AI-optimized version of your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-2xl p-4 mb-4">
                      <p className="text-sm text-purple-700 text-center mb-0">✨ Optimizing your resume with AI magic... This may take a moment! ✨</p>
                    </div>
                    <Skeleton className="h-8 w-3/4 bg-purple-100" />
                    <Skeleton className="h-4 w-1/2 bg-purple-100" />
                    <Skeleton className="h-4 w-full bg-purple-100" />
                    <Skeleton className="h-4 w-full bg-purple-100" />
                    <Skeleton className="h-4 w-5/6 bg-purple-100" />
                    <div className="pt-4">
                      <Skeleton className="h-6 w-1/3 bg-purple-100" />
                      <Skeleton className="h-4 w-full bg-purple-100 mt-2" />
                      <Skeleton className="h-4 w-full bg-purple-100 mt-1" />
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl">
                      <p className="text-xs text-blue-700 text-center">If you hit a rate limit, we'll automatically retry for you! 💪</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-4">
                      <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <HelpCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <p className="text-red-800 mb-2">Oops! Something went wrong 😅</p>
                      <p className="text-sm text-red-700 leading-relaxed max-w-md mx-auto">{error}</p>
                    </div>
                    <Button 
                      onClick={() => {
                        setError('');
                        setHasAligned(false);
                      }}
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : hasAligned ? (
                  <div className="prose max-w-none">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-2xl p-3 mb-4">
                      <p className="text-sm text-purple-700 text-center mb-0">✨ Looking good! Your resume is now optimized for success! ✨</p>
                    </div>
                    {alignedResume && (
                      <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-2xl p-6 border border-purple-100">
                        <h2 className="text-gray-800 mb-1">{alignedResume.name}</h2>
                        <p className="text-purple-600 mb-4">{alignedResume.title}</p>
                        
                        <div className="mb-4">
                          <h3 className="text-gray-800 text-sm mb-2">Professional Summary</h3>
                          <p 
                            className="text-gray-700 text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: alignedResume.summary.replace(
                                /\[INFERRED\]/g, 
                                '<span class="bg-orange-100 px-2 py-0.5 rounded-full text-orange-700 text-xs ml-1">[INFERRED]</span>'
                              )
                            }}
                          />
                        </div>

                        <div className="mb-4">
                          <h3 className="text-gray-800 text-sm mb-2">Experience</h3>
                          <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
                            {alignedResume.experience.map((exp: string, idx: number) => (
                              <li 
                                key={idx}
                                dangerouslySetInnerHTML={{
                                  __html: exp
                                    .replace(/\[ENHANCED\]/g, '<span class="bg-emerald-100 px-2 py-0.5 rounded-full text-emerald-700 text-xs ml-1">[ENHANCED]</span>')
                                    .replace(/\[INFERRED\]/g, '<span class="bg-orange-100 px-2 py-0.5 rounded-full text-orange-700 text-xs ml-1">[INFERRED]</span>')
                                }}
                              />
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-gray-800 text-sm mb-2">Education</h3>
                          <p className="text-gray-700 text-sm">{alignedResume.education}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                      <p className="text-sm text-orange-700 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        Inferred items are marked [INFERRED] — review before sending to recruiters
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-30 text-purple-300" />
                    <p className="text-gray-700 mb-1">Your aligned resume will appear here ✨</p>
                    <p className="text-sm mt-2 text-gray-500">Upload a resume and job description, then hit that magic button!</p>
                    <p className="text-sm mt-3 text-purple-600">You got this! 💪</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Improvement Suggestions */}
            {hasAligned && !isLoading && matchedSkills.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-emerald-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    Improvement Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {matchedSkills.length > 0 && (
                    <div>
                      <h4 className="text-gray-800 text-sm mb-2">Matched Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {matchedSkills.map((skill, idx) => (
                          <Badge key={idx} className="bg-emerald-100 text-emerald-700 border-emerald-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {suggestedAdditions.length > 0 && (
                    <div>
                      <h4 className="text-gray-800 text-sm mb-2">Suggested Additions</h4>
                      <div className="flex flex-wrap gap-2">
                        {suggestedAdditions.map((skill, idx) => (
                          <Badge key={idx} className="bg-orange-100 text-orange-700 border-orange-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {improvements.length > 0 && (
                    <div className="bg-gradient-to-br from-mint-50/50 to-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
                      <h4 className="text-gray-800 text-sm mb-2">Key Improvements</h4>
                      <ul className="text-gray-700 text-sm space-y-2">
                        {improvements.map((improvement, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Company Insights */}
            {hasAligned && !isLoading && companyInsights && (
              <Card className="bg-white/80 backdrop-blur-sm border-pink-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-pink-500" />
                    Company Hiring Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-br from-pink-50/50 to-purple-50/50 rounded-2xl p-4 border border-pink-100">
                    <h4 className="text-gray-800 text-sm mb-2">What This Company Looks For</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {companyInsights}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      {hasAligned && !isLoading && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-purple-100 py-4 shadow-lg">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button 
                onClick={handleCopy}
                variant="outline" 
                className="border-purple-200 text-purple-700 hover:bg-purple-50 shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Markdown
                  </>
                )}
              </Button>
              <Button 
                onClick={handleDownloadMarkdown}
                variant="outline" 
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download .md
              </Button>
              <Button 
                onClick={handleDownloadPDF}
                className="bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-purple-900 shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
