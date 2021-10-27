
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import s from '../styles/HomePage/HostHome.module.scss'; // s = styles
import NYTLogo from '../images/liveChatImages/NYT-Logo.png'
import emilyIcon from '../images/liveChatImages/emily-profile-icon.png'
import dots3Icon from '../images/liveChatImages/dots3.png'
import bookmarkIcon from '../images/bookmark.svg'
import firebase from '../firebase.js';
import { useHistory } from 'react-router-dom';
import '../components/styles/Conversation.module.scss'
import { sendEditConv } from "../styles/AuthPage/api.js"
import { useMutation } from 'react-query'
import Rodal from "rodal";
import "rodal/lib/rodal.css";
// const schedule = require('node-schedule');

// const twilio = require('twilio')
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// console.log(process.env.SENDGRID_API_KEY)
// const accountSid = process.env.TWILIO_ACCOUNT_SID
// const authToken = process.env.TWILIO_AUTH_TOKEN
// console.log(accountSid, authToken)
// var twilioClient = require('twilio')(accountSid, authToken);


const Conversation = (props, { userid }) => {
  let convoId = props.roomId
  let dummyId = props.userid
  let history = useHistory()
  // console.log(props)
  const gtcbuttonhandler = (e) => {
    history.push(`/chat/${convoId}`)
  }
  const toEditProfilePage = (evt) => {
    history.push("/editprofile")
  }
  const db = firebase.firestore();
  const [isCreateConvModalVisible, setCreateConvModalVisible] = useState(false)
  const openCreateConvModal = () => setCreateConvModalVisible(true);
  const closeCreateConvModal = () => setCreateConvModalVisible(false);

  const rsvpbuttonhandler = (e) => {
    e.preventDefault();
    console.log("test")
    console.log(props)
    db.collection('Conversations').where('convoId', '==', convoId).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let data = doc.data();
        let rsvp = data.rsvp;
        console.log(rsvp, rsvp.length)
        console.log(data)
        if (data.hostId == dummyId) {
          return console.log('is already host')
        }
        if (rsvp.length < 10) {
          rsvp.push(dummyId)
          window.alert("Succesfully RSVP'd! Tell your friends to check out your profile page to RSVP.")


          //notifications
          console.log("notif test")
          console.log(props)
          axios.post(`/api/convos/joinnotifs/${convoId}`, props)
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
          db.collection('Conversations').doc(doc.id).update({ rsvp: rsvp }).then(res => console.log('successfully rsvpd')).catch(err => console.log(err))
        } else {
          console.log('limit reached')
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

  const { articleImg, articleURL, time, hostName, roomId, convTitle, desc, userpfp, hostUName } = props;
  // console.log(time)
  //   const month = new Date(time)
  //   const date = new Date(time)
  //   const month1 = Date(time)
  //   const date1 = Date(time)
  //   console.log(month, date)
  //   console.log(month1, date1)
  let UTCTime = parseInt(time);
  let newTime = new Date().getTime()
  // console.log(Date(time).split(' ')
  // .splice(6, 2)
  // .join(' ')
  // .toUpperCase())
  let convoMonth = moment(UTCTime).format('MMM').toUpperCase();
  let convoCalendarDay = moment(UTCTime).format('D');
  let convoDay = moment(UTCTime).format('dddd').toUpperCase();
  let convoHoursMinutes = moment(UTCTime).format('h:mm a').toUpperCase();
  let convoDate = `${convoDay} ${convoHoursMinutes}`;

  return <div className={s.conversationRow}>
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
            { props.hostid !== dummyId ?
            <div className={s.sharedropdown} >
            <span>Send this link to your friends so they can find your content: https:go-off.co/profile/{hostUName} </span>
            </div>
            :
            <div className={s.buttondropdown} >
              <button className={s.dropdownbutton} onClick={openCreateConvModal}>Edit Convo</button>
              <button className={s.dropdownbutton} onClick={() => console.log("Share pressed")}>Share Convo</button>
            </div>
            }
              <CreateConvModal 
                closeCreateConvModal={closeCreateConvModal}
                isCreateConvModalVisible={isCreateConvModalVisible} 
                id={convoId}
                data={props}
              />
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
            <img src={userpfp} className={s.emilyIcon} />
            <div className={s.onlineCircle}></div>
          </div>
          <div className={s.ProfileNames}>
            <span className={s.hostText}>HOST</span>
            <div className={s.profileName}>{hostName}</div>
          </div>
        </div>
        <div className="container-layer" id="container-layer">
          {
            //*!this only shows before convo start. needs to be there until convo ends
            newTime > time ? '' : (
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
}

const CreateConvModal = ({ closeCreateConvModal, isCreateConvModalVisible,id,data}) => {
  let UTCTime = parseInt(data.time) 
  let date = moment(UTCTime).format("YYYY-MM-DD[T]HH:mm:ss")
  
  const [dateInput, setDateInput] = useState(date);
  const [convTitleInput, setConvTitleInput] = useState(data.convTitle);
  const [convDescInput, setConvDescInput] = useState(data.desc);
  const [articleURLInput, setArticleURLInput] = useState(data.articleURL);
  const { mutate } = useMutation((convCreationInfo) => sendEditConv(convCreationInfo,id))

  const handleDateInputChange = (evt) => setDateInput(evt.target.value)
  const handleConvTitleInputInput = (evt) => setConvTitleInput(evt.target.value)
  const handleConvDescInputChange = (evt) => setConvDescInput(evt.target.value)
  const handleArticleURLInputChange = (evt) => setArticleURLInput(evt.target.value)

  const handleCreateConv = (evt) => {
    // Check if values are empty, For now we'll just do an alert, in the future put some red lower text
    if (!dateInput) alert("There's something wrong with the Conversation Time Input")
    else if (!convTitleInput) alert("There's something wrong with the Convo Title Input")
    else if (!convDescInput) alert("There's something wrong with the Conv Description Input")
    else if (!articleURLInput) alert("There's something wrong with the Ariticle URL Input")

    const convCreationInfo = { articleURL: articleURLInput, time: dateInput, title: convTitleInput, description: convDescInput }
    mutate(convCreationInfo)
    closeCreateConvModal();
    //window.alert("Conversation created! To find the conversation check your Profile page or the Home page!")
  }

  const rodalCustomStyles = {
    padding: '0px'
  }


  return <Rodal
    width="300"
    height="420"
    visible={isCreateConvModalVisible}
    showMask={true}
    showCloseButton={true}
    enterAnimation="slideUp"
    leaveAnimation="door"
    onClose={closeCreateConvModal}
    customStyles={rodalCustomStyles}
  >
    {console.log(dateInput, " convo date ")}
    <div className={s.convoModal}>
      <div className={s.convModalHeading}>
        <h1 className={s.convoModalHeader}>Edit Convo</h1>
      </div>
      <div className={s.convModalContent}>
        <h3 className={s.convTimeTxt}>Conversation Time</h3>
        <input className={s.convTimeInput} type="datetime-local" defaultValue={dateInput} onChange={handleDateInputChange} value={dateInput} />
        <h3 className={s.convTitleTxt}>Convo Title</h3>
        <input className={s.convTitleInput} type="text" onChange={handleConvTitleInputInput} value={convTitleInput} />
        <h3 className={s.convDescTxt}>Convo Description</h3>
        <input className={s.convTitleInput} type="text" onChange={handleConvDescInputChange} value={convDescInput} />
        <h3 className={s.articleURLTxt}>Article URL</h3>
        <input className={s.convTitleInput} type="text" onChange={handleArticleURLInputChange} value={articleURLInput} />
        {/* <p className={s.helpbuttonTxt}>Need some Inspiration? Click <a target="_blank" href="https://feather-pump-5e2.notion.site/8610e9fcf7ee41abb1cd82eef3475691?v=8e268e6f3b064516beef074b67473dd2">here!</a></p> */}
        <div className={s.buttonbox}>
        <button className={s.createConvBtn2} onClick={() => console.log("delete pressed")}>Delete</button>
        <button className={s.createConvBtn2} onClick={closeCreateConvModal}>Cancel</button>
        <button className={s.createConvBtn} onClick={handleCreateConv}>Save</button>
        
        </div>
      </div>
    </div>
  </Rodal>
}

export default Conversation
