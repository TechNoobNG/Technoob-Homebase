const config = require('../../config/config')
const uuid = require('uuid');
const {
    BlobServiceClient,
    BlobSASPermissions,
    generateBlobSASQueryParameters,
    StorageSharedKeyCredential
} = require("@azure/storage-blob");
const connectionString = config.AZURE_STORAGE_CONNECTION_STRING;
const azureStorageAccountKey = connectionString.match(/AccountKey=([^;]+)/)[1];
const storageAccountName = config.AZURE_STORAGE_ACCOUNT_NAME;
if (!connectionString) throw Error('Azure Storage Service: No keys found');
const storageSharedKeyCredentials = new StorageSharedKeyCredential(storageAccountName, azureStorageAccountKey);
const blobServiceClient = BlobServiceClient.fromConnectionString(
    connectionString
);

const envMap = {
    "development": "dev",
    "test": "test",
    "production": "prod",
    "production_worker": "prod",
    "development_worker": "dev"
}

const aclMap = {
    "public": "public",
    "private": "private",
}

module.exports = {
    async createContainer(name, acl) {
        let options = null;
        if (acl && acl === "public") {
            options = {
                access: 'blob'
            };
        }
        const containerClient = await blobServiceClient.createContainer(name,options);

        let container = {
            name: name,
            url: containerClient.url,
            requestId: containerClient.requestId,
            message: `Container was created successfully.`
        }

        return container;
    }
    ,
    async deleteContainer(name) {
        const containerClient = blobServiceClient.getContainerClient(name);
        // Delete the container
        const deleteContainerResponse = await containerClient.delete();
        let response = {
            name: name,
            requestId: deleteContainerResponse.requestId,
            message: `Container was deleted successfully.`
        }
        return response;
    },
    async listContainers() {
        let i = 1;
        let containers = [];
        for await (const container of blobServiceClient.listContainers()) {
            containers.push({
                id: i,
                name: container.name,
                url: container.url,
                requestId: container.requestId
            });
            i++;
        }
        return containers;
    },
    async upload({type, data, name, isFile = false,  acl = "private", generatedId}) {
        let availableContainers = await this.listContainers();
        let containername = `technoob-${envMap[env]}`;
        if (acl && ["public", "private"].includes(acl)) {
            containername = `${containername}-${aclMap[acl]}`
        }

        if (!availableContainers.find(c => c.name === containername)) {
            await this.createContainer(containername,acl);
        }
        let containerClient = blobServiceClient.getContainerClient(containername);

        const key = `${type}/${name}`;
        const blockBlobClient = containerClient.getBlockBlobClient(key);
        const uploadBlobResponse = isFile? await blockBlobClient.uploadStream(data) : await blockBlobClient.upload(data, data.length);
        let blob = {
            name: name,
            url: blockBlobClient.url,
            requestId: uploadBlobResponse.requestId,
            message: `Blob was uploaded successfully.`
        }

        if(acl === "private"){
            if(!generatedId){
                generatedId = uuid.v4()
            }
            blob.url = `https://${config.LIVE_BASE_URL}/api/v1/download/${generatedId}`
            blob.generatedId = generatedId;
            blob.objectStore = containername;
            blob.key = key;
        }
        blob.key = key
        return blob;

    },
    async download({storeName, key}) {
        const sasToken = await this.getBlobSasUri(storeName, key);
        const containerClient = blobServiceClient.getContainerClient(storeName);
        const blockBlobClient = containerClient.getBlockBlobClient(key);
        const url = `${blockBlobClient.url}?${sasToken}`;
        return url;
    },
    async delete(url) {
        const parts = url.replace(/^(https?:\/\/)?/, '').split('/');
        const containerName = parts[1];
        const blobName = parts.slice(2).join('/');
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const deleteBlobResponse = await blockBlobClient.delete();
        let response = {
            name: url,
            requestId: deleteBlobResponse.requestId,
            message: `Blob was deleted successfully.`
        }
        return response;
    },
    async listBlobs(container) {
        const containerClient = blobServiceClient.getContainerClient(container);
        let i = 1;
        let blobs = [];
        for await (const blob of containerClient.listBlobsFlat()) {
            blobs.push({
                id: i,
                name: blob.name,
                url: blob.url,
                requestId: blob.requestId
            });
            i++;
        }
        return blobs;
    },

// async createBlobSas(containerName,blobName) {

//     const accountName = storageAccountName;

//     const TEN_MINUTES = 10 * 60 * 1000;
//     const NOW = new Date();

//     const TEN_MINUTES_BEFORE_NOW = new Date(NOW.valueOf() - TEN_MINUTES);
//     const TEN_MINUTES_AFTER_NOW = new Date(NOW.valueOf() + TEN_MINUTES);


//     const userDelegationKey = await blobServiceClient.getUserDelegationKey(
//         TEN_MINUTES_BEFORE_NOW,
//         TEN_MINUTES_AFTER_NOW
//     );

//     const blobPermissionsForAnonymousUser = "r"

//     const sasOptions = {
//         blobName,
//         containerName,
//         permissions: BlobSASPermissions.parse(blobPermissionsForAnonymousUser),
//         protocol: SASProtocol.HttpsAndHttp,
//         startsOn: TEN_MINUTES_BEFORE_NOW,
//         expiresOn: TEN_MINUTES_AFTER_NOW
//     };

//     const sasToken = generateBlobSASQueryParameters(
//         sasOptions,
//         userDelegationKey,
//         accountName
//     ).toString();

//     return sasToken;
// },
    async getBlobSasUri(containerName, blobName, storedPolicyName) {
        const sasOptions = {
            containerName,
            blobName: blobName
        };

        const TWO_MINUTES = 2 * 60 * 1000;
        const FIFTY_MINUTES = 50 * 60 * 1000
        const NOW = new Date();
        const TWO_MINUTES_BEFORE_NOW = new Date(NOW.valueOf() - TWO_MINUTES);
        const FIFTY_MINUTES_AFTER_NOW = new Date(NOW.valueOf() + FIFTY_MINUTES);

        if (storedPolicyName == null) {
            sasOptions.startsOn = TWO_MINUTES_BEFORE_NOW;
            sasOptions.expiresOn = FIFTY_MINUTES_AFTER_NOW;
            sasOptions.permissions = BlobSASPermissions.parse("r");
        } else {
            sasOptions.identifier = storedPolicyName;
        }

        const sasToken = generateBlobSASQueryParameters(sasOptions, storageSharedKeyCredentials).toString();

        return sasToken;
    }
}