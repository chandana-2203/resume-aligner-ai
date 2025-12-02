import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FileText, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface TemplateSelectorProps {
  onTemplateSelect: (templateId: string) => void;
  userName: string;
}

const templates = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean and professional with plenty of white space',
    emoji: '✨',
    color: 'purple',
    features: ['Single column', 'Sans-serif fonts', 'Skill bars', 'Perfect for tech roles'],
    preview: `
      ╔════════════════════╗
      ║   JANE DOE        ║
      ║   Senior Dev      ║
      ╠════════════════════╣
      ║ EXPERIENCE        ║
      ║ • Bullet points   ║
      ║ • Clean layout    ║
      ║                   ║
      ║ SKILLS            ║
      ║ ████████░░ React  ║
      ║ ██████████ Python ║
      ╚════════════════════╝
    `
  },
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional format that recruiters love',
    emoji: '📄',
    color: 'blue',
    features: ['Two column layout', 'Serif headings', 'Timeline format', 'Great for corporate roles'],
    preview: `
      ╔══════════╦═════════╗
      ║ JOHN DOE ║ CONTACT ║
      ║ Manager  ║ Info    ║
      ╠══════════╬═════════╣
      ║ WORK     ║ SKILLS  ║
      ║ 2020-Now ║ • Lead  ║
      ║ Company  ║ • Mgmt  ║
      ║          ║         ║
      ║ EDUCATION║ LANGS   ║
      ╚══════════╩═════════╝
    `
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Stand out with color accents and modern design',
    emoji: '🎨',
    color: 'pink',
    features: ['Accent colors', 'Icon integration', 'Visual hierarchy', 'Ideal for creative fields'],
    preview: `
      ╔════════════════════╗
      ║ ★ ALEX SMITH ★    ║
      ║   Designer        ║
      ╠════════════════════╣
      ║ 🎯 PROJECTS       ║
      ║ → Award-winning   ║
      ║ → Client work     ║
      ║                   ║
      ║ 💼 PORTFOLIO      ║
      ║ → Website link    ║
      ╚════════════════════╝
    `
  }
];

export default function TemplateSelector({ onTemplateSelect, userName }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate);
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple':
        return {
          border: 'border-purple-200',
          selected: 'border-purple-400 bg-purple-50',
          badge: 'bg-purple-100 text-purple-700',
          gradient: 'from-purple-100 to-pink-100'
        };
      case 'blue':
        return {
          border: 'border-blue-200',
          selected: 'border-blue-400 bg-blue-50',
          badge: 'bg-blue-100 text-blue-700',
          gradient: 'from-blue-100 to-cyan-100'
        };
      case 'pink':
        return {
          border: 'border-pink-200',
          selected: 'border-pink-400 bg-pink-50',
          badge: 'bg-pink-100 text-pink-700',
          gradient: 'from-pink-100 to-orange-100'
        };
      default:
        return {
          border: 'border-purple-200',
          selected: 'border-purple-400 bg-purple-50',
          badge: 'bg-purple-100 text-purple-700',
          gradient: 'from-purple-100 to-pink-100'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl flex items-center justify-center shadow-md mx-auto mb-4">
            <Sparkles className="w-9 h-9 text-purple-600" />
          </div>
          <h1 className="text-gray-800 mb-2">
            Hey {userName}! 👋
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Pick your perfect resume template
          </p>
          <p className="text-gray-500">
            All templates are ATS-friendly and recruiter-approved ✨
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {templates.map((template) => {
            const colors = getColorClasses(template.color);
            const isSelected = selectedTemplate === template.id;

            return (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg bg-white/80 backdrop-blur-sm border-2 ${
                  isSelected ? colors.selected : colors.border
                }`}
                onClick={() => handleSelect(template.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{template.emoji}</span>
                      <div>
                        <CardTitle className="text-gray-800">{template.name}</CardTitle>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                  <CardDescription className="text-gray-600">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview */}
                  <div className={`bg-gradient-to-br ${colors.gradient} rounded-xl p-4 border ${colors.border}`}>
                    <pre className="text-xs text-gray-700 overflow-hidden whitespace-pre">
                      {template.preview}
                    </pre>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {template.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          isSelected ? 'text-emerald-500' : 'text-gray-400'
                        }`} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Select Button */}
                  <Button
                    onClick={() => handleSelect(template.id)}
                    className={`w-full ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-300 to-teal-300 hover:from-emerald-400 hover:to-teal-400 text-emerald-900'
                        : 'bg-gradient-to-r from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300 text-purple-900'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Selected
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Choose This
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-800 mb-1">What's ATS-Friendly? 🤔</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  ATS (Applicant Tracking Systems) scan resumes before humans see them. Our templates use simple formatting, 
                  standard fonts, and clear sections so the robots (and recruiters!) love your resume. No fancy graphics that 
                  confuse the system—just clean, professional designs that get you noticed! 💪
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedTemplate}
            size="lg"
            className="bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-purple-900 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedTemplate ? (
              <>
                Continue to Resume Builder
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Select a Template First
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Don't worry—you can always change your template later! ✨
          </p>
        </div>
      </div>
    </div>
  );
}
