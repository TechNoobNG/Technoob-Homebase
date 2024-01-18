

module.exports = {

    filter(err) {
        let statusCode = err.statusCode;
        let message = err.message;
        let data = err.data;
        let trace;
        switch (err.code) {
            case 11000:
                const affectedKey = Object.keys(err.keyPattern)[0];
                const affectedValue = err.keyValue[affectedKey];
                const errorMessage = `${affectedValue} as ${affectedKey} already exists`;

                statusCode = 409;
                message = errorMessage
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