import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getLocalProfile = (userId: string): UserProfile | null => {
    const saved = localStorage.getItem(`sims-profile-${userId}`);
    return saved ? JSON.parse(saved) : null;
  };

  const saveLocalProfile = (userId: string, data: UserProfile) => {
    localStorage.setItem(`sims-profile-${userId}`, JSON.stringify(data));
  };

  const fetchProfile = async (currentUser: User) => {
    const userId = currentUser.id;
    try {
      // 1. Try Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
          // If table doesn't exist or other error, fallback to metadata or localStorage
          const local = getLocalProfile(userId);
          if (local) {
              setProfile(local);
          } else {
              setProfile({
                id: userId,
                name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
                email: currentUser.email || '',
                role: 'Administrator'
              });
          }
      } else if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(getLocalProfile(userId) || {
        id: userId,
        name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
        email: currentUser.email || '',
        role: 'Administrator'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Include full_name in auth metadata so it's always available
    const response = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
            data: {
                full_name: name
            }
        }
    });
    
    if (response.data.user && !response.error) {
        const userId = response.data.user.id;
        const profileData = {
            id: userId,
            name: name,
            email: email,
            role: 'Administrator'
        };

        saveLocalProfile(userId, profileData);

        // Try Supabase (now that table exists, this should succeed)
        await supabase
            .from('profiles')
            .upsert(profileData);
    }
    
    return response;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return { error: { message: 'Not authenticated' } };
    
    const newProfile = { ...(profile || {}), ...data, id: user.id } as UserProfile;
    
    saveLocalProfile(user.id, newProfile);
    setProfile(newProfile);

    // Sync with Supabase Auth Metadata too
    if (data.name) {
        await supabase.auth.updateUser({
            data: { full_name: data.name }
        });
    }

    const { error } = await supabase
        .from('profiles')
        .upsert(newProfile);
    
    return { error }; 
  };

  return (
    <AuthContext.Provider value={{ 
        isAuthenticated: !!user, 
        user, 
        profile, 
        isLoading, 
        signIn, 
        signUp, 
        signOut, 
        updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
