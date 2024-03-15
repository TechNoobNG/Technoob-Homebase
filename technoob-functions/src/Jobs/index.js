import JobLogger from "../utils/scraperLog.js";
import * as queue from '../utils/aws_queue.js';
import config from '../utils/config.js';
import scrapeJobsIndeed from '../automations/scraper.js';
import scrapeJobsJobberman from '../automations/scraper.js'

export async function deleteExpiredJobs() {
    try {
        await queue.sendMessage({
            name: "deleteExpiredJobs",
            import: "../../services/jobs",
            service: "jobs",
            method: "deleteExpiredJobs"
        });
    } catch (err) {
        throw err;
    }
}

export async function scrapeJobs(q, posted, expires) {
    try {
        const stackKeywords = config.SCRAPE_STACK_KEYWORDS || [
            "junior product designer",
            "junior ui/ux designer",
            "junior product manager",
            "junior project manager",
            "junior scrum master",
            "junior cloud engineer",
            "junior devops engineer",
            "junior backend",
            "junior frontend",
            "junior android developer",
            "junior ios developer",
            "junior software engineer",
            "junior QA",
            "Junior customer Service",
            "Junior customer support",
            "intern product designer",
            "intern ui/ux designer",
            "intern product manager",
            "intern project manager",
            "intern scrum master",
            "intern cloud engineer",
            "intern devops engineer",
            "intern backend",
            "intern frontend",
            "intern android developer",
            "intern ios developer",
            "intern software engineer",
            "intern QA",
            "intern customer Service",
            "intern customer support",
        ];

        const allowedContractTypes = ["full-time", "contract", "internship", "part-time", "gig"];
        const dataUpload = [];
        const scraperLogger = new JobLogger(stackKeywords, expires, "indeedNG");

        for (const keyword of stackKeywords) {
            try {
                scraperLogger.start(keyword, "initiated");
                const result = await scrapeJobsIndeed({
                    searchTag: keyword,
                    q: q * 1
                });

                scraperLogger.end(keyword, "completed");

                result.forEach((scrapedJob) => {
                    if (scrapedJob.posted * 1 > 5) {
                        const insertJobObj = {
                            title: scrapedJob.title,
                            company: scrapedJob.company,
                            exp: "N/A",
                            location: `${scrapedJob.location}, Nigeria`,
                            workplaceType: scrapedJob.workplaceType || "onsite",
                            contractType: allowedContractTypes.includes(scrapedJob.type?.toLowerCase()) ? scrapedJob.type?.toLowerCase() : "full-time",
                            datePosted: new Date(),
                            expiryDate: new Date(),
                            link: scrapedJob.link || "https://ng.indeed.com",
                            poster: scrapedJob.poster,
                            uploader_id: "64feb85db96fbbd731c42d5f",
                        };

                        insertJobObj.expiryDate.setDate(insertJobObj.datePosted.getDate() + expires);
                        dataUpload.push(insertJobObj);
                    }
                });

                const uniqueJobsArray = Array.from(new Set(dataUpload.map(JSON.stringify)), JSON.parse);

                if (uniqueJobsArray.length) {
                    await queue.sendMessage({
                        name: "createScrapedJobs",
                        import: "../../services/jobs",
                        service: "jobs",
                        method: "createScrapedJobs",
                        data: {
                            uniqueJobsArray
                        }
                    });
                }
            } catch (error) {
                console.log("Failed to scrape Job:",error);
                scraperLogger.end(keyword, "failed", error.message);
            }
        }

        scraperLogger.complete();
    } catch (error) {
        scraperLogger.end(keyword, "failed", error.message || JSON.stringify(error));
        throw error;
    }
}
export async function scrapeJobbermanJobs(q, posted, expires) {
    try {
        const stackKeywords = [
            "product designer",
            "ui/ux designer",
            "product manager",
            "project manager",
            "scrum master",
            "cloud ",
            "devops ",
            "backend",
            "frontend",
            "android developer",
            "ios developer",
            "software engineer",
            "QA",
            "fullstack",
            "customer service",
            "customer support",
            
        ]
        const allowedContractTypes = ["full-time", "contract","internship","part-time","gig"]

        let result = []
        let insertJobObj = {}
        let dataUpload = []
        const scraperLogger = new JobLogger(stackKeywords,expires,"jobberman")
        
        const scrapeJobberman = async (keyword, q, exp) => {
            return scrapeJobsJobberman({
                searchTag: keyword,
                q: q * 1,
                exp: exp
            });
        };
        
        for (let keyword of stackKeywords) {
            try {
                scraperLogger.start(keyword,"initiated")
                const runner = async (keyword, q) => {
                    const results = [];
                    results.push(await scrapeJobberman(keyword, q, "graduate-trainee"));
                    results.push(await scrapeJobberman(keyword, q, "mid-level"));
                    return results.flat();
                };
                result = await runner(keyword,q)
                scraperLogger.end(keyword,"completed")
                result.forEach((scrapedJob) => {
                    if (scrapedJob.posted * 1 > 5) {
                        insertJobObj.title = scrapedJob.title;
                        insertJobObj.company = scrapedJob.company;
                        insertJobObj.exp = "N/A";
                        insertJobObj.location = `${scrapedJob.location}, Nigeria`;
                        insertJobObj.workplaceType = scrapedJob.workplaceType || "onsite";
                        insertJobObj.contractType = allowedContractTypes.includes(scrapedJob.type?.toLowerCase()) ?  scrapedJob.type?.toLowerCase() : "full-time";
                        insertJobObj.datePosted = new Date();
                        insertJobObj.expiryDate = new Date(insertJobObj.datePosted);
                        insertJobObj.expiryDate.setDate(insertJobObj.datePosted.getDate() + expires);
                        insertJobObj.link = scrapedJob.link || "https://ng.indeed.com";
                        insertJobObj.poster = scrapedJob.poster;
                        insertJobObj.uploader_id = "64feb85db96fbbd731c42d5f"
                    }

                    if (JSON.stringify(insertJobObj) !== '{}') dataUpload.push(insertJobObj);
                });
                let uniqueJobSet = new Set();
                dataUpload.forEach((obj) => {
                    uniqueJobSet.add(JSON.stringify(obj));
                });

                let uniqueJobsArray = Array.from(uniqueJobSet, JSON.parse);
             
                if (uniqueJobsArray.length) {
                    await queue.sendMessage({
                        name: "createScrapedJobs",
                        import: "../../services/jobs",
                        method: "createScrapedJobs",
                        service: "jobs",
                        data: {
                            uniqueJobsArray
                        }
                })}
            } catch (error) {
                scraperLogger.end(keyword,"failed",error.message)
                console.log(error)
            }

        }
        scraperLogger.complete();
    } catch (error) {
        console.log(error)
        throw error
    }

}

export async function scrapeJobsV2() {
    try {
        await queue.sendMessage({
            name: "scrapeNoobJobs",
            import: "../../services/jobs",
            service: "jobs",
            method: "scrapeNoobJobs"
        });
    } catch (err) {
        throw err;
    }
}

