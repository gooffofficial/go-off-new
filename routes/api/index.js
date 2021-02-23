const express = require('express');
const router = express.Router();
const auth = require('../auth');
const crawler = require('../../apify/crawler')
const db = require('../../models')

router.use('/users', require('./users'));
router.use('/chat', require('./chat'))
router.use('/convos', require('./convos'))

router.get('/folders', auth.required, (req, res, next) => {
    const {payload: {id}} = req;
    db.Folder.findAll({
        where: {
            UserId: id
        }
    }).then((folders) => {
        return res.json(folders)
    })
})

router.get('/savedarts', auth.required, (req, res, next) => {
    const {payload: {id}} = req; 
    var foldname = req.query.namez;
    console.log("AHHHHHHHHHHHHHHHHHHHHHHHHHHH", foldname, id);
    db.Folder.findOne({
        where: {
            foldername: foldname, 
            UserId: id
        }
    }).then((folder) => {return res.json({id: folder.id})})
    // db.Folder.findAll({
    //     where:{
    //         UserId: id,
    //         foldername: foldname
    //     }
    // }).then((articles) => {
    //     return res.json(articles)
    // })
})
/*
router.get('/update_article', auth.optional, (req,res, next) => {
    db.Profile.update({
        article1title: "It's the day before Election Day",
        article1img: "https://cdn.cnn.com/cnnnext/dam/assets/201030082605-04-trump-biden-election-night-split-super-tease.jpg",
        article1author: 'CNN',
        article1link: "https://www.cnn.com/politics/live-news/us-election-news-11-02-2020/index.html",
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