import React from 'react'
import styles from '../../styles/SplashPage/splash.module.css';
import BigLogo from '../../images/go-off-logo-big.svg'
import SmallLogo from '../../images/GO_OFF_LOGO.svg'
import { useHistory } from "react-router-dom";

const MobileSplash = () => {
    let history = useHistory()

    return (
        <>
            <div style={{ 'height':'90vh'}} className="d-flex justify-content-center align-items-center">
                <div className="row-6">
                    <div className='text-center mb-5'>
                        <img src={SmallLogo} draggable="false"/>
                    </div>
                    <div className="h1">
                        <b>Join the conversation, Literally</b>
                    </div>
                    <div className='text-center'>
                        Login or Sign up to Join Go Off!
                    </div>
                    <button className="btn btn-primary col-12 mt-5"onClick={()=>history.push('/signup')}>Sign up</button>
                    <button className="btn btn-primary col-12 mt-5" onClick={()=>history.push('/login')}>Login</button>
                </div>
            </div>
        </>
    )
}

export default MobileSplash
