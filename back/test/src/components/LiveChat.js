import React, {useEffect, useState, useRef} from "react";
import goOffLogo from '../images/liveChatImages/go-off-logo.png'
import searchIcon from '../images/liveChatImages/search-icon.png'
import optionsIcon from '../images/liveChatImages/options.png'
import addPersonIcon from '../images/liveChatImages/person-add.png'
import bellIcon from '../images/liveChatImages/bell.png'
import shareIcon from '../images/liveChatImages/paper-plane.png'
import prekshaIcon from '../images/liveChatImages/preksha-profile-icon.png'
import arrowDownIcon from '../images/liveChatImages/arrow-ios-down.png'
import homeIcon from '../images/liveChatImages/home-icon.png'
import globeIcon from '../images/liveChatImages/globe-icon.png'
import article1 from '../images/liveChatImages/article-1.png'
import article2 from '../images/liveChatImages/article-2.png'
import NYTLogo from '../images/liveChatImages/NYT-Logo.png'
import emilyIcon from '../images/liveChatImages/emily-profile-icon.png'
import sendIcon from '../images/liveChatImages/send.png'
import dots3Icon from '../images/liveChatImages/dots3.png'
import inputAddIcon from '../images/liveChatImages/addIcon.png'
import inputSendIcon from '../images/liveChatImages/chatSend.png'
import '../styles/livechat.css';
import {usePubNub} from 'pubnub-react';
import { useForm } from "react-hook-form";
import Chat from './Chat';

const LiveChat = () => {
//importing pubnub into this component 
const pubnub = usePubNub();

//list of members allowed to view chat
const [members, setMembers] = useState([])

const {
  register, //used to register an input field
  handleSubmit, //is a function that will call your onSubmit function, whatever you declare that to be
  formState: { errors }, //this keeps track of the errors that can be easily retrieved
} = useForm({ criteriaMode: "all" });


//this will hold channel(s) for now default is test. will need to add way to join via a unique identifier to set as channel
const [channels , setChannels] = useState(['Test']);

//this state will hold all messages; Note every message will be structured as such {text:'string', user:'string', isHost:'boolean'}
const [messages, addMessages] = useState([]);

//this does not work it renders the limit to everyone!!! check logic when render messages
const [limitReached, setLimitReached] = useState(false);

//this is temporary user, later need to use user data from sign in
const user = pubnub.getUUID();
const isHost=true;

//this is a ref that will give scroll to bottom functionality
const scrollhook = useRef();

//this will handle incoming messages
const handleMessage = (object) => {
    const message = object.message
    if(!message.user){return}
    const text = message.text;
    if (typeof text === 'string' && text.length!==0){
      addMessages(messages => [...messages, message]);
    }
    scrollhook.current.scrollIntoView({behavior:'smooth'}); // scrolls to bottom when message is recieved
};

  //this on submit function is publishing the message to the channel
  const onSubmit = (message, e) => {
    pubnub.publish({
      channel: channels[0],
      message: {user:user,isHost:isHost,text:message.message}
    },
    function(status) { //this will print a status error in console
      if (status.error) {
        console.log(status)
      }});
    e.target.reset(); // resets the input fields
    scrollhook.current.scrollIntoView({behavior:'smooth'});// scrolls to bottom when message is sent
  };


//useEffect will add listeners and will subscribe to channel. will refresh if pubnub or the channels change 
useEffect(() => {
  
  const result = async ()=>{
    let x = await pubnub.hereNow({
      channels: ["Test"],
      includeUUIDs: true,
      includeState: true,
  });

  var y = x.channels.Test.occupants
  console.log(y)
  if (y.length>=10){
    setLimitReached(true);
  }else{
    setMembers(state=>[...state, y.uuid])
  }
  return y
  }
  result()

  var listener = {
    message: handleMessage,
    presence: function (p) {
      const action = p.action; // Can be join, leave, state-change, or timeout
      const channelName = p.channel; // Channel to which the message belongs
      const occupancy = p.occupancy; // Number of users subscribed to the channel
      const state = p.state; // User state
      const channelGroup = p.subscription; //  Channel group or wildcard subscription match, if any
      const publishTime = p.timestamp; // Publish timetoken
      const timetoken = p.timetoken; // Current timetoken
      const uuid = p.uuid; // UUIDs of users who are subscribed to the channel
      console.log(occupancy,uuid)
    },
    status: (event)=>{console.log("status: "+ JSON.stringify(event))}
  };
  //this listener sets up how to handle messages and gives status
  pubnub.addListener({
    message: handleMessage,
    presence: function (p) {
      const action = p.action; // Can be join, leave, state-change, or timeout
      const channelName = p.channel; // Channel to which the message belongs
      const occupancy = p.occupancy; // Number of users subscribed to the channel
      const state = p.state; // User state
      const channelGroup = p.subscription; //  Channel group or wildcard subscription match, if any
      const publishTime = p.timestamp; // Publish timetoken
      const timetoken = p.timetoken; // Current timetoken
      const uuid = p.uuid; // UUIDs of users who are subscribed to the channel
      if(action=='leave'){
        let newlist = members.filter(m=>m!==uuid)
        setMembers(newlist);
      }
    },
    status: (event)=>{console.log("status: "+ JSON.stringify(event))}
  });
  //this subscribes to a list of channels
  pubnub.subscribe({ 
    channels:channels,
    withPresence: true
  })
  return (pubnub.unsubscribe(channels), pubnub.removeListener())
},[pubnub, channels]);

  return <div className="liveChat">
    <NavBar />
    <div className="mainContent">
      <div className="leftColumn">
        <div className="avatarBox">
          <img src={prekshaIcon} alt="avatar" className="prekshaIcon" />
          <span className="avatarName">Preksha Munot</span>
        </div>
        <div className="homeBox">
          <img src={homeIcon} alt="homeImage" className="homeIcon" />
          <span className="homeText">Home</span>
        </div>
        <div className="discoverBox">
          <img src={globeIcon} alt="discoverImage" className="globeIcon" />
          <span className="globeText">Preksha Munot</span>
        </div>
        <h1 className="upcommingHeading">Upcoming Chats</h1>
        <div className="upcomingChats">
          <ChatCard title="Zero Waste Toothbrush: How does it really make a difference?" timeStart="HAPPENING NOW" chatImage={article1} />
          <ChatCard title="Zero Waste Toothbrush: How does it really make a difference?" timeStart="HAPPENING NOW" chatImage={article1} />
        </div>
      </div>
      <div className="middleColumn">
        <div className="innerMiddleBox">
          <div className="articleHeading">
            <div className="firstRowHeading">
              <img src={NYTLogo} alt="NYT Logo" className="NYTLogo" />
              <img src={searchIcon} alt="Search Icon" className="searchForIcon" />
            </div>
            <div className="secondRowHeading">
              <span className="mid-col-articleTitle">Zero Waste Toothbrush: How does it really make a difference?</span>
              <span className="liveBox">LIVE</span>
            </div>
          </div>
          <div className="liveChatBox">
            {/* will map messages out here. need to get all messages first then display them, then I need to set up handlers
              to add them to the list of all messages and re-render components */}
            <span className="chatTime">10:00 PM</span>
            {(()=>{
              if(limitReached){
                if(members.includes(user)){
                  return <Chat scrollhook={scrollhook} channels={channels} addMessages={addMessages} messages={messages} user={user}/>
                }else{
                  return <div style={{textAlign:'center'}}>Chat is full</div>
                }
              }else{return <Chat scrollhook={scrollhook} channels={channels} addMessages={addMessages} messages={messages} user={user}/>}
            })() /*jsx not working here with if statements*/}           
            <div ref={scrollhook}></div>
          </div>
          <div className="chatInputBox">
            <img src={inputAddIcon} alt="Add Icon" className="inputAddIcon" />
            <form className='form-demo'  onSubmit={handleSubmit(onSubmit)}>
              <input style={{width:'33vw',marginRight:'0px'}} type="text" className="inputText" placeholder='Type your message' {...register('message', {required:'Please enter a message'})} /> {/*this is for sending message, onSubmit here*/}
              {errors.message && <p className="error">{errors.message.message}</p>}
            </form>
            <img src={inputSendIcon} alt="Send Input" className="inputSendIcon" />
          </div>
        </div>
      </div>
      <div className="rightColumn">
        <div className="everythingButProfile">
          <img src={article2} alt="articleImage" className="article2" />
          <div className="chatHeading">
            <div className="leftHeading">
              <span className="monthText">MAY</span>
              <div className="dayText">22</div>
            </div>
            <div className="rightHeading">
              <img src={NYTLogo} alt="NYT Logo" className="NYTLogo" />
              <span className="articleTitle">Zero Waste Toothbrush: How does it really make a difference</span>
            </div>
          </div>
          <span className="startTime">THURSDAY 10:00 PM EST</span>
            <div className="chatTags">
              <div className="chatTag">Eco-Friendly</div>
              <div className="chatTag">Sustainability</div>
              <div className="chatTag">Zero Waste</div>
            </div>
            <p className="chatDescription">
              With zero waste taking over the world and people becoming more aware of their carbon footprint and how their actions affect the planet more options for sustaiable items have become avaiable.
            </p>
            <div className="dropDownRow">
              <span className="chatDropDownName">Participants</span>
              <img src={arrowDownIcon} alt="dropDownImg" className="dropDownImg" />
            </div>
            <div className="dropDownRow">
              <span className="chatDropDownName">Shared Media</span>
              <img src={arrowDownIcon} alt="dropDownImg" className="dropDownImg" />
            </div>
            <div className="dropDownRow">
              <span className="chatDropDownName">Privacy & Support</span>
              <img src={arrowDownIcon} alt="dropDownImg" className="dropDownImg" />
            </div>
         </div>
         <div className="profileBox">
           <div className="profileLeftSide">
             <img src={emilyIcon} alt="Profile Icon" className="emilyIcon" />
             <div className="ProfileNames">
               <span className="hostText">HOST</span>
               <div className="profileName">Emily Patterson</div>
             </div>
           </div>
           <div className="profileRightSide">
            <img src={sendIcon} alt="Share" className="sendIcon" />
            <img src={dots3Icon} alt="3 Things Setting" className="dots3Icon" />
           </div>
        </div>
      </div>
    </div>
  </div>
}

const NavBar = ({ }) => {
  return <div className="navbar">
    <img src={goOffLogo} alt="Go Off! Logo" className="goOffLogo" />
    <div className="searchBar">
      <img src={searchIcon} alt="Search Icon" className="searchIcon" />
      <input type="search" className="searchInput" placeholder="Search" />
      <img src={optionsIcon} alt="Settings" className="optionsIcon" />
    </div>
    <img src={addPersonIcon} alt="Add person" className="addPersonIcon" />
    <img src={bellIcon} alt="Notifications" className="bellIcon" />
    <img src={shareIcon} alt="Share" className="shareIcon" />
    <div className="navProfileBox">
      <div className="profile">
        <img src={prekshaIcon} alt="avatar" className="profileIcon" />
        <span className="profileText">Preksha Munot</span>
        <img src={arrowDownIcon} alt="dropDown" className="arrowDownIcon" />
      </div>
    </div>
  </div>
}

const ChatCard = ({ title, timeStart, chatImage }) => {
  return <div className="chatCard">
    <img src={chatImage} alt="Image" className="chatImage" />
    <div className="chatBottomSide">
      <h2 className="timeStart">{timeStart}</h2>
      <h4 className="chatTitle">{title}</h4>
    </div>
  </div>
}

export default LiveChat