import React, { useEffect, useState } from 'react';
import axios from 'axios';
import s from '../styles/HomePage/HostHome.module.scss'; // s = styles
import NYTLogo from '../images/liveChatImages/NYT-Logo.png'
import emilyIcon from '../images/liveChatImages/emily-profile-icon.png'
import dots3Icon from '../images/liveChatImages/dots3.png'
import bookmarkIcon from '../images/bookmark.svg'
import firebase from '../firebase.js';
const db = firebase.firestore();
const Conversation = (props, userid) => {
    // console.log(props)
    // console.log(userid)
    let convoId = 'dummyId'
      const rsvpbuttonhandler = (e) => {
          e.preventDefault();
  
          axios  
              .get('/join')
              .then((res) => {
                  window.alert("You have Succesfully RSVP'd!")
                  db.collection('Conversations').where('convoId','==', convoId).get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        let data = doc.data();
                        let rsvp = data.rsvp;
                        if(rsvp.legnth<10 && data.hostId!==userid){
                        rsvp.push(userid)
                        db.collection('Conversations').get(doc.id).update({ rsvp:rsvp }).then(res => console.log('success')).catch(err => console.log(err))
                      }else{
                        console.log('limit reached')
                      }
                        console.log(doc.id, " => ", doc.data());
                    });
                })
              })
              .catch((err) => {
                  console.log(`RSVP ERROR: ${err}`)
              });
      };
  
      const { articleImg, articleURL, time, hostName, roomId, convTitle, desc, userpfp } = props;
      const month = Date(time).toLocaleString().split(' ').splice(1, 1).join(' ').toUpperCase()
      const date = Date(time).toLocaleString().split(' ').splice(2, 1).join(' ').toUpperCase()
    return <div className={s.conversationRow}>
      <div className={s.convImageBox}>
        <img src={articleImg ? articleImg : '/images/Rectangle328.png'} alt="" className={s.convImg} />
        <img src={bookmarkIcon} alt="" className={s.bookmarkIcon} />
      </div>
      <div className={s.convRight}>
        <div className={s.chatHeading}>
          <div className={s.leftHeading}>
            <span className={s.monthText}>{month}</span>
            <div className={s.dayText}>{date}</div>
          </div>
          <div className={s.middleHeading}>
            <img src={NYTLogo} alt="NYT Logo" className={s.NYTLogo} />
            <span className={s.articleTitle}>{convTitle}</span>
          </div>
          <div className={s.rightHeading}>
            <img src={dots3Icon} alt="" className={s.threeDotsIcon} />
          </div>
        </div>
        <span className={s.startTime}>{time
						? Date(time)
								.toLocaleString()
								.split(' ')
								.splice(0, 4)
								.join(' ')
								.toUpperCase()
						: 'HAPPENING SOON'}</span>
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