const ErrorResponse = require('../utils/errorResponse');
const  errorFormater = require("../utils/errorFormater");
const Honeybadger = require("../utils/honeybadger");

const errorHandler = (err, req, res, next) => {

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


};

module.exports = errorHandler;