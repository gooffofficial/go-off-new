import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import goOffLogo from '../images/liveChatImages/go-off-logo.png';
import searchIcon from '../images/liveChatImages/search-icon.png';
import optionsIcon from '../images/liveChatImages/options.png';
import addPersonIcon from '../images/liveChatImages/person-add.png';
import bellIcon from '../images/liveChatImages/bell.png';
import shareIcon from '../images/liveChatImages/paper-plane.png';
import prekshaIcon from '../images/liveChatImages/preksha-profile-icon.png';
import arrowDownIcon from '../images/liveChatImages/arrow-ios-down.png';
import homeIcon from '../images/liveChatImages/home-icon.png';
import globeIcon from '../images/liveChatImages/globe-icon.png';
import article1 from '../images/liveChatImages/article-1.png';
import article2 from '../images/liveChatImages/article-2.png';
import NYTLogo from '../images/liveChatImages/NYT-Logo.png';
import emilyIcon from '../images/liveChatImages/emily-profile-icon.png';
import sendIcon from '../images/liveChatImages/send.png';
import dots3Icon from '../images/liveChatImages/dots3.png';
import inputAddIcon from '../images/liveChatImages/addIcon.png';
import inputSendIcon from '../images/liveChatImages/chatSend.png';
import styles from '../styles/LiveChatPage/livechat.module.css';
import { usePubNub } from 'pubnub-react';
import { useForm } from 'react-hook-form';
import Chat from '../components/Chat.js';
import axios from 'axios';

const LiveChat = () => {
	const { code } = useParams();

	//importing pubnub into this component
	const pubnub = usePubNub();

	//list of members allowed to view chat
	const [members, setMembers] = useState([]);

	const {
		register, //used to register an input field
		handleSubmit, //is a function that will call your onSubmit function, whatever you declare that to be
		formState: { errors }, //this keeps track of the errors that can be easily retrieved
	} = useForm({ criteriaMode: 'all' });

	//this will hold channel(s) for now default is test. will need to add way to join via a unique identifier to set as channel
	const [channels, setChannels] = useState([code]);

	//this state will hold all messages; Note every message will be structured as such {text:'string', user:'string', isHost:'boolean'}
	const [messages, addMessages] = useState([]);

	//this does not work it renders the limit to everyone!!! check logic when render messages
	const [limitReached, setLimitReached] = useState(false);

	//this is temporary user, later need to use user data from sign in
	//const user = pubnub.getUUID();
	const [user, setUser] = useState({
		name: 'guest',
		username: 'guest',
		uuid: pubnub.getUUID(),
		isHost: false,
	});

	//this is a ref that will give scroll to bottom functionality
	const scrollhook = useRef();

	//this will handle incoming messages
	const handleMessage = (object) => {
		console.log(object);
		const message = object.message;
		if (!message.user) {
			return;
		}
		const text = message.text;
		if (typeof text === 'string' && text.length !== 0) {
			addMessages((messages) => [...messages, message]);
		}
		scrollhook.current.scrollIntoView({ behavior: 'smooth' }); // scrolls to bottom when message is recieved
	};

	//this on submit function is publishing the message to the channel
	const onSubmit = (message, e) => {
		pubnub.publish(
			{
				channel: channels[0],
				message: {
					user: user.name,
					isHost: user.isHost,
					text: message.message,
					uuid: user.uuid,
				},
			},
			function (status) {
				//this will print a status error in console
				if (status.error) {
					console.log(status);
				}
			}
		);
		e.target.reset(); // resets the input fields
		scrollhook.current.scrollIntoView({ behavior: 'smooth' }); // scrolls to bottom when message is sent
	};

	//useEffect will add listeners and will subscribe to channel. will refresh if pubnub or the channels change
	useEffect(() => {
		//checks for current occupancy and if too many people already then does not render chat
		if (code) {
			pubnub.hereNow(
				{
					channels: channels,
					includeUUIDs: true,
					includeState: true,
				},
				(status, response) => {
					console.log(response);
					const occupancy = response.totalOccupancy;
					if (occupancy >= 10) {
						setLimitReached(true);
					} else {
						if (limitReached) {
							setLimitReached(false);
						}
					}
				}
			);
		}

		//checks for current user
		axios
			.get(`/api/users/current`, {
				withCredentials: true,
			})
			.then((res) => {
				if (res.status === 400) {
					// not a user
					console.log('not found');
				} else if (res.user) {
					//is a user
					let user = {
						name: res.user.name,
						username: res.user.username,
						uuid: res.user.uuid,
						isHost: false,
					};
					setUser(user);
				}
			});

		/** this the variable version of listener used to add and remove the listener but using the var is not working so I created
 * the object directly in the listener 
 *   var listener = {
    message: handleMessage,
    presence: function (p) {
      const action = p.action; // Can be join, leave, state-change, or timeout
      const channelName = p.channel; // Channel to which the message belongs
      const occupancy = p.occupancy; // Number of users subscribed to the channel
      const state = p.state; // User state
      const channelGroup = p.subscription; //  Channel group or wildcard subscription match, if any
      const publishTime = p.timestamp; // Publish timetoken
      const timetoken = p.timetoken; // Current timetoken
      const uuid = p.uuid; // UUIDs of users who are subscribed to the channel
      console.log(occupancy,uuid)
    },
    status: (event)=>{console.log("status: "+ JSON.stringify(event))}
  };
 */

		//this listener sets up how to handle messages and gives status
		pubnub.addListener({
			message: handleMessage,
			presence: function (p) {
				const action = p.action; // Can be join, leave, state-change, or timeout
				const channelName = p.channel; // Channel to which the message belongs
				const occupancy = p.occupancy; // Number of users subscribed to the channel
				const state = p.state; // User state
				const channelGroup = p.subscription; //  Channel group or wildcard subscription match, if any
				const publishTime = p.timestamp; // Publish timetoken
				const timetoken = p.timetoken; // Current timetoken
				const uuid = p.uuid; // UUIDs of users who are subscribed to the channel
				console.log(occupancy);
				//this portion will add or remove members from a list.
				if (action == 'leave') {
					let newlist = members.filter((m) => m !== uuid);
					setMembers(newlist);
				} else if (action == 'join' && occupancy < 11) {
					setMembers((state) => [...state, uuid]);
				}
			},
			status: (event) => {
				console.log('status: ' + JSON.stringify(event));
			},
		});

		//this subscribes to a list of channels
		pubnub.subscribe({
			channels: channels,
			withPresence: true,
		});
		return pubnub.unsubscribe(channels), pubnub.removeListener();
	}, [pubnub]);
	return (
		<div className="liveChat">
			<NavBar />
			<div className={styles['mainContent']}>
				<div className={styles['leftColumn']}>
					<div className={styles['avatarBox']}>
						<img
							src={prekshaIcon}
							alt="avatar"
							className={styles['prekshaIcon']}
						/>
						<span className={styles['avatarName']}>Preksha Munot</span>
					</div>
					<div className={styles['homeBox']}>
						<img
							src={homeIcon}
							alt="homeImage"
							className={styles['homeIcon']}
						/>
						<span className={styles['homeText']}>Home</span>
					</div>
					<div className={styles['discoverBox']}>
						<img
							src={globeIcon}
							alt="discoverImage"
							className={styles['globeIcon']}
						/>
						<span className={styles['globeText']}>Preksha Munot</span>
					</div>
					<h1 className={styles['upcommingHeading']}>Upcoming Chats</h1>
					<div className={styles['upcomingChats']}>
						<ChatCard
							title="Zero Waste Toothbrush: How does it really make a difference?"
							timeStart="HAPPENING NOW"
							chatImage={article1}
						/>
						<ChatCard
							title="Zero Waste Toothbrush: How does it really make a difference?"
							timeStart="HAPPENING NOW"
							chatImage={article1}
						/>
					</div>
				</div>
				<div className={styles['middleColumn']}>
					<div className={styles['innerMiddleBox']}>
						<div className={styles['articleHeading']}>
							<div className={styles['firstRowHeading']}>
								<img
									src={NYTLogo}
									alt="NYT Logo"
									className={styles['NYTLogo']}
								/>
								<img
									src={searchIcon}
									alt="Search Icon"
									className={styles['searchForIcon']}
								/>
							</div>
							<div className={styles['secondRowHeading']}>
								<span className={styles['mid-col-articleTitle']}>
									Zero Waste Toothbrush: How does it really make a difference?
								</span>
								<span className={styles['liveBox']}>LIVE</span>
							</div>
						</div>
						<div className={styles['liveChatBox']}>
							<span className={styles['chatTime']}>10:00 PM</span>
							{(() => {
								if (limitReached) {
									if (members.includes(user.uuid)) {
										return (
											<Chat
												scrollhook={scrollhook}
												channels={channels}
												addMessages={addMessages}
												messages={messages}
												user={user}
											/>
										);
									} else {
										return (
											<div style={{ textAlign: 'center' }}>Chat is full</div>
										);
									}
								} else {
									return (
										<Chat
											scrollhook={scrollhook}
											channels={channels}
											addMessages={addMessages}
											messages={messages}
											user={user}
										/>
									);
								}
							})()}
						</div>
						<div className={styles['chatInputBox']}>
							<img
								src={inputAddIcon}
								alt="Add Icon"
								className={styles['inputAddIcon']}
							/>
							<form className="form-demo" onSubmit={handleSubmit(onSubmit)}>
								<input
									style={{ width: '33vw', marginRight: '0px' }}
									type="text"
									className="inputText"
									placeholder="Type your message"
									{...register('message', {
										required: 'Please enter a message',
									})}
								/>{' '}
								{/*this is for sending message, onSubmit here*/}
								{errors.message && (
									<p className="error">{errors.message.message}</p>
								)}
							</form>
							<img
								src={inputSendIcon}
								alt="Send Input"
								className={styles['inputSendIcon']}
							/>
						</div>
					</div>
				</div>
				<div className={styles['rightColumn']}>
					<div className={styles['everythingButProfile']}>
						<img
							src={article2}
							alt="articleImage"
							className={styles['article2']}
						/>
						<div className={styles['chatHeading']}>
							<div className={styles['leftHeading']}>
								<span className={styles['monthText']}>MAY</span>
								<div className={styles['dayText']}>22</div>
							</div>
							<div className={styles['rightHeading']}>
								<img
									src={NYTLogo}
									alt="NYT Logo"
									className={styles['NYTLogo']}
								/>
								<span className={styles['articleTitle']}>
									Zero Waste Toothbrush: How does it really make a difference
								</span>
							</div>
						</div>
						<span className={styles['startTime']}>THURSDAY 10:00 PM EST</span>
						<div className={styles['chatTags']}>
							<div className={styles['chatTag']}>Eco-Friendly</div>
							<div className={styles['chatTag']}>Sustainability</div>
							<div className={styles['chatTag']}>Zero Waste</div>
						</div>
						<p className={styles['chatDescription']}>
							With zero waste taking over the world and people becoming more
							aware of their carbon footprint and how their actions affect the
							planet more options for sustaiable items have become avaiable.
						</p>
						<div className={styles['dropDownRow']}>
							<span className={styles['chatDropDownName']}>Participants</span>
							<img
								src={arrowDownIcon}
								alt="dropDownImg"
								className={styles['dropDownImg']}
							/>
						</div>
						<div className={styles['dropDownRow']}>
							<span className={styles['chatDropDownName']}>Shared Media</span>
							<img
								src={arrowDownIcon}
								alt="dropDownImg"
								className={styles['dropDownImg']}
							/>
						</div>
						<div className={styles['dropDownRow']}>
							<span className={styles['chatDropDownName']}>
								Privacy & Support
							</span>
							<img
								src={arrowDownIcon}
								alt="dropDownImg"
								className={styles['dropDownImg']}
							/>
						</div>
					</div>
					<div className={styles['profileBox']}>
						<div className={styles['profileLeftSide']}>
							<img
								src={emilyIcon}
								alt="Profile Icon"
								className={styles['emilyIcon']}
							/>
							<div className={styles['ProfileNames']}>
								<span className={styles['hostText']}>HOST</span>
								<div className={styles['profileName']}>Emily Patterson</div>
							</div>
						</div>
						<div className={styles['profileRightSide']}>
							<img src={sendIcon} alt="Share" className={styles['sendIcon']} />
							<img
								src={dots3Icon}
								alt="3 Things Setting"
								className={styles['dots3Icon']}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const NavBar = ({}) => {
	return (
		<div className={styles['navbar']}>
			<img src={goOffLogo} alt="Go Off! Logo" className={styles['goOffLogo']} />
			<div className={styles['searchBar']}>
				<img
					src={searchIcon}
					alt="Search Icon"
					className={styles['searchIcon']}
				/>
				<input
					type="search"
					className={styles['searchInput']}
					placeholder="Search"
				/>
				<img
					src={optionsIcon}
					alt="Settings"
					className={styles['optionsIcon']}
				/>
			</div>
			<img
				src={addPersonIcon}
				alt="Add person"
				className={styles['addPersonIcon']}
			/>
			<img src={bellIcon} alt="Notifications" className={styles['bellIcon']} />
			<img src={shareIcon} alt="Share" className={styles['shareIcon']} />
			<div className={styles['navProfileBox']}>
				<div className={styles['profile']}>
					<img
						src={prekshaIcon}
						alt="avatar"
						className={styles['profileIcon']}
					/>
					<span className={styles['profileText']}>Preksha Munot</span>
					<img
						src={arrowDownIcon}
						alt="dropDown"
						className={styles['arrowDownIcon']}
					/>
				</div>
			</div>
		</div>
	);
};

const ChatCard = ({ title, timeStart, chatImage }) => {
	return (
		<div className={styles['chatCard']}>
			<img src={chatImage} alt="chatImage" className={styles['chatImage']} />
			<div className={styles['chatBottomSide']}>
				<h2 className={styles['timeStart']}>{timeStart}</h2>
				<h4 className={styles['chatTitle']}>{title}</h4>
			</div>
		</div>
	);
};

export default LiveChat;
