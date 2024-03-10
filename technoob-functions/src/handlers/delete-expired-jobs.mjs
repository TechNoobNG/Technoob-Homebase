/**
 * A Lambda function that logs the payload received from a CloudWatch scheduled event.
 */

import { deleteExpiredJobs } from "../Jobs/index.js";
import honeybadger  from '../utils/honeybadger.js';

export const deleteExpiredJobsHandler = async (event, context) => {
    try {
        await deleteExpiredJobs(context);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Triggered successfully' }),
        };
    } catch (err) {
        console.error(err)
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }

}
