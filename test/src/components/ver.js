import React from "react";
import axios from "axios";
import {useSelector} from "react-redux";
import '../styles/signup.css';

const Ver = props => {

  const data = useSelector(state => state.signupreducers.form_values)
  console.log(data);

  //handle the axios call
  const buttonhandler = events =>{
    events.preventDefault();
    axios.post("https://cors-anywhere.herokuapp.com/localhost:8000/api/users/ecreate", JSON.stringify(data)).then(res =>{
      console.log(res)
    }).catch(error =>{
      console.log(error)
    })
  }
  return (
    <div>
      <div className="whole-container">
        <div className="left-side">
            <div className="left-container">
              <img src="/GO_Off300.png" id="left-logo"></img>
              <span className="dot" id="pdot1" style={{background: "#3A86FF"}}></span>
              <span className="bar" id="pbar1" style={{background: "#3A86FF"}}></span>
              <span className="dot" id="pdot2" style={{background: "#3A86FF"}}></span>
              <span className="bar" id="pbar2" style={{background: "#3A86FF"}}></span>
              <span className="dot" id="pdot3" style={{background: "#3A86FF"}}></span>
              <p id="head-text">Verify your account</p>
              <p id="desc-text">Choose your account verification method</p>
              {/* two forms each submit to a different verification form*/}
              <form style={{height: "15%"}} method="post" className="field-container">
                
                <button className="verbutton" onClick={buttonhandler}>
                  <img src="/mail.svg" id="mailbutton"></img>
                  <p id="evertext">VERIFY WITH EMAIL</p>
                  <p id="evertext2">{data.email}</p>
                  <img src="/Arrow.svg" id="rightarrow"></img>
                </button>
              </form>

              <form style={{height: "15%"}} method="post" className="field-container">
                
                <button className="verbutton" onClick={buttonhandler}>
                  <img src="/Phone.svg" id="phonebutton"></img>
                  <p id="svertext">VERIFY WITH SMS</p>
                  <p id="svertext2">({data.phonenumber})</p>
                  <img src="/Arrow.svg" id="rightarrow"></img>
                </button>
              </form>
            </div>
            <div className="wave-container">
                <img src="/wave_thin.svg" id="wave"/>
            </div>
        </div>
        <div className="right-side">
            <div className="right-container">

                <p id="main-text">Welcome to Go Off!</p>
                <p id="sub-text">A community made for you!</p>
                <img src="/GO_OFF_LOGO.svg" id="logo"/>
            </div>
        </div>
      </div>
    </div>
  )
}
        

export default Ver