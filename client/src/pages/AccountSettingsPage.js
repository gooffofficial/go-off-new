import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from '../styles/AccountSettingsPage/accountSettingsPage.module.css';
import Left from '../images/short_left.svg'
import Pencil from '../images/pencil.svg'
import Circle from '../images/user_circle.svg'
import Logo from '../images/GO_OFF_LOGO.svg'
import Search from '../images/search_icon.svg'
import Home from '../images/home.svg'
import Plus from '../images/plus.svg'
import Down from '../images/chevron_down.svg'

const AccountSettingsPage = ({}) => {
  let history = useHistory();

  const toEditProfilePage = (evt) => {
    history.push("/editprofile")
  }

  return <div className={styles.accountSettings}>
    <ASNavBar />
    <div className={styles["as-content"]}>
      <div className={styles["as-leftContent"]}>
        <button className={styles["as-backBtn"]}>
          <img src={Left} className={styles["as-backIcon"]} alt="" />
          <span className={styles["as-backTxt"]}>BACK</span>
        </button>
        <button onClick={toEditProfilePage} className={styles["as-editProfileBtn"]}>
          <img src={Pencil} className={styles["as-editIcon"]} alt="" />
          <span className={styles["as-editProfileTxt"]}>EDIT PROFILE</span>
        </button>
        <button className={styles["as-accountSettingsBtn as-selectedBtn"]}>
          <img src={Circle} className={styles["as-accountIcon"]} alt="" />
          <span className={styles["as-accountSettingsTxt"]}>ACCOUNT SETTINGS</span>
        </button>
      </div>
      <div className={styles["as-rightContent"]}>
        <div className={styles["as-headingRow"]}>
          <div className={styles["as-leftHeading"]}>
            <h1 className={styles["as-hTxt"]}>Account Settings</h1>
            <h2 className={styles["as-hDescription"]}>Set your login preferences and personalize your account.</h2>
          </div>
          <div className={styles["as-rightHeading"]}>
            <button className={styles["as-doneBtn"]}>Done</button>
            <button className={styles["as-cancelBtn"]}>Cancel</button>
          </div>
        </div>
        <span className={styles["as-emailLbl"]}>EMAIL</span>
        <input type="email" className={styles["as-emailInpt"]} />
        <span className={styles["as-passwordLbl"]}>PASSWORD</span>
        <input type="password" className={styles["as-passwordInpt"]} />
        <span className={styles["as-countryLbl"]}>COUNTRY/REGION</span>
        <input type="text" className={styles["as-countryInpt"]} />

        <span className={styles["as-genderLbl"]}>GENDER</span>
        <div className={styles["as-maleRow"]}>
          <input type="radio" className={styles["as-maleRadio"]} />
          <span className={styles["as-maleLbl"]} >MALE</span>
        </div>
        <div className={styles["as-femaleRow"]}>
          <input type="radio" className={styles["as-femaleRadio"]} />
          <span className={styles["as-femaleLbl"]}>FEMALE</span>
        </div>
        <div className={styles["as-otherRow"]}>
          <input type="radio" className={styles["as-otherRadio"]} />
          <input type="text" placeholder="OTHER" className={styles["as-otherInpt"]} />
        </div>
      </div> 
    </div>
  </div>
}

const ASNavBar = ({}) => {
  return <div className={styles["as-navbar"]}>
    <img src={Logo} alt="Go Off Logo" className={styles["as-goOffLogo"]} />
    <div className="as-searchBox">
      <img src={Search} className={styles["as-searchIcon"]} alt="Search Icon" />
      <input type="search" className={styles["as-inputSearch"]} placeholder="Search" />
    </div>
    <div className={styles["as-emptySpace"]}></div>
    <div className={styles["as-optionsRow"]}>
      <img src={Home} className={styles["as-homeIcon"]} alt="" />
      <a href="##" className={styles["as-amount"]}>0</a>
      <img src={Plus} alt="" className={styles["as-plus"]} />
    </div>
    <div className={styles["as-profileRow"]}>
      <img src="https://miro.medium.com/max/316/1*LGHbA9o2BKka2obwwCAjWg.jpeg" className={styles["as-profileAvatar"]} alt="profileAvatar" />
      <img src={Down} className={styles["as-arrowDown"]} alt="" />
    </div>
  </div>
}

export default AccountSettingsPage;
