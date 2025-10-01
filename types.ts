
import { Models } from 'appwrite';

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export type Theme = 'light' | 'dark';

export interface User extends Models.User<Models.Preferences> {
  // Appwrite's User model already contains id, name, email etc.
  // We can extend it if we need custom fields.
  // Fix: Add missing Appwrite User properties to satisfy TypeScript.
  $id: string;
  name: string;
  email: string;
}

export interface UserIdentity extends Models.Identity {
    // Appwrite's Identity model
}

export interface Attachment {
  $id: string;
  name: string;
  url: string;
  type: 'file' | 'google-drive';
  size_bytes?: number;
  mime_type?: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes?: number;
  url: string;
}

export interface Task extends Models.Document {
  // Fix: Add missing Appwrite Document properties to satisfy TypeScript.
  $id: string;
  $createdAt: string;
  title: string;
  description: string;
  status: TaskStatus;
  position: number;
  period_id: string;
  assignees?: User[];
  due_date?: string;
  attachments?: Attachment[];
}

export interface Period extends Models.Document {
  // Fix: Add missing Appwrite Document properties to satisfy TypeScript.
  $id: string;
  $createdAt: string;
  title: string;
  position: number;
  project_id: string;
  tasks: Task[];
}

export interface Project extends Models.Document {
  // Fix: Add missing Appwrite Document properties to satisfy TypeScript.
  $id: string;
  $createdAt: string;
  name: string;
  description: string;
  owner_id: string;
  periods: Period[];
  members: string[]; // Array of user IDs
}

export interface AppSettings {
    google: {
        apiKey: string;
        clientId: string;
    };
    gemini: {
        apiKey: string;
    };
}
