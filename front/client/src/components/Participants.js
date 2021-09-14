import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/LiveChatPage/livechat.module.css";
import arrowDownIcon from "../images/liveChatImages/arrow-ios-down.png";
import { usePubNub } from "pubnub-react";
import axios from "axios";
import { UserContext } from "../contexts/userContext";

const Participants = ({channel}) => {
  const pubnub = usePubNub();
  const {currentUser} = useContext(UserContext)
  const [participants, setParticipants] = useState([0]);
  const fetchMeta = async() => {
    const result = await pubnub.objects.getChannelMetadata({channel:channel})
    if(result.status!=200){
      const result2 = await pubnub.objects.setChannelMetadata({
      channel: channel,
      data: {
        custom: { "participant": {user1:currentUser.name} }
      }
  })
    }
  console.log('----------------',result)
  }
  useEffect(() => {
    fetchMeta()
    if(currentUser.signedIn){
    const user = currentUser;
    setParticipants([user.name]);
    pubnub.addListener({
      presence: function (p) {
        const action = p.action; // Can be join, leave, state-change, or timeout
        const channelName = p.channel; // Channel to which the message belongs
        const occupancy = p.occupancy; // Number of users subscribed to the channel
        const state = p.state; // User state
        const channelGroup = p.subscription; //  Channel group or wildcard subscription match, if any
        const publishTime = p.timestamp; // Publish timetoken
        const timetoken = p.timetoken; // Current timetoken
        const uuid = p.uuid; // UUIDs of users who are subscribed to the channel
        if(action=='join'){
          pubnub.signal({ channel: channel, message: { action: 'AM', name: user.name } })
        }
      },
      signal: function (s) {
        // handle signal
        var channelName = s.channel; // The channel to which the signal was published
        var channelGroup = s.subscription; // The channel group or wildcard subscription match (if exists)
        var pubTT = s.timetoken; // Publish timetoken
        var msg = s.message; // The Payload
        var publisher = s.publisher; //The Publisher
        if (msg.action == "AM") {
          if (msg.name !== user.name) {
            if(!participants.includes(user.name)){
              setParticipants((state) => [...state, msg.name]);
            }
          } else {
          }
        } else if (msg.action == "DM") {
          let newList = participants.filter((x) => x !== msg.name);
          setParticipants(newList);
        }
      },
    });
  }
    return pubnub.removeListener();
  }, []);
  return (
    <div className={styles["dropDownRow"]}>
      <span className={styles["chatDropDownName"]}>
        Participants: {participants ? participants.length : 0}
      </span>
      <img
        src={arrowDownIcon}
        alt="dropDownImg"
        className={styles["dropDownImg"]}
      />
      <div className={styles["dropdown-content"]}>
        {participants.map((member, index) => {
          return <div key={index}>{member}</div>;
        })}
      </div>
    </div>
  );
};

export default Participants;
