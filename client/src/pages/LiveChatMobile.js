import React from "react";

import inputAddIcon from "../images/liveChatImages/addIcon.png";
import inputSendIcon from "../images/liveChatImages/chatSend.png";
import leftArrowIcon from "../images/left_arrow.jpg"
import infoIcon from "../images/info.png";
import s from "../styles/LiveChatPage/livechatmobile.module.scss";
import { ProfileMobileNavBar } from './ProfileMobile'

// For adding the functionality: 
//  Do the same as ProfileMobile passing all functions as props and using them

const MobileLiveChat = ({ }) => {
  return <div className={s.mobileLiveChat}>
    <div className={s.stickyTop}>
      <ProfileMobileNavBar />
      <div className={s.chatHeadingRow}>
        <img src={leftArrowIcon} alt="" className={s.leftArrowIcon} />
        <span className={s.articleTitle}>
          Zero Waste Toothbrush: How does it really make a difference?
          <div className={s.liveBox}>LIVE</div>
        </span>
        <img src={infoIcon} alt="" className={s.infoIcon} />
      </div>
    </div>
    <div className={s.messagesContent}>
      <span className={s.startDate}>10:00 PM</span>
      <MobileUserChatMsg isHost={true} />
      <MobileUserChatMsg isHost={false} />
      <MobileUserChatMsg isHost={true} />
      <MobileUserChatMsg isHost={false} />
      <MobileUserChatMsg isHost={true} />
      <MobileUserChatMsg isHost={false} />
      <MobileUserChatMsg isHost={true} />
      <MobileUserChatMsg isHost={false} />
      <MobileUserChatMsg isHost={true} />
      <MobileUserChatMsg isHost={false} />
    </div>
    <div className={s.messageInputBox}>
      <img src={inputAddIcon} alt="" className={s.inputAddIcon} />
      <input type="text" className={s.inputMessage} />
      <img src={inputSendIcon} alt="" className={s.inputSendIcon} />
    </div>
  </div>
};

const MobileUserChatMsg = ({ name, avatarSrc = '/images/stock-face.jpg', message, isHost }) => {
  return <div className={isHost ? s.mobileUserChatMsg : s.nonMobileUserChatMsg}>
    <img src={avatarSrc} alt="" className={s.userAvatar} />
    <div className={s.rightChatMsg}>
      <span className={s.nameAndHost}>
        Emily Patterson
        <div className={isHost ? s.hostBox : s.nonHostBox}>HOST</div>
      </span>
      <div className={isHost ? s.hostMsgBox : s.nonHostMsgBox}>
        Hi everyone! Thank you so much for joining my converstation! I look forward to having exciting and meaningful conversations with all of you!
      </div>
    </div>
  </div>
}

export default MobileLiveChat
