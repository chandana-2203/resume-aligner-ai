import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import TemplateSelector from './components/TemplateSelector';
import ResumeBuilder from './components/ResumeBuilder';
import { Loader2 } from 'lucide-react';

type AppState = 'loading' | 'auth' | 'template' | 'builder';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [user, setUser] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        // Check if user has selected a template before
        const savedTemplate = localStorage.getItem(`template_${session.user.id}`);
        if (savedTemplate) {
          setSelectedTemplate(savedTemplate);
          setAppState('builder');
        } else {
          setAppState('template');
        }
      } else {
        setAppState('auth');
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const savedTemplate = localStorage.getItem(`template_${session.user.id}`);
        if (savedTemplate) {
          setSelectedTemplate(savedTemplate);
          setAppState('builder');
        } else {
          setAppState('template');
        }
      } else {
        setUser(null);
        setAppState('auth');
        setSelectedTemplate(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    // Will be handled by the onAuthStateChange listener
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    // Save template selection to localStorage
    if (user) {
      localStorage.setItem(`template_${user.id}`, templateId);
    }
    setAppState('builder');
  };

  const handleSignOut = () => {
    setAppState('auth');
    setUser(null);
    setSelectedTemplate(null);
  };

  // Loading state
  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your workspace... ✨</p>
        </div>
      </div>
    );
  }

  // Authentication state
  if (appState === 'auth') {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Template selection state
  if (appState === 'template') {
    return (
      <TemplateSelector
        onTemplateSelect={handleTemplateSelect}
        userName={user?.user_metadata?.name || 'there'}
      />
    );
  }

  // Resume builder state
  if (appState === 'builder' && selectedTemplate) {
    return (
      <ResumeBuilder
        selectedTemplate={selectedTemplate}
        userName={user?.user_metadata?.name || 'there'}
        onSignOut={handleSignOut}
      />
    );
  }

  return null;
}
