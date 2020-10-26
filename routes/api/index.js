const express = require('express');
const router = express.Router();
const auth = require('../auth');
const crawler = require('../../apify/crawler')
const db = require('../../models')

router.use('/users', require('./users'));
router.use('/chat', require('./chat'))

router.post('/add_article', auth.required, (req, res, next) => {
    db.Article.findOne({
        where: {
            url: req.body.article
        }
    }).then((art) => {
        if(!art){
            try{
                crawler(req.body.article)
            }
            catch(err){
                return res.send(err);
            }
            return res.json({
                "created": true
            })
        }
        return res.sendStatus(200);
    })
})

/*
router.get('/update_article', auth.optional, (req,res, next) => {
    db.Profile.update({
        article1title: "The Sweaty Penguin Podcast - Light Pollution",
        article1img: "https://gooff.s3.us-east-2.amazonaws.com/download.jpg",
        article1author: 'The Sweaty Penguin',
        article1link: "https://thesweatypenguin.com/wp-content/uploads/2020/10/FINAL-LIGHT-POLLUTION.mp3",
        article2title: "Winter COVID Outlook",
        article2img: 'https://storage.googleapis.com/afs-prod/media/2dc3dd691b834d28a6a6ede51a39d6c6/800.jpeg',
        article2author: 'Raf Casert',
        article2link: 'https://apnews.com/article/business-virus-outbreak-brussels-belgium-europe-7203f0b4e05e9d31e6ae63b88d424423',
        artice3title: 'The Startup Helping EVs Balance Out the Renewables That Power Them',
        article3img: "https://www.greentechmedia.com/assets/content/cache/made/assets/content/cache/remote/https_assets.greentechmedia.com/content/images/articles/Charging_EVs_Infrastructure_XL_500_281_80.jpg",
        article3author: 'John Parnell',
        article3link: "https://www.greentechmedia.com/articles/read/how-european-evs-are-balancing-out-the-renewables-that-power-them"
    },
    {
        where: {
            article2link: 'https://qz.com/1916923/recent-changes-at-disney-prioritize-hulu-disney-and-espn/'
        }
    }).then(() => {
        return res.sendStatus(200);
    })
})
*/
module.exports = router;