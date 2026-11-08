import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '../types';
import { supabase, isSupabaseConfigured, signInWithEmail, signUpWithEmail, signInWithGoogle, signOutUser } from '../services/supabase';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (details: {
    full_name: string;
    email: string;
    password: string;
    college: string;
    course: string;
    semester: number;
  }) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithGoogleDemo: () => void;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => void;
}

const defaultDemoProfile: Profile = {
  id: 'student-demo-849',
  email: 'aarav.sharma@campus.edu',
  full_name: 'Aarav Sharma',
  college: 'Apex Institute of Technology',
  course: 'B.Tech Computer Science & Engineering',
  semester: 5,
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  bio: '5th-semester CSE student passionate about Full-Stack Web Development, AI/ML architectures, and open-source systems.',
  phone: '+91 98765 43210',
  created_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('studentverse_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync profile to localStorage
  useEffect(() => {
    if (profile) {
      localStorage.setItem('studentverse_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('studentverse_profile');
    }
  }, [profile]);

  // Check initial session
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (supabase && isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            // Fetch profile from supabase or fallback
            const { data: dbProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (dbProfile) {
              setProfile(dbProfile as Profile);
            } else {
              // Default mapped profile from user metadata
              setProfile({
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Student',
                college: session.user.user_metadata?.college || 'National Engineering University',
                course: session.user.user_metadata?.course || 'B.Tech CSE',
                semester: session.user.user_metadata?.semester || 5,
                avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || defaultDemoProfile.avatar_url,
                bio: 'Passionate computer science scholar.',
              });
            }
          }
        }
      } catch (err) {
        console.warn('Supabase auth session restore check:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen to Supabase auth state changes if active
    if (supabase && isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const meta = session.user.user_metadata;
          setProfile((prev) => ({
            id: session.user.id,
            email: session.user.email || '',
            full_name: meta?.full_name || meta?.name || prev?.full_name || 'Student',
            college: meta?.college || prev?.college || 'Apex Institute of Technology',
            course: meta?.course || prev?.course || 'B.Tech CSE',
            semester: meta?.semester || prev?.semester || 5,
            avatar_url: meta?.avatar_url || meta?.picture || prev?.avatar_url || defaultDemoProfile.avatar_url,
            bio: prev?.bio || 'Aspiring engineer & passionate learner.',
          }));
        } else if (event === 'SIGNED_OUT') {
          // If signed out from Supabase
          if (!localStorage.getItem('studentverse_is_demo')) {
            setUser(null);
            setProfile(null);
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (supabase && isSupabaseConfigured) {
        const { data, error } = await signInWithEmail(email, password);
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          setUser(data.user);
          // profile will be set via auth listener
        }
        localStorage.removeItem('studentverse_is_demo');
        setIsLoading(false);
        return { success: true };
      }

      // Offline / Local fallback login
      const registeredUsers = JSON.parse(localStorage.getItem('studentverse_local_users') || '[]');
      const matched = registeredUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (matched) {
        if (matched.password === password) {
          setUser({ id: matched.id, email: matched.email });
          setProfile(matched.profile);
          localStorage.setItem('studentverse_is_demo', 'false');
          setIsLoading(false);
          return { success: true };
        } else {
          setIsLoading(false);
          return { success: false, error: 'Invalid password. Please check your credentials.' };
        }
      }

      // If email is demo email or user wants quick access
      if (email.toLowerCase().includes('demo') || email.toLowerCase() === defaultDemoProfile.email) {
        loginAsDemo();
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return {
        success: false,
        error: 'No account found with this email. Please create a new account or click "Explore with Demo Account".',
      };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Authentication failed' };
    }
  };

  const register = async (details: {
    full_name: string;
    email: string;
    password: string;
    college: string;
    course: string;
    semester: number;
  }) => {
    setIsLoading(true);
    try {
      if (supabase && isSupabaseConfigured) {
        const { data, error } = await signUpWithEmail(details.email, details.password, {
          full_name: details.full_name,
          college: details.college,
          course: details.course,
          semester: details.semester,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          setUser(data.user);
          const newProfile: Profile = {
            id: data.user.id,
            email: details.email,
            full_name: details.full_name,
            college: details.college,
            course: details.course,
            semester: details.semester,
            avatar_url: defaultDemoProfile.avatar_url,
            bio: 'Engineering student building the future.',
          };
          setProfile(newProfile);
        }
        localStorage.removeItem('studentverse_is_demo');
        setIsLoading(false);
        return { success: true };
      }

      // Offline / Local Account creation
      const localUsers = JSON.parse(localStorage.getItem('studentverse_local_users') || '[]');
      const newUserId = `user-${Date.now()}`;
      const newProfile: Profile = {
        id: newUserId,
        email: details.email,
        full_name: details.full_name,
        college: details.college,
        course: details.course,
        semester: details.semester,
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        bio: `${details.course} student at ${details.college}.`,
      };

      localUsers.push({
        id: newUserId,
        email: details.email,
        password: details.password,
        profile: newProfile,
      });

      localStorage.setItem('studentverse_local_users', JSON.stringify(localUsers));
      setUser({ id: newUserId, email: details.email });
      setProfile(newProfile);
      localStorage.setItem('studentverse_is_demo', 'false');

      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Registration failed' };
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    const res = await signInWithGoogle();
    if (res.error) {
      setIsLoading(false);
      return {
        success: false,
        error: res.error.message,
      };
    }
    return { success: true };
  };

  const loginWithGoogleDemo = () => {
    const googleDemoProfile: Profile = {
      id: 'google-user-901',
      email: 'aarav.sharma.student@gmail.com',
      full_name: 'Aarav Sharma',
      college: 'Apex Institute of Technology',
      course: 'B.Tech Computer Science & Engineering',
      semester: 5,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      bio: 'Authenticated via Google OAuth • B.Tech CSE Scholar',
      phone: '+91 98765 43210',
      created_at: new Date().toISOString(),
    };
    setUser({ id: googleDemoProfile.id, email: googleDemoProfile.email });
    setProfile(googleDemoProfile);
    localStorage.setItem('studentverse_is_demo', 'true');
    setIsLoading(false);
  };

  const loginAsDemo = () => {
    setUser({ id: defaultDemoProfile.id, email: defaultDemoProfile.email });
    setProfile(defaultDemoProfile);
    localStorage.setItem('studentverse_is_demo', 'true');
    setIsLoading(false);
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
    setProfile(null);
    localStorage.removeItem('studentverse_profile');
    localStorage.removeItem('studentverse_is_demo');
  };

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: Boolean(user || profile),
        isLoading,
        isConfigured: isSupabaseConfigured,
        login,
        register,
        loginWithGoogle,
        loginWithGoogleDemo,
        loginAsDemo,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

