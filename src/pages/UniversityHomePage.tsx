import { useNavigate } from 'react-router-dom';
import { User, MessageCircle, Briefcase, TrendingUp, Users, MapPin } from 'lucide-react';
import type { User as UserType } from '../lib/types';

interface UniversityHomePageProps {
  user: UserType;
}

export function UniversityHomePage({ user }: UniversityHomePageProps) {
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
                <span>Career Assistant</span>
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
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Career Opportunities Board
          </h2>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <p className="text-xl text-gray-600">
              Explore {user.discipline || 'various'} positions curated for your career development
            </p>
            {user.university && (
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-medium">{user.university}</span>
                {user.current_year && (
                  <span className="text-blue-600">• {user.current_year}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Career Planning Assistant */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-purple-100 p-4 rounded-xl">
                <MessageCircle className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Career Planning Assistant</h3>
                <p className="text-gray-600">Get personalized career guidance</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
              Access personalized career advice, CV writing tips, interview preparation guidance, 
              and professional development strategies tailored for university students.
            </p>
            <button
              onClick={() => navigate('/chatbot')}
              className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors mt-auto"
            >
              Start Career Chat
            </button>
          </div>

          {/* Available Positions Quick Access */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 p-4 rounded-xl">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Available Positions</h3>
                <p className="text-gray-600">Browse job opportunities</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
              Explore curated job opportunities in your field. Find full-time positions, 
              internships, and career opportunities that match your skills and interests.
            </p>
            <button
              onClick={() => navigate('/available-positions')}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mt-auto"
            >
              View Available Positions
            </button>
          </div>
        </div>



        {/* Career Resources */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Industry Insights
            </h4>
            <p className="text-blue-700 text-sm leading-relaxed">
              Stay updated with the latest trends, salary benchmarks, and skill requirements in your field.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Networking Tips
            </h4>
            <p className="text-green-700 text-sm leading-relaxed">
              Learn effective networking strategies and connect with professionals in your industry.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Career Development
            </h4>
            <p className="text-purple-700 text-sm leading-relaxed">
              Access resources for skill development, certifications, and career advancement strategies.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}