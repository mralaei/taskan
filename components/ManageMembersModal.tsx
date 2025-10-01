

import React, { useState } from 'react';
import { User } from '../types';
import { Icon } from './Icons';

interface ManageMembersModalProps {
    members: User[];
    onAddMember: (email: string) => void;
    onRemoveMember: (userId: string) => void;
}

const ManageMembersModal: React.FC<ManageMembersModalProps> = ({ members, onAddMember, onRemoveMember }) => {
    const [email, setEmail] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            onAddMember(email);
            setEmail('');
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="email"
                    placeholder="ایمیل عضو جدید را وارد کنید"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow p-2 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg focus:ring-2 focus:ring-primary outline-none"
                    required
                />
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
                    افزودن
                </button>
            </form>
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {members.length > 0 ? members.map(member => (
                    // Fix: Appwrite documents use $id for the document ID.
                    <div key={member.$id} className="flex items-center justify-between p-2 bg-light-bg dark:bg-dark-bg rounded-lg">
                        <div className="flex items-center gap-3">
                            {/* Fix: Appwrite User model doesn't have avatar_url. Generate avatar from initials. */}
                            <img src={`https://cloud.appwrite.io/v1/avatars/initials?name=${encodeURIComponent(member.name)}&project=${process.env.REACT_APP_APPWRITE_PROJECT_ID}`} alt={member.name} className="w-8 h-8 rounded-full" />
                            <div>
                                <p className="font-semibold">{member.name}</p>
                                <p className="text-xs text-light-muted-text dark:text-dark-muted-text">{member.email}</p>
                            </div>
                        </div>
                        {/* Fix: Appwrite documents use $id for the document ID. */}
                        <button onClick={() => onRemoveMember(member.$id)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                            <Icon name="delete" />
                        </button>
                    </div>
                )) : (
                    <p className="text-center text-sm text-light-muted-text dark:text-dark-muted-text py-4">
                        هنوز عضوی به این پروژه اضافه نشده است.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ManageMembersModal;