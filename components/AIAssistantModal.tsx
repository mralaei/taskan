
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Icon } from './Icons';

interface AIAssistantModalProps {
    onCancel: () => void;
    systemInstruction?: string;
}

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ onCancel, systemInstruction }) => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResponse('');

        if (!process.env.API_KEY) {
            setError('کلید API برای Gemini تنظیم نشده است. لطفاً آن را در متغیرهای محیطی قرار دهید.');
            setIsLoading(false);
            return;
        }

        try {
            // Fix: Initialize GoogleGenAI with named apiKey parameter.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Fix: Call generateContent with model name and contents.
            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                ...(systemInstruction && { config: { systemInstruction } })
            });

            // Fix: Access the response text directly from the .text property.
            setResponse(result.text);

        } catch (e: any) {
            setError('خطا در ارتباط با دستیار هوشمند.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-4">
            <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                از دستیار هوشمند برای ایده‌پردازی، نوشتن توضیحات یا هر سوال دیگری کمک بگیرید.
            </p>

            <form onSubmit={handleSubmit} className="space-y-2">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="پیام خود را اینجا بنویسید..."
                    className="w-full p-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg focus:ring-2 focus:ring-primary outline-none"
                    rows={3}
                    required
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:bg-gray-400 transition-colors"
                >
                    {isLoading ? 'در حال پردازش...' : <><Icon name="send" /> ارسال</>}
                </button>
            </form>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {response && (
                <div className="mt-4 p-4 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border max-h-60 overflow-y-auto">
                    <h3 className="font-bold mb-2">پاسخ دستیار:</h3>
                    <div className="whitespace-pre-wrap text-sm" dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }} />
                </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
                 <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg">بستن</button>
            </div>
        </div>
    );
};

export default AIAssistantModal;
