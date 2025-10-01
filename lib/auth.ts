import { Client, Account, ID, Models } from 'appwrite';

const APPWRITE_ENDPOINT = process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.REACT_APP_APPWRITE_PROJECT_ID || '';

if (!APPWRITE_PROJECT_ID) {
    console.warn('Appwrite Project ID is not set. Please update it in your environment variables (REACT_APP_APPWRITE_PROJECT_ID).');
}

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

const account = new Account(client);

export const createAccount = (email: string, password: string, name: string): Promise<Models.User<Models.Preferences>> => {
    return account.create(ID.unique(), email, password, name);
};

export const loginWithEmail = (email: string, password: string): Promise<Models.Session> => {
    return account.createEmailPasswordSession(email, password);
};

export const loginWithProvider = (provider: 'google' | 'github'): void => {
    const successUrl = window.location.origin;
    const failureUrl = `${window.location.origin}/login-failure`;
    account.createOAuth2Session(provider, successUrl, failureUrl);
};

export const getCurrentUser = (): Promise<Models.User<Models.Preferences>> => {
    return account.get();
};

export const signOut = (): Promise<{}> => {
    return account.deleteSession('current');
};
