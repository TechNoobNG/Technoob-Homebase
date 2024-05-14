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
const download = require("./download");
const ErrorResponse = require("../utils/error/errorResponse");
const { serveSwaggerUIDynamic } = require("postman-swagger-express");

async function configureRoutes(base = `/api/v1`,app) {

  app.all('/',(req, res) => {
    res.render('index', {
      title: 'TechNoob API',
      environment: config.NODE_ENV,
      repo_link: "https://github.com/TechNoobNG/Technoob-Homebase",
    });
  });

  const { sanitizer, redisCache: { addClearCache } } = middleware
  app.use(sanitizer);
  app.use(addClearCache);
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

  serveSwaggerUIDynamic(app, "/api-docs", "23034417-e91be4be-1155-41e4-b535-6da058e3d4a8", {
    postmanApiKey: config.POSTMAN_API_KEY,
    liveBaseUrl: `https://${config.LIVE_BASE_URL}`,
  });

  // app.use('/api-docs',swaggerUI.serve, async (req, res, next) => {
  //   const collection = await swagger.generateSwaggerJs()
  //   if (collection) {
  //     collection.servers = [
  //       {
  //         url: `https://${config.LIVE_BASE_URL}`,
  //         description: `${config.NODE_ENV} Server`
  //       },
  //     ]
  //     swaggerUI.setup(collection)(req, res, next);
  //   } else {
  //     res.send("Not available")
  //   }
  // });

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
