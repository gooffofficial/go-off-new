const express = require('express');
const router = express.Router();
const auth = require('../auth');
const crawler = require('../../apify/crawler')
const db = require('../../models')

router.use('/users', require('./users'));
router.use('/chat', require('./chat'))

//move to users.js file
router.post('/add_article1', auth.required, (req, res, next) => {
    const { payload: { id } } = req;
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
            //return res.json({
            //    "created": true
            //})
        }
        db.UserArticle.findOne({
            where: {
                UserId: id
            }
        }).then((userArticle) => {
            if(!userArticle){
                db.UserArticle.create({
                    UserId: id,
                    article1: req.body.article
                })
            }
            else{
                db.UserArticle.update({
                    article1: req.body.article
                },
                {
                    where:
                    {
                        userId: id
                    }
                })
            }
        })
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
        article2title: "DFP | Restaurants brace for winter",
        article2img: 'https://dailyfreepress.com/wp-content/uploads/image1-27-431x288.jpg',
        article2author: 'Daniel Kool',
        article2link: 'https://dailyfreepress.com/2020/10/22/restaurants-brace-for-cold-weather-after-summer-of-outdoor-dining/',
        artice3title: 'The Startup Helping EVs Balance Out the Renewables That Power Them',
        article3img: "https://www.greentechmedia.com/assets/content/cache/made/assets/content/cache/remote/https_assets.greentechmedia.com/content/images/articles/Charging_EVs_Infrastructure_XL_500_281_80.jpg",
        article3author: 'John Parnell',
        article3link: "https://www.greentechmedia.com/articles/read/how-european-evs-are-balancing-out-the-renewables-that-power-them"
    },
    {
        where: {
            article1link: 'https://thesweatypenguin.com/wp-content/uploads/2020/10/FINAL-LIGHT-POLLUTION.mp3'
        }
    }).then(() => {
        return res.sendStatus(200);
    })
})
*/
module.exports = router;