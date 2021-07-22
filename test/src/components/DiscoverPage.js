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
import '../styles/discoverPage.css';

const DiscoverPage = () => {
  return <div className="discoverPage">
    <DINavBar />
    <div className="di-mainContent">
      <div className="di-leftColumn">
        <div className="di-avatarBox">
          <img src={prekshaIcon} alt="avatar" className="di-prekshaIcon" />
          <span className="di-avatarName">Preksha Munot</span>
        </div>
        <div className="di-homeBox">
          <img src={homeIcon} alt="homeImage" className="di-homeIcon" />
          <span className="di-homeText">Home</span>
        </div>
        <div className="di-discoverBox di-selected">
          <img src={globeIcon} alt="discoverImage" className="di-globeIcon" />
          <span className="di-globeText">Discover</span>
        </div>
        <h1 className="di-upcommingHeading">Upcoming Chats</h1>
        <div className="di-upcomingChats">
          <DIChatCard title="Zero Waste Toothbrush: How does it really make a difference?" timeStart="THURSDAY, MAY 22 AT 10 PM EST" chatImage='/brushChat.png' />
          <DIChatCard title="Zero Waste Toothbrush: How does it really make a difference?" timeStart="THURSDAY, MAY 22 AT 10 PM EST" chatImage='/brushChat.png' />
        </div>
      </div>
      <div className="di-rightColumn">
        <h1 className="trendingConvoTxt">Trending Conversations</h1>
        <div className="di-convRow">
          <img src="/BrushConv.png" alt="" className="di-convImg" />
          <img src="/FacesConv.png" alt="" className="di-convImg" />
          <img src="/EyeConv.png" alt="" className="di-convImg" />
        </div>
        <h2 className="di-browseTxt">Browse All</h2>
        <div className="di-browseRow1">
          <div className="di-browseBox di-LGBTQ">LGBTQ+</div>
          <div className="di-browseBox di-Politics">Politics</div>
          <div className="di-browseBox di-Fasion">Fashion</div>
        </div>
        <div className="di-browseRow2">
          <div className="di-browseBox di-popCultureBox">Pop Culture</div>
          <div className="di-browseBox di-artBox">Art</div>
          <div className="di-browseBox di-SustainabilityBox">Sustainability</div>
        </div>
      </div>
    </div>
  </div>
}

const DINavBar = ({}) => {
  return <div className="di-navbar">
    <img src={goOffLogo} alt="Go Off! Logo" className="di-goOffLogo" />
    <div className="di-searchBar">
      <img src={searchIcon} alt="Search Icon" className="di-searchIcon" />
      <input type="search" className="di-searchInput" placeholder="Search" />
      <img src={optionsIcon} alt="Settings" className="di-optionsIcon" />
    </div>
    <img src={addPersonIcon} alt="Add person" className="di-addPersonIcon" />
    <img src={bellIcon} alt="Notifications" className="di-bellIcon" />
    <img src={shareIcon} alt="Share" className="di-shareIcon" />
    <div className="di-navProfileBox">
      <div className="di-profile">
        <img src={prekshaIcon} alt="avatar" className="di-profileIcon" />
        <span className="di-profileText">Preksha Munot</span>
        <img src={arrowDownIcon} alt="dropDown" className="di-arrowDownIcon" />
      </div>
    </div>
  </div>
}

const DIChatCard = ({ title, timeStart, chatImage }) => {
  return <div className="di-chatCard">
    <img src={chatImage} alt="chatImage" className="di-chatImage" />
    <div className="di-chatBottomSide">
      <h2 className="di-timeStart">{timeStart}</h2>
      <h4 className="di-chatTitle">{title}</h4>
    </div>
  </div>
}

export default DiscoverPage