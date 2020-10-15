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
        article1title: "BU College Republicans receive backlash over statement against Kendi tweets",
        article1img: 'https://dailyfreepress.com/wp-content/uploads/image8-6-431x299.jpg',
        article1author: 'Nathan Lederman',
        article1link: 'https://dailyfreepress.com/2020/10/04/bu-college-republicans-receive-backlash-over-statement-against-kendi-tweets/'
    },
    {
        where: {
            article1link: 'https://www.nytimes.com/live/2020/09/30/us/presidential-debate'
        }
    }).then(() => {
        return res.sendStatus(200);
    })
})
*/
module.exports = router;