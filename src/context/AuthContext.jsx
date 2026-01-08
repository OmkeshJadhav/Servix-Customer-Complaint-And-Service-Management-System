import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted session
        const storedUser = localStorage.getItem('ccsms_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const signup = async (userData) => {
        try {
            const response = await api.signup(userData);
            setUser(response.user);
            localStorage.setItem('ccsms_user', JSON.stringify(response.user));
            return response.user;
        } catch (error) {
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.login(email, password);
            setUser(response.user);
            localStorage.setItem('ccsms_user', JSON.stringify(response.user));
            return response.user;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ccsms_user');
    };

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, loading, isAuthenticated: !!user }}>
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
