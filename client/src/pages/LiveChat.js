import React, { useEffect, useState, useRef, createRef, useContext } from "react";
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
// import NYTLogo from "../images/liveChatImages/NYT-Logo.png";
import { Popover } from 'react-tiny-popover'
import Picker from 'emoji-picker-react';
import emilyIcon from "../images/liveChatImages/emily-profile-icon.png";
import sendIcon from "../images/liveChatImages/send.png";
import dots3Icon from "../images/liveChatImages/dots3.png";
import inputAddIcon from "../images/liveChatImages/addIcon.png";
import inputSendIcon from "../images/liveChatImages/chatSend.png";
import emojiIcon from "../images/liveChatImages/chatemoji.png";
import replyIcon from "../images/liveChatImages/reply.png";
import cancelIcon from "../images/liveChatImages/cancel.png";
import fileIcon from "../images/liveChatImages/fileicon.png";
import styles from "../styles/LiveChatPage/livechat.module.css";
import { usePubNub } from "pubnub-react";
import { useForm } from "react-hook-form";
import Chat from "../components/Chat.js";
import Participants from '../components/Participants.js';
import NavBar from '../components/NavBar.js';
import UpcomingChatsCard from '../components/UpcomingChatsCard.js';
import axios from "axios";
import { useHistory } from "react-router-dom";
import firebase from "../firebase.js";
import { v4 as uuid_v4 } from 'uuid';
import { components } from "react-select";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import MobileLiveChat from "./LiveChatMobile";
import { UserContext } from "../contexts/userContext";
import MobileChat from "./mobile/MobileChat";

const LiveChat = () => {

  const history = useHistory();

  const fillerUser = {
    name: "Username",
    propic: "/images/stock-face.jpg",
    username: "username",
    id: 0,
    followercount: 0,
    followingcount: 0,
  };
  const fillerMetaData = {
    convoId: 0,
    title: 'Example',
    descrition: 'Example',
    hostId: 0,
    isOpen: false,
    rsvp: []
  }


  const { code } = useParams();

  //importing pubnub into this component
  const pubnub = usePubNub();

  const target = useRef(null);

 

  const inpuref = createRef()

  const [canType, setCanType] = useState(true);

  const [emojibox, setemojibox] = useState(false);


  //chat metadata from firebase
  const [metaData, setMetaData] = useState({ title: 'Title', description: 'Description', time: '10:00 pm' });

  //host data
  const [hostData, setHostData] = useState({ name: 'Host Name', pfpic: '/images/stock-face.jpg' })

  //typing indicator
  const [userTyping, setUserTyping] = useState('');

  const [message, setmessage] = useState('');

  //file url used to be sent as attachment with messages.
  const [file, setFile] = useState('');

  const hiddenFileInput = useRef();

  const {
    register, //used to register an input field
    handleSubmit, //is a function that will call your onSubmit function, whatever you declare that to be
    formState: { errors }, //this keeps track of the errors that can be easily retrieved
  } = useForm({ criteriaMode: "all" });

  //this will hold channel(s). 
  const [channels, setChannels] = useState([code]);

  //this state will hold all messages; Note every message will be structured as such {text:'string', user:'string', isHost:'boolean'}
  const [messages, _addMessages] = useState([]);

  const messagesRef = useRef(messages);

  const addMessages = (msg) => {
    messagesRef.current = msg
    _addMessages(msg)
  }

  //sets current user with dummy info
  const { currentUser, setCurrentUser, upcoming, setUpcoming, refetchUser, refetchUpcoming } = useContext(UserContext)
  const [currentUserFull, setCurrentUserFull] = useState({ ...currentUser, upcomingChats: upcoming });

  const [loading, setLoading] = useState(true);

  const [isHost, setIsHost] = useState(false);

  const [replyonmsg,setreplyonmsg] = useState("");

  const [replyimage, setreplyimage] = useState(false)

  const [content, setContent] = useState();

  const [reload, setReload] = useState(false)

  const [host, setHost] = useState(fillerUser)

  const [canRequest, setCanRequest] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const THROTTLE = 4000; //milliseconds

  const [ConvoData] = []

  //this is a ref that will give scroll to bottom functionality
  const scrollhook = useRef();

  const currentHost = (id) => {
    axios
      .get(`${process.env.REACT_APP_FLASK_API}/getHost/${id}`, { withCredentials: true }).then(res => {
        const host = res.data
        setHost({ name: host.user.name, ppic: host.user.ppic })
      }).catch(err => console.log(err))
  }

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    const hour = today.getHours();
    const minute = today.getMinutes();
    const second = today.getSeconds();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`
  }
 // handle incoming actions
  const handleAction = async (object) => {
    if(messagesRef.current.length > 0){
      if(object.data.type == 'reaction')
      {
        var msgdata = messagesRef.current
        for(var i = 0 ; i < msgdata.length ; i++){
          if(msgdata[i] && msgdata[i].timetoken == object.data.messageTimetoken)
          {
            console.log(i)
            var key = i
            var reactions = msgdata[i].userreaction
            console.log("reaction befor >> ",reactions)
            let data = object.data.value
            let user = object.data.uuid
            if(data == 'ha'){
              reactions.push({label: "ha", node: <div>😀</div>,by : user})
            }else if(data == 'haha'){
              reactions.push({label: "haha", node: <div>🤣</div>,by : user})
            }else if(data == 'heart'){
              reactions.push({label: "heart", node: <div>❤️</div>,by : user})
            }else if(data == 'like'){
              reactions.push({label: "like", node: <div>👍</div>,by : user})
            }else if(data == 'dislike'){
              reactions.push({label: "dislike", node: <div>👎</div>,by : user})
            }
            console.log("reaction >> ",reactions)
            msgdata[key].userreaction = reactions 
            console.log(msgdata)
            addMessages(msgdata)
            setHostData([]) // for refresh only
          }
        }
      }
    }
  }


  //this will handle incoming messages
  const handleMessage = (object) => {
    console.log(object, 'handle message');
    const message = object.message;
    if (!message.user) {
      return;
    }
    const text = message.text;
    if (typeof text === "string") {
        let e = object
        let reactions = []
        let data = e.actions ? e.actions.reaction : []
        let ha = data.ha ? data.ha : []
        for(let i = 0 ; i < ha.length ; i++){
          reactions.push({label: "ha", node: <div>😀</div>,by : ha[i].uuid})
        }
        let haha = data.haha ? data.haha : []
        for(let i = 0 ; i < haha.length ; i++){
          reactions.push({label: "haha", node: <div>🤣</div>,by : haha[i].uuid})
        }
        let heart = data.heart ? data.heart : []
        for(let i = 0 ; i < heart.length ; i++){
          reactions.push({label: "heart", node: <div>❤️</div>,by : heart[i].uuid})
        }
        let like = data.like ? data.like : []
        for(let i = 0 ; i < like.length ; i++){
          reactions.push({label: "like", node: <div>👍</div>,by : like[i].uuid})
        }
        let dislike = data.dislike ? data.dislike : []
        for(let i = 0 ; i < dislike.length ; i++){
          reactions.push({label: "dislike", node: <div>👎</div>,by : dislike[i].uuid})
        }
        
        console.log("reaction >> ",reactions)
        if (e.message.text || e.message.attachment) {
          addMessages((messages) => [
            ...messages,
            {
              user: e.message.user,
              isHost: e.message.isHost,
              text: e.message.text ? e.message.text : '',
              uuid: e.message.uuid,
              url: e.message.url,
              replyedmsg : e.message.replyedmsg,
              timetoken:e.timetoken,
              userreaction:reactions,
              urlimg: e.message.urlimg,
              urltitle: e.message.urltitle,
              filename: e.message.filename,
              filesize: e.message.filesize,
              propic:e.message.propic,
              attachment: e.message.attachment,
              id: e.message.id
            },
          ]);
        }

      // addMessages((messages) => [...messages, message]);
    }
    scrollhook.current.scrollIntoView({ behavior: "smooth" }); // scrolls to bottom when message is recieved
  };


  const goToHomePage = (evt) => {
    let isHost = currentUserFull.host === "(Host)";
    let isAdmin = currentUserFull.admin === "(Admin)";
    if (isHost || isAdmin)
      history.push('/hosthome')
    else
      history.push('/home')
  }

  const uploadFile = async (fileRef) => {
    if (!file) {
      return
    }
    //uploads the file
    await fileRef.put(file)
    setFile('')
  }

  const onChangeFile = (e) => {
    const file = e.target.files[0];
    //console.log(file)
    setFile(file)
  }
  const pickemoji = (e, { emoji }) => {
    console.log("emoji >> ", emoji)
    const ref = inpuref.current;
    ref.focus();
    const start = message.substring(0, ref.selectionStart);
    const end = message.substring(ref.selectionStart);
    const msg = start + emoji + " " + end
    setmessage(msg)
  }
  const virtualClick = event => {
    hiddenFileInput.current.click();
  };
  const handletextchange = e => {
    setmessage(e.target.value)
  }
  const detectUrls = (message) => {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return message.match(urlRegex)
  }
  //this on submit function is publishing the message to the channel
  const onSubmit = async () => {
    var url = await detectUrls(message)
    var urlimg = null;
    var urltitle = null;
    if (url !== null) {
      console.log("url data")
      await axios.post(`${process.env.REACT_APP_NODE_API}/api/chat/geturldata`, { url: url[0] }, { withCredentials: true })
        .then(res => {
          console.log(res.data)
          urlimg = res.data.og.image
          urltitle = res.data.og.title
        })
        .catch(err => console.log(err))
    }
    console.log(message, currentUser, pubnub.getUUID())
    if (message == '' && !file) {
      return
    }
    const storageRef = firebase.storage().ref();
    if (file.name) {
      const fileRef = storageRef.child(file.name);//!
      uploadFile(fileRef).then(res => {
        fileRef.getDownloadURL().then(fileURL => {
          pubnub.publish(
            {
              channel: channels[0],
              message: {
                user: currentUser.username,
                isHost: isHost,
                text: message,
                uuid: currentUser.id,
                url: url,
                urlimg: urlimg,
                urltitle: urltitle,
                replyedmsg : replyonmsg,
                attachment: fileURL,
                filename: file.name,
                filesize: file.size,
                propic: currentUser.propic,
                id: uuid_v4()
              },
            },
            function (status) {
              //this will print a status error in console
              if (status.error) {
                console.log(status);
              }
            }
          );
          setmessage("") // resets the input fields
          setreplyonmsg('')
          setreplyimage(false)
          scrollhook.current.scrollIntoView({ behavior: "smooth" }); // scrolls to bottom when message is sent
        }
        ).catch()
      }).catch(error => console.log(error))
    } else {
      console.log('sending', channels)
      pubnub.publish(
        {
          channel: channels[0],
          message: {
            user: currentUser.username,
            isHost: isHost,
            text: message,
            url: url,
            urlimg: urlimg,
            urltitle: urltitle,
            replyedmsg : replyonmsg,
            uuid: currentUser.id,
            propic: currentUser.propic,
            id: uuid_v4()
          },
        },
        function (status) {
          //this will print a status error in console
          if (status.error) {
            console.log(status, 'something went wrong');
          }
        }
      );
      setreplyonmsg('')
      setreplyimage(false)
      setmessage("") // resets the input fields
      scrollhook.current.scrollIntoView({ behavior: "smooth" }); // scrolls to bottom when message is sent
    }
  };
  //handles leave/end button
  const handleButton = () => {
    pubnub.unsubscribe({ channels: channels });
    pubnub.signal({ channel: code, message: { action: 'DM', uuid: pubnub.getUUID() } });
    isHost ? endConversation(metaData.ID) : goToHomePage()
  }

  const processMessages = (messages) => {
    let newList = []
    messages.forEach((message) => {
      newList.push({
        mongoid: String(message.id),
        message: String(message.text),
        user_id: String(message.uuid),
        username: String(message.user),
        createdat: String(getCurrentDate()),
        updatedat: String(getCurrentDate()),
        roomid: String(code)
      })
    })
    return newList
  }

  const endConversation = async (ID) => { //*

    let result = await axios.put(`${process.env.REACT_APP_FLASK_API}/Convo/${ID}`, { "ended": true }, { withCredentials: true })
    if (result.status == 200) {
      pubnub.signal({ channel: code, message: { action: 'END' } })
      const messageList = messages ? processMessages(messages) : ''
      axios.post(`${process.env.REACT_APP_FLASK_API}/commitmessages`, { messages: messageList }, { withCredentials: true }).then(res => console.log(res.data.message)).catch(err => console.log(err))
      axios.post(`${process.env.REACT_APP_FLASK_API}/commitconvo`, {
        convo: {
          article: metaData.articleURL, time: metaData.time, host: metaData.hostId, roomid: metaData.convoId, title: metaData.title, description: metaData.description,
          createdAt: metaData.createdAt, updatedAt: metaData.updatedAt, tz: metaData.tz
        }
      }, { withCredentials: true }).then(res => console.log(res.data.message)).catch(err => console.log(err))
      axios.get(`${process.env.REACT_APP_FLASK_API}/execanalytics/${code}`, { withCredentials: true }).then(res => console.log(res.data.message)).catch(err => console.log(err))
      console.log("ended Conversation")
    }

  }

  //handles typing indicator signaling//*!have a UTS and UTT UTS starts timer and UTS resets timer create timer function with use state and test if each UTT adds to timer
  const handlePress = () => {
    /**
     * if(canRequest){
      setCanRequest(false);
      pubnub.signal({ channel: code, message: { action: 'UT', name: currentUser.name } });
      setTimeout(() => {
        setCanRequest(true);
      }, THROTTLE);
    }
     */
  }

  //use this to look at the metadata
  const fetchMetaData = async () => {
    let result = await axios.get(`${process.env.REACT_APP_FLASK_API}/getConvo/${code}`, { withCredentials: true }).catch(err => setContent(<div style={{ textAlign: 'center' }}>Chat does not exist</div>))
    console.log('---metadata---', result)

    if (result) {
      currentHost(result.data.convo.hostId);
      setMetaData(result.data.convo);
      fetchAllMessages();
      checkUser(result.data.convo);
    }
  }

  const openConversation = async (ID) => {
    let result = await axios.put(`${process.env.REACT_APP_FLASK_API}/Convo/${ID}`, { "isOpen": true }, { withCredentials: true })
    if (result.status != 200) {
      console.log('error opening conversation')
    } else {
      console.log('success opening')
    }
  }

  const addListener = (user) => {
    //this listener sets up how to handle messages and gives status
    pubnub.addListener({
      message: handleMessage,
      messageAction:handleAction,
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
      signal: function (s) {
        // handle signal
        var channelName = s.channel; // The channel to which the signal was published
        var channelGroup = s.subscription; // The channel group or wildcard subscription match (if exists)
        var pubTT = s.timetoken; // Publish timetoken
        var msg = s.message; // The Payload
        var publisher = s.publisher; //The Publisher
        //** use redux to see if the signals work better.
        if (msg.action == 'END') {
          //** redirect everyone out
          goToHomePage();
        } else if (msg.action == 'UT') {
          //sends message if use is typing
          setIsTyping(true)
          setUserTyping(`${msg.name} is typing`);

          if (!busy) {
            setBusy(true);
            setTimeout(() => {
              if (canRequest) {
                setUserTyping('')
              }
              setIsTyping(false)
              setBusy(false);
            }, THROTTLE)
          }

        }
      },
      status: (event) => {
        console.log("status: " + JSON.stringify(event));
      },
    });
  }
  //checks the room and returns chat or other error based on rsvp and occupancy
  const checkRoom = async (user, metadata) => {
    pubnub.hereNow(
      {
        channels: channels,
        includeUUIDs: true,
        includeState: true,
      },
      (status, response) => {
        const occupancy = response ? response.totalOccupancy : null;
        const occupants = response ? response.occupants : null;
        if (metadata.ended == 1) {
          return setContent(<div style={{ textAlign: 'center' }}>This chat has already ended.</div>)
        }
        if (occupancy < 10) {
          //room not full now check for rsvp
          if (metadata.isOpen == 0) {
            setContent(<div className={styles['setContent']}>
              <div className="lock"></div><h1>
                <i class="bi bi-lock lock" /></h1>
              <div>Currently closed! Waiting for host to open chat.</div>
            </div>)
          } else if (user.id == metadata.hostId && metadata.isOpen == 1) {
            addListener(user);
            //the user rsvp'd or is host. and can now see chat
            pubnub.signal({ channel: code, message: { action: 'AM', name: user.name } })
            setReload(true);
            //scrollhook.current.scrollIntoView({ behavior: 'smooth' });
          } else {
            //person not rsvp. redirect or respond?
            //setContent(<div style={{ textAlign: 'center' }}>You did not rsvp for this conversation</div>)
            addListener(user);
            setReload(true);
            //setCanType(false);
          }
        } else {
          //too many people
          //setContent(<div style={{ textAlign: 'center' }}>Chat is full</div>)
          setReload(true);
          addListener(user);
          setCanType(false);
        }
      }
    )
  }

  //checks for and sets User
  const checkUser = async (data) => {
    let res;
    if (!currentUser.signedIn) {
      res = await axios
        .get(`${process.env.REACT_APP_NODE_API}/api/users/current`, {
          withCredentials: true,
        })
      if (res.data.user) {
        setCurrentUser(res.data.user);
      } else {
        setContent(<div style={{ textAlign: 'center' }}>Please sign in</div>)
        console.log(`could not make request:`
        )
      }
      pubnub.setUUID(res.data.user.id);
      let metadata = { ...data }
      if (data.hostId == res.data.user.id) {
        setIsHost(true);
        if (data.isOpen == 0) {
          metadata.isOpen = 1;
          openConversation(metadata.ID);
        }
      }
      checkRoom(res.data.user, metadata)
    } else {
      pubnub.setUUID(currentUser.id);
      let metadata = { ...data }
      if (data.hostId == currentUser.id) {
        setIsHost(true);
        if (data.isOpen == 0) {
          metadata.isOpen = 1;
          openConversation(metadata.ID);
        }
      }
      checkRoom(currentUser, metadata)
    }

  }
  const setreaction = (emoji,msg) => {
    console.log(emoji,msg)
    pubnub.addMessageAction(
      {
          channel: code,
          messageTimetoken: msg,
          action: {
              type: 'reaction',
              value: emoji,
          },
      },
      function(status, response) {
         console.log(response)
         console.log(status)
      }
  );
  }
  //fetches all channel messages
  const fetchAllMessages = async () => {

    pubnub.fetchMessages({ channels: [code], count: 100 ,includeMessageActions:true})
      .then((e) => {
        // console.log(e.channels[code])
        //this will fetch all messages in Test chat then add them to the messages state.
       let localmessages = []
        e.channels[code].forEach((e) => {
          console.log(e)
          let reactions = []
          let data = e.actions ? e.actions.reaction : []
       
          let ha = data.ha ? data.ha : []
          for(let i = 0 ; i < ha.length ; i++){
            reactions.push({label: "ha", node: <div>😀</div>,by : ha[i].uuid})
          }
          let haha = data.haha ? data.haha : []
          for(let i = 0 ; i < haha.length ; i++){
            reactions.push({label: "haha", node: <div>🤣</div>,by : haha[i].uuid})
          }
          let heart = data.heart ? data.heart : []
          for(let i = 0 ; i < heart.length ; i++){
            reactions.push({label: "heart", node: <div>❤️</div>,by : heart[i].uuid})
          }
          let like = data.like ? data.like : []
          for(let i = 0 ; i < like.length ; i++){
            reactions.push({label: "like", node: <div>👍</div>,by : like[i].uuid})
          }
          let dislike = data.dislike ? data.dislike : []
          for(let i = 0 ; i < dislike.length ; i++){
            reactions.push({label: "dislike", node: <div>👎</div>,by : dislike[i].uuid})
          }
          
          console.log("reaction >> ",reactions)

          if (e.message.text || e.message.attachment) {
            localmessages =  [
              ...localmessages,
              {
                user: e.message.user,
                isHost: e.message.isHost,
                text: e.message.text ? e.message.text : '',
                uuid: e.message.uuid,
                url: e.message.url,
                replyedmsg : e.message.replyedmsg,
                timetoken:e.timetoken,
                userreaction:reactions,
                urlimg: e.message.urlimg,
                urltitle: e.message.urltitle,
                filename: e.message.filename,
                filesize: e.message.filesize,
                propic:e.message.propic,
                attachment: e.message.attachment,
                id: e.message.id
              },
            ]
          }
        });
        addMessages(localmessages)
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    if (window.innerWidth <= 800) {
      return
    }
    if (!code) {
      setContent(<div style={{ textAlign: 'center' }}>Chat does not exist</div>)
      setLoading(false);
    }
    fetchMetaData();

    //this subscribes to a list of channels
    pubnub.subscribe({
      channels: channels,
      withPresence: true,
    });
    setLoading(false);
    return pubnub.removeListener()
  }, []);

  if (window.innerWidth <= 800) {
    return <MobileChat />
  }
  //useEffect will add listeners and will subscribe to channel. will refresh if currentUser changes
  return (
    <div className={styles["liveChat"]}>
      <NavBar name={currentUser.name} avatarSource={currentUserFull.propic} host={currentUserFull.host} />
      <>
        <div className={styles["mainContent"]}>
        <div className={styles["leftColumn"]}>
          <div className={styles["avatarBox"]} onClick={() => history.push('/profile')}>
            <img
              src={currentUserFull.propic}
              alt="avatar"
              className={styles["prekshaIcon"]}
            />
            <span className={styles["avatarName"]} >{currentUser.name}</span>
          </div>
          <div className={styles["homeBox"]} onClick={goToHomePage}>
            <img
              src={homeIcon}
              alt="homeImage"
              className={styles["homeIcon"]}
            />
            <span className={styles["homeText"]}>Home</span>
          </div>
          {/* <div className={styles["discoverBox"]} onClick={() => history.push('/discover')} >
            <img
              src={globeIcon}
              alt="discoverImage"
              className={styles["globeIcon"]}
            />

            <span className={styles["globeText"]}>Discover</span>
          </div> */}
          <h1 className={styles["upcommingHeading"]}>Your Upcoming Convos</h1>
          <div className={styles["upcomingChats"]}>
            {currentUserFull.upcomingChats ? (
              currentUserFull.upcomingChats.map((prop) => {
                return (
                  <UpcomingChatsCard
                    articleURL={prop.articleURL}
                    articleImg={prop.articleImg}
                    time={prop.time}
                    convTitle={prop.convTitle}
                    hostName={prop.hostname}
                    roomId={prop.roomId}
                  />
                );
              })
            ) : (
              <UpcomingChatsCard />
            )}
            {/* <ChatCard
              title="Zero Waste Toothbrush: How does it really make a difference?"
              timeStart="HAPPENING NOW"
              chatImage={article1}
            />
            <ChatCard
              title="Zero Waste Toothbrush: How does it really make a difference?"
              timeStart="HAPPENING NOW"
              chatImage={article1}
            /> */}
            </div>
            <button onClick={handleButton}>{isHost ? 'End Conversation' : 'Leave Conversation'}</button>
          </div>
          <div className={styles["middleColumn"]}>
            <div className={styles["innerMiddleBox"]}>
              <div className={styles["articleHeading"]}>
                <div className={styles["firstRowHeading"]}>
                  {/* <img
                  src={NYTLogo}
                  alt="NYT Logo"
                  className={styles["NYTLogo"]}
                />
                <img
                  src={searchIcon}
                  alt="Search Icon"
                  className={styles["searchForIcon"]}
                /> */}
                </div>
                <div className={styles["secondRowHeading"]}>
                  <span className={styles["mid-col-articleTitle"]}>
                    {metaData.title}
                  </span>
                  <span className={styles["liveBox"]}>LIVE</span>
                </div>
              </div>
              <div className={styles["liveChatBox"]}>
                <span className={styles["chatTime"]}></span>
                {loading ? (

                  <div style={{ textAlign: "center" }}>Loading...</div>
                ) : (
                  content
                )}
                {reload ? <Chat
                  scrollhook={scrollhook}
                  messages={messages}
                  setmsg={(msg)=>setreplyonmsg(msg)}
                  setreaction={(emoji,msg)=>setreaction(emoji,msg)}
                  user={currentUser}
                /> : ''}
              </div>

              {<div >{userTyping}</div>}
              {replyonmsg == '' ? 
  
              null :
              <div className={styles["replyBox"]} >
              <div style={{width:"100%"}} className={styles['replyMessageBox']}>
                <div style={{flexGrow:1}}>
              <img
                      ref={target}
                      src={replyIcon}
                      alt="reply icon"
                      style={{ width: 15, height: 15 }}
                    />
                <span style={{color:"black",fontSize:12}}>{"  Replying to "+replyonmsg.user}</span>
              
                <div>
                <span className={styles['messageText']}>{replyonmsg.attachment ? replyonmsg.filename : replyonmsg.text}</span>
                </div>
                </div>
                {replyonmsg.attachment &&
                <div>
                <img
                      ref={target}
                      src={replyimage ? fileIcon : replyonmsg.attachment}
                      alt="cancle icon"
                      style={{ height:40,borderRadius:5 ,marginRight:5}}
          
                      onError={()=>setreplyimage(true)}
                    />
                    </div>
                }
                <div style={{backgroundColor:"#3A86FF4D",height:20,width:20,borderRadius:100}}>
                <img
                      ref={target}
                      src={cancelIcon}
                      alt="cancle icon"
                      style={{width: 20, height: 20,marginBottom:5 }}
                      onClick={() => { setreplyonmsg('') 
                                   setreplyimage(false) } }
                    />
                    </div>
              </div>
              </div>
              }
              <div className={canType ? replyonmsg == '' ? styles["chatInputBox"] : styles["replyInputBox"] : styles['d-none']}>
                <form className="form-demo" style={{ display: "flex", flexGrow: 10 }} onSubmit={handleSubmit(onSubmit)}>
                  <img
                    src={inputAddIcon}
                    alt="Add Icon"
                    className={styles["inputAddIcon"]}
                    onClick={virtualClick}
                  />
                  <input type='file' style={{ "display": "none" }} ref={hiddenFileInput} onChange={onChangeFile} />
                  <input
                    type="text"
                    className={styles["inputText"]}
                    onKeyPress={handlePress}
                    ref={inpuref}
                    value={message}
                    onChange={handletextchange}
                    placeholder="Type your message"
                  // {...register("message")}
                  />{" "}
                  {/*this is for sending message, onSubmit here*/}
                  {errors.message && (
                    <p className="error">{errors.message.message}</p>
                  )}
                </form>
                <Popover
                  isOpen={emojibox}
                  positions={['top']} // preferred positions by priority     
                  content={
                    <div style={{ marginBottom: 20 }}>
                      <Picker onEmojiClick={pickemoji} />
                    </div>
                  }
                >
                  <div style={{ width: 60, textAlign: "right" }}>
                    <img
                      ref={target}
                      src={emojiIcon}
                      alt="emoji icon"
                      style={{ width: 30, height: 30 }}
                      onClick={() => setemojibox(!emojibox)}
                    />
                  </div>
                </Popover>
                <div style={{ width: 40, textAlign: "right" }}>
                  <img
                    src={inputSendIcon}
                    alt="send icon"
                    style={{ width: 30, height: 30 }}
                    onClick={onSubmit}
                  />
                </div>
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
                  <span className={styles["monthText"]}>{Date(metaData.time).toLocaleString()
                    .split(' ')
                    .splice(1, 1)
                    .join(' ')
                    .toUpperCase()}</span>
                  <div className={styles["dayText"]}>{Date(metaData.time).toLocaleString()
                    .split(' ')
                    .splice(2, 1)
                    .join(' ')
                    .toUpperCase()}</div>
                </div>
                <div className={styles["rightHeading"]}>
                  {/* <img
                  src={NYTLogo}
                  alt="NYT Logo"
                  className={styles["NYTLogo"]}
                /> */}
                  <span className={styles["articleTitle"]}>
                    {metaData.title}
                  </span>
                </div>
              </div>
              <span className={styles["startTime"]}>{Date(metaData.time).toLocaleString()
                .split(' ')
                .splice(0, 5)
                .join(' ')
                .toUpperCase()} (EST)</span>
              {/* <div className={styles["chatTags"]}>
              <div className={styles["chatTag"]}>Eco-Friendly</div>
              <div className={styles["chatTag"]}>Sustainability</div>
              <div className={styles["chatTag"]}>Zero Waste</div>
            </div> */}
              <p className={styles["chatDescription"]}>
                {metaData.description}
              </p>
              <Participants channel={channels[0]} />
              {/* <div className={styles["dropDownRow"]}>
              <span className={styles["chatDropDownName"]}>Shared Media</span>
              <img
                src={arrowDownIcon}
                alt="dropDownImg"
                className={styles["dropDownImg"]}
              />
            </div> */}
              <div className={styles["dropDownRow"]}>
                <span className={styles["chatDropDownName"]}>
                  Privacy & Support
                </span>
                <img
                  src={arrowDownIcon}
                  alt="dropDownImg"
                  className={styles["dropDownImg"]}
                />
                <div className={styles["dropdown-content"]}>
                  <span>Have a question or facing a tech problem? Shoot us an email or text at go.offmedia@gmail.com or 415-747-1897,
                    or fill out our <a href="https://bostonu.qualtrics.com/jfe/form/SV_8AJGnTNbDWeV6ES" target="_blank">Support Survey!</a> For more info about
                    our data collecting practices, please read our <a target="_blank" href="https://docs.google.com/document/d/1MAgAfsF2ZJ-wRCFWAkA6m4hxll0tCrXb/edit?usp=sharing&ouid=118257569730053365648&rtpof=true&sd=true">Privacy Policy.</a></span>
                </div>
              </div>
            </div>
            <div className={styles["profileBox"]}>
              {/* <div className={styles["profileLeftSide"]}>
              <img
                src={host.ppic}
                alt="Profile Icon"
                className={styles["emilyIcon"]}
              />
              <div className={styles["ProfileNames"]}>
                <span className={styles["hostText"]}>HOST</span>
                <div className={styles["profileName"]}>{host.name}</div>
              </div>
            </div> */}
              {/* <div className={styles["profileRightSide"]}>
              <img src={sendIcon} alt="Share" className={styles["sendIcon"]} />
              <img
                src={dots3Icon}
                alt="3 Things Setting"
                className={styles["dots3Icon"]}
              />
            </div> */}
            </div>
          </div>
        </div></>
    </div>
  );
};
export default LiveChat
// const NavBar = ({}) => {
//   return (
//     <div className={styles["navbar"]}>
//       <img src={goOffLogo} alt="Go Off! Logo" className={styles["goOffLogo"]} />
//       <div className={styles["searchBar"]}>
//         <img
//           src={searchIcon}
//           alt="Search Icon"
//           className={styles["searchIcon"]}
//         />
//         <input
//           type="search"
//           className={styles["searchInput"]}
//           placeholder="Search"
//         />
//         <img
//           src={optionsIcon}
//           alt="Settings"
//           className={styles["optionsIcon"]}
//         />
//       </div>
//       <img
//         src={addPersonIcon}
//         alt="Add person"
//         className={styles["addPersonIcon"]}
//       />
//       <img src={bellIcon} alt="Notifications" className={styles["bellIcon"]} />
//       <img src={shareIcon} alt="Share" className={styles["shareIcon"]} />
//       <div className={styles["navProfileBox"]}>
//         <div className={styles["profile"]}>
//           <img
//             src={prekshaIcon}
//             alt="avatar"
//             className={styles["profileIcon"]}
//           />
//           <span className={styles["profileText"]}>Preksha Munot</span>
//           <img
//             src={arrowDownIcon}
//             alt="dropDown"
//             className={styles["arrowDownIcon"]}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const ChatCard = ({ title, timeStart, chatImage }) => {
//   return (
//     <div className={styles["chatCard"]}>
//       <img src={chatImage} alt="chatImage" className={styles["chatImage"]} />
//       <div className={styles["chatBottomSide"]}>
//         <h2 className={styles["timeStart"]}>{timeStart}</h2>
//         <h4 className={styles["chatTitle"]}>{title}</h4>
//       </div>
//     </div>
//   );
// };


