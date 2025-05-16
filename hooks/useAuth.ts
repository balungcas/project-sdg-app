import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // // Temporarily bypass authentication for development
  // const mockUser = {
  //   uid: 'mock-user-id',
  //   email: 'mockuser@example.com',
  //   displayName: 'Mock User',
  //   photoURL: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' // Generic avatar
  // };

  return context;
};