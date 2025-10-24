import { storage } from '../lib/demoData';
import { poeService } from './poeService';
import type { ChatbotQuery } from '../lib/types';

const getSimpleResponse = (userType: 'high_school' | 'uni_postgrad', query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (userType === 'high_school') {
    if (lowerQuery.includes('dse') || lowerQuery.includes('score')) {
      return "For DSE guidance, consider your options based on your scores. Even with lower scores, there are pathways through IVE, community colleges, or overseas universities.";
    }
    if (lowerQuery.includes('university') || lowerQuery.includes('study')) {
      return "Explore both local and overseas university options. Research entry requirements and consider alternative pathways if needed.";
    }
    if (lowerQuery.includes('career') || lowerQuery.includes('job')) {
      return "Start exploring careers through internships, job shadowing, and career talks. This will help you choose the right university program.";
    }
    return "I can help with DSE advice, university planning, and career exploration. What specific topic interests you?";
  } else {
    if (lowerQuery.includes('cv') || lowerQuery.includes('resume')) {
      return "Structure your CV with clear sections: Education, Experience, Skills, and Achievements. Tailor it to each job and keep it concise.";
    }
    if (lowerQuery.includes('interview')) {
      return "Prepare for interviews by researching the company, practicing STAR method answers, and preparing thoughtful questions to ask.";
    }
    if (lowerQuery.includes('job') || lowerQuery.includes('application')) {
      return "Focus on networking, tailoring applications to job requirements, and building relevant skills for your target roles.";
    }
    return "I can help with CV writing, interview preparation, job applications, and career development. What would you like guidance on?";
  }
};

export const chatbotService = {
  async getUserQueryCount(userId: string): Promise<number> {
    try {
      const queries = storage.getChatQueries();
      return queries.filter((q: ChatbotQuery) => q.user_id === userId).length;
    } catch (error) {
      console.error('Error getting query count:', error);
      return 0;
    }
  },

  async getUserQueries(userId: string, limit: number = 2): Promise<ChatbotQuery[]> {
    try {
      const queries = storage.getChatQueries();
      return queries
        .filter((q: ChatbotQuery) => q.user_id === userId)
        .sort((a: ChatbotQuery, b: ChatbotQuery) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // chronological order
        .slice(-limit); // Get the last N queries (most recent ones)
    } catch (error) {
      console.error('Error getting user queries:', error);
      return [];
    }
  },

  async saveQuery(userId: string, query: string, response: string): Promise<ChatbotQuery | null> {
    try {
      const queries = storage.getChatQueries();
      const newQuery: ChatbotQuery = {
        id: queries.length + 1,
        user_id: userId,
        query,
        response,
        created_at: new Date().toISOString()
      };

      queries.push(newQuery);
      storage.saveChatQueries(queries);

      return newQuery;
    } catch (error) {
      console.error('Error saving query:', error);
      return null;
    }
  },

  async getResponse(userType: 'high_school' | 'uni_postgrad', query: string): Promise<string> {
    try {
      // Use POE service to generate AI response
      const response = await poeService.generateResponse(userType, query);
      return response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fallback to simple response if AI service fails
      return getSimpleResponse(userType, query);
    }
  },

  async submitQuery(userId: string, userType: 'high_school' | 'uni_postgrad', query: string): Promise<{ response: string; saved: boolean; limitReached: boolean }> {
    try {
      const queryCount = await this.getUserQueryCount(userId);

      if (queryCount >= 10) {
        return {
          response: 'You have reached the maximum of 10 queries. Please refresh the page to start a new session.',
          saved: false,
          limitReached: true,
        };
      }

      const response = await this.getResponse(userType, query);
      const saved = await this.saveQuery(userId, query, response);

      return {
        response,
        saved: saved !== null,
        limitReached: false,
      };
    } catch (error) {
      console.error('Error in submitQuery:', error);
      const response = await this.getResponse(userType, query);
      return {
        response,
        saved: false,
        limitReached: false,
      };
    }
  },
};
