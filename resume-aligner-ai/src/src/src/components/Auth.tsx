import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Sparkles, Loader2, Mail, Lock, User, Heart } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: () => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Sign Up State
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          data: {
            name: signUpName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        setSuccess('🎉 Account created! Welcome aboard!');
        setTimeout(() => {
          onAuthSuccess();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong 😅');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });

      if (error) throw error;

      if (data.session) {
        setSuccess('✨ Welcome back! Redirecting...');
        setTimeout(() => {
          onAuthSuccess();
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials 😅');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl flex items-center justify-center shadow-md mx-auto mb-4">
            <Sparkles className="w-9 h-9 text-purple-600" />
          </div>
          <h1 className="text-gray-800 mb-2">Resume Aligner ✨</h1>
          <p className="text-gray-600">Your AI bestie for landing that dream role 💼</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-center">Get Started</CardTitle>
            <CardDescription className="text-gray-600 text-center">
              Sign in or create an account to optimize your resume! ✌️
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-purple-50">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-purple-200 data-[state=active]:text-purple-800"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-purple-200 data-[state=active]:text-purple-800"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email" className="text-gray-800 mb-2 block flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-500" />
                      Email
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                      className="bg-white border-purple-200 text-gray-800 placeholder:text-gray-400 focus:border-purple-400 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signin-password" className="text-gray-800 mb-2 block flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-500" />
                      Password
                    </Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                      className="bg-white border-purple-200 text-gray-800 placeholder:text-gray-400 focus:border-purple-400 rounded-xl"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <p className="text-emerald-700 text-sm">{success}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-purple-900 shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name" className="text-gray-800 mb-2 block flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-500" />
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      required
                      className="bg-white border-purple-200 text-gray-800 placeholder:text-gray-400 focus:border-purple-400 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-email" className="text-gray-800 mb-2 block flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-500" />
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                      className="bg-white border-purple-200 text-gray-800 placeholder:text-gray-400 focus:border-purple-400 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-password" className="text-gray-800 mb-2 block flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-500" />
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-white border-purple-200 text-gray-800 placeholder:text-gray-400 focus:border-purple-400 rounded-xl"
                    />
                    <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <p className="text-emerald-700 text-sm">{success}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-purple-900 shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-purple-100">
              <p className="text-center text-sm text-gray-500">
                We got you covered! 💪 Your data is secure with Supabase.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Made with 💜 for job seekers everywhere
          </p>
        </div>
      </div>
    </div>
  );
}
