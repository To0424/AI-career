import { supabase } from '../lib/supabase';
import { storage } from '../lib/demoData';
import type { User } from '../lib/types';

export const userService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const users = storage.getUsers();
      return users.find((u: User) => u.id === user.id) || null;
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
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return null;

      const newUser: User = {
        id: authUser.id,
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
