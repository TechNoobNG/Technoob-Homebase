const client = require("../utils/redishelper");
const utils = require("../utils/utils")

module.exports = {
    getCache: async (req, res, next) => {
        try {
            const cacheKey = req.originalUrl;
            const cachedData = await client.get(cacheKey);

            if (cachedData) {
                const data = JSON.parse(cachedData);
                res.locals.fromCache = true;
                return res.ok({
                    status: "success",
                    message: `Data retrieved from cache`,
                    data: data
                });
            } else {
                res.locals.fromCache = false;
                const addToCache = module.exports.addToCache;
                req.postExecMiddlewares = (req.postExecMiddlewares || []).concat(addToCache);
                next();
            }
        } catch (error) {
            console.error('Error in getCache:', error);
            return res.fail(error);
        }
    },

    clearCache: async (req, res, next) => {
        try {
            const baseCacheKey = utils.removePathSegments(req.originalUrl);
            const keys = await client.keys(baseCacheKey + '*');
            await Promise.all(keys.map(key => client.del(key)));
        } catch (error) {
            console.error('Error in clearCache:', error);
        }
    },

    addClearCache: (req, res, next) => {
        const clearCache = module.exports.clearCache;
        req.postExecMiddlewares = (req.postExecMiddlewares || []).concat(clearCache);
        next();
    },

    addToCache: async (req, res, next) => {
        try {
            if (!res.locals.fromCache) {
                const cacheKey = req.originalUrl;
                const dataToAdd = res.locals.data;
                const ttlInSeconds = 3600;

                await client.set(cacheKey, JSON.stringify(dataToAdd), {
                    EX: ttlInSeconds
                });
            }
        } catch (error) {
            console.error('Error in addToCache:', error);
        }
    },
};
