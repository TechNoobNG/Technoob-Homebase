const express = require('express');
const config = require('../config/config')
const user = require('./users');
const auth = require('./auth');
const admin = require('./admin');
const resources = require('./resources');
const events = require('./events')
const jobs = require('./jobs')
const quizzes = require('./quizzes')
const utils = require('./utils')
const slack = require('./slack.js')
const experimental = require('./experimental.js')
const pool = require('../experimental/index')
const middleware = require('../middleware/index');
const prometheus = require('prom-client');
const { register } = prometheus;
const utility = require("../utils/utils");
const download = require("./download");
const ErrorResponse = require("../utils/error/errorResponse")
function configureRoutes(base = `/api/v1`,app) {
  // const app = express.app();
  const excludeClearCacheRoutes = config.EXCLUDE_CLEAR_CACHE_ROUTES;

  app.all('/',(req, res) => {
    res.render('index', {
      title: 'TechNoob API',
      environment: config.NODE_ENV,
      repo_link: "https://github.com/TechNoobNG/Technoob-Homebase",
    });
  });

  

  const clearCacheMiddleware = (req, res, next) => {
    const path = req.path;
    if (req.method === 'POST' && !excludeClearCacheRoutes.includes(utility.removePathSegments(path))) {
      middleware.redisCache.addClearCache(req, res, next);
    }
    next();
  };

  const sanitizeIfNeeded = (req, res, next) => {
    if (req.path.startsWith('/email/template')) {
      return next();
    } else {
      return middleware.sanitizer(req, res, next);
    }
  };

  app.use(sanitizeIfNeeded);
  app.use(clearCacheMiddleware);
  app.use(`${base}/user`, user);
  app.use(`${base}/authenticate`, auth);
  app.use(`${base}/admin`, admin);
  app.use(`${base}/resources`, resources);
  app.use(`${base}/utils`, utils);
  app.use(`${base}/events`, events);
  app.use(`${base}/jobs`, jobs);
  app.use(`${base}/quizzes`, quizzes);
  app.use(`${base}/experimental`, experimental);
  app.use(`${base}/download`, download);
  app.use(`${base}/slack`, slack);

  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.send(await register.metrics());
    } catch (error) {
      res.fail(error)
    }
  });

  app.all('*', (req, res) => {
    console.log(req.method, req.originalUrl)
    if (!res.headersSent) {
      throw new ErrorResponse(
        400,
      `Can't find (${req.method}) ${req.originalUrl} on this server. Please check the documentation for the correct route.`,
      {}
    )
    }
  });

  return app;
}

module.exports = configureRoutes;
