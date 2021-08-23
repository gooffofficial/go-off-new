import goOffLogo from '../images/liveChatImages/go-off-logo.png'
import searchIcon from '../images/liveChatImages/search-icon.png'
import shareIcon from '../images/liveChatImages/paper-plane.png'
import homeIcon from '../images/liveChatImages/home-icon.png'
import globeIcon from '../images/liveChatImages/globe-icon.png'
import addPersonIcon from '../images/liveChatImages/person-add.png'
import bellIcon from '../images/liveChatImages/bell.png'
import s from '../styles/ProfilePage/ProfileMobile.module.scss'; // s = styles
import { ChatsFeed } from '../components/FeedCard'

const ProfileMobile = ({ currentUser, setCurrentUser, currentUserFull, setCurrentUserFull, chatCategory, setChatCategory, history }) => {
  let isUpcomingCategory = chatCategory === "Upcoming"
  let isPastCategory = chatCategory === "Past"
  let isSavedCategory = chatCategory === "Saved"

  let profileAvatar = currentUserFull ? currentUserFull.propic : '/images/stock-face.jpg';
  let profileBio = currentUserFull.bio ? currentUserFull.bio : 'No bio yet!'
  const goToHomePage = (evt) => {
    let isHost = currentUserFull.host === "(Host)";
    let isAdmin = currentUserFull.admin === "(Admin)";
      if (isHost || isAdmin)
        history.push('/hosthome')
      else 
        history.push('/home')
  }

  return <div className={s.ProfileMobile}>
    <ProfileMobileNavBar goToHomePage={goToHomePage} />
    <div className={s.middleContent}>
      <img src={profileAvatar} alt="" className={s.profileIcon} />
      <span className={s.name}>{currentUser.name}</span>
      <span className={s.username}>{currentUser.username}</span>
      <span className={s.follows}>{currentUser.followercount} followers • {currentUser.followingcount} following</span>
      <span className={s.bioText}>{profileBio}</span>
      <div className={s.chatCategoriesRow}>
        <button onClick={() => setChatCategory("Upcoming")} className={isUpcomingCategory ? s.clickedCategoryChatBtn : s.categoryChatBtn}>Upcoming</button>
        <button onClick={() => setChatCategory("Past")} className={isPastCategory ? s.clickedCategoryChatBtn : s.categoryChatBtn}>Past</button>
        <button onClick={() => setChatCategory("Saved")} className={isSavedCategory ? s.clickedCategoryChatBtn : s.categoryChatBtn}>Saved</button>
      </div>
			<ChatsFeed chatCategory={chatCategory} />
    </div>
    <div className={s.bottomContent}>
      <img onClick={goToHomePage} src={homeIcon} alt="" className={s.homeIcon} />
      <img onClick={() => history.push('/hosthome')} src={globeIcon} alt="" className={s.worldIcon} />
      <img onClick={() => history.push('/discover')} src={addPersonIcon} alt="" className={s.addPersonIcon} />
      <img onClick={() => {}} src={bellIcon} alt="" className={s.notificationsIcon} />
      <img onClick={() => history.push('/profile')} src="/images/stock-face.jpg" alt="" className={s.avatarIcon} />
    </div>
  </div>
};


export const ProfileMobileNavBar = ({ goToHomePage }) => {
  return <div className={s.ProfileMobileNavBar}>
    <img onClick={goToHomePage} src={goOffLogo} alt="" className={s.goOffIcon} />
    <div className={s.navRight}>
      <img src={searchIcon} alt="" className={s.searchIcon} />
      <img src={shareIcon} alt="" className={s.shareIcon} />
    </div>
  </div>
}

export default ProfileMobile;
