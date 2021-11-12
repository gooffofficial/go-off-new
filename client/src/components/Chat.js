import React, { useEffect, useState } from 'react';
import { usePubNub } from 'pubnub-react';
import emilyIcon from '../images/liveChatImages/emily-profile-icon.png';
import fileicon from '../images/liveChatImages/fileicon.png';
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
						console.log("message >> ",message.text)
						return (
							<MeMessage
								key={index}
								isHost={message.isHost}
								user={message.user}
								text={message.text}
								attachment={message.attachment}
							/>
						);
					}else if(!message.text){
						console.log("message 1 >> ",typeof message)
						return(
							<Attachment key={`A-${index}`} isHost={message.isHost} user={message.user} filename={message.filename} filesize={message.filesize} src={message.attachment}/>
						)
					}else{
						console.log("message text >> ",message.text)
						return( 
							<div key={index}>
							<Attachment key={`A-${index}`} isHost={message.isHost} filename={message.filename} filesize={message.filesize} user={message.user} src={message.attachment}/>
							<MeMessage
								key={index}
								isHost={message.isHost}
								user={message.user}
								text={message.text}
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
								attachment={message.attachment}
							/>
						);
					}else if(!message.text){
						return(
							<Attachment key={`A-${index}`} isHost={message.isHost} filename={message.filename} filesize={message.filesize} user={message.user} src={message.attachment} me={false}/>
						)
					}else{
						return(
							<div key={index}>
							<Attachment key={`A-${index}`} isHost={message.isHost} filename={message.filename} filesize={message.filesize} user={message.user} src={message.attachment}me={false}/>
							<OtherMessage
								key={index}
								isHost={message.isHost}
								user={message.user}
								text={message.text}
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

const MeMessage = ({ isHost, user, text}) => {
	return (
		<div className={styles['meMessageBox']}>
			<img
				src={'/images/stock-face.jpg'}
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

const Attachment = ({isHost, user,filename ,filesize , src, me=true}) => {
	const [image,setimage]= useState(true)
	if(me){
	return (
		<>
		<div className={styles['meMessageBox']}>
			<img
				src={emilyIcon}
				alt="Message Icon"
				className={styles['messageAvatar']}
			/>
			<div className={styles['rightMessageBox']}>
				<span className={styles['messageUserName']}>{user}</span>
				{isHost && <span className={styles['hostText']}>HOSTs</span>}
				{image ?
				<div>
					<img onError={()=>setimage(false)} style={{marginTop:'10px',widht:'150px',height:'150px',marginBottom:'10px',borderRadius:"10%"}} src={src}/>
				</div>
				:
				<div className={styles['chatMessageBox']}>
				<div style={{display:"flex",flexDirection:"row"}}>
				<img style={{marginTop:'5px',widht:'40px',height:'40px',marginBottom:'5px',borderRadius:"10%"}} src={fileicon}/>
				<div style={{marginTop:'5px',marginLeft:'5px'}}>
				<span className={styles['messageText']}>{filename}</span>
				<div>
				<span style={{fontSize:11}}>{(filesize / 1000).toFixed() + " KB"}</span>
				</div>
				</div>
				</div>
				</div>
				}
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
				{image ?
				<div>
					<img onError={()=>setimage(false)} style={{marginTop:'10px',widht:'150px',height:'150px',marginBottom:'10px',borderRadius:"10%"}} src={src}/>
				</div>
				:
				<div className={styles['chatMessageBox']}>
				<div style={{display:"flex",flexDirection:"row"}}>
				<img style={{marginTop:'5px',widht:'40px',height:'40px',marginBottom:'5px',borderRadius:"10%"}} src={fileicon}/>
				<div style={{marginTop:'5px',marginLeft:'5px'}}>
				<span className={styles['messageText']}>{filename}</span>
				<div>
				<span style={{fontSize:11}}>{(filesize / 1000).toFixed() + " KB"}</span>
				</div>
				</div>
				</div>
				</div>
				}
			</div>
			<img
				src={emilyIcon}
				alt="Message Icon"
				className={styles['messageAvatar']}
			/>
		</div>
		</>
		)
	}
}

export default Chat;
