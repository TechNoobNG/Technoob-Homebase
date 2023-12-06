const ErrorResponse = require('../utils/errorResponse');
const errorFormater = require('../utils/errorFormater');
function extendResponseObject(req, res, next) {
    async function processPostExecMiddlewares(req, res, next) {
        for (const middleware of req.postExecMiddlewares ?? []) {
            await middleware(req, res, next);
        }
    }

    res.ok = async function ({ data = undefined, message = 'Successful', statusCode = 200, token = undefined  } = {}) {

        res.locals.data = data;
        const response = {
            success: true,
            message,
            data,
            token
        };
        res.status(statusCode).json(response);
        try {
            return processPostExecMiddlewares(req, res, next);
        } catch (err) {
            console.warn(err.message)
        }

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
