import React, { useEffect, useContext, useRef, useState } from 'react'
import "../../styles/mobile/chat.css";
import Chat from '../../components/Chat';
import { usePubNub } from 'pubnub-react';
import { UserContext } from '../../contexts/userContext';
import Conversation from './components/Conversation'
import { useHistory } from "react-router-dom";
import { v4 as uuid_v4 } from 'uuid';

const MobileChat = ({code, messages, isHost, handleMessage}) => {
    //implement own onSubmit and recieve function to implement scrollhook
    const {currentUser} = useContext(UserContext)
    const scrollhook = useRef()
    const [option, setOption] = useState(true);
    let history = useHistory()
    const helper = (option) => {
        switch(option){
            case true:
                return <Chat scrollhook={scrollhook} messages={messages} user={currentUser}/>
            case false:
                return <Details/>
            default:
                return <Chat scrollhook={scrollhook} messages={messages} user={currentUser}/>
                
            }
    }
    const secondHelper = (option) => {
        switch(option){
            case true:
                return  <InputTab isHost={isHost} code={code} 
                handleMessage={handleMessage} scrollhook={scrollhook}/>
            case false:
                return     <div className='row text-center m-0 d-flex align-items-center'>
                <div className="col-3"><img className='bigger' src="https://miro.medium.com/max/316/1*LGHbA9o2BKka2obwwCAjWg.jpeg"/></div>
                <div className="col-3 h4 w-50">Christian Nava</div>
                <div className="col text-end m-2"><span uk-icon="more"/></div>
            </div>
            default:
                return  <InputTab code={code} isHost={isHost}
                handleMessage={handleMessage} scrollhook={scrollhook}/>
            }
    }
    const back = (option) => {
        option==false?setOption(true):history.push('/home')
    }
    useEffect(()=>{
        if(messages.length>=10){
            //scrollhook.current.scrollIntoView({ behavior: 'smooth' });
        }
        return
    })
    //scrollhook.current.scrollIntoView({ behavior: 'smooth' });
    return (
        <div className="base">
            <div className="row hostTab shadow-lg m-0 d-flex p-1">
                <div className="col"><span onClick={()=>back(option)} uk-icon="chevron-double-left"/></div>
                <div className="col-8">
                    <div className="row">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates ullam reiciendis cumque ut molestiae quidem
                    </div>
                </div>
                <div className="col text-center">
                    <div className="row m-1"><div><b className="liveBox">Live</b></div></div>
                    <div className="row m-1"><span onClick={()=>setOption(!option)} uk-icon="info"/></div>
                </div>
            </div>
            <div style={{'height':'20vh'}}></div>
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
                
                 {
                    helper(option)
                 }
                <div style={{"height":"2vh"}}></div>
             </div>
             {
                 secondHelper(option)
             }
        </div>
    )
}

const Details = () => {
    const participantsTab = useRef()
    const sharedMedia = useRef()
    const support = useRef()
    const collapse = (ref) => {

        ref.current.className.includes("collapse")?
        ref.current.className=ref.current.className.replace("collapse",""):(()=>{
            var list = ref.current.className.split(" ")
            list.push("collapse")
            list = list.join(" ")
            ref.current.className = list    
        })()
    }
    return <>
    <Conversation/>
    <div className="row mb-3" onClick={()=>collapse(participantsTab)}>
        <div className="col-1"></div>
        <div className="col"><p className="h3">Participants</p></div>
        <div className="col-2"><span uk-icon="chevron-down"/></div>
    </div>
    <div ref={participantsTab} className="collapse m-2">
      <div className="card card-body">
        Some placeholder content for the first collapse component of this multi-collapse example. This panel is hidden by default but revealed when the user activates the relevant trigger.
      </div>
    </div>
    <div className="row mb-3" onClick={()=>collapse(sharedMedia)}>
        <div className="col-1"></div>
        <div className="col"><p className="h3">Shared Media</p></div>
        <div className="col-2"><span uk-icon="chevron-down"/></div>
    </div>
    <div ref={sharedMedia} className="collapse multi-collapse m-2">
      <div className="card card-body">
        Some placeholder content for the first collapse component of this multi-collapse example. This panel is hidden by default but revealed when the user activates the relevant trigger.
      </div>
    </div>
    <div className="row mb-3" onClick={()=>collapse(support)}>
        <div className="col-1"></div>
        <div className="col"><p className="h3">Privacy & Support</p></div>
        <div className="col-2"><span uk-icon="chevron-down"/></div>
    </div>
    <div ref={support} className="collapse multi-collapse m-2">
      <div className="card card-body">
        Some placeholder content for the first collapse component of this multi-collapse example. This panel is hidden by default but revealed when the user activates the relevant trigger.
      </div>
    </div>
    </>
}

const InputTab = ({scrollhook, code, isHost, handleMessage}) => {
    const [message, setMessage] = useState("")
    const {currentUser} = useContext(UserContext)
    const pubnub = usePubNub()
    const onSubmit = (e) => {
        e.preventDefault();
        if(!message){
            return
        }
        pubnub.publish(
            {
              channel: [code],
              message: {
                user: currentUser.name,
                isHost: isHost,
                text: message,
                uuid: currentUser.id,
                attachment: '',
                id: uuid_v4()
              },
            },
            function (status) {
              //this will print a status error in console
              if (status.error) {
                console.log(status,'at mobile pubnub.publish');
              }
            }
          );
        console.log(message,'---message')
        setMessage("")
    }
    useEffect(()=>{
        /*pubnub.addListener({
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
              if (msg.action == 'END') {
                //** redirect everyone out
                //goToHomePage();
              } else if (msg.action == 'UT') {
                //sends message if use is typing
      
              }
            },
            status: (event) => {
              console.log("status: " + JSON.stringify(event));
            },
          });
        pubnub.subscribe({
            channels: [code],
            withPresence: true,
          });*/
          return //pubnub.removeListener()
    },[])
    return <> 
    <form onSubmit={onSubmit}>
    <div className='iconTab2 row text-center m-0 d-flex align-items-center'>
        <div className="col"><span uk-icon="plus-circle"/></div>
        <div className="col-8"><input value={message} onChange={(e)=>setMessage(e.target.value)}
         onClick={()=>scrollhook.current.scrollIntoView({ behavior: 'smooth' })} 
         className="w-100 textBox" type="text" /></div>
        <button type='submit' className="col" style={{"background":"none"}}><span uk-icon="reply"/></button>
        </div>  
    </form>
    </>
}

export default MobileChat
