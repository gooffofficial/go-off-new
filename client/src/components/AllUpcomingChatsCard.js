import'./styles/AllUpcomingChatsCard.module.scss';

const AllUpcomingChatsCard = (props) => {
	const { articleImg, articleURL, time, hostName, roomId, convTitle } = props;
	return (
		<div className="AllUpcomingChatsCardContainer" onClick="#">
			<div className="AllUpcomingChatsCardImageContainer">
				<img
					className="AllUpcomingChatsCardImage"
					src={articleImg ? articleImg : '/images/Rectangle328.png'}
					alt=""
				/>
			</div>
			<div className="AllUpcomingChatsCardContent">
				<h2 className="AllUpcomingChatsCardHeading">
					{time
						? Date(time)
								.toLocaleString()
								.split(' ')
								.splice(0, 4)
								.join(' ')
								.toUpperCase()
						: 'HAPPENING SOON'}
				</h2>
				<p className="AllUpcomingChatsCardDescription">
					{convTitle ? convTitle : ''}{' '}
				</p>
			</div>
		</div>
	);
};

export default AllUpcomingChatsCard;
