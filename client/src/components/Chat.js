import React, {useEffect} from 'react'
import {usePubNub} from 'pubnub-react';
import emilyIcon from '../images/liveChatImages/emily-profile-icon.png'
import styles from '../styles/LiveChatPage/livechat.css';




const Chat = ({scrollhook, channels, addMessages, messages, user})=> {
    const pubnub = usePubNub();
    useEffect(()=>{
        pubnub.fetchMessages({channels:channels,count:100}).then((e)=>{
            //this will fetch all messages in Test chat then add them to the messages state.
            e.channels.Test.forEach((e)=>{
              if(e.message.message || e.message.text.message){return} // this is just done to filter out previous versions of the messages
              if(e.message.user && e.message.text){
                addMessages(messages=>[...messages,{user:e.message.user,isHost:e.message.isHost,text:e.message.text,uuid:e.message.uuid}])
              }
              scrollhook.current.scrollIntoView({behavior:'smooth'});
            })    
          }).catch(error=>console.log(error)) 
    },[])
    return (
        <>
        { messages.map((message, index)=>{
                  if(message.uuid==user.uuid){
                    return (
                      <MeMessage key={index} isHost={message.isHost} user={message.user} text={message.text}/>
                    );
                  } else {
                    return(
                      <OtherMessage key={index} isHost={message.isHost} user={message.user} text={message.text}/>
                    );
                  }
                })
                }
        </>
    )
}

const MeMessage =  ({isHost, user, text})  => {
  return <div className={styles["meMessageBox"]}>
    <img src={emilyIcon} alt="Message Icon" className={styles["messageAvatar"]} />
    <div className={styles["rightMessageBox"]}>
      <span className={styles["messageUserName"]}>{user}</span>
      {isHost && <span className={styles["hostText"]}>HOST</span>}
      <div className={styles["chatMessageBox"]}>
        <span className={styles["messageText"]}>
          {text}
        </span>
      </div>
    </div>
  </div>
}

const OtherMessage = ({isHost, user, text}) => {
  return <div className={styles["otherMessageBox"]}>
    <div className={styles["leftMessageBox"]}>
      <span className={styles["messageUserName"]}>{user}</span>
      {isHost && <span className={styles["hostText"]}>HOST</span>}
      <div className={styles["chatMessageBox"]}>
        <span className={styles["messageText"]}>
          {text}
        </span>
      </div>
    </div>
    <img src={emilyIcon} alt="Message Icon" className={styles["messageAvatar"]} />
  </div>
}

export default Chat
