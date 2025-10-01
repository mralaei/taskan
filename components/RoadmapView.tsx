import React from 'react';
import { Period, Project, Task, TaskStatus } from '../types';
import { Icon } from './Icons';
import { toPersianDigits } from '../utils/helpers';

interface TaskCardProps {
  task: Task;
  onSelectTask: (task: Task) => void;
}

const statusStyles: { [key in TaskStatus]: { border: string; bg: string } } = {
  pending: { border: 'border-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' },
  'in-progress': { border: 'border-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/50' },
  completed: { border: 'border-green-500', bg: 'bg-green-100 dark:bg-green-900/50' },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onSelectTask }) => {
  return (
    <div
      onClick={() => onSelectTask(task)}
      className={`bg-light-card dark:bg-dark-card p-4 rounded-lg border-l-4 ${statusStyles[task.status].border} ${statusStyles[task.status].bg} shadow-soft-sm hover:shadow-soft-md cursor-pointer mb-3 transition-shadow`}
    >
      <h4 className="font-bold text-light-text dark:text-dark-text">{task.title}</h4>
      <div className="flex justify-between items-center mt-3 text-sm">
        <div className="flex items-center gap-2 text-light-muted-text dark:text-dark-muted-text">
          {task.due_date && (
            <div className="flex items-center gap-1">
              <Icon name="event" className="text-base" />
              <span className="text-xs">{new Date(task.due_date).toLocaleDateString('fa-IR')}</span>
            </div>
          )}
          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <Icon name="attachment" className="text-base" />
              <span className="text-xs">{toPersianDigits(task.attachments.length)}</span>
            </div>
          )}
        </div>
        <div className="flex -space-x-2">
          {task.assignees?.map(user => (
            // Fix: Use user.$id for the key and generate avatar from initials as avatar_url doesn't exist.
            <img key={user.$id} src={`https://cloud.appwrite.io/v1/avatars/initials?name=${encodeURIComponent(user.name)}&project=${process.env.REACT_APP_APPWRITE_PROJECT_ID}`} alt={user.name} title={user.name} className="w-6 h-6 rounded-full ring-2 ring-light-card dark:ring-dark-card" />
          ))}
        </div>
      </div>
    </div>
  );
};

interface PeriodColumnProps {
  period: Period;
  onSelectTask: (task: Task) => void;
  onAddNewTask: (periodId: string) => void;
}

const PeriodColumn: React.FC<PeriodColumnProps> = ({ period, onSelectTask, onAddNewTask }) => {
  return (
    <div className="w-80 flex-shrink-0 bg-light-bg/70 dark:bg-dark-bg/70 rounded-xl p-1 flex flex-col h-full">
      <div className="flex justify-between items-center p-3 mb-2 flex-shrink-0">
        <h3 className="font-bold text-light-text dark:text-dark-text">{period.title}</h3>
        <span className="text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded-md">{toPersianDigits(period.tasks.length)}</span>
      </div>
      <div className="flex-grow p-2 rounded-lg overflow-y-auto">
        {period.tasks.sort((a, b) => a.position - b.position).map((task) => (
          // Fix: Appwrite documents use $id for the document ID.
          <TaskCard key={task.$id} task={task} onSelectTask={onSelectTask} />
        ))}
      </div>
       <button 
        // Fix: Appwrite documents use $id for the document ID.
        onClick={() => onAddNewTask(period.$id)}
        className="w-full text-left p-2 m-1 rounded-lg hover:bg-light-border dark:hover:bg-dark-border text-light-muted-text dark:text-dark-muted-text transition-colors flex items-center gap-2 flex-shrink-0">
         <Icon name="add" />
        <span>افزودن وظیفه جدید</span>
       </button>
    </div>
  );
};


interface RoadmapViewProps {
  project: Project;
  onSelectTask: (task: Task) => void;
  onAddNewTask: (periodId: string) => void;
  onAddNewPeriod: () => void;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ project, onSelectTask, onAddNewTask, onAddNewPeriod }) => {
  return (
    <div className="h-full overflow-x-auto flex flex-col">
      <div className="flex-grow flex items-start gap-4 p-4 sm:p-8">
        {project.periods.sort((a,b) => a.position - b.position).map(period => (
          // Fix: Appwrite documents use $id for the document ID.
          <PeriodColumn key={period.$id} period={period} onSelectTask={onSelectTask} onAddNewTask={onAddNewTask} />
        ))}
        <div className="w-80 flex-shrink-0">
            <button onClick={onAddNewPeriod} className="w-full p-4 rounded-xl bg-light-bg/50 dark:bg-dark-bg/50 hover:bg-light-border dark:hover:bg-dark-border transition-colors text-light-text dark:text-dark-text flex items-center justify-center gap-2">
                <Icon name="add_circle" />
                <span>افزودن بازه زمانی جدید</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;