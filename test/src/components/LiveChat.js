import React from "react";
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

const LiveChat = () => {
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
            <span className="chatTime">10:00 PM</span>
            <MeMessage isHost />
            <OtherMessage />
          </div>
          <div className="chatInputBox">
            <img src={inputAddIcon} alt="Add Icon" className="inputAddIcon" />
            <input type="text" className="inputText" />
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

const NavBar = ({}) => {
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
    <img src={chatImage} alt="chatImage" className="chatImage" />
    <div className="chatBottomSide">
      <h2 className="timeStart">{timeStart}</h2>
      <h4 className="chatTitle">{title}</h4>
    </div>
  </div>
}

const MeMessage = ({ isHost = false }) => {
  return <div className="meMessageBox">
    <img src={emilyIcon} alt="Message Icon" className="messageAvatar" />
    <div className="rightMessageBox">
      <span className="messageUserName">Emily Patterson</span>
      {isHost && <span className="hostText">HOST</span>}
      <div className="chatMessageBox">
        <span className="messageText">
          Hi everyone! Thank you so much for joining my
          converstation! I look forward to having exciting
          and meaningful conversations with all of you!
        </span>
      </div>
    </div>
  </div>
}

const OtherMessage = ({ isHost }) => {
  return <div className="otherMessageBox">
    <div className="leftMessageBox">
      <span className="messageUserName">Emily Patterson</span>
      {isHost && <span className="hostText">HOST</span>}
      <div className="chatMessageBox">
        <span className="messageText">
          Thank you Emily for hosting this conversation! I am very excited to have this discussion with all of you and see what everyone has to say about this topic!
        </span>
      </div>
    </div>
    <img src={emilyIcon} alt="Message Icon" className="messageAvatar" />
  </div>
}

export default LiveChat