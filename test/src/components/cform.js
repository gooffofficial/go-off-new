import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { signupactions} from "../redux/actions";
import '../styles/signup.css';


const initial_form_values = {phonenumber: "", location: "", gender: "HeHim"}
const Cform = props => {
    const [form_values, set_form_values] = useState(initial_form_values)
    
    const dispatch = useDispatch();
    //sends data to signupactions
    const {update_form_values} = signupactions

    let history = useHistory();

   
    const formhandler = events =>{
        //takes whatever we are trying to update
        const name = events.target.name;
        //takes whatever is being typed
        const value = events.target.value;
        
        //sets the input of the form to be what is being typed for each part of initial_values
        set_form_values({
            ...form_values,
            [name]: value
        })
        console.log(form_values)
    }

    const buttonhandler = events =>{
        events.preventDefault();
        // events.stopPropagation();
        // let mergedData = { ...data, ...form_values}
        dispatch(update_form_values(form_values))
        history.push("/signup/ver");
    }  
    
    const selecthandler = events =>{
        //same logic as above
        const name = events.target.name
        const value = events.target.value

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
                            <span className="dot" id="pdot1" style={{background: "#3A86FF"}}></span>
                            <span className="bar" id="pbar1" style={{background: "#3A86FF"}}></span>
                            <span className="dot" id="pdot2" style={{background: "#3A86FF"}}></span>
                            <span className="bar" id="pbar2" style={{background: "#3A86FF"}}></span>
                            <span className="dot" id="pdot3"></span>
                            {/* signup header */}
                            <p id="head-text">Complete your profile</p>
                            <p id="desc-text">Almost there, we just need a few more details!</p>

                            <form className="field-container">
                                {/* form for user creation */}
                                <label htmlFor='phonenumber'>PHONE NUMBER<span className="required">*</span></label><br/>
                                <input
                                    className="field-input"
                                    name='phonenumber'
                                    placeholder="+16173529430"
                                    value={form_values.phonenumber}
                                    onChange={formhandler}
                                />
                                <label htmlFor='location'>LOCATION<span className="required">*</span></label><br/>
                                <input
                                    type='text'
                                    className="field-input"
                                    name='location'
                                    value={form_values.location}
                                    onChange={formhandler}
                                />
                                <label htmlFor='gender'>PRONOUNS<span className="required">*</span></label><br/>
                                <select onChange={selecthandler}>
                                    <option value="HeHim">He/Him</option>
                                    <option value="SheHer">She/Her</option>
                                    <option value="TheyTHem">They/Them</option>
                                </select>
                                <button id="submit-button" onClick={buttonhandler}>SAVE & CONTINUE</button>
                            </form>
                        </div>
                        <div className="wave-container">
                            <img src="/wave_thin.svg" id="wave"/>
                        </div>
                    </div>
                    <div className="right-side">
                        <div className="right-container">
                            <p id="main-text">Adventure starts here.</p>
                            <p id="sub-text">Complete your profile to join GoOFF!</p>
                        </div>  
                    </div>
                </div>
            </div>
        )
}

export default Cform