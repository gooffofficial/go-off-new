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
const schedule = require('node-schedule');
const crawler = require('../../apify/crawler')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

var twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

router.post('/create', auth.required, [body('convoTime').escape()], (req, res, next) => {
    const {payload: { id, username } } = req;
    // Create Chat room from the article
    Room.create({
        url: req.body.article
    }, async (err, room) => {
        if(err){
            console.log(err)
            console.log("ERRORRRERRORERRORERRORERRORERRORERROR")
            return res.status(422).json({
                error: err
            })
        }
        // Find the article in the database
        var userC = await db.Article.findOne({
            where: {
                url: req.body.article
            }
        });
        // If article not already in database, then scrape and add to database
        if (!userC){
            crawler(req.body.article)
        }
        //console.log("IDDDDD "+room._id)
        // Create conversation in database
        console.log(req.body)
        db.Convo.create({
            article: req.body.article,
            host: id,
            time: req.body.convoTime,
            roomId: ''+req.body.roomId,
            title: req.body.convoTitle,
            tz: req.body.tz,
            description: req.body.convoDesc
        }).then((convo) => {
            // Add host to convo member list
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
                // var d = new Date(0)
                //d.setUTCMilliseconds((convo.time.getTime() - (30*60000)))
                // Set trigger time to be 30 min before convo
                // d.setUTCMilliseconds((convo.time - (60*1000/*60000*/)))
                // if (Date.now() < convo.time - (60*1000/*30*160000*/)){
                    // console.log("HEEEEYYYY UR PHONE NUMBER IS "+ u.phonenumber+"\n"+process.env.TWILIO_PHONE_NUMBER)
                //     var textJob = new cronJob.CronJob(d, function() {
                //         console.log("TEEEEXXXTTTT\n\n\n\n")
                //         twilioClient.messages.create({
                //             to: u.phonenumber,
                //             from: process.env.TWILIO_PHONE_NUMBER, 
                //             body: "Hi, it's Go Off! We are reminding you that you are hosting a conversation about this article: " + req.body.article + " in 30 minutes.\n\n\
                //             Join the conversation at https://go-off.co/chat/"+convo.roomId})
                //         })
                //     , null, true)
                // }
                console.log('TIME OF CHAT IS: ' + convo.time)
                let dateConvoTime = (Number(convo.time))
                console.log('UPDATED TIME OF CHAT IS: ', dateConvoTime)
                let dateConvoTime30minsBefore = (dateConvoTime - 30 * 60*1000)
                console.log('UPDATED TIME OF CHAT IS: ', dateConvoTime30minsBefore)

                // SMS about joining conversation
                twilioClient.messages.create({
                  to: u.phonenumber,
                  from: process.env.TWILIO_PHONE_NUMBER, 
                  body: 'Hello ' + u.firstname + ',\n\n You just signed up for a conversation ' +
                  'about this article: ' + convo.article + ' at ' + new Date(dateConvoTime)
                })

                // 30 min SMS reminder
                schedule.scheduleJob(dateConvoTime30minsBefore, () => {
                  twilioClient.messages.create({
                    to: u.phonenumber,
                    from: process.env.TWILIO_PHONE_NUMBER, 
                    body: "Hi, it's Go Off! We are reminding you that you are hosting a conversation about this article: " + req.body.article + " in 30 minutes.\n\n\
                    Join the conversation at https://go-off.co/chat/"+ convo.roomId
                  })
                });

                //set up, schedule, and send 30 min email reminder
                //console.log("TIMEEEEEEE " + ((convo.time.getTime() - (30*60000))/1000))
                const msg = {
                    to: u.email,
                    from: 'go.offmedia@gmail.com',
                    subject: "Reminder: You're hosting a convo soon!",
                    text: 'Hello ' + u.firstname + ',\n\n We are reminding you that you\
                    are hosting a convo about this article: ' + req.body.article + ' in 30 minutes (' + new Date(dateConvoTime) + ')!\n\
                    Join the conversation at https://go-off.co/chat/ '+ convo.roomId,
                    //send_at: Math.floor((convo.time.getTime() - (30*60000))/1000)
                    send_at: Math.floor(dateConvoTime30minsBefore / 1000) // send_at requires unix time in seconds, so we / 1000 to seconds
                }
                sgMail.send(msg).then(() => {
                    //send confirmation email
                    console.log('Email scheduled to send to ' + username)
                    const msg2 = {
                        to: u.email,
                        from: 'go.offmedia@gmail.com',
                        subject: "You just signed up for a convo!",
                        text: 'Hello ' + u.firstname + ',\n\n You just signed up for a conversation\
                        about this article: ' + req.body.article + ' at ' + new Date(dateConvoTime)
                    }
                    sgMail.send(msg2).then(() => {
                      // return res.redirect('/conversation/?article='+req.body.article)
                      return res.json({ redirect: '/conversation/?article='+req.body.article })
                    }).catch(err => {
                      console.log("err: ", err)
                      return res.status(422).json({ errors: { error: "Something went wrong setting up your reminder email." } })
                    })
                }).catch((error) => {
                    console.log("error: ", error)
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
    // Add user to convo member list

    // You probably should add checking if the person is already in the conversion to add him again
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
        // var d = new Date(0)
        // Set trigger time to 30 min before convo
        //d.setUTCMilliseconds((convo.time.getTime() - (30*60000)))
        // d.setUTCMilliseconds((convo.time - (30*60000)))
        // if (Date.now() < (convo.time - (30*60000))){
        //     var textJob = new cronJob.CronJob(d, function() {
        //         console.log("TEEEEXXXTTTT\n\n\n\n")
        //         twilioClient.messages.create( {to: u.phonenumber,
        //             from: process.env.TWILIO_PHONE_NUMBER, 
        //             body: "Hi, it's Go Off! We are reminding you that you have a conversation about this article: " + convo.article + " in 30 minutes.\n\n\
        //             Join the conversation at https://go-off.co/chat/"+convo.roomId})
        //     }, null, true)
        // }

        let dateConvoTime = new Date(Number(convo.time)) 
        let dateConvoTime30minsBefore = new Date(dateConvoTime.getTime() - 30 * 60*1000)

        // SMS about joining conversation
        twilioClient.messages.create({
          to: u.phonenumber,
          from: process.env.TWILIO_PHONE_NUMBER, 
          body: 'Hello ' + u.firstname + ',\n\n You just signed up for a conversation ' +
          'about this article: ' + convo.article + ' at ' + dateConvoTime.toString()
        })

        // 30 min SMS reminder
        schedule.scheduleJob(dateConvoTime30minsBefore, () => {
          twilioClient.messages.create({
            to: u.phonenumber,
            from: process.env.TWILIO_PHONE_NUMBER, 
            body: "Hi, it's Go Off! We are reminding you that you have a conversation about this article: " + convo.article + " in 30 minutes.\n\n\
            Join the conversation at https://go-off.co/chat/"+convo.roomId
          })
        });

        //set up, schedule and send 30 min reminder email
        const msg = {
            to: u.email,
            from: 'go.offmedia@gmail.com',
            subject: "Reminder: You're in a convo soon!",
            text: 'Hello ' + u.firstname + ',\n\n We are reminding you that you\
            are signed up for a convo about this article: ' + convo.article + ' in 30 minutes (' + dateConvoTime.toString() + ')!\n\
            Join the conversation at https://go-off.co/chat/'+convo.roomId,
            // send_at: Math.floor((convo.time - (30*60000))/1000)
            send_at: Math.floor(dateConvoTime30minsBefore.getTime() / 1000)
        }

        // Email about joining conversation
        sgMail.send(msg).then(() => {
            console.log('Email scheduled to send to ' + username)
            const msg2 = {
                to: u.email,
                from: 'go.offmedia@gmail.com',
                subject: "You just signed up for a convo!",
                text: 'Hello ' + u.firstname + ',\n\n You just signed up for a conversation ' +
                'about this article: ' + convo.article + ' at ' + dateConvoTime.toString()
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