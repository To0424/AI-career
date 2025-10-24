import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { chatbotService } from '../services/chatbotService';
import type { ChatbotQuery } from '../lib/types';

interface ChatbotPageProps {
  userId: string;
  userType: 'high_school' | 'uni_postgrad';
}

export function ChatbotPage({ userId, userType }: ChatbotPageProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [queries, setQueries] = useState<ChatbotQuery[]>([]);
  const [queryCount, setQueryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadQueries();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [queries]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadQueries = async () => {
    const count = await chatbotService.getUserQueryCount(userId);
    setQueryCount(count);

    const allQueries = await chatbotService.getUserQueries(userId, 10);
    setQueries(allQueries);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim() || isLoading || queryCount >= 3) return;

    setIsLoading(true);

    const result = await chatbotService.submitQuery(userId, userType, query);

    if (result.limitReached) {
      alert(result.response);
      setIsLoading(false);
      return;
    }

    if (result.saved) {
      await loadQueries();
      setQuery('');
    }

    setIsLoading(false);
  };

  const remainingQueries = 3 - queryCount;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="text-sm text-gray-600">
              {remainingQueries > 0 ? `${remainingQueries} queries remaining` : 'Query limit reached'}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Career Assistant</h1>
                <p className="text-sm text-gray-600">
                  {userType === 'high_school'
                    ? 'Get advice on DSE preparation, overseas study, and mental health support'
                    : 'Get guidance on CV writing, interviews, and networking tips'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {queries.length === 0 && (
              <div className="text-center py-16">
                <MessageCircle className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Start a conversation</h3>
                <p className="text-gray-500 mb-6">
                  {userType === 'high_school'
                    ? 'Ask me about DSE advice, overseas study, or mental health support'
                    : 'Ask me about CV writing, interviews, or networking tips'}
                </p>
                <div className="text-left max-w-md mx-auto bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Example questions:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {userType === 'high_school' ? (
                      <>
                        <li>• What are the best study strategies for DSE?</li>
                        <li>• How can I manage exam stress?</li>
                        <li>• What should I consider for overseas universities?</li>
                      </>
                    ) : (
                      <>
                        <li>• How do I write a strong CV?</li>
                        <li>• What should I prepare for a job interview?</li>
                        <li>• How can I improve my networking skills?</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {queries.slice().reverse().map((item) => (
              <div key={item.id} className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg px-4 py-3 max-w-[80%]">
                    <p className="text-sm">{item.query}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-3 max-w-[80%]">
                    <p className="text-sm whitespace-pre-wrap">{item.response}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={remainingQueries > 0 ? "Type your question..." : "Query limit reached"}
                disabled={isLoading || queryCount >= 3}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading || queryCount >= 3}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
