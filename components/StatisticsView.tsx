import React, { useMemo } from 'react';
import { Project, TaskStatus, User } from '../types';
import { Icon } from './Icons';
import { toPersianDigits } from '../utils/helpers';

const statusDisplay: { [key in TaskStatus]: { name: string; color: string; icon: string } } = {
  pending: { name: 'در انتظار', color: 'bg-gray-400', icon: 'pending' },
  'in-progress': { name: 'در حال انجام', color: 'bg-blue-500', icon: 'autorenew' },
  completed: { name: 'تکمیل شده', color: 'bg-green-500', icon: 'task_alt' },
};

const StatCard: React.FC<{ icon: string; title: string; value: string | number; colorClass: string }> = ({ icon, title, value, colorClass }) => {
    return (
        <div className="bg-light-card dark:bg-dark-card p-6 rounded-2xl border border-light-border dark:border-dark-border flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${colorClass}`}>
                <Icon name={icon} className="text-2xl" />
            </div>
            <div>
                <p className="text-light-muted-text dark:text-dark-muted-text text-sm">{title}</p>
                <p className="text-2xl font-bold">{toPersianDigits(value)}</p>
            </div>
        </div>
    );
};

interface StatisticsViewProps {
    project?: Project;
    projects?: Project[];
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ project, projects }) => {
    const isOverallView = !project && !!projects;

    const stats = useMemo(() => {
        const sourceProjects = project ? [project] : projects || [];
        const allTasks = sourceProjects.flatMap(p => p.periods.flatMap(p => p.tasks));

        const tasksByStatus = allTasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {} as { [key in TaskStatus]?: number });

        // Fix: Use user.$id for IDs and in comparisons.
        const assignees = Array.from(new Set(allTasks.flatMap(t => t.assignees || []).map(a => a.$id)))
            .map(id => allTasks.flatMap(t => t.assignees || []).find(a => a.$id === id)!)
            .filter((u): u is User => !!u);

        const tasksPerAssignee = assignees.map(assignee => ({
            ...assignee,
            // Fix: Use user.$id for IDs and in comparisons.
            taskCount: allTasks.filter(t => t.assignees?.some(a => a.$id === assignee.$id)).length
        })).sort((a,b) => b.taskCount - a.taskCount);

        const overdueTasks = allTasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed').length;
        
        const completionRate = allTasks.length > 0 ? Math.round(((tasksByStatus.completed || 0) / allTasks.length) * 100) : 0;

        return {
            totalTasks: allTasks.length,
            totalProjects: sourceProjects.length,
            completionRate,
            tasksByStatus,
            tasksPerAssignee,
            overdueTasks
        };
    }, [project, projects]);

    return (
        <div className="p-4 sm:p-8 h-full overflow-y-auto">
            {!isOverallView && (
                 <header className="mb-8">
                    <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">{project?.name} - آمار و گزارشات</h1>
                </header>
            )}
           
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isOverallView ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6 mb-8`}>
                {isOverallView && <StatCard icon="folder" title="کل پروژه‌ها" value={stats.totalProjects} colorClass="bg-purple-500" />}
                <StatCard icon="list_alt" title="کل وظایف" value={stats.totalTasks} colorClass="bg-primary" />
                <StatCard icon="pending" title="در انتظار" value={stats.tasksByStatus.pending || 0} colorClass="bg-gray-400" />
                <StatCard icon="autorenew" title="در حال انجام" value={stats.tasksByStatus['in-progress'] || 0} colorClass="bg-blue-500" />
                <StatCard icon="task_alt" title="تکمیل شده" value={stats.tasksByStatus.completed || 0} colorClass="bg-green-500" />
                {isOverallView && <StatCard icon="percent" title="نرخ تکمیل" value={`${toPersianDigits(stats.completionRate)}٪`} colorClass="bg-teal-500" />}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tasks by Status Chart */}
                <div className="bg-light-card dark:bg-dark-card p-6 rounded-2xl border border-light-border dark:border-dark-border">
                    <h2 className="text-xl font-bold mb-4">وظایف بر اساس وضعیت</h2>
                    <div className="space-y-3">
                        {Object.entries(statusDisplay).map(([status, display]) => {
                            const count = stats.tasksByStatus[status as TaskStatus] || 0;
                            const percentage = stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0;
                            return (
                                <div key={status}>
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <span>{display.name}</span>
                                        <span>{toPersianDigits(count)}</span>
                                    </div>
                                    <div className="w-full bg-light-bg dark:bg-dark-bg rounded-full h-3">
                                        <div className={`${display.color} h-3 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tasks per Assignee */}
                <div className="bg-light-card dark:bg-dark-card p-6 rounded-2xl border border-light-border dark:border-dark-border">
                    <h2 className="text-xl font-bold mb-4">بار کاری اعضا</h2>
                    <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                        {stats.tasksPerAssignee.map(user => (
                             // Fix: Appwrite documents use $id for the document ID.
                             <div key={user.$id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* Fix: Appwrite User model doesn't have avatar_url. Generate avatar from initials. */}
                                    <img src={`https://cloud.appwrite.io/v1/avatars/initials?name=${encodeURIComponent(user.name)}&project=${process.env.REACT_APP_APPWRITE_PROJECT_ID}`} alt={user.name} className="w-10 h-10 rounded-full" />
                                    <span>{user.name}</span>
                                </div>
                                <span className="font-bold">{toPersianDigits(user.taskCount)} وظیفه</span>
                            </div>
                        ))}
                         {stats.tasksPerAssignee.length === 0 && <p className="text-light-muted-text dark:text-dark-muted-text">هیچ کاربری به وظایف اختصاص داده نشده است.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsView;