
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.js`)[env];
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = config.SALT_ROUNDS

module.exports = {
     async hashPassword(password) {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        return bcrypt.hash(password, salt);;
    },
    removePathSegments(url) {
        const isAdminRoute = url.startsWith('/api/v1/admin');
    
        if (isAdminRoute) {
            const regex = /^\/api\/v1\/admin\/([^/]+)\/?/;
            const match = url.match(regex);
            return match ? `/api/v1/admin/${match[1]}` : url;
        } else {
            const regex = /^\/api\/v1\/[^/]+/;
            const match = url.match(regex);
    
            return match ? match[0] : url;
        }
    }
    
}