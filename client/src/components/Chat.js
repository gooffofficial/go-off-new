import React, { useEffect, useState } from 'react';
import { usePubNub } from 'pubnub-react';
import emilyIcon from '../images/liveChatImages/emily-profile-icon.png';
import styles from '../styles/LiveChatPage/livechat.module.css';
import axios from 'axios';

//!messages with attachment are missing attachments
const Chat = ({	messages, user }) => {

	return (
		<div>
			{messages.map((message, index) => {
				//console.log(message)//renders a lot 
				if (message.uuid == user.id) {
					if(!message.attachment){
						return (
							<MeMessage
								key={index}
								isHost={message.isHost}
								user={message.user}
								text={message.text}
								propic={message.propic}
								attachment={message.attachment}
							/>
						);
					}else if(!message.text){
						return(
							<Attachment key={`A-${index}`} isHost={message.isHost} user={message.user} src={message.attachment}/>
						)
					}else{
						return(
							<div key={index}>
							<Attachment key={`A-${index}`} isHost={message.isHost} user={message.user} src={message.attachment}/>
							<MeMessage
								key={index}
								isHost={message.isHost}
								user={message.user}
								text={message.text}
								propic={message.propic}
								attachment={message.attachment}
							/>
							</div>
						)
					}
				} else {
					if(!message.attachment){
						return (
							<OtherMessage
								key={index}
								isHost={message.isHost}
								user={message.user}
								text={message.text}
								propic={message.propic}
								attachment={message.attachment}
							/>
						);
					}else if(!message.text){
						return(
							<Attachment key={`A-${index}`} isHost={message.isHost} user={message.user} src={message.attachment} me={false}/>
						)
					}else{
						return(
							<div key={index}>
							<Attachment key={`A-${index}`} isHost={message.isHost} user={message.user} src={message.attachment}me={false}/>
							<OtherMessage
								key={index}
								isHost={message.isHost}
								user={message.user}
								text={message.text}
								propic={message.propic}
								attachment={message.attachment}
							/>
							</div>
						)
					}
				}
			})}
		</div>
	);
};

const MeMessage = ({ isHost, user, text, propic}) => {
	return (
		<div className={styles['meMessageBox']}>
			<img
				src={propic}
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

const OtherMessage = ({ isHost, user, text, propic }) => {
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
				src={propic}
				alt="Message Icon"
				className={styles['messageAvatar']}
			/>
		</div>
	);
};

const Attachment = ({isHost, user, src, me=true, propic}) => {
	if(me){
	return (
		<>
		<div className={styles['meMessageBox']}>
			<img
				src={propic}
				alt="Message Icon"
				className={styles['messageAvatar']}
			/>
			<div className={styles['rightMessageBox']}>
				<span className={styles['messageUserName']}>{user}</span>
				{isHost && <span className={styles['hostText']}>HOSTs</span>}
				<div className={styles['chatMessageBox']}>
					<img style={{widht:'50px',height:'50px'}} src={src}/>
				</div>
			</div>
		</div>
		</>
	)}else{
		return(
			<>
		<div className={styles['otherMessageBox']}>
			<div className={styles['leftMessageBox']}>
				<span className={styles['messageUserName']}>{user}</span>
				{isHost && <span className={styles['hostText']}>HOSTs</span>}
				<div className={styles['chatMessageBox']}>
					<img style={{widht:'50px',height:'50px'}} src={src}/>
				</div>
			</div>
			<img
				src={propic}
				alt="Message Icon"
				className={styles['messageAvatar']}
			/>
		</div>
		</>
		)
	}
}

export default Chat;
