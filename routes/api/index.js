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
        article1title: "Live Presidential Debate",
        article1img: "https://gooff.s3.us-east-2.amazonaws.com/image_from_ios.jpg",
        article1author: '',
        article1link: "https://www.youtube.com/watch?v=Wc51SmOcaXI&feature=youtu.be",
        article2title: "Disney is now a streaming company",
        article2img: 'https://cms.qz.com/wp-content/uploads/2020/10/disney-the-mandalorian-disney-e1602605068688.jpg?quality=75&strip=all&w=1400',
        article2author: 'Adam Epstein',
        article2link: 'https://qz.com/1916923/recent-changes-at-disney-prioritize-hulu-disney-and-espn/',
        artice3title: 'The Startup Helping EVs Balance Out the Renewables That Power Them',
        article3img: "https://www.greentechmedia.com/assets/content/cache/made/assets/content/cache/remote/https_assets.greentechmedia.com/content/images/articles/Charging_EVs_Infrastructure_XL_500_281_80.jpg",
        article3author: 'John Parnell',
        article3link: "https://www.greentechmedia.com/articles/read/how-european-evs-are-balancing-out-the-renewables-that-power-them"
    },
    {
        where: {
            article1link: 'https://thesweatypenguin.com/wp-content/uploads/2020/10/FULL-ADHD.mp3'
        }
    }).then(() => {
        return res.sendStatus(200);
    })
})
*/
module.exports = router;