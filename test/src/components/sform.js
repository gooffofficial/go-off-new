import React, { useState } from "react";
import { useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";
import { signupactions} from "../redux/actions";
import '../styles/signup.css';



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
                <div className="whole-container">
                    <div className="left-side">
                        <div className="left-container">
                            {/* logo */}
                            <img src="/GO_Off300.png" id="left-logo"/>
                            {/* progress bar */}
                            <span className="dot" id="pdot1" style={{background: "#3A86FF"}} ></span>
                            <span className="bar" id="pbar1" style={{background: "#3A86FF"}} ></span>
                            <span className="dot" id="pdot2"></span>
                            <span className="bar" id="pbar2"></span>
                            <span className="dot" id="pdot3"></span>
                            {/* signup header */}
                            <p id="head-text">SIGN UP</p>
                            <p id="desc-text">Create a new account</p>

                            <form className="field-container">
                                {/* form for user creation */}
                                <label htmlFor='firstname' >FIRST NAME<span className="required">*</span></label><br/>
                                <input
                                    type='text'
                                    name='firstname'
                                    className="field-input"
                                    value={form_values.firstname}
                                    onChange={formhandler}
                                />
                                <label htmlFor='lastname' >LAST NAME<span className="required">*</span></label><br/>
                                <input
                                    type='text'
                                    name='lastname'
                                    className="field-input"
                                    value={form_values.lastname}
                                    onChange={formhandler}
                                />
                                <label htmlFor='email' >EMAIL<span className="required">*</span></label><br/>
                                <input
                                    type='text'
                                    name='email'
                                    className="field-input"
                                    value={form_values.email}
                                    onChange={formhandler}
                                />
                                <label htmlFor='username' >USERNAME<span className="required">*</span></label><br/>
                                <input
                                    type='text'
                                    name='username'
                                    className="field-input"
                                    value={form_values.username}
                                    onChange={formhandler}
                                />
                                <label htmlFor='password' >PASSWORD<span className="required">*</span></label><br/>
                                <input
                                    type='password'
                                    name='password'
                                    className="field-input"
                                    value={form_values.password}
                                    onChange={formhandler}
                                />
                                <label htmlFor='birthdate' >DATE OF BIRTH<span className="required">*</span></label><br/>
                                <input
                                    type='date'
                                    name='birthdate'
                                    id='birthday'
                                    value={form_values.birthdate}
                                    onChange={formhandler}
                                />
                                <div className="checkbox-container">
                                <label htmlFor='checkbox' id="terms">Agree to <b>Terms of Service & Privacy Policy</b></label>
                                <input
                                    type='checkbox'
                                    name='checkbox'
                                    id="checkbox"
                                    value={form_values.checkbox}
                                    onChange={checkboxhandler}
                                    
                                /><img src="/check.svg" id="check"/>
                                </div>
                                <button onClick={buttonhandler} id="submit-button">SIGN UP </button>
                            </form>
                            
                            {/* <p id="ques-text">Already have an account? <a href="/login">Log in here</a></p> */}
                            
                        </div>
                
                        <div className="wave-container">
                            <img src="/wave_thin.svg" id="wave"/>
                        </div>
                    </div>
                    <div className="right-side">
                        <div className="right-container">
                            <p id="main-text">Join the Conversation, Literally.</p>
                            <p id="sub-text">Create an account to join GoOFF!</p>
                        </div>  
                    </div>
                </div>
            </div>
        )

}

export default Sform