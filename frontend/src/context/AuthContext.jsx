import { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the context object
const AuthContext = createContext();

// 2. Provider — wraps your whole app and shares the auth state
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // On app load, restore user from localStorage if token exists
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', jwtToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        // 3. Provide these values to every child component
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Custom hook — makes using auth easy: const { user } = useAuth()
export const useAuth = () => useContext(AuthContext);