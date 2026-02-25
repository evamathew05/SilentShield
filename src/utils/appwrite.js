import { Client, Databases, Storage, Account, ID } from 'appwrite';

const client = new Client();

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const project = import.meta.env.VITE_APPWRITE_PROJECT_ID;

console.log("Appwrite Initialization:", { 
    endpoint: endpoint, 
    project: project ? "LOADED" : "MISSING" 
});

if (!endpoint || !project) {
    console.warn("CRITICAL: Appwrite configuration is missing from environment variables.");
}

client
    .setEndpoint(endpoint || 'https://cloud.appwrite.io/v1')
    .setProject(project || '');

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);
export { ID, client };
