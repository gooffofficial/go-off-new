import React from 'react'
import moment from 'moment';
import { useLocation} from "react-router-dom";
import { useHistory } from "react-router-dom";

const Conversation = (prop) => {
    let history = useHistory()
    const location = useLocation().pathname;
    const time = prop.time
    let UTCTime = parseInt(time);
    let newTime = new Date().getTime()
    let oldTime = new Date(UTCTime)
    let sqlTime = moment(UTCTime).format('YYYY-MM-DD HH:mm:ss')
    let convoMonth = moment(UTCTime).format('MMM').toUpperCase();
    let convoCalendarDay = moment(UTCTime).format('D');
    let convoDay = moment(UTCTime).format('dddd').toUpperCase();
    let convoHoursMinutes = moment(UTCTime).format('h:mm a').toUpperCase();
    let convoDate = `${convoDay} ${convoHoursMinutes}`;
    return<>
    <div className="card">
        <img src={prop.articleImg} class="card-img-top" alt="..."/>
        <div className="card-body">
            <div className="card-title h5 row">
                <div className='leftHeading col-3'>
                    <span className='monthText'>{convoMonth}</span>
                    <div className='dayText'>{convoCalendarDay}</div>
                </div>
                <div className="col-9">
                {prop.convTitle}
                </div>
            </div>
            <p className="startTime">
                {convoDate}EST
            </p>
            <p className="card-text">{prop.desc}</p>
        </div>
        <div className="card-footer">
            <div className="row">
                <div className='col'><img className='emilyIcon' src={prop.userpfp}/>{prop.hostName}</div>
                {location.includes("/chat")?"":<>
                <button className="btn btn-primary col-4">Save my spot</button>
                <button className="btn btn-primary col-4" onClick={()=>history.push(`/chat/${prop.roomId}`)}>Go to convo</button>
                </>}
            </div>
        </div>
    </div>
    </>
}

export default Conversation
