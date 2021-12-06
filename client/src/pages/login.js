import React, { useState, useLayoutEffect, useContext, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import styles from "../styles/LoginPage/login.module.css";
import Logo from "../images/GO_OFF_LOGO.svg";
import Wave from "../images/wave_thin.svg";
import { routeContext } from "../contexts/useReroute";
import { UserContext } from "../contexts/userContext";
import MobileLogin from "./mobile/MobileLogin";
require("dotenv").config();

const Login = (props) => {
  const { fetchData, getCookie, currentUser } = useContext(UserContext);
  const { currentLocation, setCurrentLocation } = useContext(routeContext);
  const [size, setSize] = useState([0, 0]);
  const [loginFormValues, setLoginFormValues] = useState({
    username: "",
    password: "",
  });
  let history = useHistory();

  const signupbuttonhandler = (events) => {
    events.preventDefault();
    history.push("/Signup");
  };
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const loginSubmitHandler = (e) => {
    e.preventDefault();

    if (loginFormValues.username === "" || loginFormValues.password === "") {
      console.log("Username/Password Required");
      return;
    }
    axios
      .post(
        `${process.env.REACT_APP_NODE_API}/api/users/login`,
        {
          username: loginFormValues.username,
          password: loginFormValues.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        axios
          .post(
            `${process.env.REACT_APP_FLASK_API}/login`,
            {
              username: loginFormValues.username,
              password: loginFormValues.password,
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

  const inputHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setLoginFormValues({
      ...loginFormValues,
      [name]: value,
    });
  };

  if (size[0] <= 800) {
    console.log(window.innerWidth);
    return <MobileLogin />;
  }

  return (
    <div>
      <div className={styles["left-side1"]}>
        <div className={styles["left-container1"]}>
          <p className={styles["main-text1"]}>Adventure starts here. </p>
          <p className={styles["sub-text"]}>Log in to join the community</p>
        </div>
      </div>

      <div className={styles["right-side1"]}>
        <div className={styles["right-container1"]}>
          <img src={Logo} className={styles["logo"]} />

          <p className={styles["head-text"]}>LOG IN</p>
          <p className={styles["desc-text"]}>Log into your account</p>

          <form className={styles["field-container"]} id="test-container123">
            <label>
              USERNAME <span className={styles["required"]}>*</span>
            </label>
            <br />
            <input
              type="text"
              className={styles["field-input"]}
              id="username"
              name="username"
              value={loginFormValues.username}
              onChange={inputHandler}
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
              value={loginFormValues.password}
              onChange={inputHandler}
            />
            <br />
            <br />
            <fieldset id="remember" name="remember">
              <input
                type="checkbox"
                style={{ height: 14, width: 14 }}
                id="Male"
                name="gender"
                value="male"
              />
              <label
                style={{
                  marginLeft: 10,
                  color: "black",
                  fontFamily: "Poppins",
                  fontSize: 14,
                  fontWeight: "normal",
                }}
                for="Male"
              >
                {" "}
                Remember me{" "}
              </label>
            </fieldset>
            <input
              type="hidden"
              name="redirectLinkName"
              className={styles["redirectLink"]}
              value=""
            />

            <button
              className={styles["submit-button"]}
              onClick={loginSubmitHandler}
            >
              LOG IN
            </button>
            <div style={{ height: 200 }}></div>
            <p className={styles["ques-text"]}>
              Don't have an account?{" "}
              <a className={styles["ques-text"]} onClick={signupbuttonhandler}>
                Sign up here
              </a>
            </p>
          </form>
        </div>

        <div className={styles["wave-container"]}>
          <img src={Wave} className={styles["wave1"]} />
        </div>
      </div>
    </div>
  );
};

export default Login;
