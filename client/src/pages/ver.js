import React from "react";
import { sendEmailRegister, sendSMSRegister } from '../styles/AuthPage/api'
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styles from '../styles/SignupPage/signup.module.css';
import Logo from '../images/GO_Off300.png'
import Mail from '../images/mail.svg'
import Arrow from '../images/Arrow.svg'
import Phone from '../images/Phone.svg'
import Wave from '../images/wave_thin.svg'

const Ver = props => {
  const userInfo = useSelector(state => state.signupreducers.form_values)
  const { firstname, lastname, email, username, password, birthdate, checkbox, phonenumber, location, gender } = userInfo
  console.log("userInfo: ", userInfo);
  // let serverResponse = await axios.post('http:/localhost:8000/api/users/ecreate')
  let history = useHistory();

  //handle the axios call
  const emailbuttonhandler = events =>{
    events.preventDefault();
    sendEmailRegister(userInfo);
    history.push("/signup/eauth")
    // axios.post("/localhost:8000/api/users/ecreate", JSON.stringify(data)).then(res =>{
    //   console.log(res)
    // }).catch(error =>{
    //   console.log(error)
    // })
  }


  const smsbuttonhandler = async (evt) => {
    evt.preventDefault();
    sendSMSRegister(userInfo);
    history.push("/signup/smsauth")
    
    // axios.post("https://cors-anywhere.herokuapp.com/localhost:8000/api/users/ecreate", JSON.stringify(data)).then(res =>{
    //   console.log(res)
    // }).catch(error =>{
    //   console.log(error)
    // })
  }

  return (
    <div>
      <div className={styles["whole-container"]}>
        <div className={styles["left-side"]}>
            <div className={styles["left-container"]}>
              <img src={Logo} className={styles["left-logo"]}></img>
              <span className={styles["pdot1"]} style={{background: "#3A86FF", left: "40%"}}></span>
              <span className={styles["pbar1"]} style={{background: "#3A86FF", left: "40%"}}></span>
              <span className={styles["pdot2"]} style={{background: "#3A86FF", left: "45%"}}></span>
              <span className={styles["pbar2"]} style={{background: "#3A86FF", left: "45%"}}></span>
              <span className={styles["pdot3"]} style={{background: "#3A86FF", left: "50%"}}></span>
              <p className={styles["head-text"]}>Verify your account</p>
              <p className={styles["desc-text"]}>Choose your account verification method</p>
              {/* two forms each submit to a different verification form*/}
                
              <button className={styles["verbutton"]} onClick={emailbuttonhandler}>
                <img src={Mail} className={styles["mailbutton"]}></img>
                <p className={styles["evertext"]}>VERIFY WITH EMAIL</p>
                <p className={styles["evertext2"]}>{userInfo.email}</p>
                <img src={Arrow} className={styles["rightarrow"]}></img>
              </button>

              <button className={styles["verbutton"]} onClick={smsbuttonhandler}>
                <img src={Phone} className={styles["phonebutton"]}></img>
                <p className={styles["svertext"]}>VERIFY WITH SMS</p>
                <p className={styles["svertext2"]}>({userInfo.phonenumber})</p>
                <img src={Arrow} className={styles["rightarrow"]}></img>
              </button>
            </div>
            <div className={styles["wave-container"]}>
                <img src={Wave} className={["wave"]}/>
            </div>
        </div>
        <div className={styles["right-side"]}>
            <div className={styles["right-container"]}>

                <p className={styles["main-text"]}>Welcome to Go Off!</p>
                <p className={styles["sub-text"]}>A community made for you!</p>
                {/* <img src="/GO_OFF_LOGO.svg" id="logo"/> */}
            </div>
        </div>
      </div>
    </div>
  )
}
        

export default Ver