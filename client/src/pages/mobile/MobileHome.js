import React, {useContext, useEffect, useState} from 'react'
import '../../styles/mobile/home.css'
import s from '../../styles/HomePage/HostHome.module.scss';
import moment from 'moment';
import Conversation from './components/Conversation';
import HomeTab from './components/HomeTab';
import { UserContext } from '../../contexts/userContext';

const MobileHome = () => {
    const {currentUser, setCurrentUser, upcoming, convos} = useContext(UserContext)
    const [chronConvo, setChronConvo] = useState([]);
    const [isCreateConvModalVisible, setCreateConvModalVisible] = useState(false)

    const openCreateConvModal = () => setCreateConvModalVisible(true);
    const closeCreateConvModal = () => setCreateConvModalVisible(false);


    const [show, setShow] = useState(false)
    const compareDate = (date1, date2) => {
		if(date1.time>date2.time){
			return -1
		}
		if(date1.time<date2.time){
			return 1
		}
		return 0
	}
    useEffect(()=>{
        setChronConvo([...convos].sort(compareDate))
        return
    },[])
    return (
        <div className='base'>
            <div className="row hostTab text-center shadow-lg m-0 d-flex p-1">
                <div className="col-3"><img className='bigger' src={currentUser.propic}/></div>
                <input className='col-9 start' type="text" placeholder='Start a Conversation'/>
                <div className="col-4"><span uk-icon="image"/>Photo</div>
                <div className="col-4"><span uk-icon="video-camera"/>Video</div>
                <div className="col-4"><span uk-icon="file-text"/> Article</div>
            </div>
            <div style={{'height':'20vh'}}></div>
            <div className='container'>
                <div className="col">
                    {
                        chronConvo?(chronConvo.map((prop)=>{
                            return <Conversation
                            articleURL={prop.articleURL}
                            articleImg={prop.articleImg}
                            time={prop.time}
                            convTitle={prop.convTitle}
                            hostName={prop.hostName}
                            roomId={prop.roomId}
                            desc={prop.desc}
                            hostid={prop.hostID}
                            userpfp={prop.hostpfp}
                            hostNum={prop.hostNum}
                            userid={prop.userID}
                            useremail={prop.useremail}
                            userPnum={prop.userPnum}
                            hostUName={prop.username}
                            />
                        })):<Conversation/>
                    }

                </div>
                <br />
            </div>
            <HomeTab/>
        </div>
    )
}

export default MobileHome
