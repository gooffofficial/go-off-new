import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import s from '../styles/HomePage/HostHome.module.scss'; // s = styles
import NYTLogo from '../images/liveChatImages/NYT-Logo.png'
import emilyIcon from '../images/liveChatImages/emily-profile-icon.png'
import dots3Icon from '../images/liveChatImages/dots3.png'
import bookmarkIcon from '../images/bookmark.svg'
import firebase from '../firebase.js';
import { useHistory } from 'react-router-dom';
import {Link} from 'react-router-dom'

// const schedule = require('node-schedule');

// const twilio = require('twilio')
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// console.log(process.env.SENDGRID_API_KEY)
// const accountSid = process.env.TWILIO_ACCOUNT_SID
// const authToken = process.env.TWILIO_AUTH_TOKEN
// console.log(accountSid, authToken)
// var twilioClient = require('twilio')(accountSid, authToken);
//*! remove the 10 person limit to rsvp turn it into notification system

const Conversation = (props,{ userid }) => {

  let convoId = props.roomId
  let dummyId = props.userid
  let history = useHistory()
  let link = useRef();
  const [copied, setCopied] = useState(false)
  const [show, setShow] = useState(false)

  // console.log(props)
  const gtcbuttonhandler = (e) => {
    history.push(`/chat/${convoId}`)
  }
  const db = firebase.firestore();

    const rsvpbuttonhandler = (e) => {
        e.preventDefault();
        console.log("test")
        console.log(props)
        db.collection('Conversations').where('convoId','==', convoId).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              let data = doc.data();
              let rsvp = data.rsvp;
              console.log(rsvp, rsvp.length)
              console.log(data)
              if(data.hostId==userid){
                return console.log('is already host')
              }
              if(!rsvp.includes(userid)){
              rsvp.push(dummyId)
              //window.alert("Succesfully RSVP'd! Tell your friends to check out your profile page to RSVP.")
              setShow(true)
              setTimeout(()=>setShow(false),10000)
                
              //notifications
              console.log("notif test")
              console.log(props)
              axios.post(`${process.env.REACT_APP_NODE_API}/api/convos/joinnotifs/${convoId}`, props, {withCredentials:true})
              // let dateConvoTime = new Date(Number(props.time)) 
              // let dateConvoTime30minsBefore = new Date(dateConvoTime.getTime() - 30 * 60*1000)

              // // SMS about joining conversation
              // twilioClient.messages.create({
              //   to: props.phonenum,
              //   from: process.env.TWILIO_PHONE_NUMBER, 
              //   body: 'Ready to chat? See you on Go Off! at '+ dateConvoTime.toString() + ' for ' + props.convTitle + '!'
              // })

              // // 30 min SMS reminder
              // schedule.scheduleJob(dateConvoTime30minsBefore, () => {
              //   twilioClient.messages.create({
              //     to: props.phonenum,
              //     from: process.env.TWILIO_PHONE_NUMBER, 
              //     body: props.convTitle + ' starts in 30 minutes! Be there or be square, the convo waits for no one!'
              //   })
              // });

              // //set up, schedule and send 30 min reminder email
              // const msg = {
              //     to: props.email,
              //     from: 'go.offmedia@gmail.com',
              //     subject: "Reminder: You're in a convo soon!",
              //     text: props.convTitle + ' starts in 30 minutes! Be there or be square, the convo waits for no one!',
              //     send_at: Math.floor(dateConvoTime30minsBefore.getTime() / 1000)
              // }

              // // Email about joining conversation
              // sgMail.send(msg).then(() => {
              //     console.log('Email scheduled to send to ' + props.username)
              //     const msg2 = {
              //         to: props.email,
              //         from: 'go.offmedia@gmail.com',
              //         subject: "You just signed up for a convo!",
              //         text: 'Ready to chat? See you on Go Off! at '+ dateConvoTime.toString() + ' for ' + props.convTitle + '!'
              //     }
              //     sgMail.send(msg2).then(() => {
              //         console.log("error sending email")
              //     })
              // }).catch((error) => {
              //     console.log(error.response.body.errors)
              //     console.log("Something went wrong setting up your reminder email.")
              //     })
              db.collection('Conversations').doc(doc.id).update({ rsvp:rsvp }).then(res => console.log('successfully rsvpd')).catch(err => console.log(err))
            }else{
              console.log('already rsvpd')
            }
              console.log(doc.id, " => ", doc.data());
          });

      }).catch(err => console.log(err));
      // twilioClient.messages.create({
      //   to: hostNum,
      //   from: process.env.TWILIO_PHONE_NUMBER, 
      //   body: 'Hello ' + hostName + ', A user just RSVPd to your conversation: ' + convTitle + '.'
      // })
      };
  
      const { articleImg, articleURL, time, hostName, roomId, convTitle, desc, userpfp, hostUName} = props;
      // console.log(time)
    //   const month = new Date(time)
    //   const date = new Date(time)
    //   const month1 = Date(time)
    //   const date1 = Date(time)
    //   console.log(month, date)
    //   console.log(month1, date1)
    let UTCTime = parseInt(time);
    let newTime = new Date().getTime()
    let oldTime = new Date(UTCTime)
    //oldTime.setMinutes(oldTime.getMinutes()+30)
    // console.log(Date(time).split(' ')
    // .splice(6, 2)
    // .join(' ')
    // .toUpperCase())
    let convoMonth = moment(UTCTime).format('MMM').toUpperCase();
    let convoCalendarDay = moment(UTCTime).format('D');
    let convoDay = moment(UTCTime).format('dddd').toUpperCase();
    let convoHoursMinutes = moment(UTCTime).format('h:mm a').toUpperCase();
    let convoDate = `${convoDay} ${convoHoursMinutes}`;
    
    return (<>
          {show?(<div class={`alert alert-success alert-dismissible fade show`} role="alert">
        <strong>Succesfully RSVP'd! Copy and send this link to your friends so they can join the fun: <Link ref={link} to={`profile/${hostUName}`}>https://www.go-off.co/profile/{hostUName}</Link></strong>
        <button onClick={()=>{
          navigator.clipboard.writeText(`https://www.go-off.co/profile/${hostUName}`)
          setCopied(true)
          console.log('clicked')
          setTimeout(()=>setCopied(false),3000)
        }} uk-icon="link"></button>
        {copied?<span>copied!</span>:''}
      </div>):''}
    <div className={s.conversationRow}>
      <div className={s.convImageBox}>
        <img src={articleImg ? articleImg : '/images/Rectangle328.png'} alt="" className={s.convImg} />
        <img src={bookmarkIcon} alt="" className={s.bookmarkIcon} />
      </div>
      <div className={s.convRight}>
        <div className={s.chatHeading}>
          <div className={s.leftHeading}>
            <span className={s.monthText}>{convoMonth}</span>
            <div className={s.dayText}>{convoCalendarDay}</div>
          </div>
          <div className={s.middleHeading}>
            {/* <img src={NYTLogo} alt="NYT Logo" className={s.NYTLogo} /> */}
            <span className={s.articleTitle}>{convTitle}</span>
          </div>
          <div className={s.rightHeading}>
            <img src={dots3Icon} alt="" className={s.threeDotsIcon} />
            <div className={s.dropdowncontent}>
              <span>Send this link to your friends so they can find your content: https:go-off.co/profile/{hostUName} </span>
            </div>
          </div>
        </div>
        <span className={s.startTime}>{convoDate}(EST)</span>
        {/* <div className={s.chatTags}>
          <div className={s.chatTag}>Eco-Friendly</div>
          <div className={s.chatTag}>Sustainability</div>
          <div className={s.chatTag}>Zero Waste</div>
        </div> */}
        <p className={s.chatDescription}>
          {desc}
        </p>
        <hr className={s.convLine} />
        <div className={s.RSVP_Row}>
          <div className={s.RSVP_Left}>
            <div className={s.ProfileLeft}>
              <img src={userpfp}  className={s.emilyIcon} />
              <div className={s.onlineCircle}></div>
            </div>
            <div className={s.ProfileNames}>
              <span className={s.hostText}>HOST</span>
              <div className={s.profileName}>{hostName}</div> 
            </div>
          </div>
              <div className="container-layer">
              {
                //*!this only shows before convo start. needs to be there until convo ends
              newTime>oldTime.getTime()?'':(
                <div className="layer">
                <button className={s.RSVP_Btn} onClick={rsvpbuttonhandler}>Save My Spot </button>
                </div>
)}
          
                <div className="layer">
          <button className={s.RSVP_Btn} onClick={gtcbuttonhandler}>Go To Convo</button>

                </div>
              </div>
          
        </div>
      </div>
    </div>
    </>)
  }

export default Conversation
