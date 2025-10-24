import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { storage } from '../lib/demoData';
import type { User } from '../lib/types';

const HONG_KONG_UNIVERSITIES = [
  'The University of Hong Kong (HKU)',
  'The Chinese University of Hong Kong (CUHK)',
  'The Hong Kong University of Science and Technology (HKUST)',
  'City University of Hong Kong (CityU)',
  'The Hong Kong Polytechnic University (PolyU)',
  'Hong Kong Baptist University (HKBU)',
  'Lingnan University',
  'The Education University of Hong Kong (EdUHK)',
  'Hong Kong Metropolitan University (HKMU)',
  'Hang Seng University of Hong Kong (HSUHK)'
];

const STUDY_YEARS = [
  'Year 1',
  'Year 2', 
  'Year 3',
  'Year 4',
  'Year 5',
  'Year 6',
  'Postgraduate'
];

const DISCIPLINES = [
  'Business & Management',
  'Engineering & Technology',
  'Computer Science & IT',
  'Medicine & Health Sciences',
  'Arts & Humanities',
  'Social Sciences',
  'Law',
  'Science & Mathematics',
  'Education',
  'Architecture & Design',
  'Other'
];

export function UniversityProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    university: '',
    currentYear: '',
    programme: '',
    discipline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.university || !formData.currentYear || !formData.programme || !formData.discipline) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new university user
      const newUser: User = {
        id: `demo-user-${Date.now()}`,
        email: `demo-${Date.now()}@example.com`,
        user_type: 'uni_postgrad',
        discipline: formData.discipline,
        university: formData.university,
        current_year: formData.currentYear,
        programme: formData.programme,
        created_at: new Date().toISOString()
      };

      // Save user to storage
      const users = storage.getUsers();
      users.push(newUser);
      storage.saveUsers(users);

      // Navigate to home page
      navigate('/home');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">University Profile Setup</h1>
                <p className="text-sm text-gray-600">Tell us about your academic background</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Complete Your Academic Profile
            </h2>
            <p className="text-gray-600">
              This information helps us provide personalized job recommendations and career insights.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* University Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select your university</option>
                {HONG_KONG_UNIVERSITIES.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>

            {/* Current Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Year of Study <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.currentYear}
                onChange={(e) => handleInputChange('currentYear', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select your current year</option>
                {STUDY_YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Programme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programme/Major <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.programme}
                onChange={(e) => handleInputChange('programme', e.target.value)}
                placeholder="e.g., Computer Science, Business Administration, Medicine"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Discipline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field of Study <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.discipline}
                onChange={(e) => handleInputChange('discipline', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select your field of study</option>
                {DISCIPLINES.map(discipline => (
                  <option key={discipline} value={discipline}>{discipline}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Profile...
                  </div>
                ) : (
                  'Complete Setup & Continue'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}