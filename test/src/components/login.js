import React from "react";
import { useHistory } from "react-router-dom";
import '../styles/login.css';
const Login = props => {
    let history = useHistory();

    const signupbuttonhandler = events => {
        events.preventDefault();
        history.push("/signup/sform")
    }

    return (
        <div>
            <div class="left-side">
                <div class="left-container">
                    <p id="main-text1">Adventure starts here.</p>
                    <p id="sub-text">Log in to join the community</p>
                </div>
            </div>

            <div class="right-side">
                <div class="right-container1">
                    <img src="/GO_OFF_LOGO.svg" id="logo"/> 

                    <p id="head-text">LOG IN</p>
                    <p id="desc-text">Log into your account</p>
                    
                    <form action="/api/users/login" method="post" class="field-container" id="test-container123">
                        <label>USERNAME <span class="required">*</span></label><br/>
                        <input type="text" class="field-input" id="username" name="username"/><br/>

                        <label>PASSWORD <span class="required">*</span></label><br/>
                        <input type="password" class="field-input" id="password" name="password"/><br/>
                        <br/>
                        <input type="hidden" name="redirectLinkName" id="redirectLink"  value = ''/>
            
                        <button type="submit" id="submit-button">LOG IN</button>
                        <p id="ques-text">Don't have an account? <button onClick={signupbuttonhandler}>Sign up here</button></p>
                    </form>
                </div>

                <div class="wave-container">
                    <img src="/wave_thin.svg" id="wave1"/>
                </div>
            </div>
        </div>
    )
}

export default Login