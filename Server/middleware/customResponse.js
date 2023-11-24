const ErrorResponse = require('../utils/errorResponse');
const errorFormater = require('../utils/errorFormater');
function extendResponseObject(req, res, next) {
    res.ok = function (  { data = undefined, message = 'Successful',  statusCode = 200 } = {} ) {
        const response = {
            success: true,
            message,
            data
        };

        res.status(statusCode).json(response);
    };

    const defaultErrorMessages = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
    };

    res.fail = function (error) {
        if (error instanceof ErrorResponse && !error.message) {
            error.message = defaultErrorMessages[error.statusCode] || 'Unknown Error';
        } else if (!(error instanceof ErrorResponse)) {
            const filterError = errorFormater.filter(error);
            error = new ErrorResponse(filterError.statusCode, filterError.message, filterError?.data, filterError?.stack);
        }

        next(error);
    };

    next();
}

module.exports = extendResponseObject;
