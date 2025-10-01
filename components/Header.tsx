import React, { useState, useRef, useEffect } from 'react';
import { Models } from 'appwrite';
import { Theme } from '../types';
import { Icon } from './Icons';

interface HeaderProps {
    user: Models.User<Models.Preferences>;
    onLogout: () => void;
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
    onSettingsClick: () => void;
    onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, theme, onThemeChange, onSettingsClick, onBack }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userAvatarUrl = `https://cloud.appwrite.io/v1/avatars/initials?name=${encodeURIComponent(user.name)}&project=${process.env.REACT_APP_APPWRITE_PROJECT_ID}`;

    return (
        <header className="bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border p-4 flex justify-between items-center sticky top-0 z-40">
            <div className="flex items-center gap-4">
                {onBack && (
                    <button onClick={onBack} aria-label="بازگشت به داشبورد" className="p-2 rounded-full text-light-muted-text dark:text-dark-muted-text hover:bg-light-bg dark:hover:bg-dark-bg hover:text-light-text dark:hover:text-dark-text">
                        <Icon name="arrow_forward" />
                    </button>
                )}
                <div className="flex items-baseline gap-2">
                    <h1 className="text-xl font-bold text-primary">تَــسک آن</h1>
                </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                <button onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')} aria-label="تغییر پوسته" className="p-2 rounded-full text-light-muted-text dark:text-dark-muted-text hover:bg-light-bg dark:hover:bg-dark-bg hover:text-light-text dark:hover:text-dark-text">
                    <Icon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
                </button>
                <button onClick={onSettingsClick} aria-label="باز کردن تنظیمات" className="p-2 rounded-full text-light-muted-text dark:text-dark-muted-text hover:bg-light-bg dark:hover:bg-dark-bg hover:text-light-text dark:hover:text-dark-text">
                    <Icon name="settings" />
                </button>
                
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2">
                        <img src={userAvatarUrl} alt={user.name} className="w-9 h-9 rounded-full" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-light-card dark:bg-dark-card rounded-lg shadow-soft-lg border border-light-border dark:border-dark-border py-2 animate-scale-in">
                            <div className="px-4 py-2 border-b border-light-border dark:border-dark-border">
                                <p className="font-semibold text-sm">{user.name}</p>
                            </div>
                            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-light-bg dark:hover:bg-dark-bg">
                                خروج
                            </a>
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                @keyframes scale-in {
                  from {
                    opacity: 0;
                    transform: scale(0.95);
                  }
                  to {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
                .animate-scale-in {
                  transform-origin: top left;
                  animation: scale-in 0.1s ease-out forwards;
                }
            `}</style>
        </header>
    );
};

export default Header;
