import styles from './styles/FriendActivityCard.module.scss';

const FriendActivityCard = (props) => {
	const { avatarSource, name, action, hostedBy } = props;

	return (
		<div className={styles.friendActContainer}>
			<div className={styles.friendActAvatarContainer}>
				<img src={avatarSource} alt="avatar" />
			</div>

			<div className={styles.friendActDescriptionContainer}>
				<div className={styles.friendActDescription}>
					<span className={styles.friendActName}>{name}</span>

					{` ${action} `}

					<span className={styles.friendActName}>{hostedBy}</span>
				</div>
			</div>
		</div>
	);
};

export default FriendActivityCard;
