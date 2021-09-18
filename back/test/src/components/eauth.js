import React, { useState } from "react";
import { sendVerifyCheck } from '../api';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import  ReactCodeInput  from 'react-verification-code-input';
import '../styles/auth.css';

const EAuth = props => {
    const [verfiyCode, setVerfiyCode] = useState("")
    const [errorText, setErrorText] = useState("")
    let history = useHistory();
    const userInfo = useSelector(state => state.signupreducers.form_values) // Get userInfo from signupreducer
    const { email } = userInfo;

    const handleChange = (VerifyInput) => {
      setVerfiyCode(VerifyInput);
    }

    const handleClick = async (evt) => {
      evt.preventDefault();
      if (verfiyCode.length !== 6) return;

      const wasValidCode = await sendVerifyCheck(email, verfiyCode);
      if (wasValidCode)
        history.push("/login");
      else
        setErrorText("SMS Code was invalid...")
    }    
    

    return (
        <div>
            <div className="container">
                <img src="/GO_OFF_LOGO.svg" className="logo"/>
                <h1 className="vertext">Verification Code</h1>
                <p className="sverdesc">Please enter the 6 digit verification code sent to </p>
                <form>
                    <ReactCodeInput onChange={handleChange} className="sixinput"/>
                    <button className="authsubmit" onClick={handleClick} ><span className="button-text">Verify Now</span></button>
                    <span className="SMSErrorText">{!!errorText && errorText}</span>
                </form>
            </div>
            <img src="/wave1.svg" className="swave"></img>
        </div>
    )
}
        
export default EAuth    