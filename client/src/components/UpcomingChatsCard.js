import styles from './styles/UpcomingChatsCard.module.scss';

const UpcomingChatsCard = (props) => {
	return (
		<div className={styles.upcomingChatsCardContainer} onClick="#">
			<div className={styles.upcomingChatsCardImageContainer}>
				<img
					className={styles.upcomingChatsCardImage}
					src="/images/Rectangle 328.png"
					alt="upcoming chat"
				/>
			</div>
			<div className={styles.upcomingChatsCardContent}>
				<h2 className={styles.upcomingChatsCardHeading}>HAPPENING NOW</h2>
				<p className={styles.upcomingChatsCardDescription}>
					Zero Waste Toothbrush: How does it really make a difference?
				</p>
			</div>
		</div>
	);
};

export default UpcomingChatsCard;
