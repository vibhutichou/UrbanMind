// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const root = document.documentElement;
        const isDark = theme === 'dark';

        if (isDark) {
            document.documentElement.classList.add('dark'); // Enable Tailwind Dark Mode
            // Dark Mode Colors
            root.style.setProperty('--bg-primary', '#111827');    // Gray 900
            root.style.setProperty('--bg-secondary', '#1f2937');  // Gray 800
            root.style.setProperty('--text-primary', '#f9fafb');  // Gray 50
            root.style.setProperty('--text-secondary', '#d1d5db');// Gray 300
            root.style.setProperty('--border-light', '#374151');  // Gray 700

            document.body.style.backgroundColor = '#111827';
            document.body.style.color = '#f9fafb';
        } else {
            document.documentElement.classList.remove('dark'); // Disable Tailwind Dark Mode
            // Light Mode Colors
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f9fafb');
            root.style.setProperty('--text-primary', '#111827');
            root.style.setProperty('--text-secondary', '#6b7280');
            root.style.setProperty('--border-light', '#e5e7eb');

            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#111827';
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);