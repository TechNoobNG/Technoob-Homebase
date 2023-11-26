
const xss = require('xss');

//  list of safe HTML tags and attributes
const xssOptions = {
  whiteList: {
    a: ['href', 'title', 'target'],
    img: ['src', 'alt'],
    p: [],
    div: [],
    ul: [],
    ol: [],
    li: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    br: [],
    hr: []
  }
};

function sanitize(req, res, next) {
    sanitizeObject(req.body);
    sanitizeObject(req.params);
    sanitizeObject(req.query);
    next();
}

function sanitizeObject(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            if (Array.isArray(obj[key])) {
                obj[key].forEach((element, index) => {
                    obj[key][index] = xss(element, xssOptions);
                });
            } else {
                sanitizeObject(obj[key]);
            }
        } else {
            obj[key] = xss(obj[key], xssOptions);
        }
    }
}

module.exports = sanitize;
