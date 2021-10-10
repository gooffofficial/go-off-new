import React from 'react'
import '../../styles/mobile/home.css'
import s from '../../styles/HomePage/HostHome.module.scss';
import moment from 'moment';
import Conversation from './components/Conversation'

const MobileHome = () => {
    return (
        <div className='base'>
            <div className="row hostTab text-center shadow-lg m-0 d-flex p-1">
                <div className="col-3"><img className='bigger' src="https://miro.medium.com/max/316/1*LGHbA9o2BKka2obwwCAjWg.jpeg"/></div>
                <input className='col-9 start' type="text" placeholder='Start a Conversation'/>
                <div className="col-4"><span uk-icon="image"/>Photo</div>
                <div className="col-4"><span uk-icon="video-camera"/>Video</div>
                <div className="col-4"><span uk-icon="file-text"/> Article</div>
            </div>
            <div style={{'height':'20vh'}}></div>
            <div className='container'>
                <div className="col">
                    <Conversation/>
                    <Conversation/>
                    <Conversation/>
                    <Conversation/>
                    <Conversation/>
                    <Conversation/>
                </div>
                <br />
            </div>
            <div className='iconTab row text-center m-0 d-flex align-items-center'>
                <div className="col"><span uk-icon="home"></span></div>
                <div className="col"><span uk-icon="world"></span></div>
                <div className="col"><span uk-icon="user"></span>+</div>
                <div className="col"><span uk-icon="bell"/></div>
                <div className="col"><span uk-icon='comments'/></div>
            </div>
        </div>
    )
}

export default MobileHome
