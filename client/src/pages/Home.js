import React, { useEffect, useState, useContext} from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from '../styles/HomePage/Home.module.scss';
import { UserContext } from '../contexts/userContext';

// Components
import NavBar from '../components/NavBar.js';
import NewsFeedCard from '../components/FeedCard.js';
import TrendingCard from '../components/TrendingCard.js';
import FriendActivityCard from '../components/FriendActivityCard.js';
import UpcomingChatsCard from '../components/UpcomingChatsCard.js';
import AllUpcomingChatsCard from '../components/AllUpcomingChatsCard.js';
import Conversation from '../components/Conversation.js'; 

const fillerUser = {
	name: 'Username',
	propic: '/images/stock-face.jpg',
};

const Home = (props) => {
	const {currentUser, setCurrentUser, upcoming, convos} = useContext(UserContext)
	const [currentUserFull, setCurrentUserFull] = useState({...currentUser,upcomingChats: upcoming});
	const [allUserFull, setAllUserFull] = useState({allupcomingChats: convos});

	const history = useHistory();
	// const history = useHistory();

	//when used in sort function it will return array of chats from newest to oldest
	const compareDate = (date1, date2) => {
		if(date1.time>date2.time){
			return -1
		}
		if(date1.time<date2.time){
			return 1
		}
		return 0
	}

	useEffect(() => {
		const chronConvos = [...convos].sort(compareDate)
		setAllUserFull({allupcomingChats: chronConvos})
		/* //*!try and use userContext for using data about user. chect userContext file for more details
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
              .get('/api/upcoming', { withCredentials: true})
              .then((res) => {
                setCurrentUserFull({
                  ...res2.data.user,
                  upcomingChats: res.data,
                })
                axios
									.get('/api/getconvos', { withCredentials: true})
									.then((res3) => {
										setAllUserFull({
											allupcomingChats: res3.data,
										});
									});
              })
					});
			})
			.catch((err) => {
				console.log(err);
			});
    */
	}, []);

	console.log(currentUserFull)
	console.log(allUserFull.allupcomingChats)
	let trendingImageSources = [
		'/images/trend-stock1.png',
		'/images/trend-stock2.png',
		'/images/trend-stock3.png',
		'/images/trend-stock4.png',
	];

	return (
		<div className={styles.homePageContainer}>
			<NavBar name={currentUser.name} avatarSource={currentUserFull.propic} host={currentUserFull.host} />
			<div className={styles.subContainer}>
				<div className={styles.leftSideBar}>
					<div className={styles.sideBarLinks}>
						<div className={styles.sideBarProfile} onClick={() => history.push('/profile')}>
							<img
								className={styles.sideBarProfileImage}
								src={currentUserFull
									? currentUserFull.propic
									: '/images/stock-face.jpg'}
								alt="profile portrait"
							/>
							<p className={styles.sideBarUserLinkText}>{currentUser.name}</p>
						</div>
						<div className={styles.sideBarHome}>
							<svg
								width="30"
								height="30"
								viewBox="0 0 30 30"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M23.7377 24.9999H20.0002V16.2499C20.0002 15.5587 19.4402 14.9999 18.7502 14.9999H11.2502C10.559 14.9999 10.0002 15.5587 10.0002 16.2499V24.9999H6.25024L6.25774 14.4787L14.9977 5.53995L23.7502 14.5299L23.7377 24.9999ZM12.5002 24.9999H17.5002V17.4999H12.5002V24.9999ZM25.5302 12.7312L15.894 2.8762C15.4227 2.39495 14.5777 2.39495 14.1065 2.8762L4.46899 12.7324C4.01274 13.2012 3.75024 13.8562 3.75024 14.5299V24.9999C3.75024 26.3787 4.80899 27.4999 6.11024 27.4999H11.2502H18.7502H23.889C25.1902 27.4999 26.2502 26.3787 26.2502 24.9999V14.5299C26.2502 13.8562 25.9877 13.2012 25.5302 12.7312Z"
									fill="#757D8A"
								/>
							</svg>

							<p className={styles.sideBarLinkText}>Home</p>
						</div>
						
					</div>

					<div className={styles.sideBarCards}>
						<div>
							<h3 className={styles.sideBarCardTitle}>Your Upcoming Convos</h3>
						</div>

						<div className={styles.upcomingChatsCards}>
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
				</div>
				<div className={styles.centerDash}>
					<div className={styles.centerImageContainer}>
						<img
							className={styles.centerImage}
							src="/images/girl-center-image.png"
							alt="girl-on-phone"
						/>
						<div className={styles.centerImageTextContainer}>
							<h3 className={styles.centerImageTitleText}>Become a Host</h3>
							<div className={styles.centerImgSecondaryContent}>
								<p className={styles.centerImageDescText}>
									Host Conversations and increase your engagement online
								</p>
								<div className={styles.ctaButton}>
									<p className={styles.ctaText}>LEARN MORE</p>
								</div>
							</div>
						</div>
					</div>
					<div className={styles.centerFeed}>
							{allUserFull.allupcomingChats ? (
								allUserFull.allupcomingChats.map((prop1) => {
									return (
										<Conversation
										articleURL={prop1.articleURL}
										articleImg={prop1.articleImg}
										time={prop1.time}
										convTitle={prop1.convTitle}
										hostName={prop1.hostName}
										roomId={prop1.roomId}
										desc={prop1.desc}
										hostid={prop1.hostID}
										userpfp={prop1.hostpfp}
										hostNum={prop1.hostNum}
										userid={prop1.userID}
										useremail={prop1.useremail}
                        				userPnum={prop1.userPnum}
										hostUName={prop1.username}
										/>
										
									);
									
								})
							) : (
								<Conversation />
							)}
							{/* <FeedCard />
							<FeedCard /> */}
					</div>
				</div>
				{/* <div className={styles.rightSideBar}>
					<div className={styles.trendingContainer}>
						<div className={styles.trendingTitleContainer}>
							<div className={styles.trendingIconContainer}>
								<svg
									className={styles.trendingIcon}
									width="30"
									height="30"
									viewBox="0 0 30 30"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M26.2403 8.70363C26.2378 8.61363 26.2115 8.52863 26.1878 8.44238C26.169 8.36988 26.1603 8.29613 26.129 8.22988C26.1003 8.16488 26.0515 8.11238 26.009 8.05238C25.9565 7.97613 25.909 7.89988 25.8415 7.83738C25.8303 7.82613 25.8253 7.81113 25.8128 7.80113C25.7678 7.76238 25.7128 7.74863 25.664 7.71738C25.589 7.66863 25.5153 7.61863 25.4303 7.58613C25.3465 7.55613 25.264 7.54863 25.1778 7.53613C25.1178 7.52738 25.064 7.49988 25.0003 7.49988H18.7503C18.059 7.49988 17.5003 8.05988 17.5003 8.74988C17.5003 9.43988 18.059 9.99988 18.7503 9.99988H22.2828L17.2378 15.8849L11.8928 12.6786C11.364 12.3586 10.684 12.4761 10.289 12.9499L4.039 20.4499C3.59775 20.9799 3.669 21.7686 4.199 22.2099C4.434 22.4049 4.7165 22.4999 4.999 22.4999C5.35775 22.4999 5.71275 22.3474 5.96025 22.0499L11.5253 15.3724L16.8565 18.5724C17.3803 18.8861 18.0528 18.7761 18.449 18.3136L23.7503 12.1286V14.9999C23.7503 15.6899 24.309 16.2499 25.0003 16.2499C25.6915 16.2499 26.2503 15.6899 26.2503 14.9999V8.74988C26.2503 8.73363 26.2415 8.71988 26.2403 8.70363Z"
										fill="#757D8A"
									/>
								</svg>
							</div>

							<p className={styles.trendingTitle}>Trending</p>
						</div>

						<div className={styles.trendingCards}>
							{trendingImageSources.map((src) => {
								return (
									<TrendingCard
										key={src}
										imageSource={src}
										description="Zero Waste Toothbrush: How does it really make a difference?"
										onClick = {() => history.push('/discover')}
									/>
								);
							})}
						</div>
					</div>

					<div className={styles.friendActivityContainer}>
						<div className={styles.friendActivityTitleContainer}>
							<div className={styles.friendActivityIconContainer}>
								<svg
									className={styles.friendIco}
									width="30"
									height="30"
									viewBox="0 0 30 30"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M22.5 12.5C22.5 11.8112 21.94 11.25 21.25 11.25C20.56 11.25 20 11.8112 20 12.5C20 13.1888 20.56 13.75 21.25 13.75C21.94 13.75 22.5 13.1888 22.5 12.5ZM25 12.5C25 14.5675 23.3175 16.25 21.25 16.25C19.1825 16.25 17.5 14.5675 17.5 12.5C17.5 10.4325 19.1825 8.75 21.25 8.75C23.3175 8.75 25 10.4325 25 12.5ZM13.75 8.75C13.75 7.37125 12.6287 6.25 11.25 6.25C9.87125 6.25 8.75 7.37125 8.75 8.75C8.75 10.1287 9.87125 11.25 11.25 11.25C12.6287 11.25 13.75 10.1287 13.75 8.75ZM16.25 8.75C16.25 11.5075 14.0075 13.75 11.25 13.75C8.4925 13.75 6.25 11.5075 6.25 8.75C6.25 5.9925 8.4925 3.75 11.25 3.75C14.0075 3.75 16.25 5.9925 16.25 8.75ZM17.425 18.8075C18.5112 17.9675 19.8487 17.5 21.25 17.5C24.6963 17.5 27.5 20.3037 27.5 23.75C27.5 24.44 26.9412 25 26.25 25C25.5588 25 25 24.44 25 23.75C25 21.6825 23.3175 20 21.25 20C20.3962 20 19.585 20.2925 18.93 20.8113C19.61 22.0562 20 23.4837 20 25C20 25.69 19.4412 26.25 18.75 26.25C18.0588 26.25 17.5 25.69 17.5 25C17.5 21.5537 14.6962 18.75 11.25 18.75C7.80375 18.75 5 21.5537 5 25C5 25.69 4.44125 26.25 3.75 26.25C3.05875 26.25 2.5 25.69 2.5 25C2.5 20.175 6.42625 16.25 11.25 16.25C13.6588 16.25 15.8412 17.2288 17.425 18.8075Z"
										fill="#757D8A"
									/>
								</svg>
							</div>

							<p className={styles.friendActivityTitle}>Friend Activity</p>
						</div>

						<div className={styles.friendActivityCards}>
							<FriendActivityCard
								avatarSource="/images/friend.png"
								name="User Name"
								action="saved a conversation hosted by"
								hostedBy="Erick Canales"
							/>

							<FriendActivityCard
								avatarSource="/images/friend.png"
								name="User Name"
								action="saved a conversation hosted by"
								hostedBy="Erick Canales"
							/>

							<FriendActivityCard
								avatarSource="/images/friend.png"
								name="User Name"
								action="saved a conversation hosted by"
								hostedBy="Erick Canales"
							/>

							<FriendActivityCard
								avatarSource="/images/friend.png"
								name="User Name"
								action="saved a conversation hosted by"
								hostedBy="Erick Canales"
							/>
						</div>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default Home;
