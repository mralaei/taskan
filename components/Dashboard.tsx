import React, { useState, useEffect, useCallback } from 'react';
import { Models } from 'appwrite';
import { Project, Task, AppSettings, Theme, Period } from '../types';
import * as api from '../lib/appwrite';
import Header from './Header';
import ProjectList from './ProjectList';
import RoadmapView from './RoadmapView';
import TimelineView from './TimelineView';
import StatisticsView from './StatisticsView';
import TaskDetailModal from './TaskDetailModal';
import EditProjectModal from './EditProjectModal';
import Modal from './Modal';
import SettingsModal from './SettingsModal';
import { initGoogleClient, requestGoogleToken, revokeGoogleToken } from '../lib/googleDrive';
import ProjectActions from './ProjectActions';
import OverallReportModal from './OverallReportModal';
import AllProjectsReportModal from './AllProjectsReportModal';
import ManageMembersModal from './ManageMembersModal';

type View = 'roadmap' | 'timeline' | 'stats';

const Dashboard: React.FC<{ user: Models.User<Models.Preferences>; onLogout: () => void; theme: Theme; onThemeChange: (theme: Theme) => void; settings: AppSettings; onSettingsChange: (s: any) => void; }> = ({ user, onLogout, theme, onThemeChange, settings, onSettingsChange }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [activeView, setActiveView] = useState<View>('roadmap');
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isOverallReportModalOpen, setIsOverallReportModalOpen] = useState(false);
    const [isAllProjectsReportModalOpen, setIsAllProjectsReportModalOpen] = useState(false);
    const [isManageMembersModalOpen, setIsManageMembersModalOpen] = useState(false);
    const [isGoogleConnected, setIsGoogleConnected] = useState(false);
    const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        try {
            const userProjects = await api.getProjectsForUser(user.$id);
            setProjects(userProjects);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            displayToast('خطا در بارگذاری پروژه‌ها', 'error');
        } finally {
            setLoading(false);
        }
    }, [user.$id]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const displayToast = (message: string, type: 'success' | 'error' = 'success') => {
        setShowToast({ message, type });
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleSelectProject = async (project: Project) => {
        try {
             const { project: detailedProject } = await api.getProjectDetails(project.$id);
             setSelectedProject(detailedProject);
             setActiveView('roadmap');
        } catch (error) {
            console.error("Failed to fetch project details", error);
            displayToast('خطا در بارگذاری جزئیات پروژه', 'error');
        }
    };
    
    const handleSaveProject = async (projectData: { name: string, description: string }, projectId?: string) => {
        try {
            if (projectId) {
                const updatedProject = await api.updateProject(projectId, projectData);
                setProjects(projects.map(p => p.$id === projectId ? { ...p, ...updatedProject } : p));
                if (selectedProject?.$id === projectId) {
                    setSelectedProject(prev => prev ? { ...prev, ...updatedProject } : null);
                }
                displayToast('پروژه با موفقیت به‌روزرسانی شد.');
            } else {
                const newProject = await api.createProject(projectData, user.$id);
                setProjects([...projects, newProject]);
                displayToast('پروژه جدید با موفقیت ایجاد شد.');
            }
        } catch (error) {
             displayToast('خطا در ذخیره پروژه', 'error');
        } finally {
            setIsEditProjectModalOpen(false);
        }
    };

    // Placeholder for handleSaveTask - needs Appwrite implementation
    const handleSaveTask = (updatedTask: Task) => {
        console.log("Saving task:", updatedTask);
        displayToast('قابلیت ذخیره وظیفه در حال پیاده‌سازی است.');
        setSelectedTask(null);
    };

    // Placeholder for handleDeleteTask
    const handleDeleteTask = (taskId: string) => {
        console.log("Deleting task:", taskId);
        displayToast('قابلیت حذف وظیفه در حال پیاده‌سازی است.', 'error');
        setSelectedTask(null);
    };

    if (loading) {
        return <div className="h-screen w-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div></div>;
    }

    const CurrentView = () => {
        if (!selectedProject) return null;
        switch (activeView) {
            case 'roadmap':
                return <RoadmapView project={selectedProject} onSelectTask={setSelectedTask} onAddNewTask={() => {}} onAddNewPeriod={() => {}} />;
            case 'timeline':
                return <TimelineView project={selectedProject} />;
            case 'stats':
                return <StatisticsView project={selectedProject} />;
            default:
                return null;
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-light-bg dark:bg-dark-bg transition-colors duration-300">
            <Header
                user={user}
                onLogout={onLogout}
                theme={theme}
                onThemeChange={onThemeChange}
                onSettingsClick={() => setIsSettingsModalOpen(true)}
                onBack={selectedProject ? () => setSelectedProject(null) : undefined}
            />
            <main className="flex-grow overflow-hidden">
                {!selectedProject ? (
                    <div className="p-4 sm:p-8 h-full overflow-y-auto">
                        <ProjectActions
                            isProjectView={false}
                            onNewProject={() => { setProjectToEdit(null); setIsEditProjectModalOpen(true); }}
                            onGenerateReport={() => setIsAllProjectsReportModalOpen(true)}
                            onViewOverallStats={() => { /* Implement navigation or modal for overall stats */ }}
                        />
                        <ProjectList projects={projects} onSelectProject={handleSelectProject} showToast={displayToast} />
                    </div>
                ) : (
                    <div className="h-full flex flex-col">
                        <div className="p-4 sm:p-8 sm:pb-4 pb-2 border-b border-light-border dark:border-dark-border">
                             <ProjectActions
                                isProjectView={true}
                                onEditProject={() => { setProjectToEdit(selectedProject); setIsEditProjectModalOpen(true); }}
                                onManageMembers={() => setIsManageMembersModalOpen(true)}
                                onGenerateReport={() => setIsOverallReportModalOpen(true)}
                            />
                            <div className="flex gap-4">
                                <button onClick={() => setActiveView('roadmap')} className={`pb-2 ${activeView === 'roadmap' ? 'border-b-2 border-primary text-primary font-bold' : ''}`}>نقشه راه</button>
                                <button onClick={() => setActiveView('timeline')} className={`pb-2 ${activeView === 'timeline' ? 'border-b-2 border-primary text-primary font-bold' : ''}`}>خط زمانی</button>
                                <button onClick={() => setActiveView('stats')} className={`pb-2 ${activeView === 'stats' ? 'border-b-2 border-primary text-primary font-bold' : ''}`}>آمار</button>
                            </div>
                        </div>
                       <CurrentView />
                    </div>
                )}
            </main>

            {/* Modals */}
            {selectedTask && selectedProject && (
                <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="جزئیات وظیفه">
                    <TaskDetailModal 
                        task={selectedTask}
                        users={[]} // TODO: Pass actual project users
                        onClose={() => setSelectedTask(null)}
                        onSave={handleSaveTask}
                        onDelete={handleDeleteTask}
                        isGoogleConnected={isGoogleConnected}
                        onGooglePicker={() => {}}
                    />
                </Modal>
            )}

            <Modal isOpen={isEditProjectModalOpen} onClose={() => setIsEditProjectModalOpen(false)} title={projectToEdit ? 'ویرایش پروژه' : 'ایجاد پروژه جدید'}>
                <EditProjectModal project={projectToEdit} onSave={handleSaveProject} onClose={() => setIsEditProjectModalOpen(false)} />
            </Modal>
            
            <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="تنظیمات">
                <SettingsModal settings={settings} onSettingsChange={onSettingsChange} isGoogleConnected={isGoogleConnected} onGoogleConnect={() => {}} onGoogleDisconnect={() => {}}/>
            </Modal>
            
            {selectedProject && (
                <Modal isOpen={isOverallReportModalOpen} onClose={() => setIsOverallReportModalOpen(false)} title={`گزارش هوشمند: ${selectedProject.name}`}>
                    <OverallReportModal project={selectedProject} onCancel={() => setIsOverallReportModalOpen(false)} />
                </Modal>
            )}

            <Modal isOpen={isAllProjectsReportModalOpen} onClose={() => setIsAllProjectsReportModalOpen(false)} title="گزارش کلی پروژه‌ها">
                <AllProjectsReportModal projects={projects} onCancel={() => setIsAllProjectsReportModalOpen(false)} />
            </Modal>
            
            {selectedProject && (
                <Modal isOpen={isManageMembersModalOpen} onClose={() => setIsManageMembersModalOpen(false)} title="مدیریت اعضا">
                    <ManageMembersModal members={[]} onAddMember={() => {}} onRemoveMember={() => {}} />
                </Modal>
            )}

        </div>
    );
};

export default Dashboard;
