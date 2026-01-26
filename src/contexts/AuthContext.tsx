import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, fetchUserAttributes, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

interface UserInfo {
  username: string;
  role: 'admin' | 'incharge';
  email?: string;
}

interface AuthContextType {
  userInfo: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      setUserInfo({
        username: attributes.preferred_username || user.username,
        role: (attributes['custom:role'] as 'admin' | 'incharge') || 'incharge',
        email: attributes.email
      });
    } catch (error) {
      console.log('Not authenticated');
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUserInfo(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    loadUser();

    // Listen for auth events
    const hubListener = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          console.log('User signed in');
          loadUser();
          break;
        case 'signedOut':
          console.log('User signed out');
          setUserInfo(null);
          break;
      }
    });

    return () => hubListener();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        userInfo, 
        isLoading, 
        isAuthenticated: !!userInfo,
        logout,
        refreshUser: loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
