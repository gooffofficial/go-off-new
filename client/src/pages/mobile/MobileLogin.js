import React, { useState, useEffect, useRef, useContext } from "react";
import SmallLogo from "../../images/GO_OFF_LOGO.svg";
import "../../styles/mobile/login.css";
import { useHistory } from "react-router-dom";
import axios from 'axios'
import { routeContext } from "../../contexts/useReroute";
import { UserContext } from "../../contexts/userContext";

const PartA = ({setPart}) => {
    const { currentLocation, setCurrentLocation} = useContext(routeContext)
    const {fetchData} = useContext(UserContext)
    const history = useHistory()
    const onSubmit = async(e) => {
        e.preventDefault();
        try{
            const result = await axios.post(`${process.env.REACT_APP_NODE_API}/api/users/login`, 
            {
                username: userName,
                password: password,
            },{withCredentials: true})  

            const result2 = await axios.post(`${process.env.REACT_APP_FLASK_API}/login`,
            {username:userName, password:password},{withCredentials: true})   
    
            //setPart(<PartB setPart={setPart}/>) //! for now just push to login
            /*if(currentLocation == '/' || currentLocation=='/login'){
                history.push('/profile');
                fetchData()
            }else{
                history.push(currentLocation)
            } */
            history.push('/home');
            fetchData()
        }catch(e){
            console.log("error logging in: ",e)
        }
    }
    const [check, setChecked] = useState(false)
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const userNameInput = useRef()
    const passwordInput = useRef()

  return <>
    <div className="h1">
        <b>Log In</b>
    </div>
    <div>Log in to your account</div>
    <form onSubmit={onSubmit} className="mt-5 mb-5">
        <div className="input">
        Username: <input ref={userNameInput} type="text" onChange={(e) => setUserName(e.target.value)}/>
        </div>
        <div className="input">
        Password: <input ref={passwordInput} type="password" onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div className='mt-5'>
            <input type="checkbox" onClick={()=>setChecked(!check)} checked={check} /> <b>Remember me</b>
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
    const { currentLocation, setCurrentLocation} = useContext(routeContext)
    const {fetchData} = useContext(UserContext)
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
        //history.push('/home') //! need to set this properly
        if(currentLocation == '/' || currentLocation=='/login'){
            history.push('/profile');
            fetchData()
        }else{
            history.push(currentLocation)
        } 

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
