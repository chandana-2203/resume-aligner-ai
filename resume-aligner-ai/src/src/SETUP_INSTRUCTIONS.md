# Resume Aligner - VS Code Setup Guide

## 🚀 Quick Start

This is a standalone React + Vite application that uses the Gemini API for AI-powered resume optimization.

### Prerequisites
- Node.js 18+ installed
- A Gemini API key (free from Google AI Studio)

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API key"** → **"Create API key"**
4. Copy your API key (starts with `AIza...`)

### Step 2: Install Dependencies

Open your terminal in VS Code and run:

```bash
npm install
```

### Step 3: Create Environment File

Create a file named `.env` in the root directory and add your API key:

```env
VITE_GEMINI_API_KEY=AIzaSy...your-actual-key-here
```

**⚠️ IMPORTANT:** Never commit your `.env` file to Git! It's already in `.gitignore`.

### Step 4: Run the Application

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 🎨 How to Use

1. **Upload or Build Your Resume**
   - Upload a PDF/TXT file OR
   - Use the "Build" tab to create one from scratch

2. **Paste Job Description**
   - Copy the full job posting and paste it

3. **Adjust AI Settings**
   - Move the slider to control how aggressively the AI rewrites your resume
   - Conservative: Minimal changes
   - Aggressive: Significant optimization

4. **Click "Align Resume"**
   - The AI will optimize your resume in seconds
   - Review items marked [INFERRED] and [ENHANCED]

5. **Download or Copy**
   - Export as Markdown or PDF
   - Copy to clipboard for quick pasting

## 📁 Project Structure

```
/
├── src/
│   ├── App.tsx              # Main application (calls Gemini directly)
│   ├── components/          # UI components (buttons, cards, etc.)
│   └── styles/             # Global styles
├── .env                     # Your API key (create this!)
├── .env.example            # Template for .env
├── package.json            # Dependencies
└── vite.config.ts          # Vite configuration
```

## 🔧 Troubleshooting

### "API key not found" error
- Make sure your `.env` file exists in the root directory
- Check that the variable is named `VITE_GEMINI_API_KEY`
- Restart the dev server after creating `.env`

### Rate limit errors
- The free Gemini API has limits (15 requests per minute)
- Wait 60 seconds and try again
- The app includes automatic retry logic

### TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- Restart your VS Code TypeScript server

## 🔒 Security Note

**The Gemini API key is exposed in the browser** because this is a frontend-only application. For production use, you should:
- Use a backend server to proxy API calls
- Never commit `.env` to Git
- Restrict your API key in Google Cloud Console

For prototyping and personal use, the current setup works great! 🎉

## 🎯 Features

✅ AI-powered resume optimization using Gemini  
✅ Adjustable alignment aggressiveness  
✅ Real-time preview with highlighted changes  
✅ Skill matching and suggestions  
✅ Company hiring insights  
✅ Export to Markdown and PDF  
✅ Beautiful, Gen Z-friendly UI with pastel colors  

## 💜 Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Gemini AI (Google)
- Lucide Icons

---

Made with 💜 by the Resume Aligner team
