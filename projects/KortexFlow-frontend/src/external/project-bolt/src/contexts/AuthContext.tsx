import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextValue {
    user: any | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    connectGmail: () => Promise<void>;
    connectCalendar: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function ExternalAuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        // try to read a demo user from localStorage for convenience
        const saved = localStorage.getItem('external_demo_user');
        if (saved) setUser(JSON.parse(saved));
    }, []);

    const signIn = async (email: string, password: string) => {
        // lightweight mock: create or fetch a demo user row in supabase if available
        setUser({ id: 'demo-user', email });
        localStorage.setItem('external_demo_user', JSON.stringify({ id: 'demo-user', email }));
    };

    const signUp = async (email: string, password: string) => {
        await signIn(email, password);
    };

    const signOut = async () => {
        setUser(null);
        localStorage.removeItem('external_demo_user');
    };

    const connectGmail = async () => {
        alert('Demo: connect Gmail (not implemented)');
    };

    const connectCalendar = async () => {
        alert('Demo: connect Calendar (not implemented)');
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signUp, signOut, connectGmail, connectCalendar }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within ExternalAuthProvider');
    return ctx;
}
