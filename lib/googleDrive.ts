
import { GoogleDriveFile } from '../types';

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

const loadGapiScript = (): Promise<void> => {
    return new Promise((resolve) => {
        if (document.getElementById('gapi-script')) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.id = 'gapi-script';
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => resolve();
        document.body.appendChild(script);
    });
};

const loadGisScript = (): Promise<void> => {
    return new Promise((resolve) => {
        if (document.getElementById('gis-script')) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.id = 'gis-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => resolve();
        document.body.appendChild(script);
    });
};

let tokenClient: any = null;

export const initGoogleClient = async (
    apiKey: string,
    clientId: string,
    onTokenResponse: (token: any) => void
): Promise<void> => {
    await loadGapiScript();
    await loadGisScript();

    await new Promise<void>((resolve, reject) => {
        window.gapi.load('client:picker', () => {
            window.gapi.client.setApiKey(apiKey);
            window.gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest')
                .then(resolve, reject);
        });
    });
    
    tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
        callback: onTokenResponse,
    });
};

export const requestGoogleToken = (): void => {
    if (!tokenClient) {
        console.error("Google Client not initialized");
        return;
    }
    tokenClient.requestAccessToken({ prompt: 'consent' });
};

export const revokeGoogleToken = (accessToken: string): void => {
    if (accessToken) {
        window.google.accounts.oauth2.revoke(accessToken, () => {
            console.log('Access token revoked.');
        });
    }
}

export const showPicker = (
    apiKey: string,
    accessToken: string,
    onFilesSelected: (files: GoogleDriveFile[]) => void
): void => {
    if (!window.gapi.picker) {
        console.error("Picker API not loaded");
        return;
    }
    const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
    view.setMimeTypes("image/png,image/jpeg,image/jpg,application/pdf,text/plain,application/vnd.google-apps.document,application/vnd.google-apps.spreadsheet");
    
    const picker = new window.google.picker.PickerBuilder()
        .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
        .setAppId(apiKey.split(':')[0]) // App ID is the project number from API Key
        .setOAuthToken(accessToken)
        .addView(view)
        .setCallback((data: any) => {
             if (data.action === window.google.picker.Action.PICKED) {
                const files: GoogleDriveFile[] = data.docs.map((doc: any) => ({
                    id: doc.id,
                    name: doc.name,
                    mimeType: doc.mimeType,
                    sizeBytes: doc.sizeBytes,
                    url: doc.url || doc.embedUrl || `https://docs.google.com/document/d/${doc.id}`, // Fallback URL
                }));
                onFilesSelected(files);
            }
        })
        .build();
    picker.setVisible(true);
};
