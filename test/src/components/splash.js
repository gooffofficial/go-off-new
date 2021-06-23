import React from "react";
import { useHistory } from "react-router-dom";
import '../styles/splash.css';

const Splash = props => {
    let history = useHistory();

    const signupbuttonhandler = events => {
        events.preventDefault();
        history.push("/signup/sform")
    }

    const loginbuttonhandler = events => {
        events.preventDefault();
        history.push("/login")
    }

    return (
        <div>
            <div className="left-side1">
                <img src="/go-off-logo-big.svg" id="left-logo1" draggable="false"/>
            </div>

            <div className="right-side1">
                <div className="center-container">
                    <img src="/GO_OFF_LOGO.svg" className="right-logo" draggable="false"/>

                    <p id="main-text1">Join the conversation, literally.</p>
                    <p id="sub-text1">Sign up or login to join Go Off!</p>

                    <div className="button-container">
                        <button onClick={signupbuttonhandler} className="form-button">Sign Up</button>
                        <button onClick={loginbuttonhandler} className="form-button">Log In</button>
                    </div>
                </div>

                <div className="bottom-links">
                    <ul> 
                        {/* <li><a href="">Contact</a></li>
                        <li><a href="">Beta Sign Up</a></li> */}
                        <li><a href="https://docs.google.com/document/u/1/d/e/2PACX-1vTTT-CRXbRMfNaPHfxkwvZ-s9cG8WKvcvVPEGrPiDfRGh-eb6gDEGZNIxua3RSLmQ/pub">Privacy Policy</a></li>
                        <li><a href="https://docs.google.com/document/u/1/d/e/2PACX-1vRLCSRa52WgXF_hCBByjGv6TIKcuXgirR4QB2Z5s_4r1p8ub_cOKvdCgZNNN80vsw/pub">Terms & Conditions</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Splash