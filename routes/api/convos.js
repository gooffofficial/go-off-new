const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
//const Users = require('models/Users');
const db = require('../../models')
const Chat = require('../../models/ChatSchema')
const logger = require('../../logger')
const Room = require('../../models/RoomSchema')
const DM = require('../../models/DMSchema')
const io = require('socket.io-client')
const { body } = require('express-validator');
const _ = require('lodash')
const sgMail = require('@sendgrid/mail')
const twilio = require('twilio')
const cronJob = require('cron')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

var twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

router.post('/create', auth.required, [body('convoTime').escape()], (req, res, next) => {
    const {payload: { id, username } } = req;
    Room.create({
        url: req.body.article
    }, (err, room) => {
        if(err){
            console.log(err)
            return res.status(422).json({
                error: err
            })
        }
        //console.log("IDDDDD "+room._id)
        db.Convo.create({
            article: req.body.article,
            host: id,
            time: req.body.convoTime,
            roomId: ''+room._id,
            title: req.body.convoTitle,
            tz: req.body.tz,
            description: req.body.convoDesc
        }).then((convo) => {
            db.Convo_members.create({
                UserId: id,
                ConvoId: convo.id
            }).then(async () => {
                var u = await db.User.findOne({
                    where: {
                        id: id
                    }
                })

                //set up, schedule, and send 30 min sms reminder in a cron job
                var d = new Date(0)
                //d.setUTCMilliseconds((convo.time.getTime() - (30*60000)))
                d.setUTCMilliseconds((convo.time - (30*60000)))
                console.log("HEEEEYYYY UR PHONE NUMBER IS "+ u.phonenumber+"\n"+process.env.TWILIO_PHONE_NUMBER)
                var textJob = new cronJob.CronJob(d, function() {
                    console.log("TEEEEXXXTTTT\n\n\n\n")
                    twilioClient.messages.create( {to: u.phonenumber,
                        from: process.env.TWILIO_PHONE_NUMBER, 
                        body: "Hi, it's Go Off! We are reminding you that you are hosting a conversation about this article: " + req.body.article + " in 30 minutes.\n\n\
                        Join the conversation at https://go-off.co/chat/"+convo.roomId})
                }, null, true)

                //set up, schedule, and send 30 min email reminder
                //console.log("TIMEEEEEEE " + ((convo.time.getTime() - (30*60000))/1000))
                const msg = {
                    to: u.email,
                    from: 'go.offmedia@gmail.com',
                    subject: "Reminder: You're hosting a convo soon!",
                    text: 'Hello ' + u.firstname + ',\n\n We are reminding you that you\
                    are hosting a convo about this article: ' + req.body.article + ' in 30 minutes (' + req.body.convoTime + ')!\n\
                    Join the conversation at https://go-off.co/chat/'+convo.roomId,
                    //send_at: Math.floor((convo.time.getTime() - (30*60000))/1000)
                    send_at: Math.floor((convo.time - (30*60000))/1000)
                }
                sgMail.send(msg).then(() => {
                    //send confirmation email
                    console.log('Email scheduled to send to ' + username)
                    const msg2 = {
                        to: u.email,
                        from: 'go.offmedia@gmail.com',
                        subject: "You just signed up for a convo!",
                        text: 'Hello ' + u.firstname + ',\n\n You just signed up for a conversation\
                        about this article: ' + req.body.article + ' at ' + convo.time
                    }
                    sgMail.send(msg2).then(() => {
                        return res.redirect('/conversation/?article='+req.body.article)
                    })
                }).catch((error) => {
                    console.log(error)
                    return res.status(422).json({
                        errors: {
                            err: "Something went wrong setting up your reminder email."
                        }
                    })
                })             
            })
        })
    })
})

router.post('/join', auth.required, [body('convo').escape()], (req, res, next) => {
    const {payload: {id, username}} = req;
    db.Convo_members.create({
        UserId: id,
        ConvoId: req.body.convo
    }).then(async (cm) => {
        var u = await db.User.findOne({
            where: {
                id: id
            }
        })
        var convo = await db.Convo.findOne({
            where: {
                id: req.body.convo
            }
        })
        //set up, schedule, and send 30 min reminder sms using cron job

        //TODO: Fix Date in the past Warning message after reminder text is sent to
        // participant
        var d = new Date(0)
        //d.setUTCMilliseconds((convo.time.getTime() - (30*60000)))
        d.setUTCMilliseconds((convo.time - (30*60000)))
        var textJob = new cronJob.CronJob(d, function() {
            console.log("TEEEEXXXTTTT\n\n\n\n")
            twilioClient.messages.create( {to: u.phonenumber,
                from: process.env.TWILIO_PHONE_NUMBER, 
                body: "Hi, it's Go Off! We are reminding you that you have a conversation about this article: " + convo.article + " in 30 minutes.\n\n\
                Join the conversation at https://go-off.co/chat/"+convo.roomId})
        }, null, true)

        //set up, schedule and send 30 min reminder email
        const msg = {
            to: u.email,
            from: 'go.offmedia@gmail.com',
            subject: "Reminder: You're in a convo soon!",
            text: 'Hello ' + u.firstname + ',\n\n We are reminding you that you\
            are signed up for a convo about this article: ' + convo.article + ' in 30 minutes (' + req.body.convo.time + ')!\n\
            Join the conversation at https://go-off.co/chat/'+convo.roomId,
            //send_at: Math.floor((convo.time.getTime() - (30*60000))/1000)
            send_at: Math.floor((convo.time - (30*60000))/1000)
        }

        //send confirmation email
        sgMail.send(msg).then(() => {
            console.log('Email scheduled to send to ' + username)
            const msg2 = {
                to: u.email,
                from: 'go.offmedia@gmail.com',
                subject: "You just signed up for a convo!",
                text: 'Hello ' + u.firstname + ',\n\n You just signed up for a conversation\
                about this article: ' + req.body.article + ' at ' + convo.time
            }
            sgMail.send(msg2).then(() => {
                return res.status(200)
            })
        }).catch((error) => {
            console.log(error.response.body.errors)
            return res.status(422).json({
                errors: {
                    err: "Something went wrong setting up your reminder email."
                }
            })
        }) 
    })
})

module.exports = router;