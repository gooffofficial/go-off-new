import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from '../styles/ProfilePage/Profile.module.scss';
import { UserContext } from '../contexts/userContext';

// Components
import NavBar from '../components/NavBar.js';
import { ChatsFeed } from '../components/FeedCard.js';
import UpcomingChatsCard from '../components/UpcomingChatsCard.js';

const fillerUser = {
	name: 'Username',
	propic: '/images/stock-face.jpg',
	username: 'username',
	followercount: 0,
	followingcount: 0,
};

const PublicProfile = (props) => {
	const {currentUser, setCurrentUser, upcoming, convos} = useContext(UserContext)
	const [currentUserFull, setCurrentUserFull] = useState({...currentUser,upcomingChats: upcoming});
	const [viewUser, setViewUser] = useState(currentUser);
	const [chatCategory, setChatCategory] = useState('Upcoming'); // "Upcoming", "Past", "Saved"
	const [isFollowingButton, setIsFollowingButton] = useState(false);

	const history = useHistory();
	const username = props.match.params.username;

	const goToHomePage = (evt) => {
		let isHost = currentUserFull.host === "(Host)";
		let isAdmin = currentUserFull.admin === "(Admin)";
		if (isHost || isAdmin)
		  history.push('/hosthome')
		else 
		  history.push('/home')
	  }

	useEffect(() => {
		/* 
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

		axios
			.get(`${process.env.REACT_APP_NODE_API}/api/users/profile/${username}`, {withCredentials:true})
			.then((res) => {
				setViewUser(res.data.user);
				setIsFollowingButton(res.data.user.is_following);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [username]);

	const followHandler = (e) => {
		axios
			.post(`${process.env.REACT_APP_NODE_API}/api/users/follower_update`, {
				username: viewUser.username,
				id: currentUser.id,
			}, {withCredentials:true})
			.then((res) => {
				setIsFollowingButton(res.data.followingStatus);
				setViewUser({
					...viewUser,
					followercount: res.data.followingStatus
						? (viewUser.followercount += 1)
						: (viewUser.followercount -= 1),
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};
	let isUser = currentUserFull.username == viewUser.username
	console.log(isUser)
	return (
		<div className={styles.profilePageContainer}>
			<NavBar name={currentUser.name} avatarSource={currentUserFull.propic} host={currentUserFull.host} />
			<div className={styles.subContainer}>
				<div className={styles.leftSideBar}>
					<div className={styles.sideBarLinks}>
						<div className={styles.sideBarProfile}>
							<img
								className={styles.sideBarProfileImage}
								src={
									currentUserFull
										? currentUserFull.propic
										: '/images/stock-face.jpg'
								}
								alt="profile portrait"
							/>
							<p className={styles.sideBarUserLinkText}>{currentUser.name}</p>
						</div>
						<div
							className={styles.sideBarHome}
							onClick={goToHomePage}
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

				<div className={styles.profCenterDash}>
					<div className={styles.profilePageInfoContainer}>
						<div className={styles.profilePageTopWrapper}>
							<div className={styles.profilePageAvatarContainer}>
								<img
									className={styles.profilePageAvatar}
									src={
										viewUser.propic ? viewUser.propic : '/images/stock-face.jpg'
									}
									alt="avatar"
								/>
							</div>

							<div className={styles.profilePageInfo}>
								<h1 className={styles.profilePageName}>{viewUser.name}{viewUser.admin}{viewUser.host}</h1>
								<p
									className={styles.profilePageUsername}
								>{`@${viewUser.username}`}</p>
								<p
									className={styles.profilePageFollowing}
								>{`${viewUser.followercount} followers ??? ${viewUser.followingcount} following`}</p>
								<p className={styles.profilePageBio}>
									{viewUser.bio ? viewUser.bio : 'No bio yet!'}
								</p>
							</div>

							<div className={styles.followBtnContainer}>
								<div
									className={
										isFollowingButton
											? styles.followBtnFollowing
											: styles.followBtn
									}
									onClick={followHandler}
								>
									<p>{isFollowingButton ? 'Unfollow' : 'Follow'}</p>
								</div>
							</div>
						</div>

						<div className={styles.profilePageDivider} />

						<div className={styles.profilePageTabsContainer}>
							<div
								onClick={() => setChatCategory('Upcoming')}
								className={styles.profilePageTab}
							>
								<p className={styles.profilePageTabText}>Upcoming</p>
							</div>

							<div
								onClick={() => setChatCategory('Past')}
								className={styles.profilePageTab}
							>
								<p className={styles.profilePageTabText}>Past</p>
							</div>

							{/* <div
								onClick={() => setChatCategory('Saved')}
								className={styles.profilePageTab}
							>
								<p className={styles.profilePageTabText}>Saved</p>
							</div> */}
						</div>
					</div>

					<div className={styles.profCenterFeed}>
						<ChatsFeed chatCategory={chatCategory} userId={currentUserFull.id} isUser={isUser} username={viewUser.username}/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PublicProfile;
