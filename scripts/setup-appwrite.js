import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.VITE_APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const databaseId = process.env.VITE_APPWRITE_DATABASE_ID;

async function setup() {
    try {
        console.log('--- Setting up Appwrite Resources ---');

        // 1. Create Bucket
        let bucketId;
        try {
            const bucket = await storage.createBucket(
                ID.unique(),
                'Evidence',
                [
                    Permission.create(Role.any()),
                    Permission.read(Role.any()),
                ],
                false, // fileSecurity
                true,  // enabled
                undefined, // maximumFileSize
                ['jpg', 'png', 'gif', 'jpeg', 'pdf', 'mp4'], // allowedFileExtensions
                'none', // compression
                true, // encryption
                true  // antivirus
            );
            bucketId = bucket.$id;
            console.log('✅ Bucket created: ' + bucketId);
        } catch (e) {
            console.log('⚠️ Bucket might already exist or failed: ' + e.message);
        }

        // 2. Create Collection
        let collectionId;
        try {
            const collection = await databases.createCollection(
                databaseId,
                ID.unique(),
                'Reports',
                [
                    Permission.create(Role.any()),
                    Permission.read(Role.any()),
                ]
            );
            collectionId = collection.$id;
            console.log('✅ Collection created: ' + collectionId);

            // 3. Add Attributes
            console.log('Adding attributes...');
            await databases.createStringAttribute(databaseId, collectionId, 'type', 50, true);
            await databases.createStringAttribute(databaseId, collectionId, 'platform', 100, true);
            await databases.createStringAttribute(databaseId, collectionId, 'description', 2000, true);
            await databases.createDatetimeAttribute(databaseId, collectionId, 'date', true);
            await databases.createStringAttribute(databaseId, collectionId, 'evidenceId', 255, false);
            await databases.createStringAttribute(databaseId, collectionId, 'status', 20, false, 'pending');

            console.log('✅ Attributes added.');
        } catch (e) {
            console.log('⚠️ Collection might already exist or failed: ' + e.message);
        }

        console.log('\n--- SETUP COMPLETE ---');
        console.log('Update your .env with these values:');
        if (collectionId) console.log('VITE_APPWRITE_COLLECTION_ID=' + collectionId);
        if (bucketId) console.log('VITE_APPWRITE_BUCKET_ID=' + bucketId);
        
    } catch (error) {
        console.error('❌ Setup failed:', error);
    }
}

setup();
