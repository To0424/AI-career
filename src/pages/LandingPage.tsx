import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users } from 'lucide-react';
import { storage } from '../lib/demoData';
import type { User } from '../lib/types';

export function LandingPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'high_school' | 'uni_postgrad' | null>(null);

  const handleUserTypeSelect = (userType: 'high_school' | 'uni_postgrad') => {
    setSelectedType(userType);
    
    console.log('Creating user with type:', userType);
    
    // Create user profile for both types
    const newUser: User = {
      id: `demo-user-${Date.now()}`,
      email: `demo-${Date.now()}@example.com`,
      user_type: userType,
      discipline: userType === 'high_school' ? 'General' : 'Business',
      created_at: new Date().toISOString()
    };

    console.log('Created user object:', newUser);

    // Clear existing users and save only the new one
    storage.saveUsers([newUser]);
    
    console.log('Saved single user to storage:', [newUser]);

    // Use setTimeout to ensure storage is updated before navigation
    setTimeout(() => {
      navigate('/home');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <img 
              src="/axiom-logo.png" 
              alt="AXIOM.AI Logo" 
              className="w-24 h-24"
            />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">AXIOM.AI</h1>
              <p className="text-lg text-gray-600">Build your career with confidence</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Your Career Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you're a high school student preparing for university or already pursuing higher education, 
            we'll help you navigate your path to success.
          </p>
        </div>

        {/* User Type Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* High School Student */}
          <div 
            onClick={() => handleUserTypeSelect('high_school')}
            className={`bg-white rounded-2xl p-8 shadow-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              selectedType === 'high_school' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">High School Student</h3>
              <p className="text-gray-600 mb-6">
                Explore university programs, calculate your DSE requirements, and discover internship opportunities 
                that align with your academic goals.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✓ DSE Score Calculator</p>
                <p>✓ University Program Matching</p>
                <p>✓ Student Internships</p>
                <p>✓ Career Guidance</p>
              </div>
            </div>
          </div>

          {/* University/Postgrad Student */}
          <div 
            onClick={() => handleUserTypeSelect('uni_postgrad')}
            className={`bg-white rounded-2xl p-8 shadow-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              selectedType === 'uni_postgrad' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">University Student</h3>
              <p className="text-gray-600 mb-6">
                Access curated job opportunities, career resources, and professional development tools 
                tailored to your field of study.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✓ Job Opportunities</p>
                <p>✓ Career Analytics</p>
                <p>✓ Industry Insights</p>
                <p>✓ Professional Network</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            Join thousands of students who are already building their futures with AXIOM.AI
          </p>
        </div>
      </div>
    </div>
  );
}