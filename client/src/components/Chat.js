import React, { useEffect, useState } from 'react';
import { usePubNub } from 'pubnub-react';
import emilyIcon from '../images/liveChatImages/emily-profile-icon.png';
import styles from '../styles/LiveChatPage/livechat.module.css';
import axios from 'axios';

const Chat = ({ messages, user }) => {
	return (
		<div>
			{messages.map((message, index) => {
				if (message.uuid == user.id) {
					return (
						<MeMessage
							key={index}
							isHost={message.isHost}
							user={message.user}
							text={message.text}
						/>
					);
				} else {
					return (
						<OtherMessage
							key={index}
							isHost={message.isHost}
							user={message.user}
							text={message.text}
						/>
					);
				}
			})}
		</div>
	);
};

const MeMessage = ({ isHost, user, text }) => {
	return (
		<div className={styles['meMessageBox']}>
			<img
				src={emilyIcon}
				alt="Message Icon"
				className={styles['messageAvatar']}
			/>
			<div className={styles['rightMessageBox']}>
				<span className={styles['messageUserName']}>{user}</span>
				{isHost && <span className={styles['hostText']}>HOST</span>}
				<div className={styles['chatMessageBox']}>
					<span className={styles['messageText']}>{text}</span>
				</div>
			</div>
		</div>
	);
};

const OtherMessage = ({ isHost, user, text }) => {
	return (
		<div className={styles['otherMessageBox']}>
			<div className={styles['leftMessageBox']}>
				<span className={styles['messageUserName']}>{user}</span>
				{isHost && <span className={styles['hostText']}>HOST</span>}
				<div className={styles['chatMessageBox']}>
					<span className={styles['messageText']}>{text}</span>
				</div>
			</div>
			<img
				src={emilyIcon}
				alt="Message Icon"
				className={styles['messageAvatar']}
			/>
		</div>
	);
};

export default Chat;
