import moment from 'moment';
import facesConv from '../images/FacesConv.png'
import s from './styles/MobileNewsFeedCard.module.scss'; // s = styles

const MobileNewsFeedCard = ({ articleImg, articleURL, convTitle, convDesc, time, hostUsername, roomId, hostAvatar, isOnMobile, history }) => {
  let UTCTime = parseInt(time);
	let convoMonth = moment(UTCTime).format('MMM').toUpperCase();
	let convoCalendarDay = moment(UTCTime).format('D');
	let convoDay = moment(UTCTime).format('dddd').toUpperCase();
	let convoHoursMinutes = moment(UTCTime).format('h:mm a').toUpperCase();
	let convoDate = `${convoDay} ${convoHoursMinutes}`;

  let articleHostAvatar = hostAvatar ? hostAvatar : '/images/stock-face.jpg';

	return <div>
    <div className={s.mobileNewFeedCard}>
      <img src={articleImg} alt="" className={s.articleImg} />
      <div className={s.articleHeadingRow}>
        <div className={s.headingLeft}>
          <span className={s.convMonth}>{convoMonth}</span>
          <span className={s.convDayNum}>{convoCalendarDay}</span>
        </div>
        <span className={s.articleTitle}>{convTitle}</span>
      </div>
      <span className={s.convDateStart}>{convoDate}</span>
      <span className={s.convDescription}>{convDesc}</span>
      <hr className={s.grayLine} />
      <div className={s.hostRow}>
        <div className={s.leftHostRow}>
          <img src={articleHostAvatar} alt="" className={s.hostAvatar} />
          <div className={s.rightHostInfo}>
            <span className={s.hostTag}>HOST</span>
            <span className={s.hostName}>{hostUsername}</span>
          </div>
        </div>
        <div className={s.rightHostRow}>
          <button onClick={() => history.push(`/chat/${roomId}`)} className={s.RSVPBtn}>RSVP</button>
        </div>
      </div>
    </div>
    <div className={s.bottomGrayArea}></div>
  </div>
};

export default MobileNewsFeedCard;