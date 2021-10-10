import React from 'react'
import Conversation from './components/Conversation'
import '../../styles/mobile/profile.css';

const MobileProfile = () => {
    return (
        <div className='base'>
            <div className="row profileTab text-center shadow-lg m-0 d-flex p-1">
                <div className="col-12">
                    <img style={{'height':'60px','width':'60px', 'border-radius':'25px', 'object-fit':"contain", 'margin':'1vw'}} src="https://miro.medium.com/max/316/1*LGHbA9o2BKka2obwwCAjWg.jpeg"/>
                </div>
                <div className="col-12 text-center h1"><b>Name of User</b></div>
                <div className="col-12 text-center">@Username</div>
                <div className="col-6 text-end">100 Followers</div>
                <div className="col-6 text-start">100 Following</div>
                <div className="text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate sunt sapiente suscipit architecto et alias laborum voluptatem laudantium reiciendis animi. Nemo modi dolorum esse temporibus.</div>
            </div>
            <div style={{'height':'12vh'}}></div>
            <div class='row text-center m-0 d-flex align-items-bottom'>
                <div className="col-4 h4">Upcoming</div>
                <div className="col-4 h4">Past</div>
                <div className="col-4 h4">Saved</div>
            </div>
            <div className='container'>
                <div className="col">
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

export default MobileProfile
