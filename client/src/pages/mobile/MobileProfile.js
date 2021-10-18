import React, {useState, useContext, useEffect} from 'react'
import Conversation from './components/Conversation'
import '../../styles/mobile/profile.css';
import HomeTab from './components/HomeTab';
import { UserContext } from '../../contexts/userContext';

const MobileProfile = () => {
    const { myUpcoming, convos, past, currentUser } = useContext(UserContext)
    const [option, setOption] = useState("upcoming")
    const helper = (option) => {
        switch (option){
            case "past":
                return <Past past={past}/>;
            case "upcoming":
                return <Upcoming upcoming={myUpcoming}/>;
            case "saved":
                return <Saved/>;
            default:
                return <Upcoming upcoming={myUpcoming}/>;
        }
    }
    return (
        <div className='base'>
            <div className="row profileTab text-center shadow-lg m-0 d-flex p-1">
                <div className="col-12">
                    <img style={{'height':'60px','width':'60px', 'border-radius':'25px', 'object-fit':"contain", 'margin':'1vw'}} 
                    src={currentUser.propic}/>
                </div>
                <div className="col-12 text-center h1"><b>{currentUser.name}</b></div>
                <div className="col-12 text-center">@{currentUser.username}</div>
                <div className="col-6 text-end">Followers: {currentUser.followercount}</div>
                <div className="col-6 text-start">Following: {currentUser.followingcount}</div>
                <div className="text-center">{currentUser.bio?currentUser.bio:"Set a bio!"}</div>
            </div>
            <div style={{'height':'12vh'}}></div>
            <div class='row text-center m-0 d-flex align-items-bottom'>
                <div className="col-4 h4" onClick={()=>setOption("upcoming")}>Upcoming</div>
                <div className="col-4 h4" onClick={()=>setOption("past")}>Past</div>
                <div className="col-4 h4" onClick={()=>setOption("saved")}>Saved</div>
            </div>
            <div className='container'>
                <div className="col">
                {
                    helper(option)
                }
                </div>
                <br />
                <HomeTab/>
            </div>
        </div>
    )
}

export default MobileProfile

const Upcoming = ({upcoming}) => {
    useEffect(()=>{
    },[])
    return <> 
    {upcoming.length>1?upcoming.map((prop)=>{
        <Conversation
        articleURL={prop.articleURL}
        articleImg={prop.articleImg}
        time={prop.time}
        convTitle={prop.convTitle}
        hostName={prop.hostUserNmae}
        roomId={prop.roomId}
        desc={prop.convDesc}
        hostid={prop.hostID}
        userpfp={prop.hostpfp}
        hostNum={prop.hostNum}
        userid={prop.userID}
        useremail={prop.useremail}
        userPnum={prop.userPnum}
        hostUName={prop.username}
        />
    }):<div  style={{"height":"55vh"}} className="text-center">No upcoming</div>
}
    </>
}
const Past = ({past}) => {
    return <> 
        {past.length>1?past.map((prop)=>{
        return <Conversation
        articleURL={prop.articleURL}
        articleImg={prop.articleImg}
        time={prop.time}
        convTitle={prop.convTitle}
        hostName={prop.hostUserNmae}
        roomId={prop.roomId}
        desc={prop.convDesc}
        hostid={prop.hostID}
        userpfp={prop.hostpfp}
        hostNum={prop.hostNum}
        userid={prop.userID}
        useremail={prop.useremail}
        userPnum={prop.userPnum}
        hostUName={prop.username}
        />
    }):<div  style={{"height":"55vh"}} className="text-center">No past conversations</div>
}
    </>
}
const Saved = () => {
    return <> 
        <div  style={{"height":"55vh"}} className="text-center">Saved conversations</div>
    </>
}