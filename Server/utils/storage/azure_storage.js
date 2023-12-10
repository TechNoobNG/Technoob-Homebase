const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];

const { BlobServiceClient } = require("@azure/storage-blob");
const connectionString = config.AZURE_STORAGE_CONNECTION_STRING;

if (!connectionString) throw Error('Azure Storage Service: No keys found');

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

module.exports = {
    async createContainer(name) {
        const options = {
            access: 'blob'
        };
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
    async upload({type, data, name, isFile = false}) {
        let availableContainers = await this.listContainers();
        let containername = `technoob-${envMap[env]}`;

        if (!availableContainers.find(c => c.name === containername)) {
            await this.createContainer(containername);
        }
        let containerClient = blobServiceClient.getContainerClient(containername);

        const key = `${type}${name}`
        const blockBlobClient = containerClient.getBlockBlobClient(key);
        const uploadBlobResponse = isFile? await blockBlobClient.uploadStream(data) : await blockBlobClient.upload(data, data.length);
        let blob = {
            name: name,
            url: blockBlobClient.url,
            requestId: uploadBlobResponse.requestId,
            message: `Blob was uploaded successfully.`
        }
        return blob;

    },
    async download(container, name) {
        const containerClient = blobServiceClient.getContainerClient(container);
        const blockBlobClient = containerClient.getBlockBlobClient(name);
        const downloadBlockBlobResponse = await blockBlobClient.download(0);
        let blob = {
            name: name,
            url: blockBlobClient.url,
            requestId: downloadBlockBlobResponse.requestId,
            stream: downloadBlockBlobResponse.readableStreamBody,
            message: `Blob was downloaded successfully.`
        }
        return blob;
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
    }
}