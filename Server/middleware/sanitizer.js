const xss = require('xss');

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
    hr: [],
  },
};

function sanitize(req, res, next) {

  req.body = preventNoSQLInjection(req.body, "body");
  sanitizeObject(req.body);

  req.params = preventNoSQLInjection(req.params, "params");
  sanitizeObject(req.params);

  req.query = preventNoSQLInjection(req.query, "query");
  sanitizeObject(req.query);zXkik

  next();
}

function sanitizeObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      if (Array.isArray(obj[key])) {
        obj[key] = obj[key].map((element) => xss(element, xssOptions));
      } else {
        sanitizeObject(obj[key]);
      }
    } else {
        if (typeof obj[key] !== 'number') {
            obj[key] = xss(obj[key], xssOptions);
        }
    }
  }
}


function preventNoSQLInjection(obj, type) {
  if (type === 'params' || type === 'query') {
    convertValues(obj);
  } else if (type === "body") {
    obj = sanitizeJson(obj);
  }
    return obj
}

function convertValues(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      obj[key] = obj[key].toString();
    } else if (typeof obj[key] === 'string') {
      const intValue = parseInt(obj[key], 10);
      if (!isNaN(intValue)) {
        obj[key] = intValue;
      }
    } else if (typeof obj[key] === 'number') {
      const intValue = Number.isInteger(obj[key]) ? parseInt(obj[key], 10) : obj[key];
      obj[key] = intValue;
    } else if (typeof obj[key] === 'boolean') {
      obj[key] = obj[key];
    }
  }
}

// function sanitizeString(input) {
//     console.log(sanitizedValue)
//     if (typeof input === 'string') {
//       return input.replace(/[$.]/g, '');
//     } else if (Array.isArray(input)) {
//       return input.map(item => sanitizeString(item));
//     } else if (typeof input === 'object') {
//       return sanitizeNoSQLInjection(input);
//     } else {
//       return input;
//     }
//   }

function isMongoOperator(key) {
    return key.startsWith('$') && key !== '$';
  }
  
function sanitizeJson(input) {
  if (typeof input === 'object') {
    if (Array.isArray(input)) {
      return input.map(sanitizeJson);
    } else {
      const sanitizedObject = {};
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
          const sanitizedKey = isMongoOperator(key) ? key.replace(/\$/g, '') : key;
          sanitizedObject[sanitizedKey] = sanitizeJson(input[key]);
        }
      }
      return sanitizedObject;
    }
  } else if (typeof input === 'string') {
    return isMongoOperator(input) ? input.replace(/\$/g, '') : input;
  } else {
    return input;
  }
}


module.exports = sanitize;
