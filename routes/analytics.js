const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');
//const Users = require('models/Users');
const db = require('../models')
const {spawn} = require('child_process');

router.get('/:chat', auth.required, (req, res, next) => {
    const { payload: { id } } = req;
    return db.User.findOne({
        where: {
            id: id
        }
    }).then((user) => {
        var userInfo = user.getUserInfo();
        if (user.admin != "(Admin)"){
            return res.sendStatus(401).json({"Err":"Unauthorized"})
        }
        db.Analytics.findOne({
            where: {
                id: req.params.chat
            }
        }).then((analysis) => {
            if(!analysis){
                var python = spawn('python3', ['./data-analysis/vanity.py', req.params.chat]);
                python.stderr.on('data', function (data){
                    console.log(data.toString())
                    return res.json({"Err": "Somehing went wrong with you analysis"})
                });            
                python.stdout.on('data', (data) => {
                    console.log(data.toString())
                    python2 = spawn('python3', ['./data-analysis/nlp_testclean.py', req.params.chat])
                    python2.stderr.on('data', function (data) {
                        console.log(data.toString())
                        return res.json({"Err": "Something went wrong with your analysis"})
                    })
                    python2.stdout.on('data', function(data) {
                        console.log(data.toString());
                        return res.redirect('/analytics/'+req.params.chat);
                    })
                });
            }
            else{
                res.render('metrics', {data: analysis.getData(), room:req.params.chat})
            }
        })
    })
})
module.exports = router;