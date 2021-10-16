import React, { useEffect, useContext, useRef, useState } from 'react'
import "../../styles/mobile/chat.css";
import Chat from '../../components/Chat';
import { usePubNub } from 'pubnub-react';
import { UserContext } from '../../contexts/userContext';
import Conversation from './components/Conversation'
import { useHistory } from "react-router-dom";

const MobileChat = ({loading, reload, content, messages}) => {
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
                return <div className='iconTab2 row text-center m-0 d-flex align-items-center'>
                <div className="col"><span uk-icon="plus-circle"/></div>
                <div className="col-8"><input onClick={()=>scrollhook.current.scrollIntoView({ behavior: 'smooth' })} className="w-100 textBox" type="text" /></div>
                <div className="col"><span uk-icon="reply"/></div>
            </div>
            case false:
                return     <div className='row text-center m-0 d-flex align-items-center'>
                <div className="col-3"><img className='bigger' src="https://miro.medium.com/max/316/1*LGHbA9o2BKka2obwwCAjWg.jpeg"/></div>
                <div className="col-3 h4 w-50">Christian Nava</div>
                <div className="col text-end m-2"><span uk-icon="more"/></div>
            </div>
            default:
                return <div className='iconTab2 row text-center m-0 d-flex align-items-center'>
                <div className="col"><span uk-icon="plus-circle"/></div>
                <div className="col-8"><input onClick={()=>scrollhook.current.scrollIntoView({ behavior: 'smooth' })} className="w-100 textBox" type="text" /></div>
                <div className="col"><span uk-icon="reply"/></div>
            </div>   
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

export default MobileChat
