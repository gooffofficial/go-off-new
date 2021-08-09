import React, {useEffect, useState} from 'react'
import styles from "../styles/LiveChatPage/livechat.module.css";
import arrowDownIcon from "../images/liveChatImages/arrow-ios-down.png";
import {usePubNub} from 'pubnub-react';
import axios from 'axios';



const Participants = () => {
    const pubnub = usePubNub();
    const [participants, setParticipants] = useState([0])
    useEffect(() =>{
        axios
      .get(`/api/users/current`, {
        withCredentials: true,
      })
      .then((res) => {
        const user = res.data.user
        setParticipants([user.name])
        pubnub.addListener({
            signal: function(s) {
                // handle signal
                var channelName = s.channel; // The channel to which the signal was published
                var channelGroup = s.subscription; // The channel group or wildcard subscription match (if exists)
                var pubTT = s.timetoken; // Publish timetoken
                var msg = s.message; // The Payload
                var publisher = s.publisher; //The Publisher
            //** use redux to see if the signals work better.
            if(msg.action=='AM'){
              if(msg.name!==user.name)
              {
                setParticipants(state=>[...state,msg.name]);
              }else{
                
              }
            }else if(msg.action=='DM'){
                let newList = participants.filter(x=>x!==msg.uuid)
                setParticipants(newList);
            }}
        })
      }).catch(err=>console.log(err));
      return pubnub.removeListener();
    },[])
    return (
        <div className={styles["dropDownRow"]}>
              <span className={styles["chatDropDownName"]}>Participants: {participants?participants.length:0}</span>
              <img
                src={arrowDownIcon}
                alt="dropDownImg"
                className={styles["dropDownImg"]}
              />
              <div className={styles["dropdown-content"]}>
                {participants.map((member, index)=>{
                  return <div key={index}>{member}</div>
                })}
              </div>
            </div>
    )
}

export default Participants
