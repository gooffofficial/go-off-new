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
                  body: 'Your convo is scheduled for ' + new Date(dateConvoTime) + '! Drop this link to your friends, fans, (and enemies) to invite them to RSVP: https://go-off.co/profile/' + u.username
                })

                // 30 min SMS reminder
                schedule.scheduleJob(dateConvoTime30minsBefore, () => {
                  twilioClient.messages.create({
                    to: u.phonenumber,
                    from: process.env.TWILIO_PHONE_NUMBER, 
                    body: 'The countdown is starting now.... your convo will start in 30 minutes! We will see you in the convo room in 25!'
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

router.post('/joinnotifs/:convoId', auth.required, [body('convo').escape()], async (req, res, next) => {
    // const {payload: {id, username}} = req;
    // Add user to convo member list

    // You probably should add checking if the person is already in the conversion to add him again
        console.log("Notif Testing!")
        console.log(req.body)
        let host = await db.User.findOne({
            where: {
                id: req.body.hostid
            }
        })
        let user = await db.User.findOne({
            where: {
                id: req.body.userid
            }
        })
        console.log("user data : " , user)

        // let convo = db.Convo.findOne({
        //     where: {
        //         roomId: req.body.roomId
        //     }
        // })
        let dateConvoTime = new Date(Number(req.body.time)) 
        let dateConvoTime30minsBefore = new Date(dateConvoTime.getTime() - 30 * 60*1000)
       
        twilioClient.messages.create({
            to: host.phonenumber,
            from: process.env.TWILIO_PHONE_NUMBER, 
            body: user.username + ' has saved a spot in your convo, "' + req.body.convTitle + '!"'
        })

        // SMS about joining conversation
        twilioClient.messages.create({
            to: req.body.userPnum,
            from: process.env.TWILIO_PHONE_NUMBER, 
            body: 'Ready to go off? See you on Go Off! at '+ dateConvoTime.toString() + ' for ' + req.body.convTitle + '!'
        })

        // 30 min SMS reminder
        schedule.scheduleJob(dateConvoTime30minsBefore, () => {
        twilioClient.messages.create({
            to: req.body.userPnum,
            from: process.env.TWILIO_PHONE_NUMBER, 
            body: req.body.convTitle + ' starts in 30 minutes! Be there or be square, the convo waits for no one! '
        })
        });

        //set up, schedule and send 30 min reminder email
        const msg = {
            to: req.body.useremail,
            from: 'go.offmedia@gmail.com',
            subject: "Reminder: You're in a convo soon!",
            text: req.body.convTitle + ' starts in 30 minutes! Be there or be square, the convo waits for no one!',
            send_at: Math.floor(dateConvoTime30minsBefore.getTime() / 1000)
        }

        // Email about joining conversation
        sgMail.send(msg).then(() => {
            // console.log('Email scheduled to send to ' + u.username)
            const msg2 = {
                to: req.body.useremail,
                from: 'go.offmedia@gmail.com',
                subject: "You just signed up for a convo!",
                text: 'Ready to chat? See you on Go Off! at '+ dateConvoTime.toString() + ' for ' + req.body.convTitle + '!'
            }
            sgMail.send(msg2).then(() => {
                console.log("email sended")
            })
        }).catch((error) => {
            console.log(error)
            console.log("Something went wrong setting up your reminder email.")
            })
})


module.exports = router;