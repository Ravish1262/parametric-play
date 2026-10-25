import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole | 'guest';
  loginAs: (role: UserRole | 'guest') => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  role: 'guest',
  loginAs: () => {},
  logout: () => {},
  isLoading: false,
});

export const DEMO_USERS: Record<UserRole, User> = {
  admin: {
    id: 1,
    name: 'Super Admin',
    email: 'admin@parametricplay.com',
    phone: '8102140650',
    role: 'admin',
  },
  coach: {
    id: 2,
    name: 'Rajesh Sharma (Senior PTI)',
    email: 'coach.rajesh@parametricplay.com',
    phone: '9876543210',
    role: 'coach',
  },
  school_admin: {
    id: 5,
    name: 'St. Xavier Global Academy',
    email: 'principal@xavierschool.edu',
    phone: '9811223344',
    role: 'school_admin',
  },
  society_manager: {
    id: 6,
    name: 'Palm Greens Residency RWA',
    email: 'manager@palmgreens.in',
    phone: '9822334455',
    role: 'society_manager',
  },
  customer: {
    id: 7,
    name: 'Amit Singhania (Parent)',
    email: 'parent.amit@gmail.com',
    phone: '9988776655',
    role: 'customer',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('parametric_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USERS.admin;
      }
    }
    // Default to admin for review convenience, or customer
    return DEMO_USERS.admin;
  });

  const [isLoading, setIsLoading] = useState(false);

  const loginAs = (targetRole: UserRole | 'guest') => {
    setIsLoading(true);
    if (targetRole === 'guest') {
      setCurrentUser(null);
      localStorage.removeItem('parametric_user');
    } else {
      const u = DEMO_USERS[targetRole];
      setCurrentUser(u);
      localStorage.setItem('parametric_user', JSON.stringify(u));
    }
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('parametric_user');
  };

  const role = currentUser ? currentUser.role : 'guest';

  return (
    <AuthContext.Provider value={{ currentUser, role, loginAs, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
