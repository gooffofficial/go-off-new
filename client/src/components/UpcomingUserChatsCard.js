import styles from './styles/UpcomingUserChatsCard.module.scss';

const UpcomingUserChatsCard = (props) => {
	return (
		<div className={styles.UpcomingUserChatsCardContainer} onClick="#">
			<div className={styles.UpcomingUserChatsCardImageContainer}>
				<img
					className={styles.UpcomingUserChatsCardImage}
					src="/images/Rectangle328.png"
					alt="upcoming chat"
				/>
			</div>
			<div className={styles.UpcomingUserChatsCardContent}>
				<h2 className={styles.UpcomingUserChatsCardHeading}>HAPPENING NOW</h2>
				<p className={styles.UpcomingUserChatsCardDescription}>
					Zero Waste Toothbrush: How does it really make a difference?
				</p>
			</div>
		</div>
	);
};

export default UpcomingUserChatsCard;
