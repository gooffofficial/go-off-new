import React from "react";
import { useHistory } from "react-router-dom";
import styles from '../styles/SplashPage/splash.module.css';
import BigLogo from '../images/go-off-logo-big.svg'
import SmallLogo from '../images/GO_OFF_LOGO.svg'
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
            <div className={styles["left-side2"]}>
                <img src={BigLogo} className={styles["left-logo1"]} draggable="false"/>
            </div>

            <div className={styles["right-side2"]}>
                <div className={styles["center-container"]}>
                    <img src={SmallLogo} className={styles["right-logo"]} draggable="false"/>

                    <p className={styles["main-text2"]}>Join the conversation.</p>
                    <p className={styles["sub-text2"]}>Literally.</p>

                    <div className={styles["button-container"]}>
                        <button onClick={signupbuttonhandler} className={styles["form-button"]}>Sign Up</button>
                        <button onClick={loginbuttonhandler} className={styles["form-button"]}>Log In</button>
                    </div>
                </div>

                <div className={styles["bottom-links"]}>
                    <ul> 
                        {/* <li><a href="">Contact</a></li>
                        <li><a href="">Beta Sign Up</a></li> */}
                        <li><a href="https://docs.google.com/document/d/1MAgAfsF2ZJ-wRCFWAkA6m4hxll0tCrXb/edit?usp=sharing&ouid=118257569730053365648&rtpof=true&sd=true">Privacy Policy</a></li>
                        <li><a href="https://docs.google.com/document/u/1/d/e/2PACX-1vRLCSRa52WgXF_hCBByjGv6TIKcuXgirR4QB2Z5s_4r1p8ub_cOKvdCgZNNN80vsw/pub">Terms & Conditions</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Splash
