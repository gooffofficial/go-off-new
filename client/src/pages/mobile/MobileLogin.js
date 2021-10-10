import React, { useState, useEffect, useRef } from "react";
import SmallLogo from "../../images/GO_OFF_LOGO.svg";
import "../../styles/mobile/login.css";
import { useHistory } from "react-router-dom";


const PartA = ({setPart}) => {
    const onSubmit = (e) => {
        e.preventDefault();
        setPart(<PartB setPart={setPart}/>)
    }
    const [check, setChecked] = useState(false)
  return <>
    <div className="h1">
        <b>Log In</b>
    </div>
    <div>Log in to your account</div>
    <form onSubmit={onSubmit} className="mt-5 mb-5">
        <div className="input">
        Username: <input type="text" />
        </div>
        <div className="input">
        Password: <input type="password" />
        </div>
        <div className='mt-5'>
            <input type="checkbox" /> <b>Remember me</b>
        </div>
        <div className='mt-1'>
            <button type='submit' className="btn btn-primary col-12"> Login</button>
        </div>
        <div className='mt-3'>
            Don't have an account? Sing up here
        </div>
    </form>
  </>;
}
const PartB = ({setPart}) => {
    let history = useHistory()
    let count = 1
    const input1 = useRef()
    const input2 = useRef()
    const input3 = useRef()
    const input4 = useRef()
    const input5 = useRef()
    const input6 = useRef()
    const inputArray = [input1,input2,input3,input4,input5,input6]
    const handlePress = (e) => {
        
        if(isNaN(e.target.value)){
            e.target.value=''
        }else{
            if(count<6){
                inputArray[count].current.focus()
                count++
            }
        }
    }
    //this checks for a backspace
    const handleBack = (e) =>{
        if(e.code=='Backspace' && count>0){
            e.target.value=''
            inputArray[count-1].current.focus()
            count--
        }
    }
    //this is a solution needed for backspacing to work properly
    const fix = e => {
        if(count==6 && e.code=='Backspace'){
            handleBack(e)
            inputArray[count-1].current.focus()
            count--
        }else{
            handleBack(e)
            handleBack(e)
        }
    }
    const onSubmit = (e)=>{
        e.preventDefault()
        console.log(e.target[0].value,e.target[1].value,e.target[2].value,e.target[3].value,e.target[4].value,e.target[5].value)
        history.push('/home')

    }
    useEffect(()=>{
        inputArray[0].current.focus()
    })
    return <div className='text-center'>
    <div className='h1'>
        <b>Verification Code</b>
    </div>
    <div >
        Please enter the 8 digit verification code <br /> sent to SOMETHING
    </div>
        <form onSubmit={onSubmit}>
            <div className='row justify-content-center mt-5'>
                <input ref={input1} type="text" maxLength='1' className="col-1 m-2 shadow-lg text-center" onChange={handlePress} onKeyDown={fix} /><input ref={input2} type="text" maxLength='1' className="col-1 m-2 shadow-lg  text-center" onChange={handlePress} onKeyDown={fix} /><input ref={input3} type="text" maxLength='1' className="col-1 m-2 shadow-lg  text-center" onChange={handlePress} onKeyDown={fix}/>
                <input ref={input4} type="text" maxLength='1' className="col-1 m-2 shadow-lg  text-center" onChange={handlePress} onKeyDown={fix}/><input ref={input5} type="text" maxLength='1' className="col-1 m-2 shadow-lg  text-center" onChange={handlePress} onKeyDown={fix}/><input ref={input6} type="text" maxLength='1' className="col-1 m-2 shadow-lg  text-center" onChange={handlePress} onKeyDown={fix}/>
            </div>
            <button type='submit' className="btn btn-primary col-6 mt-5">Veryify Now</button>
            <div className='mt-2'>resend code</div>
        </form>
    </div>
}

const MobileLogin = () => {
  const [part, setPart] = useState();
  useEffect(() => {
    setPart(<PartA setPart={setPart} />);
    return;
  }, []);
  return (
    <div className="base d-flex justify-content-center align-items-center">
      <div className="row-6">
        <div className="col text-center">
            <img className='small-logo' src={SmallLogo} />
        </div>
        {part}
      </div>
    </div>
  );
};

export default MobileLogin;
