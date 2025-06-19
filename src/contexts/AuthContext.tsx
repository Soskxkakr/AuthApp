import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
    name: string;
    email: string;
    password: string;
  }

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; errors?: string[] }>;
    logout: (email: string) => void;
  }

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Helper function to store user in users array
  const storeUser = async (newUser: User): Promise<{ success: boolean; error?: string }> => {
    try {
      // Get existing users
      const storedUsers = await AsyncStorage.getItem('users');
      let users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if user already exists
      const existingUser = users.find(u => u.email === newUser.email);
      if (existingUser) {
        return { success: false, error: 'Email has been registered.' };
      }

      // Add new user
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));

      return { success: true };
    } catch (error) {
      console.error('Error storing user:', error);
      return { success: false, error: 'Failed to store user' };
    }
  };

  const findUser = async (email: string): Promise<User | undefined> => {
    // Get existing users
    const storedUsers = await AsyncStorage.getItem('users');
    let users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    // Check if user already exists
    const user = users.find(u => u.email === email);
    
    return user;
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const user = await findUser(email);
    
    if (!user) return { success: false, error: 'Invalid email or password' };
    
    if (user.password !== password)
      return { success: false, error: 'Invalid email or password' };
    
    await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));

    setUser(user);
    return { success: true };
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; errors?: string[] }> => {
    const errors: string[] = [];
    
    if (!name && !email && !password)
      errors.push('All fields are required');
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email.toLowerCase())) 
      errors.push('Invalid email');
    
    if (password.length < 6) 
      errors.push('Password must be at least 6 characters');
    
    if (errors.length > 0) return { success: false, errors };
    const newUser = { name, email, password };
    const storeResult = await storeUser(newUser);
    
    if (!storeResult.success) {
      return { success: false, errors: [storeResult.error!] };
    }

    await AsyncStorage.setItem('loggedInUser', JSON.stringify(newUser));
    setUser(newUser);

    return { success: true };
  };

  const logout = async () => {
    await AsyncStorage.removeItem('loggedInUser');
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      const loggedInUser = await AsyncStorage.getItem('loggedInUser');
      
      if (!loggedInUser) return;

      const user = JSON.parse(loggedInUser) as User;
      setUser(user);
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };
