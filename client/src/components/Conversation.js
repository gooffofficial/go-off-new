import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import s from '../styles/HomePage/HostHome.module.scss'; // s = styles
import NYTLogo from '../images/liveChatImages/NYT-Logo.png'
import emilyIcon from '../images/liveChatImages/emily-profile-icon.png'
import dots3Icon from '../images/liveChatImages/dots3.png'
import bookmarkIcon from '../images/bookmark.svg'
import firebase from '../firebase.js';

const Conversation = (props,{ userid }) => {
  let convoId = 'Test'
  let dummyId = 54
  const db = firebase.firestore();
    const rsvpbuttonhandler = (e) => {
        e.preventDefault();

        db.collection('Conversations').where('convoId','==', convoId).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              let data = doc.data();
              let rsvp = data.rsvp;
              console.log(rsvp, rsvp.length)
              if(data.hostId==userid){
                return console.log('is already host')
              }
              if(rsvp.length<10){
              rsvp.push(dummyId)
              db.collection('Conversations').doc(doc.id).update({ rsvp:rsvp }).then(res => console.log('successfully rsvpd')).catch(err => console.log(err))
            }else{
              console.log('limit reached')
            }
              console.log(doc.id, " => ", doc.data());
          });

      }).catch(err => console.log(err));
      };
  
      const { articleImg, articleURL, time, hostName, roomId, convTitle, desc, userpfp} = props;
      console.log(time)
    //   const month = new Date(time)
    //   const date = new Date(time)
    //   const month1 = Date(time)
    //   const date1 = Date(time)
    //   console.log(month, date)
    //   console.log(month1, date1)
    let UTCTime = parseInt(time);
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
            <img src={NYTLogo} alt="NYT Logo" className={s.NYTLogo} />
            <span className={s.articleTitle}>{convTitle}</span>
          </div>
          <div className={s.rightHeading}>
            <img src={dots3Icon} alt="" className={s.threeDotsIcon} />
          </div>
        </div>
        <span className={s.startTime}>{convoDate}</span>
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
              <img src={userpfp} alt="Profile Icon" className={s.emilyIcon} />
              <div className={s.onlineCircle}></div>
            </div>
            <div className={s.ProfileNames}>
              <span className={s.hostText}>HOST</span>
              <div className={s.profileName}>{hostName}</div> 
            </div>
          </div>
          <button className={s.RSVP_Btn} onClick={rsvpbuttonhandler}>RSVP NOW</button>
        </div>
      </div>
    </div>
  }

export default Conversation