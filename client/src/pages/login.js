import React from "react";
import { useHistory } from "react-router-dom";
import styles from '../styles/LoginPage/login.module.css';
import Logo from '../images/GO_OFF_LOGO.svg'
import Wave from '../images/wave_thin.svg'
const Login = props => {
    let history = useHistory();

    const signupbuttonhandler = events => {
        events.preventDefault();
        history.push("/Signup")
    }

    return (
        <div>
            <div className={styles["left-side1"]}>
                <div className={styles["left-container1"]}>
                    <p className={styles["main-text1"]}>Adventure starts here.</p>
                    <p className={styles["sub-text"]}>Log in to join the community</p>
                </div>
            </div>

            <div className={styles["right-side1"]}>
                <div className={styles["right-container1"]}>
                    <img src={Logo} className={styles["logo"]}/> 

                    <p className={styles["head-text"]}>LOG IN</p>
                    <p className={styles["desc-text"]}>Log into your account</p>
                    
                    <form action="/api/users/login" method="post" className={styles["field-container"]} id="test-container123">
                        <label>USERNAME <span className={styles["required"]}>*</span></label><br/>
                        <input type="text" className={styles["field-input"]} id="username" name="username"/><br/>

                        <label>PASSWORD <span className={styles["required"]}>*</span></label><br/>
                        <input type="password" className={styles["field-input"]} id="password" name="password"/><br/>
                        <br/>
                        <input type="hidden" name="redirectLinkName" className={styles["redirectLink"]}  value = ''/>
            
                        <button type="submit" className={styles["submit-button"]}>LOG IN</button>
                        <p className={styles["ques-text"]}>Don't have an account? <button onClick={signupbuttonhandler}>Sign up here</button></p>
                    </form>
                </div>

                <div className={styles["wave-container"]}>
                    <img src={Wave} className={styles["wave1"]}/>
                </div>
            </div>
        </div>
    )
}

export default Login