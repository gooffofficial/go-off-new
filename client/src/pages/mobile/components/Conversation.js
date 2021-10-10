import React from 'react'
import moment from 'moment';

const Conversation = () => {
    const time = "1633484700000"
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
        <img src="https://besthqwallpapers.com/Uploads/10-6-2020/135848/thumb2-gray-abstract-background-gray-luxury-background-gray-lines-background-gray-geometric-background.jpg" class="card-img-top" alt="..."/>
        <div className="card-body">
            <div className="card-title h5 row">
                <div className='leftHeading col-3'>
                    <span className='monthText'>OCT</span>
                    <div className='dayText'>7</div>
                </div>
                <div className="col-9">
                The most prolific lie of our generation: I'll start eating healthy tomorrow.
                </div>
            </div>
            <p className="startTime">
                {convoDate}EST
            </p>
            <p className="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, facilis quod! Quod labore sed consequuntur rem ad dignissimos? Voluptatem excepturi maiores dolorem rem minima doloribus totam quos similique dolor ducimus, animi pariatur doloremque, suscipit itaque, dolores consequuntur eveniet. Vero molestias harum deleniti facere distinctio eum iusto obcaecati, recusandae accusantium iure.</p>
        </div>
        <div className="card-footer">
            <div className="row">
                <div className='col-4'><img className='emilyIcon' src="https://miro.medium.com/max/316/1*LGHbA9o2BKka2obwwCAjWg.jpeg"/>Emily Patterson</div>
                <button className="btn btn-primary col">Save my spot</button>
                <button className="btn btn-primary col">Go to convo</button>
            </div>
        </div>
    </div>
    </>
}

export default Conversation
