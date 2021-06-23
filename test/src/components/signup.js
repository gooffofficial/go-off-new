// import React, { Component } from "react"; //imports React
// import { render } from "ejs";
//import components
// import "./signup.css";



import Sform from "./sform";
// import Cform from "./cform";
// import Ver from "./ver";
// import SMSAuth from "./smsauth";
// import EAuth from "./eauth";


  
const Signup = props =>{
//   var fieldValues = {
//     fullname : null,
//     email    : null,
//     username : null,
//     password : null,
//     birthdate : null,
//     phonenumber: null,
//     location: null,
//     gender: null
// }
  return (
    <div>
      <Sform />
      {/* <Cform /> */}
      {/* <Ver /> */}
      {/* <SMSAuth/> */}
      {/* <EAuth/> */}
    </div>
  )
}
export default Signup;


    // getInitialState: function() {
    //     return {
    //     step : 1
    //     }
    // },

    // saveValues: function(field_value) {
    //     return function() {
    //     fieldValues = assign({}, fieldValues, field_value)
    //     }.bind(this)()
    // },

    // nextStep: function() {
    //     this.setState({
    //     step : this.state.step + 1
    //     })
    // },
  
    // submitRegistration: function() {
    //   // Handle via ajax submitting the user data, upon
    //   // success return this.nextStop(). If it fails,
    //   // show the user the error but don't advance
  
    //   this.nextStep()
    // },
  
    // showStep: function() {
    //   switch (this.state.step) {
    //     case 1:
    //         return <sform fieldValues={fieldValues}
    //                             nextStep={this.nextStep}
    //                             saveValues={this.saveValues} />
    //     case 2:
    //         return <cform fieldValues={fieldValues}
    //                            nextStep={this.nextStep}
    //                            saveValues={this.saveValues} />
    //     case 3:
    //         return <ver fieldValues={fieldValues}
    //                            submitRegistration={this.submitRegistration} />
    //     case 4:
    //         return <smsauth fieldValues={fieldValues} />
    //     case 5:
    //         return <eauth fieldValues={fieldValues} />
    //   }
    // },