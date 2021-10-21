import React, { useEffect, useContext, useRef, useState } from "react";
import { useParams } from "react-router";
import "../../styles/mobile/chat.css";
import Chat from "../../components/Chat";
import { usePubNub } from "pubnub-react";
import { UserContext } from "../../contexts/userContext";
import Conversation from "./components/Conversation";
import { useHistory } from "react-router-dom";
import { v4 as uuid_v4 } from "uuid";
import NavBar from "../../components/NavBar";
import axios from "axios";
const MobileChat = () => {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [isHost, setIsHost] = useState(false);
  const [host, setHost] = useState({hostName:'',ppic:''});
  const [messages, addMessages] = useState([]);
  const { code } = useParams();
  const { currentUser, convos } = useContext(UserContext);
  const scrollhook = useRef();
  const [option, setOption] = useState(true);
  let history = useHistory();
  const pubnub = usePubNub();
  const [metadata, setMetaData] = useState({
    title: "loading....",
    hostName: "",
    ppic: "",
  });
  const [article, setArticle] = useState({
    articleImg: "",
    time: "",
    description: "",
    title: "",
    ppic: "",
    hostName: "",
  });
  const [lockedContent, setLockedContent] = useState(null)

  const currentHost = (id) => {
    axios
      .get(`${process.env.REACT_APP_FLASK_API}/getHost/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        const host = res.data;
        setHost({
          hostName: host.user.name,
          ppic: host.user.ppic,
        });
      })
      .catch((err) => console.log(err));
  };

  const fetchMetaData = async () => {
    try {
      let result = await axios.get(
        `${process.env.REACT_APP_FLASK_API}/getConvo/${code}`,
        { withCredentials: true }
        ); //.catch(err=>setContent(<div style={{ textAlign: 'center' }}>Chat does not exist</div>))
        setMetaData(result.data.convo);
        currentHost(result.data.convo.hostId);
        convos.forEach((x) => {
            if (x.convTitle === result.data.convo.title) {
                setArticle(x);
            }
        });
        if(result.data.convo.ended){
            return setLockedContent(<div style={{ textAlign: 'center' }}>This chat has already ended.</div>)
        }else if(!result.data.convo.isOpen){
            return setLockedContent(<div className='text-center'>
            <div className="lock"></div><h1>
            <i class="bi bi-lock lock"/></h1>
            <div>Currently closed! Waiting for host to open chat.</div>
            </div>)
        }
      if (result.data.convo.hostId == currentUser.id) {
        setIsHost(true);
      }
    } catch (err) {
      console.log("error: ", err);
    }
  };

  //this will handle incoming messages
  const handleMessage = (object) => {
    console.log(object, "handle message");
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

  //fetches all channel messages
  const fetchAllMessages = async () => {
    pubnub
      .fetchMessages({ channels: [code], count: 100 })
      .then((e) => {
        //this will fetch all messages in Test chat then add them to the messages state.
        e.channels[code].forEach((e) => {
          if (e.message.text || e.message.attachment) {
            addMessages((messages) => [
              ...messages,
              {
                user: e.message.user,
                isHost: e.message.isHost,
                text: e.message.text ? e.message.text : "",
                uuid: e.message.uuid,
                attachment: e.message.attachment ? e.message.attachment : "",
                propic: e.message.propic
                  ? e.message.propic
                  : "https://miro.medium.com/max/316/1*LGHbA9o2BKka2obwwCAjWg.jpeg",
                id: e.message.id,
              },
            ]);
          }
          scrollhook.current.scrollIntoView({ behavior: "smooth" });
        });
      })
      .catch((error) => console.log(error));
  };

  const getParticipants = async () => {
        try{
            const result = await axios.post(`${process.env.REACT_APP_FLASK_API}/setParticipant`,{convoId:code,userId:currentUser.id, name:currentUser.name},{withCredentials:true})
            console.log(result.data)
            const people = []
            result.data.users.forEach(x=>{
                if(x[1]==1){
                    people.push(x[0])
                }
            })
            setParticipants(people)
        }catch(err){
            console.log(err)
        }
  }

  const helper = (option) => {
    switch (option) {
      case true:
        return (
          <Chat
            scrollhook={scrollhook}
            messages={messages}
            user={currentUser}
          />
        );
      case false:
        return <Details metadata={metadata} article={article} participants={participants}/>;
      default:
        return (
          <Chat
            scrollhook={scrollhook}
            messages={messages}
            user={currentUser}
          />
        );
    }
  };

  const secondHelper = (option) => {
    switch (option) {
      case true:
        return (
          <InputTab
            isHost={isHost}
            code={code}
            scrollhook={scrollhook}
          />
        );
      case false:
        return (
          <div className="row text-center m-0 d-flex align-items-center">
            <div className="col-3">
              <img className="bigger" src={host.ppic} />
            </div>
            <div className="col-3 h4 w-50">{host.hostName}</div>
            <div className="col text-end m-2">
              <span uk-icon="more" />
            </div>
          </div>
        );
      default:
        return (
          <InputTab
            code={code}
            isHost={isHost}
            scrollhook={scrollhook}
          />
        );
    }
  };


  const back = (option) => {
    option == false ? setOption(true) : isHost?setModal(true):history.push("/home");
  };

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

  const endConversation = async(ID) => { //*
    try{
        let result = await axios.put(`${process.env.REACT_APP_FLASK_API}/Convo/${ID}`,{"ended":true},{withCredentials:true})
        if(result.status==200){
          pubnub.signal({ channel: code, message: { action: 'END' } })
          const messageList = messages ? processMessages(messages) : ''
          axios.post(`${process.env.REACT_APP_FLASK_API}/commitmessages`, { messages: messageList },{withCredentials:true} ).then(res => console.log(res.data.message)).catch(err => console.log(err))
          axios.post(`${process.env.REACT_APP_FLASK_API}/commitconvo`, { convo: {article:metadata.articleURL, time:metadata.time,host:metadata.hostId,roomid:metadata.convoId, title:metadata.title,description:metadata.description,
            createdAt:metadata.createdAt,updatedAt:metadata.updatedAt, tz:metadata.tz} },{withCredentials:true}).then(res => console.log(res.data.message)).catch(err => console.log(err))
          axios.get(`${process.env.REACT_APP_FLASK_API}/execanalytics/${code}`,{withCredentials:true}).then(res => console.log(res.data.message)).catch(err => console.log(err))
          console.log("ended Conversation")
        }

    }catch(err){
        console.log('error ending and logging')
    }

  }


  const [modal,setModal] = useState(false)
  const hostExit = () => {
    return modal?<>
            <div className="hostModal">
            <div className="card leaveCard shadow-lg">
                <div className="card-body d-flex align-items-center justify-content-center">
                    <div className="row text-center">
                    <div className="col-12">
                        Are you sure you want to end the conversation?
                    </div>
                    <div >
                        <button className="btn m-1 btn-danger col-4"onClick={()=>endConversation(metadata.ID)}>Yes</button>
                        <button className="btn m-1 btn-primary col" onClick={()=>setModal(false)}>No</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </>:<></>
  }

  useEffect(() => {
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
        signal: function (s) {
          // handle signal
          var channelName = s.channel; // The channel to which the signal was published
          var channelGroup = s.subscription; // The channel group or wildcard subscription match (if exists)
          var pubTT = s.timetoken; // Publish timetoken
          var msg = s.message; // The Payload
          var publisher = s.publisher; //The Publisher
          //** use redux to see if the signals work better.
          if (msg.action == "END") {
            //** redirect everyone out
            //goToHomePage();
            history.push('/home')
          } else if (msg.action == "UT") {
            //sends message if use is typing
          }else if (msg.action == 'AM'){
              if(msg.name!==currentUser.name || !participants.includes(msg.name)){
                  setParticipants(s=>[...s,msg.name])
              }
          }else if(msg.action == 'DM'){
            let newList = participants.filter((x) => x !== msg.name);
            setParticipants(newList)
          }
        },
        status: (event) => {
          console.log("status: " + JSON.stringify(event));
        },
      });
      pubnub.subscribe({
        channels: [code],
        withPresence: true,
      });
      fetchMetaData();
      getParticipants();
      fetchAllMessages();
      pubnub.signal({ channel: code, message: { action: 'AM', name: currentUser.name } })
      if (messages.length >= 10) {
          scrollhook.current.scrollIntoView({ behavior: "smooth" });
        }
        setLoading(false)
        return ()=> {
            pubnub.signal({ channel: code, message: { action: 'DM', name: currentUser.name } })
            getParticipants()
            pubnub.removeListener();
        }
  }, []);
  //scrollhook.current.scrollIntoView({ behavior: 'smooth' });
  return (
    <div className="livechat">
        {hostExit()}
      <NavBar
        name={currentUser.name}
        avatarSource={currentUser.propic}
        host={currentUser.host}
      />
      <div className="base">
        <div className="row hostTab shadow-lg m-0 d-flex p-1">
          <div className="col">
            <span onClick={() => back(option)} uk-icon="chevron-double-left" />
          </div>
          <div className="col-8">
            <div className="row">{metadata.title}</div>
          </div>
          <div className="col text-center">
            <div className="row m-1">
              <div>
                <b className="liveBox">Live</b>
              </div>
            </div>
            <div className="row m-1">
              <span onClick={() => setOption(!option)} uk-icon="info" />
            </div>
          </div>
        </div>
        <div className="something" style={{ height: "20vh" }}></div>
        {/**
             * {loading ? (

            <div style={{ textAlign: "center" }}>Loading...</div>
            ) : (
            content
            )}
            {reload ? <Chat
                messages={messages}
            user={currentUser}
            /> : ''}
        */}
        <div className="chatBox">
        <div style={{ height: "5vh" }}></div>
          {loading?<>loading...</>:(lockedContent?lockedContent:helper(option))}
          <div style={{ height: "2vh" }}></div>
        </div>
        {secondHelper(option)}
      </div>
    </div>
  );
};

const Details = ({ metadata, article, participants }) => {
  const { convos } = useContext(UserContext);
  const participantsTab = useRef();
  const sharedMedia = useRef();
  const support = useRef();
  const collapse = (ref) => {
    ref.current.className.includes("collapse")
      ? (ref.current.className = ref.current.className.replace("collapse", ""))
      : (() => {
          var list = ref.current.className.split(" ");
          list.push("collapse");
          list = list.join(" ");
          ref.current.className = list;
        })();
  };
  useEffect(() => {
      console.log(metadata)
  }, []);
  return (
    <>
      <Conversation
        articleImg={article.articleImg}
        time={metadata.time}
        desc={metadata.description}
        convTitle={metadata.title}
        userpfp={metadata.ppic}
        hostName={metadata.hostName}
      />
      <div className="row mb-3" onClick={() => collapse(participantsTab)}>
        <div className="col-1"></div>
        <div className="col">
          <p className="h3">Participants: {participants.length?participants.length:0}</p>
        </div>
        <div className="col-2">
          <span uk-icon="chevron-down" />
        </div>
      </div>
      <div ref={participantsTab} className="collapse m-2">
        <div className="card card-body">
          Some placeholder content for the first collapse component of this
          multi-collapse example. This panel is hidden by default but revealed
          when the user activates the relevant trigger.
        </div>
      </div>
      <div className="row mb-3" onClick={() => collapse(sharedMedia)}>
        <div className="col-1"></div>
        <div className="col">
          <p className="h3">Shared Media</p>
        </div>
        <div className="col-2">
          <span uk-icon="chevron-down" />
        </div>
      </div>
      <div ref={sharedMedia} className="collapse multi-collapse m-2">
        <div className="card card-body">
          Some placeholder content for the first collapse component of this
          multi-collapse example. This panel is hidden by default but revealed
          when the user activates the relevant trigger.
        </div>
      </div>
      <div className="row mb-3" onClick={() => collapse(support)}>
        <div className="col-1"></div>
        <div className="col">
          <p className="h3">Privacy & Support</p>
        </div>
        <div className="col-2">
          <span uk-icon="chevron-down" />
        </div>
      </div>
      <div ref={support} className="collapse multi-collapse m-2">
        <div className="card card-body">
          Some placeholder content for the first collapse component of this
          multi-collapse example. This panel is hidden by default but revealed
          when the user activates the relevant trigger.
        </div>
      </div>
    </>
  );
};

const InputTab = ({ scrollhook, code, isHost}) => {
  const [message, setMessage] = useState("");
  const { currentUser } = useContext(UserContext);
  const pubnub = usePubNub();
  const onSubmit = (e) => {
    e.preventDefault();
    if (!message) {
      return;
    }
    pubnub.publish(
      {
        channel: [code],
        message: {
          user: currentUser.name,
          isHost: isHost,
          text: message,
          uuid: currentUser.id,
          propic: currentUser.propic,
          attachment: "",
          id: uuid_v4(),
        },
      },
      function (status) {
        //this will print a status error in console
        if (status.error) {
          console.log(status, "at mobile pubnub.publish");
        }
      }
    );
    console.log(message, "---message");
    setMessage("");
    scrollhook.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="iconTab2 row text-center m-0 d-flex align-items-center">
          <div className="col">
            <span uk-icon="plus-circle" />
          </div>
          <div className="col-8">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onClick={() =>
                scrollhook.current.scrollIntoView({ behavior: "smooth" })
              }
              className="w-100 textBox"
              type="text"
            />
          </div>
          <button type="submit" className="col" style={{ background: "none" }}>
            <span uk-icon="reply" />
          </button>
        </div>
      </form>
    </>
  );
};

export default MobileChat;
