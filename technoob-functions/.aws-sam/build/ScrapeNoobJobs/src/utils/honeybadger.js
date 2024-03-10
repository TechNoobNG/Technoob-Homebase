import config from './config.js';
const env = config.NODE_ENV
import Honeybadger from '@honeybadger-io/js';

export default Honeybadger.configure({
    apiKey: config.HONEYBADGER_KEY,
    environment: env
});
