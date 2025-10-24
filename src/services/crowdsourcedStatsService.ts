import { COMPANY_STATS } from '../lib/demoData';
import type { CompanyStats } from '../lib/types';

export const crowdsourcedStatsService = {
  async getStatsByCompany(company: string): Promise<CompanyStats | null> {
    try {
      return COMPANY_STATS.find(stat => stat.company === company) || null;
    } catch (error) {
      console.error('Error getting company stats:', error);
      return null;
    }
  },

  async getAllStats(): Promise<CompanyStats[]> {
    try {
      return COMPANY_STATS;
    } catch (error) {
      console.error('Error getting all stats:', error);
      return [];
    }
  },
};
