const Apify = require('apify')

async function testCrawl(url){
    const requestQueue = await Apify.openRequestQueue();

    await requestQueue.addRequest({url: url});

    const handlePageFunction = async({ request, $ }) => {
        const title = $('title').text();

        console.log(`The title of "${request.url}" is: ${title}.`);
    }

    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        handlePageFunction,
    });

    await crawler.run();
}
module.exports = testCrawl;