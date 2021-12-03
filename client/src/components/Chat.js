import React, { useEffect, useState } from 'react';
import { usePubNub } from 'pubnub-react';
import emilyIcon from '../images/liveChatImages/emily-profile-icon.png';
import fileicon from '../images/liveChatImages/fileicon.png';
import styles from '../styles/LiveChatPage/livechat.module.css';
import emojiIcon from "../images/liveChatImages/msgemoji.png";
import shareIcon from "../images/liveChatImages/msgshare.png";
import { ReactionBarSelector ,  ReactionCounter} from '@charkour/react-reactions';

const remoji = [
	{label: "ha", node: <div>😀</div>},
	{label: "haha", node: <div>🤣</div>},
	{label: "heart", node: <div>❤️</div>},
	{label: "like", node: <div>👍</div>},
	{label: "dislike", node: <div>👎</div>}
]
// const userreactions = 
// [
// 	// {label: "ha", node: <div>😀</div>},
// 	// {label: "haha", node: <div>🤣</div>},
// 	// {label: "heart",node: <div>❤️</div>, by: 'kunal'},
// 	// {label: "like", node: <div>👍</div> ,by: 'hemal'},
// 	// {label: "heart",node: <div>❤️</div>, by: 'milan'},
// 	// {label: "dislike", node: <div>👎</div>}
// ]
const Chat = ({	messages, user, scrollhook ,setreaction, setmsg }) => {

	useEffect(() => {
		scrollhook.current.scrollIntoView({ behavior: 'smooth' });
		return
	}, [])
	if (!scrollhook) {
		return <> Loading... </>
	}
	return (
		<div>
			{messages.map((message, index) => {
				// console.log(message)//renders a lot 
				if (message.uuid == user.id) {
					if (!message.attachment) {
						// console.log("message >> ", message)
						return (
							<MeMessage
								key={index}
								isHost={message.isHost}
								user={message.user}
								url={message.url}
								replyedmsg={message.replyedmsg}
								userreactions={message.userreaction}
								setmsg={()=>setmsg(message)}
								setreaction={(emoji)=>setreaction(emoji,message.timetoken)}
								urlimg={message.urlimg}
								urltitle={message.urltitle}
								text={message.text}
								propic={message.propic}
								attachment={message.attachment}
							/>
						);
					} else if (!message.text) {
						// console.log("message 1 >> ", typeof message)
						return (
								<Attachment key={`A-${index}`} userreactions={message.userreaction} setreaction={(emoji)=>setreaction(emoji,message.timetoken)} replyedmsg={message.replyedmsg} 	setmsg={()=>setmsg(message)} isHost={message.isHost} propic={message.propic} user={message.user} filename={message.filename} filesize={message.filesize} src={message.attachment} />
						)
					} else {
						// console.log("message text >> ", message.text)
						return (
							<div key={index}>
								<Attachment key={`A-${index}`} userreactions={message.userreaction} setreaction={(emoji)=>setreaction(emoji,message.timetoken)} replyedmsg={message.replyedmsg} isHost={message.isHost} propic={message.propic} filename={message.filename} filesize={message.filesize} user={message.user} src={message.attachment} />
								<MeMessage
									key={index}
									isHost={message.isHost}
									userreactions={message.userreaction}
									replyedmsg={message.replyedmsg}
									user={message.user}
									text={message.text}
									setmsg={()=>setmsg(message)}
									setreaction={(emoji)=>setreaction(emoji,message.timetoken)}
									url={message.url}
									urlimg={message.urlimg}
									urltitle={message.urltitle}
									propic={message.propic}
									attachment={message.attachment}
								/>
							</div>
						)
					}
				} else {
					if (!message.attachment) {
						return (
							<OtherMessage
								key={index}
								isHost={message.isHost}
								user={message.user}
								text={message.text}
								userreactions={message.userreaction}
								url={message.url}
								setreaction={(emoji)=>setreaction(emoji,message.timetoken)}
								replyedmsg={message.replyedmsg}
								setmsg={()=>setmsg(message)}
								urlimg={message.urlimg}
								urltitle={message.urltitle}
								propic={message.propic}
								attachment={message.attachment}
							/>
						);
					} else if (!message.text) {
						return (
							<Attachment userreactions={message.userreaction} setreaction={(emoji)=>setreaction(emoji,message.timetoken)} key={`A-${index}`} replyedmsg={message.replyedmsg} 	setmsg={()=>setmsg(message)} propic={message.propic} isHost={message.isHost} filename={message.filename} filesize={message.filesize} user={message.user} src={message.attachment} me={false} />
						)
					} else {
						return (
							<div key={index}>
								<Attachment userreactions={message.userreaction} setreaction={(emoji)=>setreaction(emoji,message.timetoken)} key={`A-${index}`} replyedmsg={message.replyedmsg}	setmsg={()=>setmsg(message)} propic={message.propic} isHost={message.isHost} filename={message.filename} filesize={message.filesize} user={message.user} src={message.attachment} me={false} />
								<OtherMessage
									key={index}
									setreaction={(emoji)=>setreaction(emoji,message.timetoken)}
									isHost={message.isHost}
									user={message.user}
									userreactions={message.userreaction}
									url={message.url}
									replyedmsg={message.replyedmsg}
									setmsg={()=>setmsg(message)}
									urlimg={message.urlimg}
									urltitle={message.urltitle}
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

const MeMessage = ({ isHost, user, url,userreactions, urlimg, urltitle, text,setreaction, setmsg, propic , replyedmsg }) => {
	const [showreaction, setshowreaction] = useState(false)
	const [replyimage, setreplyimage] = useState(replyedmsg ? replyedmsg.attachment : "")
	const [reactiondata, setreactiondata] = useState(userreactions ? userreactions : [])
	return (
		<div className={styles['meMessageBox']} >
			{/* {console.log("replyed message >> ", JSON.stringify(replyedmsg))} */}
			<img
				src={propic}
				alt="Message Icon"
				className={styles['messageAvatar']}
			/>
			
			<div className={styles['rightMessageBox']}>
				<span className={styles['messageUserName']}>{user}</span>
				{isHost && <span className={styles['hostText']}>HOST</span>}
				{replyedmsg &&
				<div style={{borderBottomLeftRadius:0}} className={styles['replyMessage']}>
					<div>
					<div>
					<span style={{color:"black",fontSize:14}}>{replyedmsg.user}</span>
					</div>
					<span style={{color:"black",fontSize:14,opacity:0.5}}>{replyedmsg.attachment ? replyedmsg.filename : replyedmsg.text}</span>
					</div>
					<img onError={() => setreplyimage(fileicon)} style={{ marginLeft:20,marginBottom:10,height: '40px', borderRadius: "5px" }} src={replyimage} />
					
				</div>
				}
				{url == null ?
					<div className={styles['chatMessageBox']}>
						<span className={styles['messageText']}>{text}</span>
					{reactiondata.length !== 0 && <div style={{height:18}}></div>}
					</div>
					:
					<div onClick={() => window.open(url[0])} style={{ marginTop: '10px', borderRadius: 10, borderBottomLeftRadius: '0px',paddingBottom:10, marginBottom: 12, width: '250px', backgroundColor: "#C4C4C44D" }} >
						<img style={{ width: '250px', marginBottom: '10px', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} src={urlimg} />
						<div style={{ width: "230px", marginLeft: "10px" }}>
							<span style={{ wordBreak: "break-all" }} className={styles['messageText']}>{urltitle}</span>
							<div>
								<span style={{ wordBreak: "break-all", lineHeight: "0px", fontSize: 11, opacity: "50%" }} >{text}</span>
							</div>
						</div>
						{reactiondata.length !== 0 && <div style={{height:8}}></div>}
					</div>
				}
				{reactiondata.length !== 0 &&
					<div style={{marginTop:-25,marginLeft:10,backgroundColor:"#F3F3F5",maxWidth:"fit-content",borderRadius:50,padding:5,paddingRight:8,paddingBottom:8,marginBottom:11}} >
				        {console.log(reactiondata)}
						<ReactionCounter 
						iconSize={18}
						showReactsOnly={true}
						bg="transparent"
						reactions={reactiondata} 
						// onSelect={(item)=>console.log("selected "+item)} 
						/>
					</div>
					}
				
			</div>
			<div className={styles['msghovercontent']}>
			{/* <div className={styles['msgiconselected']} > */}
			{showreaction &&		
				<ReactionBarSelector 
				iconSize={15}
				reactions={remoji} 
				onSelect={(item)=> {
					setreaction(item)

					if(item == "heart")
					{
						setreactiondata([...reactiondata,{label: "heart",node: <div>❤️</div>, by: 'kunal'}])
					}else if(item == "like")
					{
						setreactiondata([...reactiondata,{label: "like", node: <div>👍</div> ,by: 'hemal'}])
					}else if(item == "ha")
					{
						setreactiondata([...reactiondata,{label: "ha", node: <div>😀</div>, by: 'kunal'}])
					}else if(item == "haha")
					{
						setreactiondata([...reactiondata,{label: "haha", node: <div>🤣</div>, by: 'kunal'}])
					}else if(item == "dislike")
					{
						setreactiondata([...reactiondata,{label: "dislike", node: <div>👎</div>, by: 'kunal'}])
					}
					setshowreaction(false)
				}} 
				/>
				}
			<img
				src={shareIcon}
				alt="share Icon"
				className={styles['hovericon']}
				onClick={setmsg}
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
 
const OtherMessage = ({ isHost, user, url,userreactions, urlimg,setreaction, urltitle, text, propic ,replyedmsg, setmsg }) => {
	const [replyimage, setreplyimage] = useState(replyedmsg ? replyedmsg.attachment : "")
	const [showreaction, setshowreaction] = useState(false)
	const [reactiondata, setreactiondata] = useState(userreactions ? userreactions : [])

	return (
		<div className={styles['otherMessageBox']}>
			<div className={styles['msghovercontent']}>
			{/* <div className={styles['msgiconselected']} > */}
			{showreaction &&
				<ReactionBarSelector 
				iconSize={15}
				reactions={remoji} 
				onSelect={(item)=> {
					setreaction(item)

					if(item == "heart")
					{
						setreactiondata([...reactiondata,{label: "heart",node: <div>❤️</div>, by: 'kunal'}])
					}else if(item == "like")
					{
						setreactiondata([...reactiondata,{label: "like", node: <div>👍</div> ,by: 'hemal'}])
					}else if(item == "ha")
					{
						setreactiondata([...reactiondata,{label: "ha", node: <div>😀</div>, by: 'kunal'}])
					}else if(item == "haha")
					{
						setreactiondata([...reactiondata,{label: "haha", node: <div>🤣</div>, by: 'kunal'}])
					}else if(item == "dislike")
					{
						setreactiondata([...reactiondata,{label: "dislike", node: <div>👎</div>, by: 'kunal'}])
					}
					setshowreaction(false)
				}} 
				/>
				}
			<img
				src={shareIcon}
				alt="share Icon"
				className={styles['hovericon']}
				onClick={setmsg}
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
				{isHost && <span className={styles['hostText']}>HOST</span>}
				{replyedmsg &&
				<div style={{borderBottomRightRadius:0}} className={styles['replyMessage']}>
					<div>
					<div>
					<span style={{color:"black",fontSize:14}}>{replyedmsg.user}</span>
					</div>
					<span style={{color:"black",fontSize:14,opacity:0.5}}>{replyedmsg.attachment ? replyedmsg.filename : replyedmsg.text}</span>
					</div>
					<img onError={() => setreplyimage(fileicon)} style={{ marginLeft:20,marginBottom:10,height: '40px', borderRadius: "5px" }} src={replyimage} />
					
				</div>
				}
				{url == null ?
					<div className={styles['chatMessageBox']}>
						<span className={styles['messageText']}>{text}</span>
						{reactiondata.length !== 0 && <div style={{height:18}}></div>}
					</div>
					:
					<div onClick={() => window.open(url[0])} style={{ marginTop: '10px', borderRadius: 10, borderBottomRightRadius: '0px', marginBottom: 10,paddingBottom:12, width: '250px', backgroundColor: "#C4C4C44D" }} >
						<img style={{ width: '250px', marginBottom: '10px', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} src={urlimg} />
						<div style={{ width: "230px", marginLeft: "10px" }}>
							<span style={{ wordBreak: "break-all" }} className={styles['messageText']}>{urltitle}</span>
							<div>
								<span style={{ wordBreak: "break-all", lineHeight: "0px", fontSize: 11, opacity: "50%" }} >{text}</span>
							</div>
						</div>
						{reactiondata.length !== 0 && <div style={{height:8}}></div>}
					</div>
				}
				{reactiondata.length !== 0 &&
					<div style={{marginTop:-25,marginLeft:5,display:'flex',flexDirection:"row",marginBottom:11}} >
						<div style={{flexGrow:1}}></div>
						<div style={{backgroundColor:"#F3F3F5",maxWidth:"fit-content",marginRight:10,borderRadius:50,padding:5,paddingRight:8,paddingBottom:8}}>
						<ReactionCounter 
						iconSize={18}
						showReactsOnly={true}
						bg="transparent"
						reactions={reactiondata} 
						// onSelect={(item)=>console.log("selected "+item)} 
						/>
						</div>
					</div>
					}
			</div>
			<img
				src={propic}
				alt="Message Icon"
				className={styles['messageAvatar']}
			/>
		</div>
	);
};

const Attachment = ({ isHost, user, filename,userreactions,setreaction, propic, filesize,setmsg,replyedmsg, src, me = true }) => {
    const [image, setimage] = useState(true)
	const [showreaction, setshowreaction] = useState(false)
	const [replyimage, setreplyimage] = useState(replyedmsg ? replyedmsg.attachment : "")
	const [reactiondata, setreactiondata] = useState(userreactions ? userreactions : [])

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
				{replyedmsg &&
				<div style={{borderBottomLeftRadius:0}} className={styles['replyMessage']}>
						<div>
					<div>
					<span style={{color:"black",fontSize:14}}>{replyedmsg.user}</span>
					</div>
					<span style={{color:"black",fontSize:14,opacity:0.5}}>{replyedmsg.attachment ? replyedmsg.filename : replyedmsg.text}</span>
					</div>
					<img onError={() => setreplyimage(fileicon)} style={{ marginLeft:20,marginBottom:10,height: '40px', borderRadius: "5px" }} src={replyimage} />
					
				</div>
				}
				{image ?
                            <div>
                                <img onError={() => setimage(false)} style={{ marginTop: '10px', width: '250px', marginBottom: '10px', borderRadius: "10px" }} src={src} />
						{reactiondata.length !== 0 && <div style={{height:0}}></div>}

							</div>
                            :
                            <div className={styles['chatMessageBox']}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <img style={{ marginTop: '5px', widht: '40px', height: '40px', marginBottom: '5px', borderRadius: "10px" }} src={fileicon} />
                                    <div style={{ marginTop: '5px', marginLeft: '5px' }}>
                                        <span className={styles['messageText']}>{filename}</span>
                                        <div>
                                            <span style={{ fontSize: 11 }}>{(filesize / 1000).toFixed() + " KB"}</span>
                                        </div>
                                    </div>
                                </div>
								{reactiondata.length !== 0 && <div style={{height:15}}></div>}
                            </div>
                        }
							{reactiondata.length !== 0 &&
					<div style={{marginTop:-25,marginLeft:10,backgroundColor:"#F3F3F5",maxWidth:"fit-content",borderRadius:50,padding:5,paddingRight:8,paddingBottom:8,marginBottom:11}} >
				        {console.log(reactiondata)}
						<ReactionCounter 
						iconSize={18}
						showReactsOnly={true}
						bg="transparent"
						reactions={reactiondata} 
						// onSelect={(item)=>console.log("selected "+item)} 
						/>
					</div>
					}
					
			</div>
			<div className={styles['msghovercontent']}>
			{/* <div className={styles['msgiconselected']} > */}
			{showreaction &&
				<ReactionBarSelector 
				iconSize={15}
				reactions={remoji}
				onSelect={(item)=> {
					setreaction(item)

					if(item == "heart")
					{
						setreactiondata([...reactiondata,{label: "heart",node: <div>❤️</div>, by: 'kunal'}])
					}else if(item == "like")
					{
						setreactiondata([...reactiondata,{label: "like", node: <div>👍</div> ,by: 'hemal'}])
					}else if(item == "ha")
					{
						setreactiondata([...reactiondata,{label: "ha", node: <div>😀</div>, by: 'kunal'}])
					}else if(item == "haha")
					{
						setreactiondata([...reactiondata,{label: "haha", node: <div>🤣</div>, by: 'kunal'}])
					}else if(item == "dislike")
					{
						setreactiondata([...reactiondata,{label: "dislike", node: <div>👎</div>, by: 'kunal'}])
					}
					setshowreaction(false)
				}} 
				/>
				}
			<img
				src={shareIcon}
				alt="share Icon"
				className={styles['hovericon']}
				onClick={setmsg}
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
				onSelect={(item)=> {
					setreaction(item)
					if(item == "heart")
					{
						setreactiondata([...reactiondata,{label: "heart",node: <div>❤️</div>, by: 'kunal'}])
					}else if(item == "like")
					{
						setreactiondata([...reactiondata,{label: "like", node: <div>👍</div> ,by: 'hemal'}])
					}else if(item == "ha")
					{
						setreactiondata([...reactiondata,{label: "ha", node: <div>😀</div>, by: 'kunal'}])
					}else if(item == "haha")
					{
						setreactiondata([...reactiondata,{label: "haha", node: <div>🤣</div>, by: 'kunal'}])
					}else if(item == "dislike")
					{
						setreactiondata([...reactiondata,{label: "dislike", node: <div>👎</div>, by: 'kunal'}])
					}
					setshowreaction(false)
				}} 
				/>
				}
			<img
				src={shareIcon}
				alt="share Icon"
				className={styles['hovericon']}
				onClick={setmsg}
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
				{replyedmsg &&
				<div style={{borderBottomRightRadius:0}} className={styles['replyMessage']}>
					<div>
					<div>
					<span style={{color:"black",fontSize:14}}>{replyedmsg.user}</span>
					</div>
					<span style={{color:"black",fontSize:14,opacity:0.5}}>{replyedmsg.attachment ? replyedmsg.filename : replyedmsg.text}</span>
					</div>
					<img onError={() => setreplyimage(fileicon)} style={{ marginLeft:20,marginBottom:10,height: '40px', borderRadius: "5px" }} src={replyimage} />
					
				</div>
				}
				{image ?
                            <div>
                                <img onError={() => setimage(false)} style={{ marginTop: '10px', width: '250px', marginBottom: '10px', borderRadius: "10px" }} src={src} />
								{reactiondata.length !== 0 && <div style={{height:4}}></div>}
                           
						    </div>
                            :
                            <div className={styles['chatMessageBox']}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <img style={{ marginTop: '5px', widht: '40px', height: '40px', marginBottom: '5px', borderRadius: "10px" }} src={fileicon} />
                                    <div style={{ marginTop: '5px', marginLeft: '5px' }}>
                                        <span className={styles['messageText']}>{filename}</span>
                                        <div>
                                            <span style={{ fontSize: 11 }}>{(filesize / 1000).toFixed() + " KB"}</span>
                                        </div>
                                    </div>
                                </div>
								{reactiondata.length !== 0 && <div style={{height:15}}></div>}

                            </div>
                        }
						{reactiondata.length !== 0 &&
						<div style={{marginTop:-25,marginLeft:5,display:'flex',flexDirection:"row",marginBottom:11}} >
						<div style={{flexGrow:1}}></div>
						<div style={{backgroundColor:"#F3F3F5",maxWidth:"fit-content",marginRight:10,borderRadius:50,padding:5,paddingRight:8,paddingBottom:8}}>
						<ReactionCounter 
						iconSize={18}
						showReactsOnly={true}
						bg="transparent"
						reactions={reactiondata} 
						// onSelect={(item)=>console.log("selected "+item)} 
						/>
						</div>
					</div>
					}
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