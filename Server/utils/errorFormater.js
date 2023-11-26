

module.exports = {

    filter(err) {
        let statusCode = err.statusCode;
        let message = err.message;
        let data = err.data;
        let trace;
    
        switch (err.code) {
            case 11000:
                statusCode = 409;
                message = `"${Object.values(err.keyValue).join(', ')}" already exists`;
                break;
            case 121:
                statusCode = 400;
                message = "Parameters validation failed";
                break;
            case 66:
                statusCode = 400;
                message = "Missing required field";
                break;
            case 11600:
                statusCode = 503;
                message = "Interrupted operation";
                break;
            default:
                break;
        }
    
        trace = err.message;
    
        return {
            statusCode,
            message,
            trace,
            data
        };
    }
    
}