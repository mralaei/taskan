

import React, { useState, useEffect } from 'react';
import { Task, User, TaskStatus, Attachment } from '../types';
import { Icon } from './Icons';
import { toPersianDigits } from '../utils/helpers';

interface TaskDetailModalProps {
    task: Task;
    users: User[]; // All users in the project to select from
    onClose: () => void;
    onSave: (updatedTask: Task) => void;
    onDelete: (taskId: string) => void;
    isGoogleConnected: boolean;
    onGooglePicker: () => void;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'pending', label: 'در انتظار' },
    { value: 'in-progress', label: 'در حال انجام' },
    { value: 'completed', label: 'تکمیل شده' },
];

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, users, onClose, onSave, onDelete, isGoogleConnected, onGooglePicker }) => {
    const [editableTask, setEditableTask] = useState<Task>(task);

    useEffect(() => {
        setEditableTask(task);
    }, [task]);

    const handleFieldChange = (field: keyof Task, value: any) => {
        setEditableTask(prev => ({ ...prev, [field]: value }));
    };

    const handleAssigneeToggle = (user: User) => {
        const currentAssignees = editableTask.assignees || [];
        // Fix: Appwrite documents use $id for the document ID.
        const isAssigned = currentAssignees.some(a => a.$id === user.$id);
        const newAssignees = isAssigned
            // Fix: Appwrite documents use $id for the document ID.
            ? currentAssignees.filter(a => a.$id !== user.$id)
            : [...currentAssignees, user];
        handleFieldChange('assignees', newAssignees);
    };

    const handleSave = () => {
        onSave(editableTask);
    };

    return (
        <div className="flex flex-col gap-6">
            <input
                type="text"
                value={editableTask.title}
                onChange={e => handleFieldChange('title', e.target.value)}
                className="text-xl font-bold bg-transparent focus:outline-none focus:border-b border-light-border dark:border-dark-border w-full py-1"
                placeholder="عنوان وظیفه"
            />
            
            <textarea
                value={editableTask.description}
                onChange={e => handleFieldChange('description', e.target.value)}
                className="w-full p-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg focus:ring-2 focus:ring-primary outline-none"
                rows={4}
                placeholder="توضیحات وظیفه..."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">وضعیت</label>
                    <select
                        value={editableTask.status}
                        onChange={e => handleFieldChange('status', e.target.value as TaskStatus)}
                        className="w-full p-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg focus:ring-2 focus:ring-primary outline-none"
                    >
                        {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">تاریخ سررسید</label>
                    <input
                        type="date"
                        value={editableTask.due_date ? new Date(editableTask.due_date).toISOString().split('T')[0] : ''}
                        onChange={e => handleFieldChange('due_date', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                        className="w-full p-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
            </div>

            {/* Other sections like assignees, attachments would go here */}

            <div className="flex justify-between items-center pt-4 border-t border-light-border dark:border-dark-border">
                {/* Fix: Appwrite documents use $id for the document ID. */}
                <button onClick={() => onDelete(task.$id)} className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1">
                    <Icon name="delete" />
                    حذف وظیفه
                </button>
                <div className="flex gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg">لغو</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">ذخیره</button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;