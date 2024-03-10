import * as queue from '../utils/aws_queue.js';
import * as automations from '../automations/scraper.js';
import * as scraperLog from "../utils/scraperLog.js";
import config from '../utils/config.js';
import * as functionsToTest from './index.js';
import { jest } from '@jest/globals';

console.log(queue)
jest.mock('../utils/aws_queue.js', () => ({
  sendMessage: jest.fn()
}));
jest.mock('../automations/scraper.js');
jest.mock("../utils/scraperLog.js");
jest.mock('../utils/config.js');

describe('deleteExpiredJobs', () => {
    it('should send a message to delete expired jobs', async () => {
        //const sendMessageSpy = jest.spyOn(queue, 'sendMessage');

        // await functionsToTest.deleteExpiredJobs();

        // expect(queue.sendMessage).toHaveBeenCalledWith({
        //     name: 'deleteExpiredJobs',
        //     import: '../services/jobs',
        //     method: 'deleteExpiredJobs'
        // });
    });

    // it('should throw an error if sendMessage fails', async () => {
    //     const errorMessage = 'mock error message';
    //     jest.spyOn(queue, 'sendMessage').mockRejectedValue(new Error(errorMessage));

    //     await expect(deleteExpiredJobs()).rejects.toThrow(errorMessage);
    // });
});