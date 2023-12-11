const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];
const uuid = require('uuid');
let storageProvider = config.STORAGE_PROVIDER.provider;
let useMultipleProviders = config.STORAGE_PROVIDER.useMultipleProviders || false;

function getRandomStorageProvider() {
    const providers = ["aws", "azure"];
    const randomIndex = Math.floor(Math.random() * providers.length);
    return providers[randomIndex];
}

function getStorageProvider(provider) {
    if (!provider || !["aws", "azure"].includes(provider) || useMultipleProviders) {
        const randomProvider = getRandomStorageProvider();
        console.log("Using random storage provider: " + randomProvider);
        return require(`./${randomProvider}_storage`);
    } else {
        console.log("Using storage provider: " + provider);
        return require(`./${provider}_storage`);
    }
}

module.exports = {
    upload: async ({ type, data, name, isFile = false, acl }) => {
        try {
            if (!type) throw new Error("Missing parameters");
            if (!data) throw new Error("Missing data");
            if (!name) throw new Error("Missing name");
            let generatedId = false;
            if (acl && acl === "private") {
                generatedId = uuid.v4();
            }
            let provider = storageProvider;
            const res = await getStorageProvider(provider).upload({
                type,
                data,
                name,
                isFile,
                acl,
                generatedId,
            })
            res.provider = provider
            return res;
        } catch (error) {
            throw error
        }

    },
    delete: async (url) => {
        if (!url) {
            throw new Error("Missing url");
        }
        return await getStorageProvider(storageProvider).delete(url);
    },
    download: async ({storeName,generatedId,key}) => {
        if (!storeName) {
            throw new Error("Missing storeName");
        }
        if(!generatedId && !key){
            throw new Error("Missing generatedId or key");
        }
        const file = await getStorageProvider(storageProvider).download({ storeName, generatedId, key });
        return file;
    },

}