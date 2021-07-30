import React, { useState } from "react";
import { sendVerifyCheck } from '../api';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import  ReactCodeInput  from 'react-verification-code-input';
import '../styles/auth.css';


const SMSAuth = props => {
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
        history.push("/Profile");
      else 
        setErrorText("SMS Code was invalid...")
      
    }  

    return (
        <div>
            <div className={styles["container"]}>
                <img src="/GO_OFF_LOGO.svg" className={styles["logo"]}/>
                <h1 className={styles["vertext"]}>Verification Code</h1>
                <p className={styles["sverdesc"]}>Please enter the 6 digit verification code sent to </p>
                <form>
                    <ReactCodeInput onChange={handleChange} className={styles["sixinput"]} />
                    <button className={styles["authsubmit"]} onClick={handleClick}><span className="button-text">Verify Now</span></button>
                    <span className={styles["SMSErrorText"]}>{!!errorText && errorText}</span>
                </form>
            </div>
            <img src="/wave1.svg" className="swave"></img>
        </div>
    )
}
        
export default SMSAuth