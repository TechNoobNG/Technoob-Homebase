const logger = require('./logger');

class JobLogger {
  constructor( searchTags,age,platform) {
    this.searchTags = searchTags;
    this.status = 'initiated';
    this.jobLog = {};
    this.age = age;
    this.platform = platform
  }

  start(key, status) {
    this.jobLog[key] = {
      start: Date.now(),
      status: 'initiated'
    };
  }

  end(key, status, errMessage) {
    const entry = this.jobLog[key];
    if (entry) {
      entry.end = Date.now();
      entry.duration = entry.end - entry.start;
      entry.status = status;
      entry.error = errMessage || null;
    }
  }

  complete() {
    this.status = "run-completed";
    this.log();
  }

  log() {
    logger.createScrapeLog({
      searchTags: this.searchTags,
      status: this.status,
      scrapeResultLog: this.jobLog,
      age: this.age,
      platform: this.platform
    });
  }
}

module.exports = JobLogger;
