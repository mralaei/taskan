import React from 'react';

const GitHubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
);


const Footer: React.FC = () => {
    return (
        <footer className="w-full p-4 bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border mt-auto flex-shrink-0">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-2 text-sm text-light-muted-text dark:text-dark-muted-text">
                <div className="flex items-center gap-2 flex-wrap justify-center">
                     <a href="https://github.com/ramont-studio/taskan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                        <GitHubIcon />
                        <span>مشاهده پروژه در گیت‌هاب</span>
                    </a>
                    <span className="hidden sm:inline text-light-border dark:text-dark-border">|</span>
                    <span className="font-mono">1.0.0 Beta</span>
                </div>
                <span className="text-center">
                    طراحی شده توسط <a href="https://ramont.net" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">رامونت</a>
                </span>
            </div>
        </footer>
    );
};

export default Footer;