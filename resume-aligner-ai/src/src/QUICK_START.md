# 🚀 Quick Start Checklist

Get your Resume Aligner running in 5 minutes! ⏱️

## ✅ Setup Checklist

### 1. Get Gemini API Key (2 minutes)
- [ ] Go to https://aistudio.google.com/app/apikey
- [ ] Sign in with Google account
- [ ] Click "Create API key"
- [ ] Copy the key (starts with `AIza...`)

### 2. Install & Configure (2 minutes)
```bash
# Clone/download project
cd resume-aligner

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your Gemini API key
# VITE_GEMINI_API_KEY=AIza...your-key-here
```

### 3. Run the App! (1 minute)
```bash
npm run dev
```

- [ ] Open http://localhost:5173
- [ ] See the login page? ✅ You're ready!

---

## 🎯 First-Time User Flow

### Step 1: Sign Up
- [ ] Click "Sign Up" tab
- [ ] Enter name, email, password
- [ ] Click "Create Account"

### Step 2: Choose Template
- [ ] Browse 3 template options
- [ ] Click on your favorite
- [ ] Click "Continue to Resume Builder"

### Step 3: Add Your Info
- [ ] Upload resume OR build from scratch
- [ ] Paste job description
- [ ] Adjust alignment slider (try 50% first)

### Step 4: Optimize!
- [ ] Click "Align Resume" button
- [ ] Wait 10-15 seconds for AI magic ✨
- [ ] Review the optimized resume

### Step 5: Export
- [ ] Review [INFERRED] and [ENHANCED] tags
- [ ] Make any adjustments needed
- [ ] Download or copy your resume
- [ ] Apply for that job! 🎉

---

## 🔧 Troubleshooting Quick Fixes

### Can't start the app?
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### API key error?
```bash
# Check your .env file exists and has:
VITE_GEMINI_API_KEY=your-actual-key

# Restart dev server after adding key
```

### Rate limit error?
- Wait 60 seconds
- Free tier = 15 requests per minute
- You'll be fine! ⏰

---

## 📚 Next Steps

After you're up and running:

- [ ] Read [USER_GUIDE.md](./USER_GUIDE.md) for detailed features
- [ ] Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for auth details
- [ ] Review [README.md](./README.md) for full documentation

---

## 💡 Pro Tips for First Run

1. **Test with Real Data** - Use an actual job posting for best results
2. **Try Different Levels** - Run at 30%, 50%, and 70% to compare
3. **Review Carefully** - AI suggestions need human verification
4. **Save Multiple Versions** - Download different alignments
5. **Have Fun!** - This tool is here to help, not stress you out ✨

---

## ✨ What's Included

Your app has:
- ✅ Secure Supabase authentication
- ✅ 3 ATS-friendly resume templates
- ✅ Google Gemini AI integration
- ✅ Beautiful pastel UI
- ✅ Export to Markdown & PDF
- ✅ Skill matching & suggestions
- ✅ Company insights

---

## 🎉 You're All Set!

Everything working? Awesome! Now go:

1. Create your account
2. Choose your template
3. Optimize that resume
4. Land your dream job! 🚀

**Questions?** Check the docs or troubleshooting sections above.

**Ready to crush it?** Let's go! 💪✨

---

Made with 💜 for job seekers everywhere
