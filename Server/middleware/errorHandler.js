const ErrorResponse = require('../utils/errorResponse');
const  errorFormater = require("../utils/errorFormater");

const errorHandler = (err, req, res, next) => {

    const filterError = errorFormater.filter(err);

    const { message, statusCode, data } = filterError;

    if (err instanceof ErrorResponse) {
        res.status(statusCode).json({
            success: false,
            error: message,
            data: data || undefined
        });
    } else {
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};

module.exports = errorHandler;