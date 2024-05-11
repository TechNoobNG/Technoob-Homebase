const config = require(`${__dirname}/config/config.js`)
const express = require("express");
const flash = require("connect-flash");
const createError = require("http-errors");
const rateLimit = require("express-rate-limit");
const passport = require("./config/passportConfig");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");
const Honeybadger = require("./utils/honeybadger/honeybadger");
const helmet = require("helmet");
const sanitizer = require("perfect-express-sanitizer");
const configureRoutes = require("./routes/index");
const app = express();
const prometheus = require("prom-client");
const trafficMiddleware = require("./middleware/traffic");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');
const errorHandler = require("./middleware/errorHandler");
const response = require("./middleware/customResponse");
const allowedOrigins = config.ALLOWED_ORIGINS;

app.use(
  express.urlencoded({
    extended: true,
    verify: (req, _, buf) => {
      if (req.headers['x-slack-request-timestamp'] && req.headers['x-slack-signature']  &&  req.headers['user-agent'].includes("api.slack.com")) {
        req.rawBody = buf;
      }
    },
  })
);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback({
          message: "CORS: I don't know you bro!",
          status: 403,
        });
      }
    },
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
    exposedHeaders: 'Set-Cookie',
  })
);

app.use(response);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
          "'unsafe-inline'",
          'data:',
          'localhost',
          'main-domain.com',
          '*.main-domain.com',
          '*.google.com',
          '*.google.co.in',
          '*.google-analytics.com',
          '*.googlesyndication.com',
          '*.googleadservices.com',
          '*.googletagservices.com',
          '*.googleapis.com',
          '*.doubleclick.net',
          '*.gstatic.com',
          'youtu.be',
          '*.youtu.be',
          '*.youtube.com',
          'localhost:3000'
        ],
      },
    },
  })
)

const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in microseconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.5, 1, 5, 10, 30, 60, 120, 240, 480, 960],
});

const cpuUsageGauge = new prometheus.Gauge({
  name: "cpu_usage",
  help: "Amount of CPU time used by the application",
});

const memoryUsageGauge = new prometheus.Gauge({
  name: "memory_usage",
  help: "Amount of memory used by the application",
});

const requestCount = new prometheus.Counter({
  name: "http_request_count",
  help: "Total number of HTTP requests received",
  labelNames: ["method", "path", "code"],
});

const errorCount = new prometheus.Counter({
  name: "http_request_error_count",
  help: "Total number of HTTP requests resulting in an error response",
  labelNames: ["method", "path", "code"],
});

const concurrentConnections = new prometheus.Gauge({
  name: "concurrent_connections",
  help: "Number of concurrent connections",
});

const networkTrafficBytes = new prometheus.Counter({
  name: "network_traffic_bytes",
  help: "Total network traffic in bytes",
  labelNames: ["direction"], // 'in' or 'out'
});

app.use(logger("combined"));
// Honeybadger.notify('Starting/Restarting Technoob Server');

let cookieConfig;

if (config.USE_CORS) {
  cookieConfig = {
    domain: ".technoob.tech",
    secure: true,
    maxAge: 60 * 60 * 1000,
    sameSite: "none"
  };
} else {
  cookieConfig = {
    secure: false,
    maxAge: 60 * 60 * 1000,
  };
}

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: MongoStore.create({
      mongoUrl: config.DATABASE_URL,
      ttl: 60 * 60, // 1 hour
      autoRemove: "native",
    }),
    cookie: cookieConfig
  })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(Honeybadger.requestHandler);
//app.use(helmet({
//crossOriginEmbedderPolicy: false
//}));

// Set up rate limit on our APIs
const limiter = rateLimit({
  max: config.REQUEST_LIMIT ,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.route?.path, req.method, res.statusCode)
      .observe(duration / 1000);
  });
  next();
});

app.use((req, res, next) => {
  const onData = (chunk) => {
    networkTrafficBytes.inc({ direction: "in" }, chunk.length);
  };
  const onEnd = () => {
    networkTrafficBytes.inc(
      { direction: "out" },
      res.get("Content-Length") || 0
    );
    res.removeListener("data", onData);
    res.removeListener("end", onEnd);
  };
  res.on("data", onData);
  res.on("end", onEnd);
  next();
});

app.use((req, res, next) => {
  concurrentConnections.inc();
  res.on("finish", () => {
    concurrentConnections.dec();
  });
  next();
});

app.use((req, res, next) => {
  requestCount.inc({
    method: req.method,
    path: req.path,
    code: res.statusCode,
  });
  if (res.statusCode >= 400) {
    errorCount.inc({
      method: req.method,
      path: req.path,
      code: res.statusCode,
    });
  }
  next();
});

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(trafficMiddleware);
app.use(limiter)
configureRoutes("/api/v1", app);

setInterval(() => {
  cpuUsageGauge.set(process.cpuUsage().user / 1000000);
  memoryUsageGauge.set(process.memoryUsage().rss);
}, 10000);

app.use(errorHandler);
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics();


module.exports = app;
