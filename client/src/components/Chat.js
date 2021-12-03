import React, { useEffect, useState } from 'react';
import { usePubNub } from 'pubnub-react';
import emilyIcon from '../images/liveChatImages/emily-profile-icon.png';
import fileicon from '../images/liveChatImages/fileicon.png';
import styles from '../styles/LiveChatPage/livechat.module.css';

const Chat = ({ messages, user, scrollhook }) => {

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
				//console.log(message)//renders a lot 
				if (message.uuid == user.id) {
					if (!message.attachment) {
						console.log("message >> ", message.text)
						return (
							<MeMessage
								key={index}
								isHost={message.isHost}
								user={message.user}
								url={message.url}
								urlimg={message.urlimg}
								urltitle={message.urltitle}
								text={message.text}
								propic={message.propic}
								attachment={message.attachment}
							/>
						);
					} else if (!message.text) {
						console.log("message 1 >> ", typeof message)
						return (
							<Attachment key={`A-${index}`} isHost={message.isHost} propic={message.propic} user={message.user} filename={message.filename} filesize={message.filesize} src={message.attachment} />
						)
					} else {
						console.log("message text >> ", message.text)
						return (
							<div key={index}>
								<Attachment key={`A-${index}`} isHost={message.isHost} propic={message.propic} filename={message.filename} filesize={message.filesize} user={message.user} src={message.attachment} />
								<MeMessage
									key={index}
									isHost={message.isHost}
									user={message.user}
									text={message.text}
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
								url={message.url}
								urlimg={message.urlimg}
								urltitle={message.urltitle}
								propic={message.propic}
								attachment={message.attachment}
							/>
						);
					} else if (!message.text) {
						return (
							<Attachment key={`A-${index}`} propic={message.propic} isHost={message.isHost} filename={message.filename} filesize={message.filesize} user={message.user} src={message.attachment} me={false} />
						)
					} else {
						return (
							<div key={index}>
								<Attachment key={`A-${index}`} propic={message.propic} isHost={message.isHost} filename={message.filename} filesize={message.filesize} user={message.user} src={message.attachment} me={false} />
								<OtherMessage
									key={index}
									isHost={message.isHost}
									user={message.user}
									url={message.url}
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

const MeMessage = ({ isHost, user, url, urlimg, urltitle, text, propic }) => {
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
				{url == null ?
					<div className={styles['chatMessageBox']}>
						<span className={styles['messageText']}>{text}</span>
					</div>
					:
					<div onClick={() => window.open(url[0])} style={{ marginTop: '10px', borderRadius: 10, borderBottomLeftRadius: '0px', marginBottom: 20, width: '250px', backgroundColor: "#C4C4C44D" }} >
						<img style={{ width: '250px', marginBottom: '10px', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} src={urlimg} />
						<div style={{ width: "230px", marginLeft: "10px" }}>
							<span style={{ wordBreak: "break-all" }} className={styles['messageText']}>{urltitle}</span>
							<div>
								<span style={{ wordBreak: "break-all", lineHeight: "0px", fontSize: 11, opacity: "50%" }} >{text}</span>
							</div>
						</div>
					</div>
				}
			</div>
		</div>
	);
};

const OtherMessage = ({ isHost, user, url, urlimg, urltitle, text, propic }) => {
	return (
		<div className={styles['otherMessageBox']}>
			<div className={styles['leftMessageBox']}>
				<span className={styles['messageUserName']}>{user}</span>
				{isHost && <span className={styles['hostText']}>HOST</span>}
				{url == null ?
					<div className={styles['chatMessageBox']}>
						<span className={styles['messageText']}>{text}</span>
					</div>
					:
					<div onClick={() => window.open(url[0])} style={{ marginTop: '10px', borderRadius: 10, borderBottomRightRadius: '0px', marginBottom: 20, width: '250px', backgroundColor: "#C4C4C44D" }} >
						<img style={{ width: '250px', marginBottom: '10px', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} src={urlimg} />
						<div style={{ width: "230px", marginLeft: "10px" }}>
							<span style={{ wordBreak: "break-all" }} className={styles['messageText']}>{urltitle}</span>
							<div>
								<span style={{ wordBreak: "break-all", lineHeight: "0px", fontSize: 11, opacity: "50%" }} >{text}</span>
							</div>
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

const Attachment = ({ isHost, user, filename, propic, filesize, src, me = true }) => {
	const [image, setimage] = useState(true)
	if (me) {
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
						{image ?
							<div>
								<img onError={() => setimage(false)} style={{ marginTop: '10px', width: '250px', marginBottom: '10px', borderRadius: "10%" }} src={src} />
							</div>
							:
							<div className={styles['chatMessageBox']}>
								<div style={{ display: "flex", flexDirection: "row" }}>
									<img style={{ marginTop: '5px', widht: '40px', height: '40px', marginBottom: '5px', borderRadius: "10%" }} src={fileicon} />
									<div style={{ marginTop: '5px', marginLeft: '5px' }}>
										<span className={styles['messageText']}>{filename}</span>
										<div>
											<span style={{ fontSize: 11 }}>{(filesize / 1000).toFixed() + " KB"}</span>
										</div>
									</div>
								</div>
							</div>
						}
					</div>
				</div>
			</>
		)
	} else {
		return (
			<>
				<div className={styles['otherMessageBox']}>
					<div className={styles['leftMessageBox']}>
						<span className={styles['messageUserName']}>{user}</span>
						{isHost && <span className={styles['hostText']}>HOSTs</span>}
						{image ?
							<div>
								<img onError={() => setimage(false)} style={{ marginTop: '10px', width: '250px', marginBottom: '10px', borderRadius: "10%" }} src={src} />
							</div>
							:
							<div className={styles['chatMessageBox']}>
								<div style={{ display: "flex", flexDirection: "row" }}>
									<img style={{ marginTop: '5px', widht: '40px', height: '40px', marginBottom: '5px', borderRadius: "10%" }} src={fileicon} />
									<div style={{ marginTop: '5px', marginLeft: '5px' }}>
										<span className={styles['messageText']}>{filename}</span>
										<div>
											<span style={{ fontSize: 11 }}>{(filesize / 1000).toFixed() + " KB"}</span>
										</div>
									</div>
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