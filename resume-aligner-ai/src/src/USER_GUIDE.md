# Resume Aligner - Complete User Guide 📚

Welcome to Resume Aligner! This guide will walk you through every feature of the app. Let's get you that dream job! 💪

## 🎬 App Flow Overview

```
Sign Up/Sign In → Choose Template → Build & Optimize Resume → Export
     🔐              🎨                  ✨                   📥
```

---

## 1️⃣ Authentication Page

### What You'll See:
- Beautiful pastel gradient background
- Two tabs: **Sign In** and **Sign Up**
- Clean, Gen Z-friendly interface

### Sign Up (New Users):
1. Enter your **full name** (so we can greet you!)
2. Enter your **email address**
3. Create a **password** (minimum 6 characters)
4. Click **"Create Account"**
5. You'll see a success message and automatically move to template selection

### Sign In (Returning Users):
1. Enter your **email address**
2. Enter your **password**
3. Click **"Sign In"**
4. If you've already selected a template, you'll go straight to the resume builder
5. If this is your first time, you'll choose a template

### Tips:
- ✅ Use a real email if you want to receive updates (optional)
- ✅ Pick a memorable password
- ✅ Your data is secure with Supabase encryption

---

## 2️⃣ Template Selection Page

### What You'll See:
- 3 beautiful ATS-friendly resume templates
- Visual previews of each template
- Feature lists for each design

### The Templates:

#### ✨ Modern Minimal
**Best For:** Tech roles, startups, modern companies
- Single column layout
- Sans-serif fonts for readability
- Skill bars and progress indicators
- Lots of white space
- Clean and professional

#### 📄 Classic Professional
**Best For:** Corporate roles, traditional industries, management positions
- Two-column layout
- Serif headings for gravitas
- Timeline format for experience
- Traditional and trusted design
- Recruiter-favorite format

#### 🎨 Creative Bold
**Best For:** Creative fields, design roles, marketing positions
- Accent colors throughout
- Icon integration
- Strong visual hierarchy
- Personality-driven design
- Stand-out aesthetic

### How to Choose:
1. Click on any template card to preview
2. Selected template will show a green checkmark ✅
3. Read the features to see what's included
4. Click **"Continue to Resume Builder"** when ready

### Tips:
- 💡 All templates are ATS-friendly (robot-approved!)
- 💡 You can't go wrong - pick what feels right for your industry
- 💡 Don't stress - this is saved and you can change it later

---

## 3️⃣ Resume Builder Page

This is where the magic happens! ✨

### Page Layout:
```
┌─────────────────────────────────────────────────┐
│  Header: Logo | Your Name | Template | Sign Out  │
├──────────────────┬──────────────────────────────┤
│  LEFT PANEL      │  RIGHT PANEL                 │
│  Input Section   │  Output Section              │
│  ├─ Resume       │  ├─ Aligned Resume           │
│  ├─ Job Desc     │  ├─ Matched Skills           │
│  └─ AI Settings  │  ├─ Suggestions              │
│                  │  └─ Company Insights         │
└──────────────────┴──────────────────────────────┘
│         Footer: Export Options (when done)       │
└──────────────────────────────────────────────────┘
```

### Left Panel - Your Inputs:

#### 📄 Your Resume Section
**Two ways to input:**

**Option 1: Upload Tab**
- Drag & drop or click to upload PDF/TXT files
- OR paste your existing resume text
- Max file size: 5MB

**Option 2: Build Tab**
- **Full Name:** Your name as it should appear
- **Job Title:** Your current or target role
- **Experience Bullets:** List your achievements and responsibilities
  - Use bullet points (• or -)
  - Focus on quantifiable achievements
  - Example: "Led team of 5 engineers"
- **Education:** Degree, school, graduation year

#### 🎯 Job Description Section
- Paste the **complete job posting**
- Include all sections: requirements, responsibilities, nice-to-haves
- The more detail, the better the AI optimization!

#### ⚡ AI Magic Settings
**Alignment Aggressiveness Slider:**
- **0-30% (Conservative):** 
  - Minimal changes to your original content
  - Subtle keyword additions
  - Preserves your voice
  - Best for: When you're happy with your resume and just want polish

- **40-60% (Moderate):**
  - Balanced approach
  - Rewords for clarity and impact
  - Adds relevant skills from job description
  - Best for: Most use cases - safe middle ground

- **70-100% (Aggressive):**
  - Significant rewriting
  - Maximizes keyword matching
  - Infers skills and experiences
  - Best for: Career pivots or when you need major changes

**Action Buttons:**
- **Align Resume:** Start the AI optimization (this is the main button!)
- **Get Suggestions:** (Coming soon!) Quick tips without full rewrite

### Right Panel - AI Results:

#### ✨ Aligned Resume
Your optimized resume appears here after clicking "Align Resume"

**What You'll See:**
- Your name and title
- Professional Summary
- Experience bullets
- Education

**Special Markers:**
- 🟠 **[INFERRED]** tags = AI added this content (review carefully!)
- 🟢 **[ENHANCED]** tags = AI improved this bullet
- Plain text = Kept from your original

**While Processing:**
- You'll see a loading animation
- Typical wait time: 5-15 seconds
- If it takes longer, check your internet connection

#### 💎 Matched Skills
Green badges showing skills from your resume that match the job description
- These are your strengths!
- Mention these in your cover letter
- Prepare examples for interviews

#### ⭐ Suggested Additions
Orange badges showing skills from the job description you might want to add
- Consider adding these if you have experience
- Honest additions only!
- Could be skills you forgot to mention

#### 📈 Key Improvements
A list of specific changes the AI made:
- What was enhanced
- Why it matters
- How it helps you

#### 🏢 Company Hiring Context
AI analysis of what the company is looking for:
- Company culture insights
- Key priorities for this role
- What they value in candidates
- Use this to tailor your cover letter!

### Footer - Export Options:

When your resume is ready, you'll see these buttons:

#### 📋 Copy Markdown
- Copies to clipboard instantly
- Markdown format (easy to paste anywhere)
- Great for quick applications

#### ⬇️ Download .md
- Downloads a Markdown file
- Open in any text editor
- Easy to edit further

#### 📄 Download PDF
- Downloads a PDF file
- Ready to submit
- Professional format

---

## 🎯 Best Practices

### Before You Start:
1. ✅ Have your existing resume ready (any format)
2. ✅ Find the job posting you're applying to
3. ✅ Set aside 10-15 minutes
4. ✅ Be in a focused mindset

### During Optimization:
1. ✅ Read the job description carefully first
2. ✅ Start with 50% alignment and adjust from there
3. ✅ Be honest about your experience
4. ✅ Review ALL [INFERRED] items carefully
5. ✅ Run multiple versions with different alignment levels

### After Optimization:
1. ✅ Read through the entire aligned resume
2. ✅ Verify all information is accurate
3. ✅ Remove any [INFERRED] items that don't apply
4. ✅ Customize the summary further if needed
5. ✅ Proofread for typos (AI isn't perfect!)
6. ✅ Export in your preferred format

---

## 🚨 Common Issues & Solutions

### "API key not found" Error
**Problem:** Gemini API key missing
**Solution:** 
```bash
# Make sure .env file exists with:
VITE_GEMINI_API_KEY=your-key-here

# Then restart the dev server
```

### "Rate limit reached" Error
**Problem:** Too many requests too quickly
**Solution:** Wait 60 seconds and try again. Free tier = 15 requests/minute

### Resume looks wrong after optimization
**Problem:** AI got too creative
**Solution:** 
- Lower the alignment slider (try 30-40%)
- Check your input resume for clarity
- Try uploading a cleaner version

### Can't sign in
**Problem:** Wrong email or password
**Solution:**
- Double-check your email
- Passwords are case-sensitive
- Use "Forgot Password" (coming soon!)

### Template selection not saving
**Problem:** Browser storage issues
**Solution:**
- Enable cookies/localStorage in your browser
- Try a different browser
- Check if you're in private/incognito mode

---

## 💡 Pro Tips

### For Best Results:
1. 🎯 **Be Specific:** More detailed job descriptions = better optimization
2. 📊 **Use Numbers:** Quantify achievements ("increased sales by 40%")
3. 🔑 **Keywords Matter:** AI looks for job description keywords
4. 🎨 **Formatting Counts:** Use clean, simple formatting in uploads
5. 🔄 **Iterate:** Try different alignment levels and compare results

### Career Stage Tips:
- **Entry-Level:** Use 60-80% alignment to fill gaps
- **Mid-Career:** Use 40-60% for balanced optimization
- **Senior-Level:** Use 20-40% to maintain authority

### Industry Tips:
- **Tech:** Modern Minimal template + 50% alignment
- **Corporate:** Classic Professional + 40% alignment
- **Creative:** Creative Bold + 60% alignment

---

## 🎓 Understanding ATS

### What is ATS?
ATS (Applicant Tracking System) = software that scans resumes before humans see them

### What ATS Looks For:
- ✅ Standard section headings (Experience, Education, Skills)
- ✅ Common fonts (Arial, Calibri, Times New Roman)
- ✅ Simple formatting (no tables, text boxes, or images)
- ✅ Keywords from the job description
- ✅ Clear dates and job titles

### What ATS Hates:
- ❌ Fancy graphics or charts
- ❌ Headers/footers with important info
- ❌ Unusual file formats
- ❌ Columns or complex layouts
- ❌ Skills hidden in paragraphs

### Why Our Templates Work:
All our templates use:
- ✅ Standard HTML/text-based formatting
- ✅ Clear section headers
- ✅ Simple, readable fonts
- ✅ Keyword-optimized content
- ✅ Scannable structure

---

## 📞 Need Help?

### Resources:
- 📖 **This Guide:** You're reading it!
- 📄 **README.md:** Technical setup info
- 🔧 **SETUP_INSTRUCTIONS.md:** Installation guide
- 🔐 **SUPABASE_SETUP.md:** Authentication details

### Troubleshooting Steps:
1. Check this guide first
2. Review the error message carefully
3. Check browser console (F12) for details
4. Try in a different browser
5. Clear cache and reload

---

## 🎉 Success Stories

Once your resume is optimized:

### Next Steps:
1. ✅ Download in your preferred format
2. ✅ Use the Company Insights to write your cover letter
3. ✅ Prepare interview answers for Matched Skills
4. ✅ Research the Suggested Additions to improve your expertise
5. ✅ Apply with confidence!

### Remember:
- 💜 You're awesome and qualified
- 💪 The right job is out there for you
- ✨ This tool helps you shine, but YOU are the star
- 🚀 Every application is practice and progress

---

**You got this! Go land that dream job! 🎯✨**

Made with 💜 for job seekers everywhere
