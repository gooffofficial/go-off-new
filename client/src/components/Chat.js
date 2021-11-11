import React, { useEffect, useState } from 'react';
import { usePubNub } from 'pubnub-react';
import emilyIcon from '../images/liveChatImages/emily-profile-icon.png';
import styles from '../styles/LiveChatPage/livechat.module.css';
import emojiIcon from "../images/liveChatImages/msgemoji.png";
import shareIcon from "../images/liveChatImages/msgshare.png";
import { ReactionBarSelector , FacebookSelector} from '@charkour/react-reactions';

const remoji = [
	{label: "ha", node: <div>😀</div>},
	{label: "haha", node: <div>🤣</div>},
	{label: "heart", node: <div>❤️</div>},
	{label: "like", node: <div>👍</div>},
	{label: "dislike", node: <div>👎</div>}
]
const Chat = ({	messages, user, scrollhook }) => {

	useEffect(()=>{
		scrollhook.current.scrollIntoView({ behavior: 'smooth' });
		return
	},[])
	if(!scrollhook){
		return <> Loading... </>
	}
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
			<div ref={scrollhook}></div>
		</div>
	);
};

const MeMessage = ({ isHost, user, text, propic}) => {
	const [showreaction, setshowreaction] = useState(false)
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
			<div className={styles['msghovercontent']}>
			{/* <div className={styles['msgiconselected']} > */}
			{showreaction &&		
				<ReactionBarSelector 
				iconSize={15}
				reactions={remoji} 
				onSelect={(item)=>console.log("selected "+item)} 
				/>
				}
			<img
				src={shareIcon}
				alt="share Icon"
				className={styles['hovericon']}
				onClick={()=>console.log("share icon pressed")}
			/>
			{/* </div>
			<div className={styles['msgiconselected']} > */}
			<img
				src={emojiIcon}
				alt="emoji Icon"
				className={styles['hovericon']}
				onClick={()=> setshowreaction(!showreaction)}
			/>
			{/* </div> */}
			</div>
		</div>
	);
};

const OtherMessage = ({ isHost, user, text, propic }) => {
  const [showreaction, setshowreaction] = useState(false)
	return (
		<div className={styles['otherMessageBox']}>
			<div className={styles['msghovercontent']}>
			{/* <div className={styles['msgiconselected']} > */}
			{showreaction &&
				<ReactionBarSelector 
				iconSize={15}
				reactions={remoji} 
				onSelect={(item)=>console.log("selected "+item)} 
				/>
				}
			<img
				src={shareIcon}
				alt="share Icon"
				className={styles['hovericon']}
				onClick={()=>console.log("share icon pressed")}
			/>
			{/* </div>
			<div className={styles['msgiconselected']} > */}
			<img
				src={emojiIcon}
				alt="emoji Icon"
				className={styles['hovericon']}
				onClick={()=> setshowreaction(!showreaction)}
			/>
			{/* </div> */}
			</div>
			<div className={styles['leftMessageBox']}>
			  
				<span className={styles['messageUserName']}>{user}</span>
				{<span className={styles['hostText']}>HOST</span>}
			
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
	const [showreaction, setshowreaction] = useState(false)

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
			<div className={styles['msghovercontent']}>
			{/* <div className={styles['msgiconselected']} > */}
			{showreaction &&
				<ReactionBarSelector 
				iconSize={15}
				reactions={remoji}
				onSelect={(item)=>console.log("selected "+item)} 
				/>
				}
			<img
				src={shareIcon}
				alt="share Icon"
				className={styles['hovericon']}
				onClick={()=>console.log("share icon pressed")}
			/>
			{/* </div>
			<div className={styles['msgiconselected']} > */}
			<img
				src={emojiIcon}
				alt="emoji Icon"
				className={styles['hovericon']}
				onClick={()=> setshowreaction(!showreaction)}
			/>
			{/* </div> */}
			</div>
		</div>
		</>
	)}else{
	
		return(
			<>
		<div className={styles['otherMessageBox']}>
		<div className={styles['msghovercontent']}>
			{/* <div className={styles['msgiconselected']} > */}
			{showreaction &&
				<ReactionBarSelector 
				iconSize={15}
				reactions={remoji} 
				onSelect={(item)=>console.log("selected "+item)} 
				/>
				}
			<img
				src={shareIcon}
				alt="share Icon"
				className={styles['hovericon']}
				onClick={()=>console.log("share icon pressed")}
			/>
			{/* </div>
			<div className={styles['msgiconselected']} > */}
			<img
				src={emojiIcon}
				alt="emoji Icon"
				className={styles['hovericon']}
				onClick={()=> setshowreaction(!showreaction)}
			/>
			{/* </div> */}
			</div>
		
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

/*test data
			<MeMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test gotta make this hella so that we can test this better"} propic={""} attachment={null}/>
			<OtherMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test"} propic={""} attachment={null}/>
			<MeMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test gotta make this hella so that we can test this better"} propic={""} attachment={null}/>
			<OtherMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test"} propic={""} attachment={null}/>
			<MeMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test gotta make this hella so that we can test this better"} propic={""} attachment={null}/>
			<OtherMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test"} propic={""} attachment={null}/>
			<MeMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test gotta make this hella so that we can test this better"} propic={""} attachment={null}/>
			<OtherMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test"} propic={""} attachment={null}/>
			<MeMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test gotta make this hella so that we can test this better"} propic={""} attachment={null}/>
			<OtherMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test"} propic={""} attachment={null}/>
			<MeMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test gotta make this hella so that we can test this better"} propic={""} attachment={null}/>
			<OtherMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test"} propic={""} attachment={null}/>
			<MeMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test gotta make this hella so that we can test this better"} propic={""} attachment={null}/>
			<OtherMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test"} propic={""} attachment={null}/>
			<MeMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test gotta make this hella so that we can test this better"} propic={""} attachment={null}/>
			<OtherMessage key={0} isHost={true} user={"Christian Nava"} text={"this is a test"} propic={""} attachment={null}/>
*/