import React, { useState, useEffect } from "react";
import SmallLogo from "../../images/GO_OFF_LOGO.svg";
import "../../styles/mobile/signup.css";

const PartA = ({setPart, setLoading}) => {
    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(66)
        setPart(<PartB setPart={setPart} setLoading={setLoading}/>)
    }
  return (
    <>
      <div className="h1">
        <b>Sign Up</b>
      </div>
      <div>Create a new account</div>
      <form onSubmit={onSubmit} className="mt-5 mb-5">
        <div className="input">
          Full Name: <input type="text" />
        </div>
        <div className="input">
          Email: <input type="email" />
        </div>
        <div className="input">
          Username: <input type="text" />
        </div>
        <div className="input">
          Password: <input type="password" />
        </div>
        <div className="input">
          Date of Birth: <input type="date" />
        </div>
        <div className='mt-5'>
            Agree to <b>Terms of Service & Privacy Policy</b>
        </div>
        <div>
            <button type='submit' className="btn btn-primary col-12"> Sign up</button>
        </div>
        <div>Already have an account? log in here.</div>
      </form>
    </>
  );
};

const PartB = ({setPart, setLoading}) => {
    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(100)
        setPart(<PartC setPart={setPart}/>)
    }
  return <>
    <div className="h1">
        <b>Complete your profile</b>
    </div>
    <div>Almost there, we just need a few more details!</div>
    <form onSubmit={onSubmit} className="mt-5 mb-5">
        <div className="input">
        Phone Number: <input type="text" placeholder='+1(000)-000-0000' />
        </div>
        <div className="input">
        Location: <input type="text" placeholder='city,State' />
        </div>
        <div className="input">
        Pronouns: <select name="pronoun">
            <option value="">Choose One</option>
            <option value="male">He/Him</option>
            <option value="female">She/Her</option>
            <option value="they">They/Them</option>
            <option value="other">Other</option>
        </select>
        </div>
        <div className='mt-5'>
            <button type='submit' className="btn btn-primary col-12"> Save and Continue</button>
        </div>
    </form>
  </>;
};

const PartC = ({setPart}) => {
  return <>
    <div className="h1">
        <b>Verify your account</b>
    </div>
    <div>Choose your account verification method</div>
    <div style={{ 'width':'60vw'}}>
        <button className="btn btn-primary mt-5 col-12">Verify with email</button>
        <button className="btn btn-primary mt-5 col-12">Verify with sms</button>
    </div>
  </>;
};

const MobileSignup= () => {
  const [part, setPart] = useState();
  const [loading, setLoading] = useState(33)
  useEffect(() => {
      setPart(<PartA setPart={setPart} setLoading={setLoading}/>)
    return;
  }, []);
  return (
    <div className="base d-flex justify-content-center align-items-center">
      <div className="row-6">
        <div className="row">
            <div className="col-3">
            <img className="small-logo" src={SmallLogo} draggable="false" />
            </div>
            <div className="col d-flex">
            <progress
                className="uk-progress align-self-center"
                value={`${loading}`}
                max="100"
            ></progress>
            </div>
        </div>
        {
            part
        }
      </div>
    </div>
  );
};



export default MobileSignup;
