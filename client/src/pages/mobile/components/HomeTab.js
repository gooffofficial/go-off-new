import React from 'react'
import { useHistory } from "react-router-dom";

const HomeTab = () => {
    let history = useHistory();
    return (
        <div className='iconTab row text-center m-0 d-flex align-items-center'>
            <div className="col" onClick={()=>history.push('/home')}><span uk-icon="home"></span></div>
            <div className="col"><span uk-icon="world"></span></div>
            <div className="col"><span uk-icon="user"></span>+</div>
            <div className="col"><span uk-icon="bell"/></div>
            <div className="col"><span uk-icon='comments'/></div>
        </div>
    )
}

export default HomeTab
