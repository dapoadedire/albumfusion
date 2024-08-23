'use client';

import React from 'react';
import { AuthProvider } from './components/auth/AuthContext'; // Adjust this import path as needed

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default ClientProvider;