import './styles/UpcomingChatsCard.scss';

const UpcomingChatsCard = (props) => {
	const { articleImg, articleURL, time, hostName, roomId, convTitle } = props;
	return (
		<div className="upcomingChatsCardContainer" onClick="#">
			<div className="upcomingChatsCardImageContainer">
				<img
					className="upcomingChatsCardImage"
					src={articleImg ? articleImg : '/images/Rectangle328.png'}
					alt=""
				/>
			</div>
			<div className="upcomingChatsCardContent">
				<h2 className="upcomingChatsCardHeading">
					{time
						? Date(time)
								.toLocaleString()
								.split(' ')
								.splice(0, 4)
								.join(' ')
								.toUpperCase()
						: 'HAPPENING SOON'}
				</h2>
				<p className="upcomingChatsCardDescription">
					{convTitle ? convTitle : ''}{' '}
				</p>
			</div>
		</div>
	);
};

export default UpcomingChatsCard;
