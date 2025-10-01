
import React, { useState } from 'react';
import { Icon } from './Icons';

interface SettingsModalProps {
    settings: {
        google: { apiKey: string; clientId: string; };
    };
    onSettingsChange: (settings: { google: { apiKey: string; clientId: string; } }) => void;
    isGoogleConnected: boolean;
    onGoogleConnect: () => void;
    onGoogleDisconnect: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    settings,
    onSettingsChange,
    isGoogleConnected,
    onGoogleConnect,
    onGoogleDisconnect
}) => {
    const [localSettings, setLocalSettings] = useState(settings);

    const handleSaveSettings = () => {
        onSettingsChange(localSettings);
    };

    return (
        <div className="space-y-6">
            <div>
                 <h3 className="text-lg font-bold mb-2">دستیار هوشمند Gemini</h3>
                 {/* Fix: Removed Gemini API Key input field and replaced with an informational message to comply with guidelines. */}
                 <p className="text-sm text-light-muted-text dark:text-dark-muted-text mb-4">
                    قابلیت‌های هوش مصنوعی توسط Gemini ارائه می‌شود. کلید API مربوطه باید از طریق متغیرهای محیطی (environment variables) سرور با نام `API_KEY` تنظیم شود.
                </p>
            </div>

            <div className="border-t border-light-border dark:border-dark-border pt-4">
                <h3 className="text-lg font-bold mb-2">اتصال به گوگل درایو</h3>
                <p className="text-sm text-light-muted-text dark:text-dark-muted-text mb-4">
                    با اتصال به حساب گوگل خود می‌توانید فایل‌هایتان را مستقیما به وظایف پیوست کنید.
                </p>
                {!isGoogleConnected ? (
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Google API Key"
                            value={localSettings.google.apiKey}
                            onChange={e => setLocalSettings(prev => ({...prev, google: { ...prev.google, apiKey: e.target.value}}))}
                            className="w-full p-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg focus:ring-2 focus:ring-primary outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Google Client ID"
                            value={localSettings.google.clientId}
                            onChange={e => setLocalSettings(prev => ({...prev, google: { ...prev.google, clientId: e.target.value}}))}
                            className="w-full p-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg focus:ring-2 focus:ring-primary outline-none"
                        />
                        <button 
                            onClick={onGoogleConnect}
                            disabled={!localSettings.google.apiKey || !localSettings.google.clientId}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                            <Icon name="link" />
                            اتصال به گوگل
                        </button>
                    </div>
                ) : (
                     <button onClick={onGoogleDisconnect} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        <Icon name="link_off" />
                        قطع اتصال از گوگل
                    </button>
                )}
            </div>
            <div className="flex justify-end pt-4 border-t border-light-border dark:border-dark-border">
                <button onClick={handleSaveSettings} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">ذخیره تنظیمات</button>
            </div>
        </div>
    );
};

export default SettingsModal;
