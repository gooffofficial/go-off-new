import styles from './styles/FeedCard.module.scss';
import Tag from '../components/Tag';
import moment from 'moment'
import { getUpcomingChats, getPastChats, charLimit } from "../styles/AuthPage/api.js"
import { useQuery } from 'react-query'

// NEED TO IMPLEMENT DYNAMIC FUNCTIONALITY FOR:
// FEED IMAGE - CALENDAR - COMPANY LOGO - HEADING - DATE - TAGS - DESCRIPTION - HOST NAME / HOST AVATAR

export const ChatsFeed = ({ chatCategory }) => { // "Upcoming", "Past", "Saved"
  switch (chatCategory) {
   case "Upcoming": return <UpComingChatsFeed/>
   case "Past": return <PastChatsFeed/>
   case "Saved": return <SavedChatsFeed/>
   default: return;
  }
}

const UpComingChatsFeed = () => {
  const { data: upcomingChats, isLoading, error } = useQuery("upcomingChat", getUpcomingChats)
  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Unable loading upcoming chats...</p>
  if (!upcomingChats || upcomingChats.length === 0) return <p>No joined upcoming conversation chats...</p>

  console.log("")
  
  return <div>
    {upcomingChats.map(({ articleURL, articleImg, time, hostUsername, roomId, convTitle, hostAvatar, convDesc }) => 
      <NewsFeedCard 
        articleURL={articleURL}
        articleImg={articleImg}
        time={time}
        hostUsername={hostUsername}
        convTitle={convTitle}
        hostAvatar={hostAvatar}
        convDesc={convDesc}
      />
    )}
  </div>
}

const PastChatsFeed = () => {
  const { data: pastChats, isLoading, error } = useQuery("pastChats", getPastChats)
  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Unable loading upcoming chats...</p>
  if (!pastChats || pastChats.length === 0) return <p>No joined past conversation chats...</p>
  return <div>
    {pastChats.map(({ articleURL, articleImg, time, hostUsername, roomId, convTitle, hostAvatar, convDesc }) => 
      <NewsFeedCard 
        articleURL={articleURL}
        articleImg={articleImg}
        time={time}
        hostUsername={hostUsername}
        convTitle={convTitle}
        hostAvatar={hostAvatar}
        convDesc={convDesc}
      />
    )}
  </div>
}

const SavedChatsFeed = () => {
  return <div>
    No saved conversation chats implemented yet...
  </div>
}

const NewsFeedCard = ({ articleURL = "", articleImg = "", time = "", hostUsername = "", convTitle = "", hostAvatar = "", convDesc = "" }) => {
  let UTCTime = parseInt(time)
  let convoMonth = moment(UTCTime).format('MMM').toUpperCase();
  let convoCalendarDay = moment(UTCTime).format('D');
  let convoDay = moment(UTCTime).format('dddd').toUpperCase();
  let convoHoursMinutes = moment(UTCTime).format('h:mm a').toUpperCase();
  let convoDate = `${convoDay} ${convoHoursMinutes}`;

  // console.log("upComingChats: ", upComingChats)
  // console.log("OOF")z
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

	return (
		<div className={styles.FeedCardContainer}>
			<div className={styles.feedCardImageContainer}>
				<img
					className={styles.feedCardImage}
					src={articleImg} // src="/images/article-stock-img.png"
					alt="article"
				/>
				<svg
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
				</svg>
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
							<div className={styles.companyLogoContainer}>
								<img
									className={styles.companyLogo}
									src="/images/New-York-Times-Logo.png"
									alt="publisher logo"
								/>
							</div>
							<div className={styles.feedCardHeadingContainer}>
								<h4 className={styles.feedCardHeading}>
									{charLimit(convTitle, 60)}
									{/* SET CHARACTER LIMIT */}
								</h4>
							</div>
						</div>
					</div>

					<div className={styles.dateContainer}>
						<p className={styles.date}>{convoDate}</p>
					</div>

					{/* <div className={styles.cardTagContainer}>
						<Tag text="Eco-Friendly" />
						<Tag text="Sustainability" />
						<Tag text="Zero Waste" />
					</div> */}

					<div className={styles.feedCardDescriptionContainer}>
						<p className={styles.feedCardDescription}>
              {charLimit(convDesc, 190)}
						</p>
					</div>

					<div className={styles.hostContentDetailsContainer}>
						<div className={styles.hostContentDetails}>
							<div className={styles.hostImageContainer}>
								<img
									className={styles.hostImage}
									src={hostAvatar} //src="/images/stock-face.jpg"
									alt="profile pic"
								/>
								<div className={styles.hostStatus}></div>
							</div>

							<div className={styles.hostDetails}>
								<div className={styles.badgeContainer}>
									<div className={styles.hostBadge}>
										<p className={styles.badgeText}>HOST</p>
									</div>
								</div>
								<p className={styles.hostName}>{hostUsername}</p>
							</div>

							<div className={styles.rsvpButtonContainer}>
								<div className={styles.convoButton}>
									<p className={styles.buttonText}>GO TO CONVO</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

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
		</div>
	);
};

export default NewsFeedCard;
