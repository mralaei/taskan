import React, { useState } from 'react';
import { Models } from 'appwrite';
import { createAccount, loginWithEmail, loginWithProvider } from '../lib/auth';
import AnimatedLogo from './AnimatedLogo';
import ParticleBackground from './ParticleBackground';
import { Icon } from './Icons';
import { Theme } from '../types';


const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.6 10.2244C19.6 9.53436 19.54 8.86436 19.42 8.22436H10V12.0244H15.44C15.22 13.2844 14.58 14.3644 13.62 15.0244V17.6244H17.2C18.84 16.0044 19.6 13.3844 19.6 10.2244Z" fill="#4285F4"/>
        <path d="M10 20.0001C12.76 20.0001 15.1 19.0601 16.74 17.6201L13.62 15.0201C12.72 15.6201 11.48 16.0001 10 16.0001C7.4 16.0001 5.16 14.2201 4.38 11.9001H0.64V14.5801C2.28 17.7801 5.88 20.0001 10 20.0001Z" fill="#34A853"/>
        <path d="M4.38 11.9001C4.18 11.3001 4.08 10.6601 4.08 10.0001C4.08 9.34006 4.18 8.70006 4.38 8.10006V5.42006H0.64C-0.220016 7.18006 0.0199843 9.68006 0.0199843 10.0001C0.0199843 10.3201 -0.220016 12.8201 0.64 14.5801L4.38 11.9001Z" fill="#FBBC05"/>
        <path d="M10 3.99994C11.32 3.99994 12.44 4.47994 13.28 5.27994L16.82 1.73994C15.1 0.199941 12.76 -0.0000591278 10 -0.0000591278C5.88 -0.0000591278 2.28 2.21994 0.64 5.41994L4.38 8.09994C5.16 5.77994 7.4 3.99994 10 3.99994Z" fill="#EA4335"/>
    </svg>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
);


interface LoginPageProps {
    onLoginSuccess: (user: Models.User<Models.Preferences>) => void;
    onThemeChange: (theme: Theme) => void;
    currentTheme: Theme;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onThemeChange, currentTheme }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isSignUp) {
                await createAccount(email, password, name);
                const user = await loginWithEmail(email, password);
                onLoginSuccess(user);
            } else {
                const user = await loginWithEmail(email, password);
                onLoginSuccess(user);
            }
        } catch (err: any) {
            setError(err.message || 'خطایی رخ داد. لطفا دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ParticleBackground />
            <div className="min-h-screen flex flex-col items-center justify-center bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text p-4 relative z-10">
                <button 
                  onClick={() => onThemeChange(currentTheme === 'light' ? 'dark' : 'light')} 
                  aria-label="تغییر پوسته" 
                  className="absolute top-4 right-4 p-2 rounded-full text-light-muted-text dark:text-dark-muted-text hover:bg-light-card dark:hover:bg-dark-card"
                >
                    <Icon name={currentTheme === 'light' ? 'dark_mode' : 'light_mode'} />
                </button>
                <main className="flex flex-col items-center text-center max-w-sm w-full bg-light-card/50 dark:bg-dark-card/50 backdrop-blur-lg p-8 rounded-2xl shadow-soft-lg border border-light-border/50 dark:border-dark-border/50">
                    <div className="mb-6">
                         <div dir="ltr">
                            <AnimatedLogo />
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                        {isSignUp ? 'ایجاد حساب کاربری' : 'ورود به تَــسک آن'}
                    </h2>
                    <p className="text-sm text-light-muted-text dark:text-dark-muted-text mb-6">
                        {isSignUp ? 'برای شروع، اطلاعات خود را وارد کنید.' : 'پروژه‌های خود را هوشمندانه مدیریت کنید.'}
                    </p>

                    <form onSubmit={handleSubmit} className="w-full space-y-4 mb-4">
                        {isSignUp && (
                            <input
                                type="text"
                                placeholder="نام و نام خانوادگی"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg/70 dark:bg-dark-bg/70 focus:ring-2 focus:ring-primary outline-none"
                            />
                        )}
                        <input
                            type="email"
                            placeholder="ایمیل سازمانی"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg/70 dark:bg-dark-bg/70 focus:ring-2 focus:ring-primary outline-none"
                        />
                        <input
                            type="password"
                            placeholder="رمز عبور"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-light-bg/70 dark:bg-dark-bg/70 focus:ring-2 focus:ring-primary outline-none"
                        />
                         {error && <p className="text-red-500 text-xs text-right">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:bg-gray-400 transition-colors"
                        >
                             {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (isSignUp ? 'ثبت نام' : 'ورود')}
                        </button>
                    </form>
                    
                    <div className="flex items-center w-full my-4">
                        <div className="flex-grow border-t border-light-border dark:border-dark-border"></div>
                        <span className="flex-shrink mx-4 text-xs text-light-muted-text dark:text-dark-muted-text">یا</span>
                        <div className="flex-grow border-t border-light-border dark:border-dark-border"></div>
                    </div>

                    <div className="w-full space-y-3">
                         <button
                            onClick={() => loginWithProvider('google')}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
                        >
                            <GoogleIcon />
                            <span className="font-semibold text-sm">ادامه با حساب گوگل</span>
                        </button>
                        <button
                            onClick={() => loginWithProvider('github')}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
                        >
                            <GitHubIcon className="text-light-text dark:text-dark-text"/>
                            <span className="font-semibold text-sm">ادامه با حساب گیت‌هاب</span>
                        </button>
                    </div>

                    <p className="text-sm text-light-muted-text dark:text-dark-muted-text mt-6">
                        {isSignUp ? 'حساب کاربری دارید؟' : 'هنوز ثبت نام نکرده‌اید؟'}
                        <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="font-semibold text-primary hover:underline mr-1">
                            {isSignUp ? 'وارد شوید' : 'ثبت نام کنید'}
                        </button>
                    </p>
                </main>
                <p className="absolute bottom-4 text-xs font-mono text-light-muted-text/50 dark:text-dark-muted-text/50">
                    v1.0.0 Beta
                </p>
            </div>
        </>
    );
};

export default LoginPage;