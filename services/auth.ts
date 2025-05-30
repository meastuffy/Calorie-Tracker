import { useState, useEffect } from 'react';

// Mock user data - in a real app, this would come from Firebase
const MOCK_USERS = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password',
    settings: {
      darkMode: false,
      notifications: true,
      units: 'metric',
    }
  }
];

// Mock auth state - in a real app, this would be managed by Firebase
let currentUser: any = null;

// Sign in function
export async function signIn(email: string, password: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const user = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (user) {
        // Remove password before setting current user
        const { password, ...userWithoutPassword } = user;
        currentUser = userWithoutPassword;
        resolve(userWithoutPassword);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000);
  });
}

// Sign up function
export async function signUp(name: string, email: string, password: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        reject(new Error('Email already in use'));
        return;
      }
      
      // Create new user
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        name,
        email,
        password,
        settings: {
          darkMode: false,
          notifications: true,
          units: 'metric',
        }
      };
      
      // In a real app, this would add to Firebase
      MOCK_USERS.push(newUser);
      
      // Remove password before setting current user
      const { password: _, ...userWithoutPassword } = newUser;
      currentUser = userWithoutPassword;
      
      resolve(userWithoutPassword);
    }, 1000);
  });
}

// Sign out function
export async function signOut(): Promise<void> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      currentUser = null;
      resolve();
    }, 500);
  });
}

// Get current user
export function getCurrentUser(): any {
  return currentUser;
}

// Update user settings
export async function updateUserSettings(settings: any): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!currentUser) {
      reject(new Error('No user is signed in'));
      return;
    }
    
    setTimeout(() => {
      // Update current user settings
      currentUser.settings = {
        ...currentUser.settings,
        ...settings,
      };
      
      // In a real app, this would update Firebase
      const userIndex = MOCK_USERS.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        MOCK_USERS[userIndex].settings = {
          ...MOCK_USERS[userIndex].settings,
          ...settings,
        };
      }
      
      resolve();
    }, 500);
  });
}

// Get user profile (current user)
export async function getUserProfile(): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentUser) {
        resolve(currentUser);
      } else {
        // Auto-login with demo account for demonstration purposes
        const demoUser = MOCK_USERS[0];
        const { password, ...userWithoutPassword } = demoUser;
        currentUser = userWithoutPassword;
        resolve(userWithoutPassword);
      }
    }, 500);
  });
}

// Custom hook for auth state
export function useAuth() {
  const [user, setUser] = useState<any>(currentUser);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate auth state change listener
    const checkAuth = () => {
      setUser(currentUser);
      setLoading(false);
    };
    
    checkAuth();
    
    // In a real app, this would be a Firebase auth listener
    const interval = setInterval(checkAuth, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return { user, loading };
}