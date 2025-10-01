
import React from 'react';
import { Icon } from './Icons';

interface ProjectActionsProps {
    isProjectView: boolean;
    onNewProject?: () => void;
    onEditProject?: () => void;
    onDeleteProject?: () => void;
    onManageMembers?: () => void;
    onGenerateReport?: () => void;
    onViewOverallStats?: () => void;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({
    isProjectView,
    onNewProject,
    onEditProject,
    onDeleteProject,
    onManageMembers,
    onGenerateReport,
    onViewOverallStats
}) => {
    return (
        <div className="mb-6 flex flex-wrap gap-2 justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
                    {isProjectView ? 'نمای کلی پروژه' : 'پروژه‌های من'}
                </h1>
            </div>
            <div className="flex items-center flex-wrap gap-2">
                {isProjectView ? (
                    <>
                        <button onClick={onEditProject} className="action-button">
                            <Icon name="edit" /> ویرایش
                        </button>
                        <button onClick={onManageMembers} className="action-button">
                            <Icon name="group" /> اعضا
                        </button>
                        <button onClick={onGenerateReport} className="action-button-primary">
                            <Icon name="auto_awesome" /> گزارش هوشمند
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={onViewOverallStats} className="action-button">
                             <Icon name="bar_chart" /> آمار کلی
                        </button>
                         <button onClick={onGenerateReport} className="action-button">
                            <Icon name="auto_awesome" /> گزارش کلی
                        </button>
                        <button onClick={onNewProject} className="action-button-primary">
                            <Icon name="add" /> پروژه جدید
                        </button>
                    </>
                )}
            </div>
            <style>{`
                .action-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    border-radius: 0.5rem;
                    background-color: var(--color-card-light);
                    border: 1px solid var(--color-border-light);
                    transition: background-color 0.2s;
                }
                .dark .action-button {
                    background-color: var(--color-card-dark);
                    border-color: var(--color-border-dark);
                }
                .action-button:hover {
                    background-color: var(--color-bg-light);
                }
                .dark .action-button:hover {
                    background-color: var(--color-bg-dark);
                }

                .action-button-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    border-radius: 0.5rem;
                    background-color: var(--primary);
                    color: white;
                    transition: background-color 0.2s;
                }
                .action-button-primary:hover {
                    background-color: var(--primary-hover);
                }
            `}</style>
        </div>
    );
};

export default ProjectActions;
