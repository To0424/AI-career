import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, X, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { chatbotService } from '../services/chatbotService';
import type { ChatbotQuery } from '../lib/types';

interface ChatbotWidgetProps {
  userId: string;
  userType: 'high_school' | 'uni_postgrad';
}

export function ChatbotWidget({ userId, userType }: ChatbotWidgetProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [queries, setQueries] = useState<ChatbotQuery[]>([]);
  const [queryCount, setQueryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadQueries();
  }, [userId]);

  const loadQueries = async () => {
    const count = await chatbotService.getUserQueryCount(userId);
    setQueryCount(count);

    const recentQueries = await chatbotService.getUserQueries(userId, 2);
    setQueries(recentQueries);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim() || isLoading || queryCount >= 10) return;

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
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-40 flex flex-col" style={{ height: '500px' }}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Career Assistant</h3>
              <p className="text-xs text-gray-500">
                {remainingQueries > 0 ? `${remainingQueries} queries remaining` : 'Query limit reached'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/chatbot')}
                className="text-gray-400 hover:text-gray-600"
                title="Open full page"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {queries.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">
                  {userType === 'high_school'
                    ? 'Ask me about DSE advice, overseas study, or mental health support'
                    : 'Ask me about CV writing, interviews, or networking tips'}
                </p>
              </div>
            )}

            {queries.slice().reverse().map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="bg-blue-100 text-blue-900 rounded-lg p-3 ml-8">
                  <p className="text-sm">{item.query}</p>
                </div>
                <div className="bg-gray-100 text-gray-900 rounded-lg p-3 mr-8">
                  <div className="text-sm prose prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        ul: ({ children }) => <ul className="list-disc list-inside ml-2 mb-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside ml-2 mb-1">{children}</ol>,
                        li: ({ children }) => <li className="mb-0.5">{children}</li>,
                        code: ({ children }) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                      }}
                    >
                      {item.response}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={remainingQueries > 0 ? "Ask a question..." : "Query limit reached"}
                disabled={isLoading || queryCount >= 3}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading || queryCount >= 3}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
