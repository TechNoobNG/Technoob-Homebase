const express = require('express');
const router = express.Router();
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const user = require('./users');
const auth = require('./auth');
const admin = require('./admin');
const resources = require('./resources');
const events = require('./events')
const jobs = require('./jobs')
const quizzes = require('./quizzes')
const utils = require('./utils')
const experimental = require('./experimental.js')
const base = `/api/v1`
const pool = require('../experimental/index')
const middleware = require('../middleware/index');
const prometheus = require('prom-client');
const { register } = prometheus;
const utility = require("../utils/utils");


router.get('/', (req, res) => {
  res.render('index', {
    title: 'TechNoob API',
    environment: config.NODE_ENV,
    repo_link: "https://github.com/TechNoobNG/Technoob-Homebase",
    // activeTasks: pool.stats().activeTasks,
    // totalWorkers: pool.stats().totalWorkers,
    // busyWorkers: pool.stats().busyWorkers,
    // idleWorkers: pool.stats().idleWorkers,
    // pendingTasks: pool.stats().pendingTasks,

  });

});

const excludeClearCacheRoutes = config.EXCLUDE_CLEAR_CACHE_ROUTES;

const clearCacheMiddleware = (req, res, next) => {
  if (req.method === 'POST' && !excludeClearCacheRoutes.includes(utility.removePathSegments(req.path))) {
        middleware.redisCache.addClearCache(req, res, next);
    } else {
        next();
    }
};

const sanitizeIfNeeded = (req, res, next) => {
  if (req.path.startsWith('/email/template')) {
    return next();
  } else {
    return middleware.sanitizer(req, res, next);
  }
};

router.use(sanitizeIfNeeded);

router.use(clearCacheMiddleware);

router.use(`${base}/user`, user);
router.use(`${base}/authenticate`, auth);
router.use(`${base}/admin`, admin);
router.use(`${base}/resources`, resources);
router.use(`${base}/utils`, utils);
router.use(`${base}/events`, events);
router.use(`${base}/jobs`, jobs);
router.use(`${base}/quizzes`, quizzes)
router.use(`${base}/experimental`, experimental)

// Prometheus middleware
router.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics());
  } catch (error) {
    res.fail(error)
  }
});

router.all('*', (req, res) => {
  console.log(req.method, req.originalUrl)
  return res.status(400).json({
    status: 'fail',
    message: `Can't find (${req.method}) ${req.originalUrl} on this server. Please check the documentation for the correct route.`
  })

});

module.exports = router;
