
const config = require('../../config/config')
const axios = require("axios").default;
const postmanToOpenApi = require('postman-to-openapi')
const yamljs = require('yamljs');

module.exports = {
     async fetchPostmanCollection(collectionId) {
        try {
            const options = {}
            options.headers = {
                "x-api-key": config.POSTMAN_API_KEY
            }
            const response = await axios.get(`https://api.getpostman.com/collections/${collectionId}`, options);
            return response.data;
        } catch (error) {
          console.error(`Error fetching or encoding content from ${url}:`, error.message);
        }
    },  
    
    async generateSwaggerYaml(collectionId = "23034417-e91be4be-1155-41e4-b535-6da058e3d4a8") {
        try {
            const { collection } = await this.fetchPostmanCollection(collectionId);
            const result = await postmanToOpenApi(JSON.stringify(collection), null, { defaultTag: 'General' })
            return result
        } catch (error) {
            console.warn("Failed to load Swagger Doc", error.message);
            return null
        }
    },

    async generateSwaggerJs(collectionId = "23034417-e91be4be-1155-41e4-b535-6da058e3d4a8" ) {
        try {
            const swaggeryml = await this.generateSwaggerYaml(collectionId);
            const result = yamljs.parse(swaggeryml)
            return result
        } catch (error) {
            console.warn("Failed to load Swagger Doc", error.message);
            return null
        }
    }
   
}