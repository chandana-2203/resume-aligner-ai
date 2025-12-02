# Resume Aligner ✨

> Your AI bestie for landing that dream role 💼

An AI-powered web application that optimizes your resume for specific job descriptions using Google's Gemini API. Built with React, TypeScript, Tailwind CSS, and Supabase authentication.

![Resume Aligner](https://img.shields.io/badge/AI-Gemini-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase)

## ✨ Features

- 🔐 **Secure Authentication** - Sign up/sign in with Supabase Auth
- 🎨 **3 ATS-Friendly Templates** - Choose from Modern Minimal, Classic Professional, or Creative Bold
- 🤖 **AI-Powered Optimization** - Uses Google Gemini to align your resume with job requirements
- 🎚️ **Adjustable Aggressiveness** - Control how much the AI modifies your resume
- 📝 **Dual Input Methods** - Upload existing resume or build one from scratch
- 🎯 **Smart Matching** - Identifies matched skills and suggests additions
- 💡 **Improvement Insights** - Get specific recommendations for enhancement
- 🏢 **Company Analysis** - Understand what the employer is looking for
- 📥 **Export Options** - Download as Markdown or PDF
- 🎨 **Beautiful UI** - Gen Z-friendly design with pastel colors and encouraging messages

## 🚀 Quick Start

### 1. Get a Gemini API Key (Free!)

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API "**
4. Copy your key (starts with `AIza...`)

### 2. Clone or Download This Project

```bash
# If using Git
git clone <your-repo-url>
cd resume-aligner

# Or download as ZIP and extract
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Add Your API Key

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` and add your API key:

```env
VITE_GEMINI_API_KEY=AIzaSy...your-actual-key-here
```

### 5. Run the App!

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser 🎉

## 📖 How to Use

### 1. Sign Up or Sign In
Create a free account or log in to get started

### 2. Choose Your Resume Template
Pick from 3 ATS-friendly templates:
- **Modern Minimal** ✨ - Clean, single-column design perfect for tech roles
- **Classic Professional** 📄 - Traditional two-column format recruiters love
- **Creative Bold** 🎨 - Stand out with color accents for creative fields

### 3. Upload Your Resume
- **Option A:** Upload a PDF or TXT file
- **Option B:** Build from scratch using the form

### 4. Add Job Description
Copy and paste the complete job posting you're applying for

### 5. Customize AI Settings
- **Conservative (0-30%):** Minimal changes, preserves original content
- **Moderate (40-60%):** Balanced optimization
- **Aggressive (70-100%):** Significant rewriting to match job requirements

### 6. Review Results
- Check items marked **[INFERRED]** - AI-added content
- Check items marked **[ENHANCED]** - AI-improved bullets
- Review matched skills and suggestions
- Read company hiring insights

### 7. Export
- **Copy to Clipboard** - Quick paste into application forms
- **Download Markdown** - For further editing
- **Download PDF** - Ready to send

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **AI:** Google Gemini 1.5 Flash
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
- **Authentication:** Supabase Auth

## 📁 Project Structure

```
resume-aligner/
├── src/
│   ├── main.tsx           # App entry point
│   └── App.tsx            # Main application component
├── components/
│   ├── ui/                # Reusable UI components
│   └── figma/             # Figma integration helpers
├── styles/
│   └── globals.css        # Global styles and Tailwind config
├── .env                   # Your API key (DO NOT COMMIT)
├── .env.example          # Template for .env
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
└── README.md             # You are here!
```

## 🔒 Security & Privacy

- ⚠️ **API Key Exposure:** Since this is a frontend-only app, your Gemini API key is exposed in the browser. This is fine for personal use, but **do not share your API key publicly**.
  
- 🔐 **For Production:** Consider adding a backend proxy server to keep your API key secure

- 📝 **Data Privacy:** Your resume text is sent to Google's Gemini API for processing. Google's privacy policy applies.

## 🐛 Troubleshooting

### "API key not found" Error
- Make sure `.env` exists in the root directory
- Check variable name is exactly `VITE_GEMINI_API_KEY`
- Restart dev server after creating `.env`

### Rate Limit Errors
- Free tier: 15 requests per minute
- Wait 60 seconds and try again
- App includes automatic retry logic

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎯 API Rate Limits

**Gemini Free Tier:**
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per minute

Perfect for personal resume optimization! 💪

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this for your job search! 

## 💜 Acknowledgments

- Built with love for nervous job seekers
- Powered by Google Gemini AI
- UI components from Radix UI and shadcn/ui
- Icons from Lucide

---

**Good luck with your job search! You got this! 🚀✨**

Made with 💜 and ☕