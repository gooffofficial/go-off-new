const express = require('express');
const router = express.Router();
const auth = require('../auth');
const crawler = require('../../apify/crawler')

router.use('/users', require('./users'));
router.use('/chat', require('./chat'))

router.post('/add_article', auth.required, (req, res, next) => {
    try{
        crawler(req.body.article)
    }
    catch(err){
        return res.send(err);
    }
    res.sendStatus(200);
})

module.exports = router;