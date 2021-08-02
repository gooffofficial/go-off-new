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
import dots3Icon from '../images/liveChatImages/dots3.png'
import articleIcon from '../images/liveChatImages/article-2.png'
import peopleIcon from '../images/people.svg'
import photoIcon from '../images/photo.png'
import trendingArrow from '../images/trending-up.png'
import trendImg1 from '../images/trend-stock1.png'
import trendImg2 from '../images/trend-stock2.png'
import trendImg3 from '../images/trend-stock3.png'
import trendImg4 from '../images/trend-stock4.png'
import ytIcon from '../images/youtube.png'
import bookmarkIcon from '../images/bookmark.svg'
// import avatarMedium from '../images/avatar-medium.png'
import avatarMedium from '../images/bookmark.svg'
import s from '../styles/HomePage/Home.module.scss'; // s = styles

const HomePage = () => {
  return <div className={s.homePage}>
    <NavBar />
    <div className={s.mainContent}>
      <div className={s.leftColumn}>
        <div className={s.avatarBox}>
          <img src={prekshaIcon} alt="avatar" className={s.prekshaIcon} />
          <span className={s.avatarName}>Preksha Munot</span>
        </div>
        <div className={s.homeBox}>
          <img src={homeIcon} alt="homeImage" className={s.homeIcon} />
          <span className={s.homeText}>Home</span>
        </div>
        <div className={s.discoverBox}>
          <img src={globeIcon} alt="discoverImage" className={s.globeIcon} />
          <span className={s.globeText}>Preksha Munot</span>
        </div>
        <h1 className={s.upcommingHeading}>Upcoming Chats</h1>
        <div className={s.upcomingChats}>
          <ChatCard title="Zero Waste Toothbrush: How does it really make a difference?" timeStart="HAPPENING NOW" chatImage={article1} />
          <ChatCard title="Zero Waste Toothbrush: How does it really make a difference?" timeStart="HAPPENING NOW" chatImage={article1} />
        </div>
      </div>
      <div className={s.middleColumn}>
        <div className={s.insideMiddleColumn}>
          <div className={s.userBox}>
            <div className={s.userConvRow}>
              <img src={avatarMedium} alt="Avatar" className={s.avatarIcon} />
              <input type="text" className={s.startAConvInput} placeholder="Start a conversation"/>
            </div>
            <hr className={s.grayLine} />
            <div className={s.userIconsRow}>
              <div className={s.photoRow}>
                <img src={photoIcon} alt="" className={s.photoIcon} />
                <span className={s.photoTxt}>Photo</span>
              </div>
              <div className={s.ytRow}>
                <img src={ytIcon} alt="" className={s.videoIcon} />
                <span className={s.videoTxt}>Video</span>
              </div>
              <div className={s.articleRow}>
                <img src={articleIcon} alt="" className={s.articleIcon} />
                <span className={s.articleTxt}>Article</span>
              </div>
            </div>
          </div>
          <Conversation convImg={article2} />
          <Conversation convImg={article2} />
        </div>
      </div>
      <div className={s.rightColumn}>
        <div className={s.trendingRow}>
          <img src={trendingArrow} alt="" className={s.trendingIcon} />
          <span className={s.trendingTxt}>Trending</span>
        </div>
        <TrendingCard image={trendImg1} title="Zero Waste Toothbrush: How does it really make a difference?" />
        <TrendingCard image={trendImg2} title="Zero Waste Toothbrush: How does it really make a difference?" />
        <TrendingCard image={trendImg3} title="Zero Waste Toothbrush: How does it really make a difference?" />
        <TrendingCard image={trendImg4} title="Zero Waste Toothbrush: How does it really make a difference?" />
        <div className={s.friendActivityRow}>
          <img src={peopleIcon} alt="" className={s.friendsIcon} />
          <span className={s.friendActivityHeading}>Friend Activity</span>
        </div>
        <FriendActivityCard userAvatar={emilyIcon} username="Emily Patterson" friendName="Clarissa Peers" />
        <FriendActivityCard userAvatar={emilyIcon} username="Emily Patterson" friendName="Clarissa Peers" />
        <FriendActivityCard userAvatar={emilyIcon} username="Emily Patterson" friendName="Clarissa Peers" />
        <FriendActivityCard userAvatar={emilyIcon} username="Emily Patterson" friendName="Clarissa Peers" />
        <FriendActivityCard userAvatar={emilyIcon} username="Emily Patterson" friendName="Clarissa Peers" />
      </div>
    </div>
  </div>
}

const NavBar = ({ }) => {
  return <div className={s.navbar}>
    <img src={goOffLogo} alt="Go Off! Logo" className={s.goOffLogo} />
    <div className={s.searchBar}>
      <img src={searchIcon} alt="Search Icon" className={s.searchIcon} />
      <input type="search" className={s.searchInput} placeholder="Search" />
      <img src={optionsIcon} alt="Settings" className={s.optionsIcon} />
    </div>
    <img src={addPersonIcon} alt="Add person" className={s.addPersonIcon} />
    <img src={bellIcon} alt="Notifications" className={s.bellIcon} />
    <img src={shareIcon} alt="Share" className={s.shareIcon} />
    <div className={s.navProfileBox}>
      <div className={s.profile}>
        <img src={prekshaIcon} alt="avatar" className={s.profileIcon} />
        <span className={s.profileText}>Preksha Munot</span>
        <img src={arrowDownIcon} alt="dropDown" className={s.arrowDownIcon} />
      </div>
    </div>
  </div>
}

const TrendingCard = ({ image, title }) => {
  return <div className={s.trendingCardRow}>
    <img src={image} alt="" className={s.trendingImage} />
    <div className={s.trendingRight}>
      <span className={s.trendingTitle}>{title}</span>
    </div>
  </div>
}

const FriendActivityCard = ({ userAvatar, username, friendName }) => {
  return <div className={s.friendActivityCardRow}>
    <img src={userAvatar} alt="User Avatar" className={s.userAvatar} />
    <span className={s.activityTxt}>
      <span className={s.username}>{username}</span> 
      &nbsp;saved a conversation hosted by&nbsp;
      <span className={s.friendName}>{friendName}</span>
    </span>
  </div>
}

const Conversation = ({ convImg }) => {
  return <div className={s.conversationRow}>
    <div className={s.convImageBox}>
      <img src={convImg} alt="" className={s.convImg} />
      <img src={bookmarkIcon} alt="" className={s.bookmarkIcon} />
    </div>
    <div className={s.convRight}>
      <div className={s.chatHeading}>
        <div className={s.leftHeading}>
          <span className={s.monthText}>MAY</span>
          <div className={s.dayText}>22</div>
        </div>
        <div className={s.middleHeading}>
          <img src={NYTLogo} alt="NYT Logo" className={s.NYTLogo} />
          <span className={s.articleTitle}>Zero Waste Toothbrush: How does it really make a difference</span>
        </div>
        <div className={s.rightHeading}>
          <img src={dots3Icon} alt="" className={s.threeDotsIcon} />
        </div>
      </div>
      <span className={s.startTime}>THURSDAY 10:00 PM EST</span>
      <div className={s.chatTags}>
        <div className={s.chatTag}>Eco-Friendly</div>
        <div className={s.chatTag}>Sustainability</div>
        <div className={s.chatTag}>Zero Waste</div>
      </div>
      <p className={s.chatDescription}>
        With zero waste taking over the world and people becoming more aware of their carbon footprint and how their actions affect the planet more options for sustaiable items have become avaiable.
      </p>
      <hr className={s.convLine} />
      <div className={s.RSVP_Row}>
        <div className={s.RSVP_Left}>
          <div className={s.ProfileLeft}>
            <img src={emilyIcon} alt="Profile Icon" className={s.emilyIcon} />
            <div className={s.onlineCircle}></div>
          </div>
          <div className={s.ProfileNames}>
            <span className={s.hostText}>HOST</span>
            <div className={s.profileName}>Emily Patterson</div>
          </div>
        </div>
        <button className={s.RSVP_Btn}>RSVP NOW</button>
      </div>
    </div>
  </div>
}

const ChatCard = ({ title, timeStart, chatImage }) => {
  return <div className={s.chatCard}>
    <img src={chatImage} alt="Chat Img" className={s.chatImage} />
    <div className={s.chatBottomSide}>
      <h2 className={s.timeStart}>{timeStart}</h2>
      <h4 className={s.chatTitle}>{title}</h4>
    </div>
  </div>
}

export default HomePage;