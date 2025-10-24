// POE API Service
// Using POE's OpenAI-compatible API with your custom GenAI-career-planner bot

const POE_API_KEY = import.meta.env.VITE_POE_API_KEY || 'w-LuCyMAkiz37CrEU5M_3t9lrLsvx-9p0qYnZcuJtJU';
const POE_BASE_URL = 'https://api.poe.com/v1';

// Using your custom POE bot
const POE_MODEL = 'GenAI-career-planner';

interface POEMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface POERequest {
  model: string;
  messages: POEMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

interface POEResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// System prompts for different user types
const SYSTEM_PROMPTS = {
  high_school: `You are an AI career assistant specifically designed to help Hong Kong high school students navigate their academic and career planning. You have expertise in:

1. **DSE (Diploma of Secondary Education) guidance**: Score interpretation, subject selection, and preparation strategies
2. **University pathways**: Local universities (HKU, CUHK, HKUST, PolyU, CityU, HKBU, LingU, EdUHK), overseas options, and alternative pathways
3. **Career exploration**: Helping students discover interests, strengths, and career options
4. **Academic planning**: Subject combinations, study strategies, and timeline planning
5. **Post-secondary options**: IVE, community colleges, associate degrees, and direct employment

**Guidelines:**
- Be encouraging and supportive, especially for students worried about their DSE scores
- Provide practical, actionable advice tailored to Hong Kong's education system
- Suggest multiple pathways and alternatives when appropriate
- Use examples relevant to Hong Kong students
- Keep responses concise but comprehensive (aim for 2-3 paragraphs max)
- Always maintain a positive, growth-oriented tone

Respond to student queries with empathy, practical guidance, and hope for their future.`,

  uni_postgrad: `You are an AI career assistant specifically designed to help university students and recent graduates in Hong Kong advance their careers. You specialize in:

1. **Job search strategy**: CV/resume writing, cover letters, job application best practices
2. **Interview preparation**: Common questions, STAR method, industry-specific preparation
3. **Career development**: Skill building, networking, professional growth, and career transitions
4. **Industry insights**: Market trends, salary expectations, and growth opportunities in Hong Kong and internationally
5. **Professional skills**: LinkedIn optimization, personal branding, and workplace soft skills
6. **Graduate programs**: Further education options, professional certifications, and skill development

**Guidelines:**
- Provide actionable, professional advice based on current job market trends
- Tailor suggestions to Hong Kong's competitive job market and workplace culture
- Include both local and international perspective when relevant
- Offer specific examples and templates when appropriate
- Focus on practical steps students can take immediately
- Keep responses professional yet approachable (aim for 2-3 paragraphs max)
- Emphasize continuous learning and adaptability

Help students build confidence and take concrete steps toward their career goals.`
};

export class POEService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || POE_API_KEY;
    this.baseUrl = POE_BASE_URL;
    this.model = model || POE_MODEL;
  }

  /**
   * Generate a response using POE API
   */
  async generateResponse(
    userType: 'high_school' | 'uni_postgrad',
    userMessage: string,
    conversationHistory: POEMessage[] = []
  ): Promise<string> {
    try {
      const messages: POEMessage[] = [
        {
          role: 'system',
          content: SYSTEM_PROMPTS[userType]
        },
        ...conversationHistory,
        {
          role: 'user',
          content: userMessage
        }
      ];

      const requestBody: POERequest = {
        model: this.model,
        messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('POE API error:', response.status, errorText);
        throw new Error(`POE API error: ${response.status}`);
      }

      const data: POEResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response choices returned from POE');
      }

      return data.choices[0].message.content.trim();

    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback to simple responses if API fails
      return this.getFallbackResponse(userType, userMessage);
    }
  }

  /**
   * Fallback response generator for when API is unavailable
   */
  private getFallbackResponse(userType: 'high_school' | 'uni_postgrad', query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (userType === 'high_school') {
      if (lowerQuery.includes('dse') || lowerQuery.includes('score')) {
        return "For DSE guidance, remember that your scores are just one part of your journey. Focus on your strengths and explore various pathways including local universities, overseas options, and alternative routes through IVE or community colleges. Every score opens different doors - the key is finding the right path for you.";
      }
      if (lowerQuery.includes('university') || lowerQuery.includes('study')) {
        return "When choosing universities, consider both academic fit and personal interests. Research local options like HKU, CUHK, and HKUST, but also explore overseas opportunities and alternative pathways. Look into program requirements, campus culture, and career outcomes to make an informed decision.";
      }
      if (lowerQuery.includes('career') || lowerQuery.includes('job')) {
        return "Career exploration at your stage is about discovering possibilities. Try job shadowing, attend career talks, and speak with professionals in fields that interest you. This will help you choose the right university program and build a foundation for your future career.";
      }
      return "I'm here to help with DSE planning, university selection, and career exploration. Whether you're worried about scores or excited about possibilities, let's work together to find the best path for your future. What specific area would you like to discuss?";
    } else {
      if (lowerQuery.includes('cv') || lowerQuery.includes('resume')) {
        return "A strong CV should tell your professional story clearly. Start with a compelling summary, then organize sections for education, experience, skills, and achievements. Tailor each application to the specific role, use action verbs, and quantify your accomplishments wherever possible. Keep it concise and error-free.";
      }
      if (lowerQuery.includes('interview')) {
        return "Interview success comes from preparation and practice. Research the company thoroughly, prepare STAR method examples for behavioral questions, and practice your responses out loud. Prepare thoughtful questions to ask them, dress appropriately, and remember that confidence comes from being well-prepared.";
      }
      if (lowerQuery.includes('job') || lowerQuery.includes('application')) {
        return "Effective job searching combines strategy with persistence. Network actively both online and offline, tailor each application to the role, and follow up professionally. Focus on building relevant skills and showcasing your value to employers. Quality applications often matter more than quantity.";
      }
      return "I'm here to support your career development with practical advice on job searching, CV writing, interview preparation, and professional growth. Whether you're a recent graduate or looking to advance your career, let's work on concrete steps to achieve your goals. What would you like to focus on?";
    }
  }
}

// Export a default instance
export const poeService = new POEService();