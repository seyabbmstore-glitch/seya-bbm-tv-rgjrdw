
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { User } from '../types';

const USER_KEY = 'user_data';
const AUTH_TOKEN_KEY = 'auth_token';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await SecureStore.getItemAsync(USER_KEY);
      const authToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      
      if (userData && authToken) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate registration process
      const userId = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        email + Date.now().toString()
      );

      const newUser: User = {
        id: userId,
        email,
        name,
        isEmailVerified: false,
        createdAt: new Date(),
      };

      // Generate auth token
      const authToken = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        userId + Date.now().toString()
      );

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(newUser));
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, authToken);

      setUser(newUser);
      setIsAuthenticated(true);

      // Send verification email (simulated)
      await sendVerificationEmail(email);

      return { success: true };
    } catch (error) {
      console.log('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate login process
      const userId = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        email + 'existing_user'
      );

      const existingUser: User = {
        id: userId,
        email,
        name: email.split('@')[0],
        isEmailVerified: true,
        createdAt: new Date(),
      };

      const authToken = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        userId + Date.now().toString()
      );

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(existingUser));
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, authToken);

      setUser(existingUser);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.log('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const sendVerificationEmail = async (email: string) => {
    // Simulate sending verification email
    console.log(`Verification email sent to ${email}`);
    return { success: true };
  };

  const verifyEmail = async (verificationCode: string) => {
    try {
      if (user && verificationCode === '123456') { // Simulated verification
        const updatedUser = { ...user, isEmailVerified: true };
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }
      return { success: false, error: 'Invalid verification code' };
    } catch (error) {
      console.log('Email verification error:', error);
      return { success: false, error: 'Verification failed' };
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    register,
    login,
    logout,
    sendVerificationEmail,
    verifyEmail,
  };
};
