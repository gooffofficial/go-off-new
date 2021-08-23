import React, { useState } from "react";
import { useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";
import { signupactions} from "../redux/actions";
import Logo from '../images/GO_Off300.png'
import Check from '../images/check.svg'
import Wave from '../images/wave_thin.svg'
import styles from '../styles/SignupPage/signup.module.css';



//initial values to be set in form
// const form_values = { firstname: "", lastname: "", email: "", username: "", password: "", birthdate: "", checkbox: false};
const initial_form_values = { firstname: "", lastname: "", email: "", username: "", password: "", birthdate: "", checkbox: false}
const Sform =  props => {
    const [form_values, set_form_values] = useState(initial_form_values);
    //invoke the function
    const dispatch = useDispatch();
    //sends data to signupactions
    const {update_form_values} = signupactions
    
    //accesses the state inside redux to pass the data
    // const global_form_values = useSelector((state) => state.signupreducers.form_values)
    // form_values.firstname = "Samuel";
    // form_values.lastname = "Leach";
    console.log(form_values)

    let history = useHistory();
    

    //function that handles button submit
    const buttonhandler = events =>{
        events.preventDefault();
        // events.stopPropagation();
        dispatch(update_form_values(form_values))
        history.push("/signup/cform");
    }

    const formhandler = events =>{
        //takes whatever we are trying to update
        const name = events.target.name;
        //takes whatever is being typed
        const value = events.target.value;
        
        //sets the input of the form to be what is being typed for each part of form_values
        set_form_values({
            ...form_values,
            [name]: value
        })
        // console.log(form_values)
    }

    const checkboxhandler = events =>{
        //same logic as above
        const name = events.target.name
        const value = events.target.checked

        set_form_values({
            ...form_values,
            [name]: value
        })
    }

        return (
            <div>
                <div className={styles["whole-container"]}>
                    <div className={styles["left-side"]}>
                        <div className={styles["left-container"]}>
                            {/* logo */}
                            <img src={Logo} className={styles["left-logo"]}/>
                            {/* progress bar */}
                            <span className={styles["pdot1"]} style={{background: "#3A86FF"}} ></span>
                            <span className={styles["pbar1"]} style={{background: "#3A86FF"}} ></span>
                            <span className={styles["pdot2"]}></span>
                            <span className={styles["pbar2"]}></span>
                            <span className={styles["pdot3"]}></span>
                            {/* signup header */}
                            <p className={styles["head-text"]}>SIGN UP</p>
                            <p className={styles["desc-text"]}>Create an account and start having real conversations.</p>

                            <form className={styles["field-container"]}>
                                {/* form for user creation */}
                                <label htmlFor='firstname' >FIRST NAME<span className={styles["required"]}>*</span></label><br/>
                                <input
                                    type='text'
                                    name='firstname'
                                    className={styles["field-input"]}
                                    value={form_values.firstname}
                                    onChange={formhandler}
                                />
                                <label htmlFor='lastname' >LAST NAME<span className={styles["required"]}>*</span></label><br/>
                                <input
                                    type='text'
                                    name='lastname'
                                    className={styles["field-input"]}
                                    value={form_values.lastname}
                                    onChange={formhandler}
                                />
                                <label htmlFor='email' >EMAIL<span className={styles["required"]}>*</span></label><br/>
                                <input
                                    type="email"
                                    name='email'
                                    className={styles["field-input"]}
                                    value={form_values.email}
                                    onChange={formhandler}
                                />
                                <label htmlFor='username' >USERNAME<span className={styles["required"]}>*</span></label><br/>
                                <input
                                    type='text'
                                    name='username'
                                    className={styles["field-input"]}
                                    value={form_values.username}
                                    onChange={formhandler}
                                />
                                <label htmlFor='password' >PASSWORD<span className={styles["required"]}>*</span></label><br/>
                                <input
                                    type='password'
                                    name='password'
                                    className={styles["field-input"]}
                                    value={form_values.password}
                                    onChange={formhandler}
                                />
                                <label htmlFor='birthdate' >DATE OF BIRTH<span className={styles["required"]}>*</span></label><br/>
                                <input
                                    type='date'
                                    name='birthdate'
                                    className={styles['birthday']}
                                    value={form_values.birthdate}
                                    onChange={formhandler}
                                />
                                <div className={styles["checkbox-container"]}>
                                <label htmlFor='checkbox' className={styles["terms"]}>Agree to <b>Terms of Service & Privacy Policy</b></label>
                                <input
                                    type='checkbox'
                                    name='checkbox'
                                    className={styles['checkbox']}
                                    value={form_values.checkbox}
                                    onChange={checkboxhandler}
                                    
                                /><img src={Check} className={styles["check"]}/>
                                </div>
                                <button onClick={buttonhandler} className={styles["submit-button"]}>SIGN UP </button>
                            </form>
                            
                            {/* <p id="ques-text">Already have an account? <a href="/login">Log in here</a></p> */}
                            
                        </div>
                
                        <div className={styles["wave-container"]}>
                            <img src={Wave} className={styles["wave"]}/>
                        </div>
                    </div>
                    <div className={styles["right-side"]}>
                        <div className={styles["right-container"]}>
                            <p className={styles["main-text"]}>Join the Conversation, Literally.</p>
                            <p className={styles["sub-text"]}>Create an account to join GoOFF!</p>
                        </div>  
                    </div>
                </div>
            </div>
        )

}

export default Sform