import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from '../styles/ProfilePage/Profile.module.scss';
import { useMutation } from 'react-query'
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { sendEditProf } from "../styles/AuthPage/api.js"
import {
	BrowserView,
	MobileView,
	isBrowser,
	isMobile
} from "react-device-detect";
// Components
import ProfileMobile from './ProfileMobile';
import NavBar from '../components/NavBar.js';
import { ChatsFeed } from '../components/FeedCard.js';
import UpcomingChatsCard from '../components/AllUpcomingChatsCard.js';
import PencilIcon from '../images/Unionpencil.png'
import { UserContext } from '../contexts/userContext';
import MobileProfile from './mobile/MobileProfile';

import s from '../styles/HomePage/HostHome.module.scss';
import homeIcon from '../images/liveChatImages/home-icon.png'

const fillerUser = {
	name: 'Username',
	propic: '/images/stock-face.jpg',
	username: 'username',
	followercount: 0,
	followingcount: 0,
};

const Profile = (props) => {
	const {currentUser, setCurrentUser, upcoming, setUpcoming, refetchUser, refetchUpcoming } = useContext(UserContext)
	const [currentUserFull, setCurrentUserFull] = useState({...currentUser,upcomingChats:upcoming});
	const [chatCategory, setChatCategory] = useState("Upcoming") // "Upcoming", "Past", "Saved"
	const [isEditProfModalVisible, setEditProfModalVisible] = useState(false)

	const history = useHistory();
	const openEditProfModal = () => setEditProfModalVisible(true);
	const closeEditProfModal = () => setEditProfModalVisible(false);


	const goToHomePage = (evt) => {
		let isHost = currentUserFull.host === "(Host)";
		let isAdmin = currentUserFull.admin === "(Admin)";
		if (isHost || isAdmin)
			history.push('/hosthome')
		else
			history.push('/home')
	}

	useEffect(() => {
		console.log(currentUserFull)
		axios.get(`${process.env.REACT_APP_FLASK_API}/`, {withCredentials: true}).then(res=>console.log(res,'-------g')).catch(err=>console.log(err,'-------g'))
		}, []);

/*
	if (isMobile)
		return <ProfileMobile
			currentUser={currentUser}
			setCurrentUser={setCurrentUser}
			currentUserFull={currentUserFull}
			setCurrentUserFull={setCurrentUserFull}
			chatCategory={chatCategory}
			setChatCategory={setChatCategory}
			goToHomePage={goToHomePage}
			history={history}
		/>
		*/
	
	return (
		<div className={styles.profilePageContainer}> {/* WHY IS THIS HERE? 
			the property it's referencing is empty
			but trying to comment this code out causes it to crash */}

			
			<NavBar name={currentUser.name} avatarSource={currentUserFull.propic} host={currentUserFull.host} />
			{
				// window.innerWidth<=800?<MobileProfile/>:<>
			<div className={styles.subContainer}>
			<div className={s.mainContent}>
					<div className={s.leftColumn}>
						<div className={s.avatarBox} onClick={() => history.push('/profile')}>
							<img src={currentUserFull.propic} alt="avatar" className={s.prekshaIcon} />
							<span className={s.avatarName}>{ currentUser.name }</span>
						</div>
						
						<div className={s.homeBox} onClick = {goToHomePage}>
							<img src={homeIcon} alt="homeImage" className={s.homeIcon} />
							<span className={s.homeProfText}>Home</span>
						</div>
						{/* <div className={s.discoverBox} onClick = {() => history.push('/discover')}>
							<img src={globeIcon} alt="discoverImage" className={s.globeIcon} />
							<span className={s.globeText}>Explore</span>
						</div> */}
        				<br></br>
        				<br></br>
        				<h1 className={s.upcomingHeading}>Upcoming Chats</h1>
        				<div className={s.upcomingChatsCards}>
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

				<div className={styles.profCenterDash}>
					<div className={styles.profilePageInfoContainer}>
						<div className={styles.profilePageTopWrapper}>
							<div className={styles.profilePageAvatarContainer}>
								<img
									className={styles.profilePageAvatar}
									src={
										currentUserFull.propic
											? currentUserFull.propic
											: '/images/stock-face.jpg'
									}
									alt="avatar"
								/>
								<button onclick={openEditProfModal} className={styles.EditImgContainer}>
									<img className={styles.EditImg} src={PencilIcon}></img>
									<EditProfModal
										closeEditProfModal={closeEditProfModal}
										isEditProfModalVisible={isEditProfModalVisible}
										id={currentUser.id}
									/>
								</button>
							</div>

							<div className={styles.profilePageInfo}>
								<h1 className={styles.profilePageName}>{currentUser.name}{currentUserFull.host}{currentUserFull.admin}</h1>
								<p
									className={styles.profilePageUsername}
								>{`@${currentUser.username}`}</p>
								<p
									className={styles.profilePageFollowing}
								>{`${currentUser.followercount} followers • ${currentUser.followingcount} following`}</p>
								<p className={styles.profilePageBio}>
									{currentUserFull.bio ? currentUserFull.bio : 'No bio yet!'}
								</p>
							</div>
						</div>

						<div className={styles.profilePageDivider} />

						<div className={styles.profilePageTabsContainer}>
							<div onClick={() => setChatCategory("Upcoming")} className={styles.profilePageTab}>
								<p className={styles.profilePageTabText}>Upcoming</p>
							</div>
							<div onClick={() => setChatCategory("Past")} className={styles.profilePageTab}>
								<p className={styles.profilePageTabText}>Past</p>
							</div>

							{/* <div onClick={() => setChatCategory("Saved")} className={styles.profilePageTab}>
								<p className={styles.profilePageTabText}>Saved
								
								
								
								
								</p>
							</div> */}
						</div>
					</div>

					<div className={styles.profCenterFeed}>
						<ChatsFeed chatCategory={chatCategory} isUser={currentUserFull.is_user}/>
					</div>
				</div>
				</div>
				</div>
				
			}
		</div>
	);
};

const EditProfModal = ({ closeEditProfModal, isEditProfModalVisible, id }) => {
	console.log("pencil clicked")
	const [bioInput, setBioInput] = useState("");
	const [firstNameInput, setFirstNameInput] = useState("");
	const [lastNameInput, setLastNameInput] = useState("");
	// const [articleURLInput, setArticleURLInput] = useState("");
	const { mutate } = useMutation((editProfInfo) => sendEditProf(editProfInfo, id))

	const handleBioInputChange = (evt) => setBioInput(evt.target.value)
	const handleFirstNameInputChange = (evt) => setFirstNameInput(evt.target.value)
	const handleLastNameInputChange = (evt) => setLastNameInput(evt.target.value)
	// const handleArticleURLInputChange = (evt) => setArticleURLInput(evt.target.value)

	const handleEditProf = (evt) => {
		// Check if values are empty, For now we'll just do an alert, in the future put some red lower text
		if (!bioInput) alert("There's something wrong with the Bio Input")
		else if (!firstNameInput) alert("There's something wrong with the First Name Input")
		else if (!lastNameInput) alert("There's something wrong with the Last Name Input")

		const editProfInfo = { bio: bioInput, firstName: firstNameInput, lastName: lastNameInput }
		mutate(editProfInfo)
		closeEditProfModal();
		//   window.alert("Conversation created! To find the conversation check your Profile page or the Home page!")
	}

	const rodalCustomStyles = {
		padding: '0px'
	}

	return <Rodal
		width="283"
		height="391"
		visible={isEditProfModalVisible}
		showMask={true}
		showCloseButton={true}
		enterAnimation="slideUp"
		leaveAnimation="door"
		onClose={closeEditProfModal}
		customStyles={rodalCustomStyles}
	>
		<div className={styles.convoModal}>
			<div className={styles.convModalHeading}>
				<h1 className={styles.convoModalHeader}>Convo</h1>
			</div>
			<div className={styles.convModalContent}>
				<h3 className={styles.convTimeTxt}>Bio</h3>
				<input className={styles.convTimeInput} type="text" onChange={handleBioInputChange} value={bioInput} />
				<h3 className={styles.convTitleTxt}>First Name</h3>
				<input className={styles.convTitleInput} type="text" onChange={handleFirstNameInputChange} value={firstNameInput} />
				<h3 className={styles.convDescTxt}>Last Name</h3>
				<input className={styles.convTitleInput} type="text" onChange={handleLastNameInputChange} value={lastNameInput} />
				<button className={styles.createConvBtn} onClick={handleEditProf}>Create Conversation</button>
			</div>
		</div>
	</Rodal>
}
export default Profile;
