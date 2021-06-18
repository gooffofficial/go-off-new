import React, { Component } from "react";

class left extends Component {

    constructor(props) {
        super(props);
        this.state = { username: "" };
        this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(evt) {
        this.setState({ [evt.target.name]: evt.target.value });
        this.setState({ [evt.target.name]: type === 'checkbox' ? checked : value});
    }
    // handleSubmit(evt) {
    //     evt.preventDefault();
    //     alert(`You typed: ${this.state.username}`);
    //     this.setState({ username: "" });
    // }

    render() {
        return (
            <div>
                {/* logo */}
                <img src="/GO_Off300.png" id="left-logo"></img>
                {/* progress bar */}
                <span class="dot" id="pdot1" style="background: #3A86FF;"></span>
                <span class="bar" id="pbar1" style="background: #3A86FF;"></span>
                <span class="dot" id="pdot2"></span>
                <span class="bar" id="pbar2"></span>
                <span class="dot" id="pdot3"></span>
                {/* signup header */}
                <p id="head-text">SIGN UP</p>
                <p id="desc-text">Create a new account</p>

                <form>
                    {/* form for user creation */}
                    <label htmlFor='firstname'>FULL NAME</label>
                    <input
                        type='text'
                        id='firstname'
                        value={this.state.firstname}
                        onChange={this.handleChange}
                    />
                    <label htmlFor='email'>EMAIL</label>
                    <input
                        type='text'
                        id='email'
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                    <label htmlFor='password'>PASSWORD</label>
                    <input
                        type='password'
                        id='password'
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                    <label htmlFor='birthdate'>DATE OF BIRTH</label>
                    <input
                        type='date'
                        id='birthdaye'
                        value={this.state.birthdate}
                        onChange={this.handleChange}
                    />
                    <label htmlFor='checkbox'>Agree to <b>Terms of Service & Privacy Policy</b></label>
                    <input
                        type='checkbox'
                        id='checkbox'
                        value={this.state.checkbox}
                        onChange={this.handleChange}
                    />
                </form>
            </div>
        )
    }
}