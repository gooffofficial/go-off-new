import styles from './styles/TrendingCard.module.scss';

const TrendingCard = (props) => {
	const { imageSource, description } = props;

	return (
		<div className={styles.trendingCardContainer}>
			<div className={styles.imageContainer}>
				<img
					className={styles.trendingImage}
					src={imageSource}
					alt="trending"
				/>
			</div>

			<div className={styles.trendingDescription}>
				<p className={styles.trendingDescText}>{description}</p>
			</div>
		</div>
	);
};

export default TrendingCard;
