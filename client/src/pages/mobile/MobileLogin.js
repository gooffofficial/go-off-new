import React, { useState, useEffect, useRef, useContext } from "react";
import SmallLogo from "../../images/GO_OFF_LOGO.svg";
import "../../styles/mobile/login.css";
import styles from "../../styles/LoginPage/login.module.css";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { routeContext } from "../../contexts/useReroute";
import { UserContext } from "../../contexts/userContext";

const PartA = ({ setPart }) => {
  const { currentLocation, setCurrentLocation } = useContext(routeContext);
  const { fetchData } = useContext(UserContext);
  const history = useHistory();
  const signupbuttonhandler = (events) => {
    events.preventDefault();
    history.push("/Signup");
  };
  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const result = await axios.post(
  //       `${process.env.REACT_APP_NODE_API}/api/users/login`,
  //       {
  //         username: userName,
  //         password: password,
  //       },
  //       { withCredentials: true }
  //     );

  //     const result2 = await axios.post(
  //       `${process.env.REACT_APP_FLASK_API}/login`,
  //       { username: userName, password: password },
  //       { withCredentials: true }
  //     );
  //     history.push("/home");
  //     fetchData();
  //   } catch (e) {
  //     console.log("error logging in: ", e);
  //   }
  // };
  const loginSubmitHandler = (e) => {
    e.preventDefault();

    if (userName === "" || password === "") {
      console.log("Username/Password Required");
      alert("Username/Password Required");
      return;
    }
    axios
      .post(
        `${process.env.REACT_APP_NODE_API}/api/users/login`,
        {
          username: userName,
          password: password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        axios
          .post(
            `${process.env.REACT_APP_FLASK_API}/login`,
            {
              username: userName,
              password: password,
            },
            { withCredentials: true }
          )
          .then((res) => console.log("successsss"))
          .catch((err) => console.log(err));
        console.log(res, "  ", currentLocation);
        if (currentLocation == "/" || currentLocation == "/login") {
          //!#
          history.push("/profile");
          fetchData();
        } else {
          history.push(currentLocation);
        }
      })
      .catch((err) => {
        console.log(`LOGIN ERROR: ${err}`);
      });
  };
  const [check, setChecked] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const userNameInput = useRef();
  const passwordInput = useRef();

  return (
    <>
      <p className={styles["head-text"]}>LOG IN</p>
      <p className={styles["desc-text"]}>Log into your account</p>
      <form onSubmit={loginSubmitHandler} className={styles["field-container"]}>
        <label>
          USERNAME <span className={styles["required"]}>*</span>
        </label>
        <br />
        <input
          type="text"
          className={styles["field-input"]}
          id="username"
          name="username"
          onChange={(e) => setUserName(e.target.value)}
        />
        <br />
        <label>
          PASSWORD <span className={styles["required"]}>*</span>
        </label>
        <br />

        <input
          type="password"
          className={styles["field-input"]}
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <fieldset id="remember" name="remember">
          <input
            type="checkbox"
            style={{ height: 12, width: 12 }}
            id="Male"
            onClick={() => setChecked(!check)}
            checked={check}
            name="gender"
            value="male"
          />
          <label
            style={{
              marginLeft: 10,
              color: "black",
              fontFamily: "Poppins",
              fontSize: 12,
              fontWeight: "normal",
            }}
            for="Male"
          >
            {" "}
            Remember me{" "}
          </label>
        </fieldset>
        <button
          className={styles["submit-button"]}
          onClick={loginSubmitHandler}
        >
          LOG IN
        </button>
        <div style={{ height: 20 }}></div>
        <p className={styles["ques-text"]}>
          Don't have an account?{" "}
          <a className={styles["ques-text"]} onClick={signupbuttonhandler}>
            Sign up here
          </a>
        </p>
      </form>
    </>
  );
};
const PartB = ({ setPart }) => {
  const { currentLocation, setCurrentLocation } = useContext(routeContext);
  const { fetchData } = useContext(UserContext);
  let history = useHistory();
  let count = 1;
  const input1 = useRef();
  const input2 = useRef();
  const input3 = useRef();
  const input4 = useRef();
  const input5 = useRef();
  const input6 = useRef();
  const inputArray = [input1, input2, input3, input4, input5, input6];
  const handlePress = (e) => {
    if (isNaN(e.target.value)) {
      e.target.value = "";
    } else {
      if (count < 6) {
        inputArray[count].current.focus();
        count++;
      }
    }
  };
  //this checks for a backspace
  const handleBack = (e) => {
    if (e.code == "Backspace" && count > 0) {
      e.target.value = "";
      inputArray[count - 1].current.focus();
      count--;
    }
  };
  //this is a solution needed for backspacing to work properly
  const fix = (e) => {
    if (count == 6 && e.code == "Backspace") {
      handleBack(e);
      inputArray[count - 1].current.focus();
      count--;
    } else {
      handleBack(e);
      handleBack(e);
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log(
      e.target[0].value,
      e.target[1].value,
      e.target[2].value,
      e.target[3].value,
      e.target[4].value,
      e.target[5].value
    );
    //history.push('/home') //! need to set this properly
    if (currentLocation == "/" || currentLocation == "/login") {
      history.push("/profile");
      fetchData();
    } else {
      history.push(currentLocation);
    }
  };
  useEffect(() => {
    inputArray[0].current.focus();
  });
  return (
    <div className="text-center">
      <div className="h1">
        <b>Verification Code</b>
      </div>
      <div>
        Please enter the 8 digit verification code <br /> sent to SOMETHING
      </div>
      <form onSubmit={onSubmit}>
        <div className="row justify-content-center mt-5">
          <input
            ref={input1}
            type="text"
            maxLength="1"
            className="col-1 m-2 shadow-lg text-center"
            onChange={handlePress}
            onKeyDown={fix}
          />
          <input
            ref={input2}
            type="text"
            maxLength="1"
            className="col-1 m-2 shadow-lg  text-center"
            onChange={handlePress}
            onKeyDown={fix}
          />
          <input
            ref={input3}
            type="text"
            maxLength="1"
            className="col-1 m-2 shadow-lg  text-center"
            onChange={handlePress}
            onKeyDown={fix}
          />
          <input
            ref={input4}
            type="text"
            maxLength="1"
            className="col-1 m-2 shadow-lg  text-center"
            onChange={handlePress}
            onKeyDown={fix}
          />
          <input
            ref={input5}
            type="text"
            maxLength="1"
            className="col-1 m-2 shadow-lg  text-center"
            onChange={handlePress}
            onKeyDown={fix}
          />
          <input
            ref={input6}
            type="text"
            maxLength="1"
            className="col-1 m-2 shadow-lg  text-center"
            onChange={handlePress}
            onKeyDown={fix}
          />
        </div>
        <button type="submit" className="btn btn-primary col-6 mt-5">
          Veryify Now
        </button>
        <div className="mt-2">resend code</div>
      </form>
    </div>
  );
};

const MobileLogin = () => {
  const [part, setPart] = useState();
  useEffect(() => {
    setPart(<PartA setPart={setPart} />);
    return;
  }, []);
  return (
    <div className="base d-flex justify-content-center align-items-center">
      <div className="row-6" style={{ width: "80%" }}>
        <div className="col ">
          <img height={40} width={40} className="small-logo" src={SmallLogo} />
        </div>
        {part}
      </div>
    </div>
  );
};

export default MobileLogin;
