import React, { useState, useEffect } from 'react';
import { Models } from 'appwrite';
import { Theme, AppSettings } from './types';
import { getCurrentUser, signOut } from './lib/auth';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) return JSON.parse(savedSettings);
    } catch (e) { console.error("Could not parse settings from localStorage", e)}
    return {
        google: { apiKey: '', clientId: '' },
        gemini: { apiKey: '' } // This is no longer set via UI, but we keep the structure
    }
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSettingsChange = (newSettings: { google: { apiKey: string; clientId: string; }}) => {
    setSettings(prev => {
        const updatedSettings = { ...prev, ...newSettings };
        localStorage.setItem('settings', JSON.stringify(updatedSettings));
        return updatedSettings;
    });
  };
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleLoginSuccess = (loggedInUser: Models.User<Models.Preferences>) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
  }

  if (loading) {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <>
      {user ? (
        <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            theme={theme} 
            onThemeChange={setTheme}
            settings={settings}
            onSettingsChange={handleSettingsChange}
        />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} onThemeChange={setTheme} currentTheme={theme} />
      )}
    </>
  );
};

export default App;
