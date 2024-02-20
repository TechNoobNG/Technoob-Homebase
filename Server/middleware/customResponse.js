const ErrorResponse = require('../utils/error/errorResponse');
const errorFormater = require('../utils/error/errorFormater');
const axios = require('axios');

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

    res.slackok = async function ({ data = undefined, statusCode = 200  } = {}) {

        res.status(statusCode).json(data);
        try {
            return processPostExecMiddlewares(req, res, next);
        } catch (err) {
            console.warn(err.message)
        }

    };

    res.slackfail = async function (message) {

        res.status(200).send(message);
        try {
            return processPostExecMiddlewares(req, res, next);
        } catch (err) {
            console.warn(err.message)
        }

    };
    res.customRedirect = function (url) {
        res.status(302).redirect(url);
         try {
            return processPostExecMiddlewares(req, res, next);
        } catch (err) {
            console.warn(err.message)
        }
    };

    res.contentPipe = async function (url) {
        try {
            const externalResponse = await axios.get(url, { responseType: 'stream' });
            res.set('Content-Type', externalResponse.headers['content-type']);
            res.set('Content-Length', externalResponse.headers['content-length']);
            res.set('Cache-Control', 'public, max-age=31557600'); 
            externalResponse.data.pipe(res);
        } catch (error) {
            res.status(500).send('Internal Server Error');
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
