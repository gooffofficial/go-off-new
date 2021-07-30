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
    <div className={styles["mainContent"]}>
      <div className={styles["leftColumn"]}>
        <div className={styles["avatarBox"]}>
          <img src={prekshaIcon} alt="avatar" className={styles["prekshaIcon"]} />
          <span className={styles["avatarName"]}>Preksha Munot</span>
        </div>
        <div className={styles["homeBox"]}>
          <img src={homeIcon} alt="homeImage" className={styles["homeIcon"]} />
          <span className={styles["homeText"]}>Home</span>
        </div>
        <div className={styles["discoverBox"]}>
          <img src={globeIcon} alt="discoverImage" className={styles["globeIcon"]} />
          <span className={styles["globeText"]}>Preksha Munot</span>
        </div>
        <h1 className={styles["upcommingHeading"]}>Upcoming Chats</h1>
        <div className={styles["upcomingChats"]}>
          <ChatCard title="Zero Waste Toothbrush: How does it really make a difference?" timeStart="HAPPENING NOW" chatImage={article1} />
          <ChatCard title="Zero Waste Toothbrush: How does it really make a difference?" timeStart="HAPPENING NOW" chatImage={article1} />
        </div>
      </div>
      <div className={styles["middleColumn"]}>
        <div className={styles["innerMiddleBox"]}>
          <div className={styles["articleHeading"]}>
            <div className={styles["firstRowHeading"]}>
              <img src={NYTLogo} alt="NYT Logo" className={styles["NYTLogo"]} />
              <img src={searchIcon} alt="Search Icon" className={styles["searchForIcon"]} />
            </div>
            <div className={styles["secondRowHeading"]}>
              <span className={styles["mid-col-articleTitle"]}>Zero Waste Toothbrush: How does it really make a difference?</span>
              <span className={styles["liveBox"]}>LIVE</span>
            </div>
          </div>
          <div className={styles["liveChatBox"]}>
            <span className={styles["chatTime"]}>10:00 PM</span>
            <MeMessage isHost />
            <OtherMessage />
          </div>
          <div className={styles["chatInputBox"]}>
            <img src={inputAddIcon} alt="Add Icon" className={styles["inputAddIcon"]} />
            <input type="text" className={styles["inputText"]} />
            <img src={inputSendIcon} alt="Send Input" className={styles["inputSendIcon"]} />
          </div>
        </div>
      </div>
      <div className={styles["rightColumn"]}>
        <div className={styles["everythingButProfile"]}>
          <img src={article2} alt="articleImage" className={styles["article2"]} />
          <div className={styles["chatHeading"]}>
            <div className={styles["leftHeading"]}>
              <span className={styles["monthText"]}>MAY</span>
              <div className={styles["dayText"]}>22</div>
            </div>
            <div className={styles["rightHeading"]}>
              <img src={NYTLogo} alt="NYT Logo" className={styles["NYTLogo"]} />
              <span className={styles["articleTitle"]}>Zero Waste Toothbrush: How does it really make a difference</span>
            </div>
          </div>
          <span className={styles["startTime"]}>THURSDAY 10:00 PM EST</span>
            <div className={styles["chatTags"]}>
              <div className={styles["chatTag"]}>Eco-Friendly</div>
              <div className={styles["chatTag"]}>Sustainability</div>
              <div className={styles["chatTag"]}>Zero Waste</div>
            </div>
            <p className={styles["chatDescription"]}>
              With zero waste taking over the world and people becoming more aware of their carbon footprint and how their actions affect the planet more options for sustaiable items have become avaiable.
            </p>
            <div className={styles["dropDownRow"]}>
              <span className={styles["chatDropDownName"]}>Participants</span>
              <img src={arrowDownIcon} alt="dropDownImg" className={styles["dropDownImg"]} />
            </div>
            <div className={styles["dropDownRow"]}>
              <span className={styles["chatDropDownName"]}>Shared Media</span>
              <img src={arrowDownIcon} alt="dropDownImg" className={styles["dropDownImg"]} />
            </div>
            <div className={styles["dropDownRow"]}>
              <span className={styles["chatDropDownName"]}>Privacy & Support</span>
              <img src={arrowDownIcon} alt="dropDownImg" className={styles["dropDownImg"]} />
            </div>
         </div>
         <div className={styles["profileBox"]}>
           <div className={styles["profileLeftSide"]}>
             <img src={emilyIcon} alt="Profile Icon" className={styles["emilyIcon"]} />
             <div className={styles["ProfileNames"]}>
               <span className={styles["hostText"]}>HOST</span>
               <div className={styles["profileName"]}>Emily Patterson</div>
             </div>
           </div>
           <div className={styles["profileRightSide"]}>
            <img src={sendIcon} alt="Share" className={styles["sendIcon"]} />
            <img src={dots3Icon} alt="3 Things Setting" className={styles["dots3Icon"]} />
           </div>
        </div>
      </div>
    </div>
  </div>
}

const NavBar = ({}) => {
  return <div className={styles["navbar"]}>
    <img src={goOffLogo} alt="Go Off! Logo" className={styles["goOffLogo"]} />
    <div className={styles["searchBar"]}>
      <img src={searchIcon} alt="Search Icon" className={styles["searchIcon"]} />
      <input type="search" className={styles["searchInput"]} placeholder="Search" />
      <img src={optionsIcon} alt="Settings" className={styles["optionsIcon"]} />
    </div>
    <img src={addPersonIcon} alt="Add person" className={styles["addPersonIcon"]} />
    <img src={bellIcon} alt="Notifications" className={styles["bellIcon"]} />
    <img src={shareIcon} alt="Share" className={styles["shareIcon"]} />
    <div className={styles["navProfileBox"]}>
      <div className={styles["profile"]}>
        <img src={prekshaIcon} alt="avatar" className={styles["profileIcon"]} />
        <span className={styles["profileText"]}>Preksha Munot</span>
        <img src={arrowDownIcon} alt="dropDown" className={styles["arrowDownIcon"]} />
      </div>
    </div>
  </div>
}

const ChatCard = ({ title, timeStart, chatImage }) => {
  return <div className={styles["chatCard"]}>
    <img src={chatImage} alt="chatImage" className={styles["chatImage"]} />
    <div className={styles["chatBottomSide"]}>
      <h2 className={styles["timeStart"]}>{timeStart}</h2>
      <h4 className={styles["chatTitle"]}>{title}</h4>
    </div>
  </div>
}

const MeMessage = ({ isHost = false }) => {
  return <div className={styles["meMessageBox"]}>
    <img src={emilyIcon} alt="Message Icon" className={styles["messageAvatar"]} />
    <div className={styles["rightMessageBox"]}>
      <span className={styles["messageUserName"]}>Emily Patterson</span>
      {isHost && <span className={styles["hostText"]}>HOST</span>}
      <div className={styles["chatMessageBox"]}>
        <span className={styles["messageText"]}>
          Hi everyone! Thank you so much for joining my
          converstation! I look forward to having exciting
          and meaningful conversations with all of you!
        </span>
      </div>
    </div>
  </div>
}

const OtherMessage = ({ isHost }) => {
  return <div className={styles["otherMessageBox"]}>
    <div className={styles["leftMessageBox"]}>
      <span className={styles["messageUserName"]}>Emily Patterson</span>
      {isHost && <span className={styles["hostText"]}>HOST</span>}
      <div className={styles["chatMessageBox"]}>
        <span className={styles["messageText"]}>
          Thank you Emily for hosting this conversation! I am very excited to have this discussion with all of you and see what everyone has to say about this topic!
        </span>
      </div>
    </div>
    <img src={emilyIcon} alt="Message Icon" className={styles["messageAvatar"]} />
  </div>
}

export default LiveChat