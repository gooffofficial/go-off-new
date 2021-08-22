import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from '../styles/HomePage/Home.module.scss';

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
	const [currentUser, setCurrentUser] = useState(fillerUser);
	const [currentUserFull, setCurrentUserFull] = useState(fillerUser);
	const [allUserFull, setAllUserFull] = useState(fillerUser);

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
								axios
									.get('/api/getconvos', { withCredentials: true})
									.then((res3) => {
										setAllUserFull({
											allupcomingChats: res3.data,
										});
									});
							});
					});
			})
			.catch((err) => {
				console.log(err);
			});
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
						<div className={styles.sideBarProfile}>
							<img
								className={styles.sideBarProfileImage}
								src={currentUserFull.propic}
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
						<div
							className={styles.sideBarDiscover}
							onClick={() => history.push('/discover')}
						>
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
									d="M21.1109 22.898C20.8959 22.3567 20.5909 21.8842 20.3234 21.4805C20.1884 21.278 20.0496 21.0717 19.9284 20.8592C19.4421 20.0142 19.6096 19.6717 20.3984 18.3505L20.5259 18.1342C21.1646 17.058 21.1996 16.0255 21.2321 15.1155C21.2471 14.668 21.2621 14.2467 21.3484 13.8505C21.5496 12.9355 23.4834 12.6917 24.6821 12.548C24.8834 13.3342 24.9996 14.153 24.9996 15.0005C24.9996 18.2117 23.4721 21.0667 21.1109 22.898ZM6.20213 19.7492C6.99713 19.9517 7.85838 20.0917 8.73463 20.0917C10.0846 20.0917 11.4634 19.7617 12.6559 18.828C14.8009 17.1505 14.8009 15.0055 14.8009 13.2805C14.8009 12.1655 14.8009 11.2042 15.2659 10.3505C15.5159 9.89299 16.0484 9.57549 16.6646 9.20674C17.0421 8.98049 17.4334 8.74799 17.8084 8.45299C18.6121 7.82424 19.2096 7.01549 19.5796 6.12049C21.3296 7.02674 22.7796 8.43049 23.7371 10.1492C21.9521 10.3967 19.4184 10.9817 18.9071 13.3155C18.7721 13.933 18.7509 14.5142 18.7346 15.028C18.7084 15.7567 18.6884 16.333 18.3759 16.8605L18.2509 17.0705C17.4421 18.4242 16.5271 19.9592 17.7609 22.1055C17.9096 22.3655 18.0759 22.6155 18.2396 22.8642C18.6696 23.5092 18.8809 23.8655 18.8821 24.2155C17.6884 24.7205 16.3759 25.0005 14.9996 25.0005C11.2034 25.0005 7.89588 22.873 6.20213 19.7492ZM14.9996 5.00049C15.7696 5.00049 16.5134 5.09549 17.2334 5.26049C17.0221 5.72549 16.6959 6.14924 16.2659 6.48549C15.9934 6.70049 15.6871 6.87924 15.3834 7.06049C14.5696 7.54549 13.6484 8.09549 13.0709 9.15299C12.3009 10.5655 12.3009 12.008 12.3009 13.2805C12.3009 14.9742 12.2459 15.9755 11.1159 16.8592C9.40463 18.2005 6.78588 17.4517 5.16588 16.7705C5.06338 16.1942 4.99963 15.6042 4.99963 15.0005C4.99963 9.48674 9.48589 5.00049 14.9996 5.00049ZM14.9996 2.50049C8.10713 2.50049 2.49963 8.10799 2.49963 15.0005C2.49963 21.8917 8.10713 27.5005 14.9996 27.5005C21.8921 27.5005 27.4996 21.8917 27.4996 15.0005C27.4996 8.10799 21.8921 2.50049 14.9996 2.50049Z"
									fill="#757D8A"
								/>
							</svg>
							<p className={styles.sideBarLinkText}>Discover</p>
						</div>
					</div>

					<div className={styles.sideBarCards}>
						<div>
							<h3 className={styles.sideBarCardTitle}>Upcoming Chats</h3>
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
