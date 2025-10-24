import { storage } from '../lib/demoData';
import type { User } from '../lib/types';

export const userService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const users = storage.getUsers();
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async createUser(
    email: string,
    userType: 'high_school' | 'uni_postgrad',
    dseScores?: { [subject: string]: string },
    discipline?: string
  ): Promise<User | null> {
    try {
      const newUser: User = {
        id: `demo-user-${Date.now()}`,
        email,
        user_type: userType,
        dse_scores: dseScores || null,
        discipline: discipline || null,
        created_at: new Date().toISOString()
      };

      const users = storage.getUsers();
      users.push(newUser);
      storage.saveUsers(users);

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  },

  async updateUser(
    userId: string,
    updates: {
      user_type?: 'high_school' | 'uni_postgrad';
      dse_scores?: { [subject: string]: string } | null;
      discipline?: string | null;
    }
  ): Promise<User | null> {
    try {
      const users = storage.getUsers();
      const userIndex = users.findIndex((u: User) => u.id === userId);
      
      if (userIndex >= 0) {
        users[userIndex] = { ...users[userIndex], ...updates };
        storage.saveUsers(users);
        return users[userIndex];
      }

      return null;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  },

  async checkUserExists(userId: string): Promise<boolean> {
    try {
      const users = storage.getUsers();
      return users.some((u: User) => u.id === userId);
    } catch (error) {
      return false;
    }
  },
};
