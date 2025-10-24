import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Calculator } from 'lucide-react';
import universityData from '../data/universities.json';
import { storage } from '../lib/demoData';
import type { User } from '../lib/types';

interface DSEScores {
  [subject: string]: string;
}

interface Program {
  name: string;
  code: string;
  minScore: number;
  weightedSubjects: { [key: string]: number };
  coreRequirements: { [key: string]: number };
  electiveRequirements: string[];
}

interface University {
  university: string;
  abbreviation: string;
  programs: Program[];
}

interface ProgramMatch {
  university: string;
  abbreviation: string;
  program: Program;
  score: number;
  qualified: boolean;
  missingRequirements: string[];
}

const DSE_GRADES = ['5**', '5*', '5', '4', '3', '2', '1', 'U'];
const DSE_CORE_SUBJECTS = ['English', 'Chinese', 'Mathematics', 'Liberal Studies'];
const DSE_ELECTIVE_SUBJECTS = [
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'BAFS',
  'Geography',
  'History',
  'Chinese History',
  'ICT',
  'M1',
  'M2',
];

const gradeToScore = (grade: string): number => {
  const gradeMap: { [key: string]: number } = {
    '5**': 7,
    '5*': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
    '1': 1,
    'U': 0,
  };
  return gradeMap[grade] || 0;
};

export function DSECalculatorPage() {
  const navigate = useNavigate();
  const [dseScores, setDseScores] = useState<DSEScores>({});
  const [elective1, setElective1] = useState('');
  const [elective2, setElective2] = useState('');
  const [matches, setMatches] = useState<ProgramMatch[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleDseScoreChange = (subject: string, grade: string) => {
    setDseScores(prev => ({ ...prev, [subject]: grade }));
  };

  const isFormComplete = () => {
    const coreComplete = DSE_CORE_SUBJECTS.every(subject => dseScores[subject]);
    return coreComplete && elective1 && elective2 && dseScores[elective1] && dseScores[elective2];
  };

  const saveUserProfile = () => {
    const newUser: User = {
      id: `demo-user-${Date.now()}`,
      email: `demo-${Date.now()}@example.com`,
      user_type: 'high_school',
      dse_scores: dseScores,
      discipline: 'General',
      created_at: new Date().toISOString()
    };

    const users = storage.getUsers();
    users.push(newUser);
    storage.saveUsers(users);

    navigate('/home');
  };

  const calculateMatches = () => {
    if (!isFormComplete()) {
      alert('Please complete all DSE subject scores');
      return;
    }

    const allMatches: ProgramMatch[] = [];

    (universityData as any[]).forEach((uni: any) => {
      uni.programs.forEach((program: any) => {
        let baseScore = 0;
        const missingRequirements: string[] = [];

        DSE_CORE_SUBJECTS.forEach(subject => {
          const score = gradeToScore(dseScores[subject]);
          baseScore += score;
          if (program.coreRequirements[subject] && score < program.coreRequirements[subject]) {
            missingRequirements.push(`${subject}: need ${program.coreRequirements[subject]}, got ${score}`);
          }
        });

        [elective1, elective2].forEach(subject => {
          const score = gradeToScore(dseScores[subject]);
          const weight = program.weightedSubjects[subject] ||
                        (subject === 'M1' || subject === 'M2' ? program.weightedSubjects['M1/M2'] || 1 : 1);
          baseScore += score * weight;
        });

        const hasRequiredElectives = program.electiveRequirements.some((req: any) =>
          [elective1, elective2].includes(req)
        );

        if (!hasRequiredElectives && program.electiveRequirements.length > 0) {
          missingRequirements.push(`Need one of: ${program.electiveRequirements.join(', ')}`);
        }

        const qualified = baseScore >= program.minScore && missingRequirements.length === 0;

        allMatches.push({
          university: uni.university,
          abbreviation: uni.abbreviation,
          program,
          score: baseScore,
          qualified,
          missingRequirements,
        });
      });
    });

    allMatches.sort((a, b) => {
      if (a.qualified !== b.qualified) return a.qualified ? -1 : 1;
      return b.score - a.score;
    });

    setMatches(allMatches);
    setHasCalculated(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">DSE University Calculator</h1>
          </div>
          <p className="text-gray-600">
            Try different combinations of DSE scores to discover which university programs you qualify for
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Enter Your DSE Scores</h2>

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
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Elective Subjects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Elective 1
                    </label>
                    <select
                      value={elective1}
                      onChange={(e) => setElective1(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
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
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
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
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                onClick={calculateMatches}
                disabled={!isFormComplete()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Calculate Matches
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Program Matches</h2>

            {!hasCalculated ? (
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">
                  Enter your DSE scores and click Calculate to see which programs you qualify for
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {matches.filter(m => m.qualified).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-2">No qualifying programs found</p>
                    <p className="text-sm text-gray-500">Try adjusting your scores or check programs below minimum requirements</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-green-700 mb-3">Qualified Programs ({matches.filter(m => m.qualified).length})</h3>
                      <div className="space-y-3">
                        {matches.filter(m => m.qualified).map((match, idx) => (
                          <div key={idx} className="border border-green-200 bg-green-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">{match.program.name}</h4>
                                <p className="text-sm text-gray-600">{match.university} ({match.abbreviation})</p>
                              </div>
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                                {match.score.toFixed(1)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">Program Code: {match.program.code}</p>
                            <p className="text-xs text-gray-500">Minimum Score: {match.program.minScore}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {matches.filter(m => !m.qualified).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-3">Not Qualified ({matches.filter(m => !m.qualified).length})</h3>
                        <div className="space-y-3">
                          {matches.filter(m => !m.qualified).slice(0, 5).map((match, idx) => (
                            <div key={idx} className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{match.program.name}</h4>
                                  <p className="text-sm text-gray-600">{match.university} ({match.abbreviation})</p>
                                </div>
                                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium">
                                  {match.score.toFixed(1)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mb-1">Minimum Score: {match.program.minScore}</p>
                              {match.missingRequirements.length > 0 && (
                                <div className="text-xs text-red-600 mt-2">
                                  <p className="font-medium">Missing:</p>
                                  <ul className="list-disc list-inside">
                                    {match.missingRequirements.map((req, i) => (
                                      <li key={i}>{req}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Continue to Main App Button */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-gray-600 mb-4">
                    Ready to explore career opportunities and resources?
                  </p>
                  <button
                    onClick={saveUserProfile}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Continue to Main App
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
