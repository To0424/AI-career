// Simple demo auth system
let currentUser: { id: string; email: string } | null = null;

export const demoAuth = {
  getUser: async () => {
    return { data: { user: currentUser }, error: null };
  },
  
  signInAnonymously: async () => {
    if (!currentUser) {
      currentUser = {
        id: `demo-user-${Date.now()}`,
        email: `demo-${Date.now()}@example.com`
      };
    }
    return { data: { user: currentUser }, error: null };
  }
};