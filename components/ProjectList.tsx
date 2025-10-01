import React from 'react';
import { Project, User } from '../types';
import { Icon } from './Icons';
import { toPersianDigits } from '../utils/helpers';


interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const calculateProgress = (project: Project): number => {
    const allTasks = project.periods.flatMap(p => p.tasks);
    if (allTasks.length === 0) return 0;
    const completedTasks = allTasks.filter(t => t.status === 'completed').length;
    return Math.round((completedTasks / allTasks.length) * 100);
};

const getCollaborators = (project: Project): User[] => {
    const allAssignees = project.periods.flatMap(p => p.tasks).flatMap(t => t.assignees || []);
    // Fix: Use user.$id as the key for the map.
    return Array.from(new Map(allAssignees.map(user => [user.$id, user])).values());
};

const calculateDaysActive = (startDate: string | undefined): number => {
    if (!startDate) return 0;
    const diff = new Date().getTime() - new Date(startDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}


const ProjectCard: React.FC<{ project: Project; onSelectProject: (project: Project) => void; showToast: ProjectListProps['showToast'] }> = ({ project, onSelectProject, showToast }) => {
    const progress = calculateProgress(project);
    const collaborators = getCollaborators(project);
    // Fix: Appwrite uses $createdAt for the creation timestamp.
    const daysActive = calculateDaysActive(project.$createdAt);

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Fix: Appwrite documents use $id for the document ID.
        navigator.clipboard.writeText(`${window.location.origin}/project/${project.$id}`);
        showToast('لینک پروژه کپی شد!');
    };

    return (
        <div
            onClick={() => onSelectProject(project)}
            className="group bg-light-card dark:bg-dark-card p-6 rounded-2xl border border-light-border dark:border-dark-border cursor-pointer transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 hover:border-primary flex flex-col"
        >
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-light-text dark:text-dark-text">{project.name}</h2>
                <button onClick={handleShare} className="text-light-muted-text/70 dark:text-dark-muted-text/70 hover:text-primary dark:hover:text-primary transition-colors">
                    <Icon name="share" />
                </button>
            </div>
            <p className="text-light-muted-text dark:text-dark-muted-text mb-6 text-sm line-clamp-2 flex-grow">{project.description}</p>
            
            <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-light-muted-text dark:text-dark-muted-text">پیشرفت</span>
                    <span className="text-xs font-bold text-primary">{toPersianDigits(progress)}٪</span>
                </div>
                <div className="w-full bg-light-bg dark:bg-dark-bg rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="flex justify-between items-center text-sm pt-4 border-t border-light-border dark:border-dark-border">
                <div className="flex items-center">
                    <div className="flex -space-x-2">
                        {collaborators.slice(0, 3).map(user => (
                            // Fix: Use user.$id for the key and generate avatar from initials as avatar_url doesn't exist.
                            <img key={user.$id} src={`https://cloud.appwrite.io/v1/avatars/initials?name=${encodeURIComponent(user.name)}&project=${process.env.REACT_APP_APPWRITE_PROJECT_ID}`} alt={user.name} title={user.name} className="w-8 h-8 rounded-full ring-2 ring-light-card dark:ring-dark-card"/>
                        ))}
                    </div>
                    {collaborators.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-light-bg dark:bg-dark-bg flex items-center justify-center text-xs font-bold text-light-muted-text dark:text-dark-muted-text ring-2 ring-light-card dark:ring-dark-card z-10">
                            +{toPersianDigits(collaborators.length - 3)}
                        </div>
                    )}
                     {collaborators.length === 0 && (
                        <span className="text-xs text-light-muted-text dark:text-dark-muted-text ml-2">بدون همکار</span>
                    )}
                </div>
                <div className="text-xs text-light-muted-text dark:text-dark-muted-text font-medium">{toPersianDigits(daysActive)} روز فعالیت</div>
            </div>
            <div className="flex justify-between items-center text-sm font-medium text-primary mt-4">
                <span>مشاهده نقشه راه</span>
                <Icon name="chevron_right" className="text-xl transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </div>
        </div>
    );
};


const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject, showToast }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
            // Fix: Appwrite documents use $id for the document ID.
            <ProjectCard key={project.$id} project={project} onSelectProject={onSelectProject} showToast={showToast} />
        ))}
    </div>
  );
};

export default ProjectList;