import { Client, Databases, ID, Query, Permission, Role, Models } from 'appwrite';
import { Project, Period, Task, User } from '../types';

const APPWRITE_ENDPOINT = process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.REACT_APP_APPWRITE_PROJECT_ID || '';
const DATABASE_ID = process.env.REACT_APP_DATABASE_ID || 'taskan_db';
const PROJECTS_COLLECTION_ID = process.env.REACT_APP_PROJECTS_COLLECTION_ID || 'projects';
const PERIODS_COLLECTION_ID = process.env.REACT_APP_PERIODS_COLLECTION_ID || 'periods';
const TASKS_COLLECTION_ID = process.env.REACT_APP_TASKS_COLLECTION_ID || 'tasks';

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

const databases = new Databases(client);

// --- Projects ---

export const getProjectsForUser = async (userId: string): Promise<Project[]> => {
    const { documents } = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        [Query.search('members', userId)]
    );
    return documents;
};

export const createProject = async (projectData: { name: string, description: string }, ownerId: string): Promise<Project> => {
    const permissions = [
        Permission.read(Role.user(ownerId)),
        Permission.update(Role.user(ownerId)),
        Permission.delete(Role.user(ownerId)),
    ];

    const newProject = await databases.createDocument<Project>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        ID.unique(),
        {
            ...projectData,
            owner_id: ownerId,
            members: [ownerId]
        },
        permissions
    );
    return newProject;
};

export const updateProject = async (projectId: string, projectData: { name: string, description: string }): Promise<Project> => {
    const updatedProject = await databases.updateDocument<Project>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        projectId,
        projectData
    );
    return updatedProject;
};

export const deleteProject = async (projectId: string): Promise<{}> => {
    // Note: You might want to delete associated periods and tasks as well.
    // This requires cascading deletes, which should be handled carefully.
    return databases.deleteDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, projectId);
};


// --- Periods & Tasks (Example for one level, real implementation would need more logic) ---

export const getProjectDetails = async (projectId: string): Promise<{ project: Project, periods: Period[] }> => {
    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_COLLECTION_ID, projectId);
    
    const { documents: periods } = await databases.listDocuments<Period>(
        DATABASE_ID,
        PERIODS_COLLECTION_ID,
        [Query.equal('project_id', projectId), Query.orderAsc('position')]
    );
    
    for (const period of periods) {
        const { documents: tasks } = await databases.listDocuments<Task>(
            DATABASE_ID,
            TASKS_COLLECTION_ID,
            [Query.equal('period_id', period.$id), Query.orderAsc('position')]
        );
        period.tasks = tasks;
    }
    
    project.periods = periods;
    return { project, periods };
};


// --- Members ---

export const updateProjectMembers = async (projectId: string, memberIds: string[]): Promise<Project> => {
    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_COLLECTION_ID, projectId);
    
    const ownerId = project.owner_id;
    const newPermissions = [
        Permission.read(Role.user(ownerId)),
        Permission.update(Role.user(ownerId)),
        Permission.delete(Role.user(ownerId)),
        ...memberIds.map(id => Permission.read(Role.user(id))),
        ...memberIds.map(id => Permission.update(Role.user(id))),
    ];

    const updatedProject = await databases.updateDocument<Project>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        projectId,
        { members: memberIds },
        newPermissions
    );
    return updatedProject;
};
