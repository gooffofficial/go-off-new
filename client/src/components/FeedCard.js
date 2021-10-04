import styles from "./styles/FeedCard.module.scss";
import Tag from "../components/Tag";
import axios from "axios";
import moment from "moment";
import { useEffect, useState, useRef, useContext } from "react";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import {
  getUpcomingChats,
  getPastChats,
  charLimit,
  getAllUpcomingChats,
} from "../styles/AuthPage/api.js";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import MobileNewsFeedCard from "./MobileNewsFeedCard";
import firebase from "../firebase.js";
import {Link} from 'react-router-dom';
import s from '../styles/HomePage/HostHome.module.scss';
import { UserContext } from "../contexts/userContext";
const schedule = require("node-schedule");

const fillerUser = {
  name: "Username",
  propic: "/images/stock-face.jpg",
  username: "username",
  followercount: 0,
  followingcount: 0,
};
// NEED TO IMPLEMENT DYNAMIC FUNCTIONALITY FOR:
// FEED IMAGE - CALENDAR - COMPANY LOGO - HEADING - DATE - TAGS - DESCRIPTION - HOST NAME / HOST AVATAR

export const ChatsFeed = ({ chatCategory, username, isUser, userId }) => {
  const {currentUser} = useContext(UserContext)
  // "Upcoming", "Past", "Saved"
  // console.log(username)
  // console.log("isUser: ", isUser)
  switch (chatCategory) {
    case "Upcoming":
      return (
        <UpComingChatsFeed
          username={username}
          //userId={userId}
          isUser={isUser}
          isOnMobile={isMobile}
        />
      );
    case "Past":
      return (
        <PastChatsFeed
          username={username}
          userId={userId}
          isUser={isUser}
          isOnMobile={isMobile}
        />
      );
    case "Saved":
      return (
        <SavedChatsFeed
          username={username}
          userId={userId}
          isUser={isUser}
          isOnMobile={isMobile}
        />
      );
    default:
      return;
  }
};

const UpComingChatsFeed = ({
  username,
  isOnMobile = false,
  isUser,
  //userId,
}) => {
  const {
    data: upcomingChats,
    isLoading,
    error,
  } = useQuery(`upcomingChat${username}`, () => getUpcomingChats(username));
  if (isLoading) return <p className={styles.largerText}>Loading...</p>;
  if (error)
    return (
      <p className={styles.largerText}>Unable to load upcoming chats...</p>
    );
  if (!upcomingChats || upcomingChats.length === 0)
    return (
      <p className={styles.largerText}>
        No upcoming conversations.. RSVP and join in on the action.
      </p>
    );
  // console.log(upcomingChats)
  // console.log(username)
  // console.log("isUser: ", isUser)
  return (
    <div>
      {upcomingChats.map(
        ({
          articleURL,
          articleImg,
          time,
          hostName,
          roomId,
          convTitle,
          hostAvatar,
          convDesc,
          hostUsername,
          isUser,
        }) => (
          <NewsFeedCard
            articleURL={articleURL}
            articleImg={articleImg}
            time={time}
            hostName={hostUsername}
            convTitle={convTitle}
            hostAvatar={hostAvatar}
            convDesc={convDesc}
            roomId={roomId}
            isOnMobile={isOnMobile}
            isUser={isUser}
            //userId={userId}
            hostUsername={username}
          />
        )
      )}
    </div>
  );
};

const PastChatsFeed = ({ username, isUser, isOnMobile = false }) => {
  const {
    data: pastChats,
    isLoading,
    error,
  } = useQuery(`pastChats${username}`, () => getPastChats(username));
  if (isLoading) return <p className={styles.largerText}>Loading...</p>;
  if (error)
    return (
      <p className={styles.largerText}>Unable loading upcoming chats...</p>
    );
  if (!pastChats || pastChats.length === 0)
    return (
      <p className={styles.largerText}>No joined past conversation chats...</p>
    );
  // console.log(username, hostUsername)
  return (
    <div>
      {pastChats.map(
        ({
          articleURL,
          articleImg,
          time,
          hostUsername,
          roomId,
          convTitle,
          hostAvatar,
          convDesc,
        }) => (
          <NewsFeedCard
            articleURL={articleURL}
            articleImg={articleImg}
            time={time}
            hostUsername={hostUsername}
            convTitle={convTitle}
            hostAvatar={hostAvatar}
            convDesc={convDesc}
            roomId={roomId}
            isOnMobile={isOnMobile}
          />
        )
      )}
    </div>
  );
};

const SavedChatsFeed = () => {
  return (
    <div className={styles.largerText}>
      No saved conversation chats implemented yet...
    </div>
  );
};

const NewsFeedCard = (props) => {
  const {
    articleImg,
    articleURL,
    convTitle,
    convDesc,
    time,
    hostName,
    roomId,
    hostAvatar,
    isOnMobile,
    userId,
    hostUsername,
  } = props;
  const history = useHistory();
  const {currentUser, setCurrentUser} = useContext(UserContext);

  useEffect(() => {
    if (!currentUser.signedIn){
		axios
      .get(`${process.env.REACT_APP_NODE_API}/api/users/current`, {
        withCredentials: true,
      })
      .then((res) => {
        setCurrentUser(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
	}
  }, []);



  let UTCTime = parseInt(time);
  let newTime = new Date().getTime()
  let oldTime = new Date(UTCTime)
  let convoMonth = moment(UTCTime).format("MMM").toUpperCase();
  let convoCalendarDay = moment(UTCTime).format("D");
  let convoDay = moment(UTCTime).format("dddd").toUpperCase();
  let convoHoursMinutes = moment(UTCTime).format("h:mm a").toUpperCase();

  let convoDate = `${convoDay} ${convoHoursMinutes}`;
  let isUser = currentUser.username == hostUsername;
  let link = useRef();
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);
  let sqlTime = moment(UTCTime).format('YYYY-MM-DD HH:mm:ss')
  console.log(sqlTime,'sql-------')
  // console.log(hostUsername)
  // console.log(props)
  // const {
  //  feedImage,
  //  calendar,
  //  companyLogo,
  //  heading,
  //  date,
  //  tags,
  //  description,
  //  hostName,
  //  hostAvatar,
  // } = props;
  // console.log(document.getElementById("buttonText").textContent)

  // if(isUser == false){
  // 	document.getElementById("myBtn").textContent = "RSVP"
  // }

  const db = firebase.firestore();

  // console.log(hostUsername)
  const rsvpbuttonhandler = async(e) => {
    let convoId = roomId;
    let dummyId = currentUser.id;
    e.preventDefault();

    let result = await axios.post(`${process.env.REACT_APP_FLASK_API}/setrsvp`,{username:currentUser.username,roomId:roomId,notification:'text',startTime:sqlTime},{withCredentials:true})
    if(result.status==200){
      setShow(true);
      setTimeout(() => setShow(false), 10000);
    }
    console.log(result)
  };

  const gobuttonhandler = (e) => {
    history.push(`/chat/${roomId}`);
  };

  if (isOnMobile) {
    return (
      <MobileNewsFeedCard
        articleImg={articleImg}
        articleURL={articleURL}
        convTitle={convTitle}
        convDesc={convDesc}
        time={time}
        hostUsername={hostUsername}
        roomId={roomId}
        hostAvatar={hostAvatar}
        isOnMobile={isOnMobile}
        history={history}
        isUser={isUser}
        userId={userId}
        hostUsername={hostUsername}
      />
    );
  }

  return (
    <>
      {show ? (
        <div
          class={`alert alert-success alert-dismissible fade show`}
          role="alert"
        >
          <strong>
            Succesfully RSVP'd! Copy and send this link to your friends so they
            can join the fun:{" "}
            <Link ref={link} to={`profile/${hostUsername}`}>
              https://www.go-off.co/profile/{hostUsername}
            </Link>
          </strong>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `https://www.go-off.co/profile/${hostUsername}`
              );
              setCopied(true);
              console.log("clicked");
              setTimeout(() => setCopied(false), 3000);
            }}
            uk-icon="link"
          ></button>
          {copied ? <span>copied!</span> : ""}
        </div>
      ) : (
        ""
      )}
      <div className={styles.FeedCardContainer}>
        <div className={styles.feedCardImageContainer}>
          <img
            className={styles.feedCardImage}
            src={articleImg} // src="/images/article-stock-img.png"
            alt="article"
          />
          {/* <svg
					className={styles.bookmarkIcon}
					width="40"
					height="40"
					viewBox="0 0 40 40"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M19.7022 25.8432C19.9839 25.8432 20.2672 25.9149 20.5222 26.0582L28.3339 30.4765V8.88988C28.3339 8.55488 28.1322 8.33321 28.0005 8.33321H12.0005C11.8672 8.33321 11.6672 8.55488 11.6672 8.88988V30.3899L18.8439 26.0815C19.1089 25.9232 19.4055 25.8432 19.7022 25.8432ZM10.0005 34.9999C9.7172 34.9999 9.43386 34.9282 9.17886 34.7832C8.6572 34.4882 8.33386 33.9332 8.33386 33.3332V8.88988C8.33386 6.74488 9.97886 4.99988 12.0005 4.99988H28.0005C30.0222 4.99988 31.6672 6.74488 31.6672 8.88988V33.3332C31.6672 33.9265 31.3522 34.4749 30.8405 34.7732C30.3272 35.0732 29.6972 35.0782 29.1805 34.7849L19.7272 29.4382L10.8572 34.7632C10.5939 34.9199 10.2972 34.9999 10.0005 34.9999Z"
						fill="white"
					/>
				</svg> */}
        </div>
        <div className={styles.feedCardContentContainer}>
          <div className={styles.feedCardContent}>
            <div className={styles.contentTop}>
              <div className={styles.calendarContainer}>
                <div className={styles.calendar}>
                  <div className={styles.calendarMonth}>{convoMonth}</div>
                  <div className={styles.calendarDay}>{convoCalendarDay}</div>
                </div>
              </div>

              <div className={styles.titleColumn}>
                {/* <div className={styles.companyLogoContainer}>
								<img
									className={styles.companyLogo}
									src="/images/New-York-Times-Logo.png"
									alt="publisher logo"
								/>
							</div> */}
                <div className={styles.feedCardHeadingContainer}>
                  <h4 className={styles.feedCardHeading}>
                    {convTitle}
                    {/* {charLimit(convTitle, 60)} */}
                    {/* SET CHARACTER LIMIT */}
                  </h4>
                </div>
              </div>
            </div>

            <div className={styles.dateContainer}>
              <p className={styles.date}>{convoDate}(EST)</p>
            </div>

            {/* <div className={styles.cardTagContainer}>
						<Tag text="Eco-Friendly" />
						<Tag text="Sustainability" />
						<Tag text="Zero Waste" />
					</div> */}

            <div className={styles.feedCardDescriptionContainer}>
              <p className={styles.feedCardDescription}>
                {convDesc ? convDesc : ""}{" "}
              </p>
            </div>

            <div className={styles.hostContentDetailsContainer}>
              <div className={styles.hostContentDetails}>
                <div className={styles.hostImageContainer}>
                  <img
                    className={styles.hostImage}
                    src={hostAvatar ? hostAvatar : "/images/stock-face.jpg"} //src="/images/stock-face.jpg"
                    // alt="profile pic"
                  />
                  <div className={styles.hostStatus}></div>
                </div>

                <div className={styles.hostDetails}>
                  <div className={styles.badgeContainer}>
                    <div className={styles.hostBadge}>
                      <p className={styles.badgeText}>HOST</p>
                    </div>
                  </div>
                  <p className={styles.hostName}>{hostName}</p>
                </div>

                <div className={styles.rsvpButtonContainer}>
                  {
                    //*!this only shows before convo start. needs to be there until convo ends
                    newTime > oldTime.getTime() ? (
                      ""
                    ) : (
                      <div className="layer">
                        <button
                          className={s.RSVP_Btn}
                          onClick={rsvpbuttonhandler}
                        >
                          Save My Spot{" "}
                        </button>
                      </div>
                    )
                  }
                  {/* {isUser 
									? <div className={styles.convoButton} onClick={gobuttonhandler}>
										<p className={styles.buttonText}>GO TO CONVO</p>
									  </div>
									: <div className={styles.convoButton} onClick={rsvpbuttonhandler}>
										<p className={styles.buttonText}>RSVP</p>
									 </div>} */}
                  <div className={styles.convoButton} onClick={gobuttonhandler}>
                    <p className={styles.buttonText}>GO TO CONVO</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.dropDownRow}>
          <svg
            className={styles.dots}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id=" Outline / more-horizontal">
              <path
                id="Union"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 12C3 10.896 3.896 10 5 10C6.104 10 7 10.896 7 12C7 13.104 6.104 14 5 14C3.896 14 3 13.104 3 12ZM12 10C10.896 10 10 10.896 10 12C10 13.104 10.896 14 12 14C13.104 14 14 13.104 14 12C14 10.896 13.104 10 12 10ZM19 10C17.896 10 17 10.896 17 12C17 13.104 17.896 14 19 14C20.104 14 21 13.104 21 12C21 10.896 20.104 10 19 10Z"
                fill="#757D8A"
              />
            </g>
          </svg>
          {/* <div className={styles.dropdowncontent}>
					<span>Send this link to your friends so they can find your content: https://go-off.co/profile/{hostUsername} </span>
				</div> */}
        </div>
      </div>
    </>
  );
};

export default NewsFeedCard;
