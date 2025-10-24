import { useNavigate } from 'react-router-dom';
import { MessageCircle, Calculator, GraduationCap, User, BookOpen, Brain, Heart } from 'lucide-react';
import type { User as UserType } from '../lib/types';

interface HighSchoolHomePageProps {
  user: UserType;
}

export function HighSchoolHomePage({ user }: HighSchoolHomePageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <img 
                src="/axiom-logo.png" 
                alt="AXIOM.AI Logo" 
                className="w-20 h-20"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AXIOM.AI</h1>
                <p className="text-xs text-gray-500">Build your career with confidence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/chatbot')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat Assistant</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Academic Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl">
            Focus on your DSE preparation, explore university programs, and get personalized guidance 
            for your academic and career planning.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* DSE Calculator */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 p-4 rounded-xl">
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">DSE Score Calculator</h3>
                <p className="text-gray-600">Find your matching university programs</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
              Enter your DSE subject scores to discover which university programs you qualify for. 
              Get detailed analysis of admission requirements and make informed decisions about your future.
            </p>
            <button
              onClick={() => navigate('/dse-calculator')}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mt-auto"
            >
              Start DSE Calculator
            </button>
          </div>

          {/* Academic & Mental Health Assistant */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-100 p-4 rounded-xl">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Academic Assistant</h3>
                <p className="text-gray-600">Get personalized guidance & support</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
              Access personalized academic advice, study strategies, mental health support, and 
              career guidance tailored specifically for high school students.
            </p>
            <button
              onClick={() => navigate('/chatbot')}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors mt-auto"
            >
              Chat with Assistant
            </button>
          </div>
        </div>

        {/* Academic Resources Grid */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Academic Resources</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <h4 className="font-bold text-purple-900">Study Strategies</h4>
              </div>
              <p className="text-purple-700 text-sm leading-relaxed">
                Effective study techniques, time management tips, and exam preparation strategies 
                specifically designed for DSE success.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-6 h-6 text-orange-600" />
                <h4 className="font-bold text-orange-900">University Guide</h4>
              </div>
              <p className="text-orange-700 text-sm leading-relaxed">
                Comprehensive information about Hong Kong universities, admission requirements, 
                and program details to help you make informed choices.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-pink-600" />
                <h4 className="font-bold text-pink-900">Mental Wellness</h4>
              </div>
              <p className="text-pink-700 text-sm leading-relaxed">
                Stress management techniques, mindfulness practices, and mental health resources 
                to support your well-being during this important time.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">Your Academic Progress</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">DSE</div>
              <div className="text-blue-100">Score Calculator Ready</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">9+</div>
              <div className="text-blue-100">Universities to Explore</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Academic Support</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}