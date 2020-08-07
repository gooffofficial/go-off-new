const Apify = require('apify')
const db = require('../models')

async function testCrawl(url){
    const requestQueue = await Apify.openRequestQueue();

    await requestQueue.addRequest({url: url});

    const handlePageFunction = async({ request, $ }) => {
        const title = $('title').text();
        const img = $('img').attr("src");
        
        //getting the word count of the webpage to calculate the read time
        const len = $('body').text().split(' ').length;

        //readtime calulcated by dividing word count by 200(average reading speed)
        //depending on website article is from, it may be inaccurate because a lot of miscellaneous info is included
        const readTime = len/200;
        console.log(`The title of "${request.url}" is: ${title}.\nThe image is ${img}\nWord Count is ${len}
        \nIt will take about ${readTime} minutes to read.`);

        db.Article.create({
            url: request.url,
            title: title,
            img: img,
            readTime: readTime
        })
    }

    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        handlePageFunction,
    });

    await crawler.run();
}
module.exports = testCrawl;