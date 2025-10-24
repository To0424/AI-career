import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import type { DSEScores } from '../lib/types';

interface OnboardingModalProps {
  onComplete: (
    userType: 'high_school' | 'uni_postgrad',
    dseScores?: DSEScores,
    discipline?: string
  ) => void;
}

const DSE_GRADES = ['5**', '5*', '5', '4', '3', '2', '1', 'U'];

const DSE_CORE_SUBJECTS = ['English', 'Chinese', 'Mathematics', 'Liberal Studies'];

const DSE_ELECTIVE_SUBJECTS = [
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Business Accounting and Financial Studies',
  'Geography',
  'History',
  'Chinese History',
  'Information and Communication Technology',
  'Visual Arts',
  'Music',
  'Physical Education',
];

const DISCIPLINES = ['Tech', 'Business', 'Arts', 'Science', 'General'];

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'type' | 'profile'>('type');
  const [userType, setUserType] = useState<'high_school' | 'uni_postgrad' | null>(null);
  const [dseScores, setDseScores] = useState<DSEScores>({});
  const [elective1, setElective1] = useState('');
  const [elective2, setElective2] = useState('');
  const [discipline, setDiscipline] = useState('');

  const handleTypeSelect = (type: 'high_school' | 'uni_postgrad') => {
    setUserType(type);
    if (type === 'high_school') {
      onComplete(type);
      navigate('/dse-calculator');
    } else {
      setStep('profile');
    }
  };

  const handleDseScoreChange = (subject: string, grade: string) => {
    setDseScores(prev => ({ ...prev, [subject]: grade }));
  };

  const isHighSchoolProfileComplete = () => {
    const coreComplete = DSE_CORE_SUBJECTS.every(subject => dseScores[subject]);
    return coreComplete && elective1 && elective2 && dseScores[elective1] && dseScores[elective2];
  };

  const isUniProfileComplete = () => {
    return discipline !== '';
  };

  const handleSubmit = () => {
    if (!userType) return;

    if (userType === 'high_school' && !isHighSchoolProfileComplete()) {
      alert('Please complete all DSE subject scores');
      return;
    }

    if (userType === 'uni_postgrad' && !isUniProfileComplete()) {
      alert('Please select a discipline');
      return;
    }

    if (userType === 'high_school') {
      onComplete(userType, dseScores);
    } else {
      onComplete(userType, undefined, discipline);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {step === 'type' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <img 
                    src="/axiom-logo.png" 
                    alt="AXIOM.AI Logo" 
                    className="w-14 h-14"
                  />
                  <h2 className="text-2xl font-bold text-gray-900">Welcome to AI Career Planner</h2>
                </div>
              </div>

              <p className="text-gray-600 mb-8">
                Let's personalize your experience. Are you a high school student or university/postgraduate student?
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleTypeSelect('high_school')}
                  className="w-full p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">High School Student</h3>
                  <p className="text-gray-600">
                    I'm preparing for or have completed DSE and exploring career options
                  </p>
                </button>

                <button
                  onClick={() => handleTypeSelect('uni_postgrad')}
                  className="w-full p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">University/Postgraduate Student</h3>
                  <p className="text-gray-600">
                    I'm seeking internships or professional roles to start my career
                  </p>
                </button>
              </div>
            </div>
          )}

          {step === 'profile' && userType === 'high_school' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your DSE Scores</h2>
                <button
                  onClick={() => setStep('type')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Enter your DSE scores to receive personalized career advice and study recommendations.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Subjects</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {DSE_CORE_SUBJECTS.map(subject => (
                      <div key={subject}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {subject}
                        </label>
                        <select
                          value={dseScores[subject] || ''}
                          onChange={(e) => handleDseScoreChange(subject, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select grade</option>
                          {DSE_GRADES.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Elective Subjects (Select 2)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Elective 1
                      </label>
                      <select
                        value={elective1}
                        onChange={(e) => setElective1(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                      >
                        <option value="">Select subject</option>
                        {DSE_ELECTIVE_SUBJECTS.map(subject => (
                          <option key={subject} value={subject} disabled={subject === elective2}>
                            {subject}
                          </option>
                        ))}
                      </select>
                      {elective1 && (
                        <select
                          value={dseScores[elective1] || ''}
                          onChange={(e) => handleDseScoreChange(elective1, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select grade</option>
                          {DSE_GRADES.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Elective 2
                      </label>
                      <select
                        value={elective2}
                        onChange={(e) => setElective2(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                      >
                        <option value="">Select subject</option>
                        {DSE_ELECTIVE_SUBJECTS.map(subject => (
                          <option key={subject} value={subject} disabled={subject === elective1}>
                            {subject}
                          </option>
                        ))}
                      </select>
                      {elective2 && (
                        <select
                          value={dseScores[elective2] || ''}
                          onChange={(e) => handleDseScoreChange(elective2, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select grade</option>
                          {DSE_GRADES.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!isHighSchoolProfileComplete()}
                  className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          )}

          {step === 'profile' && userType === 'uni_postgrad' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Discipline</h2>
                <button
                  onClick={() => setStep('type')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Select your field of study to see relevant job opportunities.
              </p>

              <div className="space-y-4">
                {DISCIPLINES.map(disc => (
                  <button
                    key={disc}
                    onClick={() => setDiscipline(disc)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      discipline === disc
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{disc}</h3>
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isUniProfileComplete()}
                className="w-full mt-6 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Complete Setup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
