import React from 'react'
import styles from '../../styles/SplashPage/splash.module.css';
import BigLogo from '../../images/go-off-logo-big.svg'
import SmallLogo from '../../images/GO_OFF_LOGO.svg'
import { useHistory } from "react-router-dom";

const MobileSplash = () => {
    let history = useHistory()

    return (
        <>
            <div style={{ 'height':'90vh',width:"80%",marginLeft:"10%"}} className="d-flex justify-content-center align-items-center">
                <div className="row-6">
                    <div className='text-center mb-5'>
                        <img width="70px"  src={SmallLogo} draggable="false"/>
                    </div>
                    <div className="h1" style={{textAlign:"center",letterSpacing:-1,fontFamily:"Poppins",fontSize:"24px",fontWeight:"bold"}} >
                      Join the conversation, Literally
                    </div>
                    <div className='text-center' style={{fontSize:"10px",marginBottom:60,opacity:"40%",fontFamily:"Poppins"}} >
                        Login or Sign up to Join Go Off!
                    </div>
                    <button className="btn btn-primary col-12 mt-5" style={{height:35,background: 'linear-gradient(171.72deg, #3A86FF 24.63%, #3A71FF 93.65%)',boxShadow: '0px 1px 15px rgba(58, 134, 255, 0.25)',border: 0,outline: 0, fontFamily:"Poppins",fontSize:"10px",fontWeight:"bold"}} onClick={()=>history.push('/login')}>LOGIN</button>
                    <button className="btn btn-primary col-12 mt-4" style={{height:35,background: 'linear-gradient(171.72deg, #3A86FF 24.63%, #3A71FF 93.65%)',boxShadow: '0px 1px 15px rgba(58, 134, 255, 0.25)',border: 0,outline: 0, fontFamily:"Poppins",fontSize:"10px",fontWeight:"bold"}} onClick={()=>history.push('/signup')}>SIGN UP</button>
                </div>
            </div>
        </>
    )
}

export default MobileSplash
