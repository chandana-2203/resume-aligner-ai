# Supabase Setup Guide 🔐

Your Resume Aligner app is already configured to work with Supabase! Here's what's set up:

## ✅ Already Configured

Your project is connected to Supabase with:
- **Project ID:** `gtaerswjartksrorfbzb`
- **Authentication:** Email/Password sign up and sign in
- **Session Management:** Automatic session persistence

## 🎯 What Works Out of the Box

1. **User Sign Up** - Users can create accounts with email and password
2. **User Sign In** - Existing users can log in
3. **Session Persistence** - Users stay logged in across browser refreshes
4. **Sign Out** - Users can securely sign out
5. **Template Selection** - Template choices are saved locally per user

## 🔧 Email Configuration (Optional)

By default, Supabase requires email confirmation. For development/testing, this is **already disabled** in the code.

If you want to enable email confirmation for production:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **Providers** → **Email**
3. Configure your SMTP settings or use Supabase's built-in email service
4. Update the code in `/src/components/Auth.tsx` to remove `email_confirm: true`

## 📊 Database (Optional)

Currently, the app uses:
- **Supabase Auth** for user management
- **LocalStorage** for template preferences
- **No custom tables** - everything works without additional database setup!

If you want to store resume history or other data:

1. Create tables in your Supabase Dashboard
2. Set up Row Level Security (RLS) policies
3. Use the existing Supabase client at `/src/lib/supabase.ts`

Example query:
```typescript
import { supabase } from './lib/supabase';

// Insert data
const { data, error } = await supabase
  .from('resume_history')
  .insert({ user_id: user.id, resume_data: {...} });

// Query data
const { data, error } = await supabase
  .from('resume_history')
  .select('*')
  .eq('user_id', user.id);
```

## 🔐 Security Notes

### Current Setup:
- ✅ User passwords are hashed and secure
- ✅ Sessions are handled by Supabase
- ✅ API keys are in environment variables
- ✅ User data is isolated by authentication

### For Production:
Consider adding:
- Rate limiting for sign up
- Email verification
- Password reset flow
- Social login (Google, GitHub, etc.)
- Multi-factor authentication (MFA)

## 🚀 Adding Social Login (Optional)

Want to add "Sign in with Google" or other providers?

### Google Sign In:
1. Follow [Supabase Google Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
2. Get Google OAuth credentials
3. Add to your Supabase project settings
4. Update `/src/components/Auth.tsx`:

```typescript
const handleGoogleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
};
```

## 📞 Support

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **Dashboard:** https://supabase.com/dashboard

## 🎉 You're All Set!

Your authentication is ready to go! Just run:

```bash
npm run dev
```

And start signing up users! ✨

---

**Pro Tip:** Test the auth flow with a disposable email service like [temp-mail.org](https://temp-mail.org) during development!
