import styles from './styles/FeedCard.module.scss';
import Tag from '../components/Tag';

// NEED TO IMPLEMENT DYNAMIC FUNCTIONALITY FOR:
// FEED IMAGE - CALENDAR - COMPANY LOGO - HEADING - DATE - TAGS - DESCRIPTION - HOST NAME / HOST AVATAR

const NewsFeedCard = (props) => {
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
					src="/images/article-stock-img.png"
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
								<div className={styles.calendarMonth}>JUN</div>
								<div className={styles.calendarDay}>25</div>
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
									Zero Waste Toothbrush: How does it really make a difference?
									{/* SET CHARACTER LIMIT */}
								</h4>
							</div>
						</div>
					</div>

					<div className={styles.dateContainer}>
						<p className={styles.date}>FRIDAY 12:00 PM EST</p>
					</div>

					<div className={styles.cardTagContainer}>
						<Tag text="Eco-Friendly" />
						<Tag text="Sustainability" />
						<Tag text="Zero Waste" />
					</div>

					<div className={styles.feedCardDescriptionContainer}>
						<p className={styles.feedCardDescription}>
							With zero waste taking over the world and people becoming more
							aware of their carbon footprint and how their actions affect the
							planet more options for sustaiable items have become avaiable.
						</p>
					</div>

					<div className={styles.hostContentDetailsContainer}>
						<div className={styles.hostContentDetails}>
							<div className={styles.hostImageContainer}>
								<img
									className={styles.hostImage}
									src="/images/stock-face.jpg"
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
								<p className={styles.hostName}>Erick Canales</p>
							</div>

							<div className={styles.rsvpButtonContainer}>
								<div className={styles.rsvpButton}>
									<p className={styles.buttonText}>RSVP NOW</p>
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