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
import styles from '../styles/DiscoverPage/discoverPage.css';

const DiscoverPage = () => {
  return <div className="discoverPage">
    <DINavBar />
    <div className={styles["di-mainContent"]}>
      <div className={styles["di-leftColumn"]}>
        <div className={styles["di-avatarBox"]}>
          <img src={prekshaIcon} alt="avatar" className={styles["di-prekshaIcon"]} />
          <span className={styles["di-avatarName"]}>Preksha Munot</span>
        </div>
        <div className={styles["di-homeBox"]}>
          <img src={homeIcon} alt="homeImage" className={styles["di-homeIcon"]} />
          <span className={styles["di-homeText"]}>Home</span>
        </div>
        <div className={styles["di-discoverBox di-selected"]}>
          <img src={globeIcon} alt="discoverImage" className={styles["di-globeIcon"]} />
          <span className={styles["di-globeText"]}>Discover</span>
        </div>
        <h1 className={styles["di-upcommingHeading"]}>Upcoming Chats</h1>
        <div className={styles["di-upcomingChats"]}>
          <DIChatCard title="Zero Waste Toothbrush: How does it really make a difference?" timeStart="THURSDAY, MAY 22 AT 10 PM EST" chatImage='/brushChat.png' />
          <DIChatCard title="Zero Waste Toothbrush: How does it really make a difference?" timeStart="THURSDAY, MAY 22 AT 10 PM EST" chatImage='/brushChat.png' />
        </div>
      </div>
      <div className={styles["di-rightColumn"]}>
        <h1 className={styles["trendingConvoTxt"]}>Trending Conversations</h1>
        <div className={styles["di-convRow"]}>
          <img src="/BrushConv.png" alt="" className={styles["di-convImg"]} />
          <img src="/FacesConv.png" alt="" className={styles["di-convImg"]} />
          <img src="/EyeConv.png" alt="" className={styles["di-convImg"]} />
        </div>
        <h2 className={styles["di-browseTxt"]}>Browse All</h2>
        <div className={styles["di-browseRow1"]}>
          <div className={styles["di-browseBox di-LGBTQ"]}>LGBTQ+</div>
          <div className={styles["di-browseBox di-Politics"]}>Politics</div>
          <div className={styles["di-browseBox di-Fasion"]}>Fashion</div>
        </div>
        <div className={styles["di-browseRow2"]}>
          <div className={styles["di-browseBox di-popCultureBox"]}>Pop Culture</div>
          <div className={styles["di-browseBox di-artBox"]}>Art</div>
          <div className={styles["di-browseBox di-SustainabilityBox"]}>Sustainability</div>
        </div>
      </div>
    </div>
  </div>
}

const DINavBar = ({}) => {
  return <div className={styles["di-navbar"]}>
    <img src={goOffLogo} alt="Go Off! Logo" className={styles["di-goOffLogo"]} />
    <div className={styles["di-searchBar"]}>
      <img src={searchIcon} alt="Search Icon" className={styles["di-searchIcon"]} />
      <input type="search" className={styles["di-searchInput"]} placeholder="Search" />
      <img src={optionsIcon} alt="Settings" className={styles["di-optionsIcon"]} />
    </div>
    <img src={addPersonIcon} alt="Add person" className={styles["di-addPersonIcon"]} />
    <img src={bellIcon} alt="Notifications" className={styles["di-bellIcon"]} />
    <img src={shareIcon} alt="Share" className={styles["di-shareIcon"]} />
    <div className={styles["di-navProfileBox"]}>
      <div className={styles["di-profile"]}>
        <img src={prekshaIcon} alt="avatar" className={styles["di-profileIcon"]} />
        <span className={styles["di-profileText"]}>Preksha Munot</span>
        <img src={arrowDownIcon} alt="dropDown" className={styles["di-arrowDownIcon"]} />
      </div>
    </div>
  </div>
}

const DIChatCard = ({ title, timeStart, chatImage }) => {
  return <div className={styles["di-chatCard"]}>
    <img src={chatImage} alt="chatImage" className={styles["di-chatImage"]} />
    <div className={styles["di-chatBottomSide"]}>
      <h2 className={styles["di-timeStart"]}>{timeStart}</h2>
      <h4 className={styles["di-chatTitle"]}>{title}</h4>
    </div>
  </div>
}

export default DiscoverPage