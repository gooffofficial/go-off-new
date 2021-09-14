import React from 'react'

const Analytics = () => {
    return (
        <div>
            <h1>Number of users</h1>
            <p>data.numUsers</p>
            <h1>Total number of messages in convo</h1>
            <p>data.totalMessages</p>
            <h1>Average number of chars per message</h1>
            <p>data.averageLettersMessage</p>
            <h1>Total number of words in convo</h1>
            <p>data.totalWords</p>
            <h1>Average number of words per message</h1>
            <p>data.averageWordsMessage</p>
            <h1>Word Cloud of convo</h1>
            <img src="https://gooff.s3.us-east-2.amazonaws.com/images/graphs/<%=room%>_wordcloud.png"/>
            <h1>Most common words</h1>
            <img src="https://gooff.s3.us-east-2.amazonaws.com/images/graphs/<%=room%>_top5Bar.png"/>
            <h1>Sentiment overview of conversation</h1>
            <img src="https://gooff.s3.us-east-2.amazonaws.com/images/graphs/<%=room%>_sentimentDonut.png"/>
            <h1>Sentiment overview with neutral ratings</h1>
            <img src="/donut_neutral.png"/>
            <h1>Sentiment over time</h1>
            <img src="/sentimentOverTime.png"></img>
        </div>
    )
}

export default Analytics
