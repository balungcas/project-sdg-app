import React, { createContext, useState, useEffect } from 'react';
import * as firebase from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { firebaseConfig } from '@/config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Platform } from 'react-native';

// Initialize Firebase if it hasn't been initialized yet
if (!firebase.getApps().length) {
  firebase.initializeApp(firebaseConfig);
}

export const AuthContext = createContext({
  user: null,
  isLoading: false,
  login: async (email: string, password: string) => {},
  register: async (email: string, password: string, name: string) => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    // For demo purposes, we'll skip the auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false); // Set loading to false after auth state is determined
    });
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      // For demo purposes, just return the mock user
      setUser(mockUser);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, just return the mock user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Optionally update profile with display name
      await updateProfile(userCredential.user, { displayName: name });
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, just return the mock user
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};