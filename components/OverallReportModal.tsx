import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { GoogleGenAI } from '@google/genai';
import { Icon } from './Icons';

interface OverallReportModalProps {
    project: Project;
    onCancel: () => void;
}

const OverallReportModal: React.FC<OverallReportModalProps> = ({ project, onCancel }) => {
    const [report, setReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const projectDataSummary = useMemo(() => {
        const allTasks = project.periods.flatMap(p => p.tasks);
        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter(t => t.status === 'completed').length;
        const periodsSummary = project.periods.map(p => ({
            title: p.title,
            taskCount: p.tasks.length,
            tasks: p.tasks.map(t => ({ title: t.title, status: t.status }))
        }));

        return JSON.stringify({
            projectName: project.name,
            projectDescription: project.description,
            totalTasks,
            completedTasks,
            progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            periods: periodsSummary
        }, null, 2);
    }, [project]);

    const generateReport = async () => {
        setIsLoading(true);
        setError('');
        setReport('');

        if (!process.env.API_KEY) {
            setError('کلید API برای Gemini تنظیم نشده است. لطفاً آن را در متغیرهای محیطی قرار دهید.');
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Analyze the following project data and provide a concise, high-level status report in Persian. 
                Focus on overall progress, identify potential bottlenecks or risks (e.g., phases with many pending tasks), and suggest the next key focus area.
                The report should be easy to read for a project manager.
                
                Project Data:
                ${projectDataSummary}`,
            });

            setReport(response.text);

        } catch (e: any) {
            setError('خطا در تولید گزارش. لطفا از معتبر بودن کلید API خود اطمینان حاصل کنید.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-4">
            <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                دستیار هوشمند یک گزارش کلی از وضعیت فعلی پروژه، پیشرفت و ریسک‌های احتمالی تهیه می‌کند.
            </p>

            {!report && (
                <button
                    onClick={generateReport}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:bg-gray-400"
                >
                    {isLoading ? 'در حال آماده‌سازی گزارش...' : <><Icon name="auto_awesome" /> تولید گزارش</>}
                </button>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {report && (
                <div className="mt-4 p-4 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border max-h-80 overflow-y-auto">
                    <h3 className="font-bold mb-2">گزارش وضعیت پروژه:</h3>
                    <div className="whitespace-pre-wrap text-sm" dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br />') }} />
                </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
                 <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg">بستن</button>
            </div>
        </div>
    );
};

export default OverallReportModal;
