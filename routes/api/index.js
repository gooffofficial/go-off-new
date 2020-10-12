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
        article1title: "2020 Presidential Debate",
        article1img: 'https://static01.nyt.com/images/2020/09/30/multimedia/30elections-briefing-debates3/merlin_177807387_607b7b41-4fa3-438d-8a63-2daf4b7a899c-superJumbo.jpg?quality=90&auto=webp',
        article1author: '',
        article1link: 'https://www.nytimes.com/live/2020/09/30/us/presidential-debate'
    },
    {
        where: {
            article1link: 'https://www.nytimes.com/2020/09/15/technology/instagram-freeze-facebook.html'
        }
    }).then(() => {
        return res.sendStatus(200);
    })
})
*/
module.exports = router;