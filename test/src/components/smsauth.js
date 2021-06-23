import React from "react";
import '../styles/auth.css';

const SMSAuth = props => {
    return (
        <div>
            <div className="container">
                <image src="/GO_OFF_LOGO.svg" className="logo"></image>
                <h1 className="vertext">Verification Code</h1>
                <p className="sverdesc">Please enter the 6 digit verification code sent to </p>
                <form>
                    {/* <ReactCodeInput type='number' id="input" fields={6} /> */}
                    <button className="authsubmit">Verify Now</button>
                </form>
            </div>
            {/* <img src="/wave1.svg" className="swave"></img> */}
        </div>
    )
}
        
export default SMSAuth    
