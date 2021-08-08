import React, { useEffect, useState, useRef, createRef } from "react";
import { useParams } from "react-router";
import goOffLogo from "../images/liveChatImages/go-off-logo.png";
import searchIcon from "../images/liveChatImages/search-icon.png";
import optionsIcon from "../images/liveChatImages/options.png";
import addPersonIcon from "../images/liveChatImages/person-add.png";
import bellIcon from "../images/liveChatImages/bell.png";
import shareIcon from "../images/liveChatImages/paper-plane.png";
import prekshaIcon from "../images/liveChatImages/preksha-profile-icon.png";
import arrowDownIcon from "../images/liveChatImages/arrow-ios-down.png";
import homeIcon from "../images/liveChatImages/home-icon.png";
import globeIcon from "../images/liveChatImages/globe-icon.png";
import article1 from "../images/liveChatImages/article-1.png";
import article2 from "../images/liveChatImages/article-2.png";
import NYTLogo from "../images/liveChatImages/NYT-Logo.png";
import emilyIcon from "../images/liveChatImages/emily-profile-icon.png";
import sendIcon from "../images/liveChatImages/send.png";
import dots3Icon from "../images/liveChatImages/dots3.png";
import inputAddIcon from "../images/liveChatImages/addIcon.png";
import inputSendIcon from "../images/liveChatImages/chatSend.png";
import styles from "../styles/LiveChatPage/livechat.module.css";
import { PubNubConsumer, usePubNub } from "pubnub-react";
import { useForm } from "react-hook-form";
import Chat from "../components/Chat.js";
import Participants from '../components/Participants.js';
import axios from "axios";
import { useHistory } from "react-router-dom";
import firebase from "../firebase.js";

const LiveChat = () => {
  const db = firebase.firestore()
  //storage is
  // firebase.storage()

  const history = useHistory();

  const fillerUser = {
    name: "Username",
    propic: "/images/stock-face.jpg",
    username: "username",
    id: 0,
    followercount: 0,
    followingcount: 0,
  };
  const fillerMetaData={
    convoId:0,
    title:'Example',
    descrition: 'Example',
    hostId: 0,
    isOpen:false,
    rsvp:[]
  }

  const { code } = useParams();

  //importing pubnub into this component
  const pubnub = usePubNub();

  
  //chat metadata from firebase
  const [metaData, setMetaData] = useState();

  //typing indicator
  const [userTyping, setUserTyping] = useState('');

  //file url used to be sent as attachment with messages.
  const [file, setFile] = useState('');

  const hiddenFileInput = useRef();

  const {
    register, //used to register an input field
    handleSubmit, //is a function that will call your onSubmit function, whatever you declare that to be
    formState: { errors }, //this keeps track of the errors that can be easily retrieved
  } = useForm({ criteriaMode: "all" });

  //this will hold channel(s) for now default is test. will need to add way to join via a unique identifier to set as channel
  const [channels, setChannels] = useState([code]);

  //this state will hold all messages; Note every message will be structured as such {text:'string', user:'string', isHost:'boolean'}
  const [messages, addMessages] = useState([]);

  //sets current user with dummy info
  const [currentUser, setCurrentUser] = useState(fillerUser);

  const [loading, setLoading] = useState(true);

  const [isHost, setIsHost] = useState(false);

  const [content, setContent] = useState();

  const [reload, setReload] = useState(false)

  //this is a ref that will give scroll to bottom functionality
  const scrollhook = useRef();

  //this will handle incoming messages
  const handleMessage = (object) => {
    console.log(object.message);
    const message = object.message;
    if (!message.user) {
      return;
    }
    const text = message.text;
    if (typeof text === "string") {
      addMessages((messages) => [...messages, message]);
    }
    scrollhook.current.scrollIntoView({ behavior: "smooth" }); // scrolls to bottom when message is recieved
  };

  const uploadFile = async (fileRef) =>{
    if(!file){
      return 
    }
    //uploads the file
    console.log('here')
    await fileRef.put(file)
    setFile('')
  }

  const onChangeFile = (e) => {
    const file = e.target.files[0];
    //console.log(file)
    setFile(file)
  }

  const virtualClick = event =>{
    hiddenFileInput.current.click();
  };

  //this on submit function is publishing the message to the channel
  const onSubmit = async (message, e) => {
    console.log(message)
    if(message.message=='' && !file){
      return
    }
    const storageRef = firebase.storage().ref();
    if(file.name){
      console.log('file', file.name)
    const fileRef = storageRef.child(file.name);
    uploadFile(fileRef).then(res => {
      console.log('upload success')
      fileRef.getDownloadURL().then(fileURL=>{
        console.log('URL success')
        pubnub.publish(
          {
            channel: channels[0],
            message: {
              user: currentUser.name,
              isHost: isHost,
              text: message.message,
              uuid: currentUser.id,
              attachment: fileURL
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
        scrollhook.current.scrollIntoView({ behavior: "smooth" }); // scrolls to bottom when message is sent
      }
      ).catch()
  }).catch(error =>console.log(error))
}else{
    console.log('no pic')
    pubnub.publish(
      {
        channel: channels[0],
        message: {
          user: currentUser.name,
          isHost: isHost,
          text: message.message,
          uuid: currentUser.id,
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
    scrollhook.current.scrollIntoView({ behavior: "smooth" }); // scrolls to bottom when message is sent
  }
    };
  //handles leave/end button
  const handleButton = () => {
	pubnub.unsubscribe({channels: channels});
	pubnub.signal({channel:code,message:{action:'DM',uuid:pubnub.getUUID()}});
	console.log('left');
	isHost?endConversation():history.push('/home')
  }

  const endConversation = () => {
    pubnub.signal({channel:code,message:{action:'END'}})
    //use db to make isOpen to false on conversation metadata 
  }

  //handles typing indicator signaling
  const handlePress=()=>{
	  pubnub.signal({channel:code,message:{action:'UT',name:currentUser.name}});
	}

  //use this to look at the metadata
  const fetchMetaData = async () => {
    /**
    db.collection('Conversations').onSnapshot((snapshot)=>{
      snapshot.forEach(doc => console.log(doc.data()))
    })
     */
    const doc= await db.collection('Conversations').where('convoId','==', code).get();
    db.collection('Conversations').where('convoId','==', code).get().then((querySnapshot) => {

      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          let metadata= doc.data()
          setMetaData(metadata);
          fetchAllMessages();
          checkUser(metadata);
          //console.log(doc.id, " => ", doc.data());
      });
  }).catch((err) => console.log(err))

  if(!doc.docs[0]){
    setContent(<div style={{textAlign: 'center'}}>Chat does not exist</div>)
  }

  }

  const openConversation = () =>{
    db.collection('Conversations').where('convoId','==', code).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          db.collection('Conversations').doc(doc.id).update({isOpen:true}).then(res=>console.log('success')).catch(err => console.log(err))
          console.log(doc.id, " => ", doc.data());
      });
  })
  }

  const addListener = (user)=>{
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
          },
        signal: function(s) {
            // handle signal
            var channelName = s.channel; // The channel to which the signal was published
            var channelGroup = s.subscription; // The channel group or wildcard subscription match (if exists)
            var pubTT = s.timetoken; // Publish timetoken
            var msg = s.message; // The Payload
            var publisher = s.publisher; //The Publisher
        //** use redux to see if the signals work better.
        if (msg.action=='END'){
          //** redirect everyone out
          history.push('/home');
        }else if(msg.action=='UT'){
          //sends message if use is typing
          setUserTyping(`${msg.name} is typing`);
          setTimeout(()=>{setUserTyping('')},5000)
        }
        },
          status: (event) => {
            console.log("status: " + JSON.stringify(event));
          },
        });
  }
  //checks the room and returns chat or other error based on rsvp and occupancy
  const checkRoom = async (user, metadata) =>{
    pubnub.hereNow(
      {
        channels: channels,
        includeUUIDs: true,
        includeState: true,
      },
      (status, response) => {
        const occupancy = response?response.totalOccupancy:null;
        const occupants = response?response.occupants:null;
        if(occupancy<10){
          //room not full now check for rsvp
          if(metadata.isOpen==false){
            setContent(<div style={{textAlign: 'center'}}>Conversation not yet open</div>)
          }else if((metadata.rsvp.includes(user.id)||user.id==metadata.hostId)&&metadata.isOpen==true){
            addListener(user);
            //the user rsvp'd or is host. and can now see chat
            pubnub.signal({channel:code,message:{action:'AM',name:user.name}})
            setReload(true);
            scrollhook.current.scrollIntoView({ behavior: 'smooth' });
          }else{
            //person not rsvp. redirect or respond?
           setContent(<div style={{textAlign: 'center'}}>You did not rsvp for this conversation</div>)
          }
        }else{
          //too many people
           setContent(<div style={{textAlign: 'center'}}>Chat is full</div>)
        }
      }
    )}

    //checks for and sets User
    const checkUser = async (data) =>{
      axios
      .get(`/api/users/current`, {
        withCredentials: true,
      })
      .then((res) => {
        setCurrentUser(res.data.user);
        pubnub.setUUID(res.data.user.id);
        let metadata = {...data}
        if(data.hostId==res.data.user.id){
          setIsHost(true);
          if(data.isOpen==false){
            metadata.isOpen=true;
            openConversation();
          }
        }        
        checkRoom(res.data.user, metadata)
      }).catch(err =>{
        setContent(<div style={{textAlign: 'center'}}>Please sign in</div>)
        console.log(`could not make request: ${err}`
      )})
    }

    //fetches all channel messages
    const fetchAllMessages = async () => {

        pubnub.fetchMessages({ channels: [code], count: 100 })
			.then((e) => {
				//this will fetch all messages in Test chat then add them to the messages state.
				e.channels[code].forEach((e) => {
					if (e.message.message || e.message.text.message) {
						return;
					} // this is just done to filter out previous versions of the messages
					if (e.message.user && e.message.text) {
						addMessages((messages) => [
							...messages,
							{
								user: e.message.user,
								isHost: e.message.isHost,
								text: e.message.text,
								uuid: e.message.uuid,
                attachment: e.message.attachment,
							},
						]);
					}
				});
			})
			.catch((error) => console.log(error));
    }
  //useEffect will add listeners and will subscribe to channel. will refresh if currentUser changes
  useEffect(() => {
    if(!code){
      //!should set content
      setContent(<div style={{textAlign: 'center'}}>Chat does not exist</div>)
      setLoading(false);
      return
    }
    const unmount = fetchMetaData();
    //this subscribes to a list of channels
    pubnub.subscribe({
      channels: channels,
      withPresence: true,
    });
    setLoading(false);
    //for example
    setTimeout(()=>{pubnub.signal({channel:code,message:{action:'AM',name:'something'}})},5000)
    return pubnub.removeListener(), unmount 
  }, []);
  return (
    <div className="liveChat">
      <NavBar />
      <div className={styles["mainContent"]}>
        <div className={styles["leftColumn"]}>
          <div className={styles["avatarBox"]}>
            <img
              src={prekshaIcon}
              alt="avatar"
              className={styles["prekshaIcon"]}
            />
            <span className={styles["avatarName"]} >Preksha Munot</span>
          </div>
          <div className={styles["homeBox"]} onClick={() => history.push('/home')} >
            <img
              src={homeIcon}
              alt="homeImage"
              className={styles["homeIcon"]}
            />
            <span className={styles["homeText"]}>Home</span>
          </div>
          <div className={styles["discoverBox"]} onClick={() => history.push('/discover')} >
            <img
              src={globeIcon}
              alt="discoverImage"
              className={styles["globeIcon"]}
            />
            <span className={styles["globeText"]}>Preksha Munot</span>
          </div>
          <h1 className={styles["upcommingHeading"]}>Upcoming Chats</h1>
          <div className={styles["upcomingChats"]}>
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
		  <button onClick={handleButton}>{isHost?'End Conversation':'Leave Conversation'}</button>
        </div>
        <div className={styles["middleColumn"]}>
          <div className={styles["innerMiddleBox"]}>
            <div className={styles["articleHeading"]}>
              <div className={styles["firstRowHeading"]}>
                <img
                  src={NYTLogo}
                  alt="NYT Logo"
                  className={styles["NYTLogo"]}
                />
                <img
                  src={searchIcon}
                  alt="Search Icon"
                  className={styles["searchForIcon"]}
                />
              </div>
              <div className={styles["secondRowHeading"]}>
                <span className={styles["mid-col-articleTitle"]}>
                  Zero Waste Toothbrush: How does it really make a difference?
                </span>
                <span className={styles["liveBox"]}>LIVE</span>
              </div>
            </div>
            <div className={styles["liveChatBox"]}>
              <span className={styles["chatTime"]}>10:00 PM</span>
              {loading ? (
                <div style={{ textAlign: "center" }}>Loading...</div>
              ) : (
                content
              )}
              {reload?<Chat
                messages={messages}
                user={currentUser}
              />:''}
              <div ref={scrollhook}></div>
            </div>
			{<div >{userTyping}</div>}
            <div className={styles["chatInputBox"]}>
              <form className="form-demo" onSubmit={handleSubmit(onSubmit)}>
              <img
                src={inputAddIcon}
                alt="Add Icon"
                className={styles["inputAddIcon"]}
                onClick={virtualClick}
              />
                <input style={{display: "none"}} type='file' ref={hiddenFileInput} onChange={onChangeFile}/>
                <input
                  style={{ width: "33vw", marginRight: "0px" }}
                  type="text"
                  className="inputText"
				  onKeyPress={handlePress}
                  placeholder="Type your message"
                  {...register("message")}
                />{" "}
                {/*this is for sending message, onSubmit here*/}
                {errors.message && (
                  <p className="error">{errors.message.message}</p>
                )}
              </form>
              <img
                src={inputSendIcon}
                alt="Send Input"
                className={styles["inputSendIcon"]}
                onClick={()=>onSubmit}
              />
            </div>
          </div>
        </div>
        <div className={styles["rightColumn"]}>
          <div className={styles["everythingButProfile"]}>
            <img
              src={article2}
              alt="articleImage"
              className={styles["article2"]}
            />
            <div className={styles["chatHeading"]}>
              <div className={styles["leftHeading"]}>
                <span className={styles["monthText"]}>MAY</span>
                <div className={styles["dayText"]}>22</div>
              </div>
              <div className={styles["rightHeading"]}>
                <img
                  src={NYTLogo}
                  alt="NYT Logo"
                  className={styles["NYTLogo"]}
                />
                <span className={styles["articleTitle"]}>
                  Zero Waste Toothbrush: How does it really make a difference
                </span>
              </div>
            </div>
            <span className={styles["startTime"]}>THURSDAY 10:00 PM EST</span>
            <div className={styles["chatTags"]}>
              <div className={styles["chatTag"]}>Eco-Friendly</div>
              <div className={styles["chatTag"]}>Sustainability</div>
              <div className={styles["chatTag"]}>Zero Waste</div>
            </div>
            <p className={styles["chatDescription"]}>
              With zero waste taking over the world and people becoming more
              aware of their carbon footprint and how their actions affect the
              planet more options for sustaiable items have become avaiable.
            </p>
            <Participants/>
            <div className={styles["dropDownRow"]}>
              <span className={styles["chatDropDownName"]}>Shared Media</span>
              <img
                src={arrowDownIcon}
                alt="dropDownImg"
                className={styles["dropDownImg"]}
              />
            </div>
            <div className={styles["dropDownRow"]}>
              <span className={styles["chatDropDownName"]}>
                Privacy & Support
              </span>
              <img
                src={arrowDownIcon}
                alt="dropDownImg"
                className={styles["dropDownImg"]}
              />
            </div>
          </div>
          <div className={styles["profileBox"]}>
            <div className={styles["profileLeftSide"]}>
              <img
                src={emilyIcon}
                alt="Profile Icon"
                className={styles["emilyIcon"]}
              />
              <div className={styles["ProfileNames"]}>
                <span className={styles["hostText"]}>HOST</span>
                <div className={styles["profileName"]}>Emily Patterson</div>
              </div>
            </div>
            <div className={styles["profileRightSide"]}>
              <img src={sendIcon} alt="Share" className={styles["sendIcon"]} />
              <img
                src={dots3Icon}
                alt="3 Things Setting"
                className={styles["dots3Icon"]}
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
    <div className={styles["navbar"]}>
      <img src={goOffLogo} alt="Go Off! Logo" className={styles["goOffLogo"]} />
      <div className={styles["searchBar"]}>
        <img
          src={searchIcon}
          alt="Search Icon"
          className={styles["searchIcon"]}
        />
        <input
          type="search"
          className={styles["searchInput"]}
          placeholder="Search"
        />
        <img
          src={optionsIcon}
          alt="Settings"
          className={styles["optionsIcon"]}
        />
      </div>
      <img
        src={addPersonIcon}
        alt="Add person"
        className={styles["addPersonIcon"]}
      />
      <img src={bellIcon} alt="Notifications" className={styles["bellIcon"]} />
      <img src={shareIcon} alt="Share" className={styles["shareIcon"]} />
      <div className={styles["navProfileBox"]}>
        <div className={styles["profile"]}>
          <img
            src={prekshaIcon}
            alt="avatar"
            className={styles["profileIcon"]}
          />
          <span className={styles["profileText"]}>Preksha Munot</span>
          <img
            src={arrowDownIcon}
            alt="dropDown"
            className={styles["arrowDownIcon"]}
          />
        </div>
      </div>
    </div>
  );
};

const ChatCard = ({ title, timeStart, chatImage }) => {
  return (
    <div className={styles["chatCard"]}>
      <img src={chatImage} alt="chatImage" className={styles["chatImage"]} />
      <div className={styles["chatBottomSide"]}>
        <h2 className={styles["timeStart"]}>{timeStart}</h2>
        <h4 className={styles["chatTitle"]}>{title}</h4>
      </div>
    </div>
  );
};

export default LiveChat
