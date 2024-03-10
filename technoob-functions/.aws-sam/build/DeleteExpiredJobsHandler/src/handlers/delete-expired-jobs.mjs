/**
 * A Lambda function that logs the payload received from a CloudWatch scheduled event.
 */

import { deleteExpiredJobs } from "../Jobs/index.js";
import honeybadger  from '../utils/honeybadger.js';

export const deleteExpiredJobsHandler = async (event, context) => {
    try {
        await deleteExpiredJobs(context);
    } catch (err) {
        console.error(err)
        honeybadger.notify({
            name: "Failed To Trigger Bi-daily Job",
            message: err
    })
    }

}
