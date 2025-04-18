interface User {
    email: string;
    passwordHash: string;
    streak: number;
    lastPlayed: string;
    guessesToday: string[];
  }
  
  export const users: Record<string, User> = {}; // Keyed by email
  