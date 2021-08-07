import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
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
import EyeConv from '../images/EyeConv.png'
import FacesConv from '../images/FacesConv.png'
import BrushConv from '../images/BrushConv.png'
import brushChat from '../images/brushChat.png'
import peopleIcon from '../images/people.png'
import styles from '../styles/DiscoverPage/discoverPage.module.css';
import NavBar from '../components/NavBar.js';
import UpcomingChatsCard from '../components/UpcomingChatsCard.js';

const fillerUser = {
	name: 'Username',
	propic: '/images/stock-face.jpg',
};

const DiscoverPage = () => {
  const [currentUser, setCurrentUser] = useState(fillerUser);
	const [currentUserFull, setCurrentUserFull] = useState(fillerUser);

	const history = useHistory();
	// const history = useHistory();

	useEffect(() => {
		axios
			.get(`/api/users/current`, {
				withCredentials: true,
			})
			.then((res) => {
				setCurrentUser(res.data.user);

				axios
					.get(`/api/users/profile/${res.data.user.username}`, {
						withCredentials: true,
					})
					.then((res2) => {
            setCurrentUserFull(res2.data.user);
            
            axios
							.get('/api/upcoming', { withCredentials: true })
							.then((res) => {
								setCurrentUserFull({
									...res2.data.user,
									upcomingChats: res.data,
								});
							});
					});
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	let trendingImageSources = [
		'/images/trend-stock1.png',
		'/images/trend-stock2.png',
		'/images/trend-stock3.png',
		'/images/trend-stock4.png',
    ];

  return <div className={styles["discoverPage"]}>
    <NavBar name={currentUser.name} avatarSource={currentUserFull.propic}/>
    <div className={styles["di-mainContent"]}>
      <div className={styles["di-leftColumn"]}>
        <div className={styles["di-avatarBox"]}>
          <img src={prekshaIcon} alt="avatar" className={styles["di-prekshaIcon"]} />
          <span className={styles["di-avatarName"]}>Preksha Munot</span>
        </div>
        <div className={styles["di-homeBox"]} onClick={() => history.push('/discover')}>
          <img src={homeIcon} alt="homeImage" className={styles["di-homeIcon"]} />
          <span className={styles["di-homeText"]}>Home</span>
        </div>
        <div className={`${styles['di-discoverBox']} ${styles['di-selected']}`}>
          <img src={globeIcon} alt="discoverImage" className={styles["di-globeIcon"]} />
          <span className={styles["di-globeText"]}>Discover</span>
        </div>
        <h1 className={styles["di-upcommingHeading"]}>Upcoming Chats</h1>
        <div className={styles["di-upcomingChats"]}>
          {currentUserFull.upcomingChats ? (
                  currentUserFull.upcomingChats.map((prop) => {
                    return (
                      <UpcomingChatsCard
                        articleURL={prop.articleURL}
                        articleImg={prop.articleImg}
                        time={prop.time}
                        convTitle={prop.convTitle}
                        hostName={prop.hostname}
                        roomId={prop.roomId}
                      />
                    );
                  })
                ) : (
                  <UpcomingChatsCard />
                )}
        </div>
      </div>
      <div className={styles["di-middleColumn"]}>
        <h1 className={styles["happeningNowTxt"]}>Happening Now</h1>
        <div className={styles["di-convRow"]}>
          <HappeningNowCard convImg={BrushConv} convTitle='Zero Waste Toothbrush: How does it really make a difference?' />
          <HappeningNowCard convImg={FacesConv} convTitle='Zero Waste Toothbrush: How does it really make a difference?' />
          <HappeningNowCard convImg={EyeConv} convTitle='Zero Waste Toothbrush: How does it really make a difference?' />
          {/* <img src={BrushConv} alt="" className={styles["di-convImg"]} />
          <img src={FacesConv} alt="" className={styles["di-convImg"]} />
          <img src={EyeConv} alt="" className={styles["di-convImg"]} /> */}
        </div>
        <h2 className={styles["trendingTxt"]}>Trending</h2>
        <div className={styles["di-convRow"]}>
          <TrendingCard convImg={BrushConv} convTitle='Zero Waste Toothbrush: How does it really make a difference?' />
          <TrendingCard convImg={FacesConv} convTitle='Zero Waste Toothbrush: How does it really make a difference?' />
          <TrendingCard convImg={EyeConv} convTitle='Zero Waste Toothbrush: How does it really make a difference?' />
        </div>
        {/* <div className={styles["di-browseRow1"]}>
          <div className={`${styles['di-browseBox']} ${styles['di-LGBTQ']}`}>LGBTQ+</div>
          <div className={`${styles['di-browseBox']} ${styles['di-Politics']}`}>Politics</div>
          <div className={`${styles['di-browseBox']} ${styles['di-Fasion']}`}>Fashion</div>
        </div>
        <div className={styles["di-browseRow2"]}>
          <div className={`${styles['di-browseBox']} ${styles['di-popCultureBox']}`}>Pop Culture</div>
          <div className={`${styles['di-browseBox']} ${styles['di-artBox']}`}>Art</div>
          <div className={`${styles['di-browseBox']} ${styles['di-SustainabilityBox']}`}>Sustainability</div>
        </div> */}
      </div>
      <div className={styles["rightColumn"]}>
        <div className={styles["featuredTxtRow"]}>
          <img src={peopleIcon} alt="" className={styles["peopleIcon"]} />
          <h2 className={styles["featuredTxt"]}>Featured Hosts</h2>
        </div>
        <FeaturedHost hostImg={prekshaIcon} hostName="Preksha Munot" followersAmt={100} isFollowing={false} />
        <FeaturedHost hostImg={prekshaIcon} hostName="Preksha Munot" followersAmt={100} isFollowing={false} />
        <FeaturedHost hostImg={prekshaIcon} hostName="Preksha Munot" followersAmt={100} isFollowing={true} />
        <FeaturedHost hostImg={prekshaIcon} hostName="Preksha Munot" followersAmt={100} isFollowing={false} />
        <FeaturedHost hostImg={prekshaIcon} hostName="Preksha Munot" followersAmt={100} isFollowing={false} />
        <FeaturedHost hostImg={prekshaIcon} hostName="Preksha Munot" followersAmt={100} isFollowing={true} />
        <FeaturedHost hostImg={prekshaIcon} hostName="Preksha Munot" followersAmt={100} isFollowing={false} />
        <FeaturedHost hostImg={prekshaIcon} hostName="Preksha Munot" followersAmt={100} isFollowing={true} />
        <FeaturedHost hostImg={prekshaIcon} hostName="Preksha Munot" followersAmt={100} isFollowing={false} />
        <FeaturedHost hostImg={prekshaIcon} hostName="Preksha Munot" followersAmt={100} isFollowing={false} />
      </div>
    </div>
  </div>
}

const FeaturedHost = ({ hostImg, hostName, followersAmt, isFollowing = false }) => {
  return <div className={styles['FeaturedHostRow']}>
    <div className={styles['leftSideFeatured']}>
      <img src={hostImg} alt="" className={styles['hostAvatar']} />
      <div className={styles['hostInfo']}>
        <span className={styles['hostName']}>{hostName}</span>
        <span className={styles['followersAmt']}>{followersAmt} followers</span>
      </div>
    </div>
    <div className={styles['rightSideFeatured']}>
      {isFollowing ? <button className={styles['followingBtn']}>Following</button> : 
        <button className={styles['followBtn']}>Follow</button>}
    </div>
  </div>
}

const HappeningNowCard = ({ convImg, convTitle }) => {
  return <div className={styles['HappeningNowCard']}>
    <img src={convImg} alt="" className={styles["di-convImg"]} />
    <span className={styles['convDateStart']}>HAPPENING NOW</span>
    <h2 className={styles['convTitle']}>{convTitle}</h2>
  </div>
}

const TrendingCard = ({ convImg, convTitle }) => {
  return <div className={styles['TrendingCard']}>
    <img src={convImg} alt="" className={styles["di-convImg"]} />
    <span className={styles['convDateStartTrending']}>THURSDAY 10:00 PM EST</span>
    <h2 className={styles['convTitle']}>{convTitle}</h2>
  </div>
}

// const DINavBar = ({}) => {
//   return <div className={styles["di-navbar"]}>
//     <img src={goOffLogo} alt="Go Off! Logo" className={styles["di-goOffLogo"]} />
//     <div className={styles["di-searchBar"]}>
//       <img src={searchIcon} alt="Search Icon" className={styles["di-searchIcon"]} />
//       <input type="search" className={styles["di-searchInput"]} placeholder="Search" />
//       <img src={optionsIcon} alt="Settings" className={styles["di-optionsIcon"]} />
//     </div>
//     <img src={addPersonIcon} alt="Add person" className={styles["di-addPersonIcon"]} />
//     <img src={bellIcon} alt="Notifications" className={styles["di-bellIcon"]} />
//     <img src={shareIcon} alt="Share" className={styles["di-shareIcon"]} />
//     <div className={styles["di-navProfileBox"]}>
//       <div className={styles["di-profile"]}>
//         <img src={prekshaIcon} alt="avatar" className={styles["di-profileIcon"]} />
//         <span className={styles["di-profileText"]}>Preksha Munot</span>
//         <img src={arrowDownIcon} alt="dropDown" className={styles["di-arrowDownIcon"]} />
//       </div>
//     </div>
//   </div>
// }

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