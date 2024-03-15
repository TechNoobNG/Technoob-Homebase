
try {
    (async () => {
        const scrape = require("./automations/scraper")
        const rr = await scrape.scrapeJobsIndeed({
            searchTag: "product designer",
                q: 5
        })
        console.log(rr)
    })()
} catch (err){
    console.log(err)
}