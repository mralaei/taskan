import React, { useState, useEffect } from 'react';
import { Project } from '../types';

interface EditProjectModalProps {
    project: Project | null;
    onSave: (projectData: { name: string, description: string }, projectId?: string) => void;
    onClose: () => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onSave, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (project) {
            setName(project.name);
            setDescription(project.description);
        } else {
            setName('');
            setDescription('');
        }
    }, [project]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return; // Basic validation
        // Fix: Appwrite documents use $id for the document ID.
        onSave({ name, description }, project?.$id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="projectName" className="block text-sm font-medium mb-1">نام پروژه</label>
                <input
                    id="projectName"
                    type="text"
                    placeholder="مثال: بازطراحی وبسایت"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg focus:ring-2 focus:ring-primary outline-none"
                    required
                />
            </div>
            <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium mb-1">توضیحات</label>
                <textarea
                    id="projectDescription"
                    placeholder="یک توضیح کوتاه در مورد اهداف این پروژه بنویسید."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg focus:ring-2 focus:ring-primary outline-none"
                    rows={4}
                />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg">لغو</button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                >
                    {project ? 'ذخیره تغییرات' : 'ایجاد پروژه'}
                </button>
            </div>
        </form>
    );
};

export default EditProjectModal;