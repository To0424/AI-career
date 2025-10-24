import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import { userService } from '../services/userService';
import { applicationService, type ApplicationWithJob } from '../services/applicationService';
import type { User, DSEScores } from '../lib/types';

interface DashboardPageProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

const DSE_GRADES = ['5**', '5*', '5', '4', '3', '2', '1', 'U'];
const DISCIPLINES = ['Tech', 'Business', 'Arts', 'Science', 'General'];

export function DashboardPage({ user, onUserUpdate }: DashboardPageProps) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDseScores, setEditedDseScores] = useState<DSEScores>(user.dse_scores || {});
  const [editedDiscipline, setEditedDiscipline] = useState(user.discipline || '');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);

    if (user.user_type === 'uni_postgrad') {
      const apps = await applicationService.getUserApplications(user.id);
      setApplications(apps);
    }

    setIsLoading(false);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);

    const updates = user.user_type === 'high_school'
      ? { dse_scores: editedDseScores }
      : { discipline: editedDiscipline };

    const updatedUser = await userService.updateUser(user.id, updates);

    if (updatedUser) {
      onUserUpdate(updatedUser);
      setIsEditing(false);
    }

    setIsSaving(false);
  };

  const handleCancelEdit = () => {
    setEditedDseScores(user.dse_scores || {});
    setEditedDiscipline(user.discipline || '');
    setIsEditing(false);
  };

  const getStudySuggestions = () => {
    if (!user.dse_scores) return [];

    const scores = Object.values(user.dse_scores);
    const hasTopScore = scores.some(score => score === '5**' || score === '5*');
    const avgScore = scores.some(score => ['4', '5'].includes(score));
    const lowScore = scores.some(score => ['1', '2', '3'].includes(score));

    const suggestions = [];

    if (hasTopScore) {
      suggestions.push('Your excellent grades open doors to top universities like HKU, CUHK, and HKUST.');
      suggestions.push('Consider applying to competitive overseas programs in the US, UK, or Canada.');
      suggestions.push('Look into scholarship opportunities for high-achieving students.');
    } else if (avgScore) {
      suggestions.push('You have good options for local universities through JUPAS.');
      suggestions.push('Consider overseas universities in UK, Australia, or Taiwan with flexible entry requirements.');
      suggestions.push('Explore programs that match your strongest subjects.');
    }

    if (lowScore) {
      suggestions.push('Consider diploma programs at IVE or community colleges with articulation pathways.');
      suggestions.push('You can retake specific DSE subjects to improve your scores.');
      suggestions.push('Look into vocational training programs that align with your interests.');
    }

    return suggestions.length > 0 ? suggestions : ['Continue working hard and explore various educational pathways available to you.'];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-50 border-b border-gray-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Profile</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">User Type</p>
              <p className="text-gray-900 font-medium">
                {user.user_type === 'high_school' ? 'High School Student' : 'University/Postgraduate Student'}
              </p>
            </div>

            {user.user_type === 'high_school' && (
              <div>
                <p className="text-sm text-gray-600 mb-3">DSE Scores</p>
                {!isEditing ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {Object.entries(user.dse_scores || {}).map(([subject, grade]) => (
                      <div key={subject} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">{subject}</p>
                        <p className="text-lg font-semibold text-gray-900">{grade}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(editedDseScores).map(([subject, grade]) => (
                      <div key={subject}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {subject}
                        </label>
                        <select
                          value={grade}
                          onChange={(e) => setEditedDseScores(prev => ({ ...prev, [subject]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {DSE_GRADES.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {user.user_type === 'uni_postgrad' && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Discipline</p>
                {!isEditing ? (
                  <p className="text-gray-900 font-medium">{user.discipline}</p>
                ) : (
                  <select
                    value={editedDiscipline}
                    onChange={(e) => setEditedDiscipline(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {DISCIPLINES.map(disc => (
                      <option key={disc} value={disc}>{disc}</option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
        </div>

        {user.user_type === 'high_school' && (
          <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-300 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Study Suggestions</h2>
            <div className="space-y-3">
              {getStudySuggestions().map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-0.5">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {user.user_type === 'uni_postgrad' && (
          <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-300 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Applied Jobs</h2>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : applications.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                You haven't applied to any jobs yet. Start exploring opportunities on the homepage!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Job Title</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Company</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Source</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Applied Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{app.job.title}</td>
                        <td className="py-3 px-4 text-gray-700">{app.job.company}</td>
                        <td className="py-3 px-4 text-gray-700">{app.job.source}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{formatDate(app.applied_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
