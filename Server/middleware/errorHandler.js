const ErrorResponse = require('../utils/error/errorResponse');
const  errorFormater = require("../utils/error/errorFormater");
const Honeybadger = require("../utils/honeybadger/honeybadger");

const errorHandler = (err, req, res, next) => {
    async function processPostExecMiddlewares(req, res, next) {
        for (const middleware of req.postExecMiddlewares ?? []) {
            await middleware(req, res, next);
        }
    }
    const filterError = errorFormater.filter(err);

    const { message, statusCode, data } = filterError;

    if (err instanceof ErrorResponse) {
        res.status(statusCode).json({
            success: false,
            error: message,
            data: data || undefined
        });
    } else if (err.message.includes("CORS")) {
        res.status(403).json({
            success: false,
            error: err.message
        });
    } else {
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
        Honeybadger.errorHandler(err,req,res,next)
    }

    try {
        return processPostExecMiddlewares(req, res, next);
    } catch (err) {
        console.warn(err.message)
    }
};

module.exports = errorHandler;