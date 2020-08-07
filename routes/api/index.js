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

module.exports = router;