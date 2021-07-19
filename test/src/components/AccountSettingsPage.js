import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import '../styles/accountSettingsPage.css';

const AccountSettingsPage = ({}) => {
  let history = useHistory();

  const toEditProfilePage = (evt) => {
    history.push("/profile_edit")
  }

  return <div className="accountSettings">
    <ASNavBar />
    <div className="as-content">
      <div className="as-leftContent">
        <button className="as-backBtn">
          <img src="/short_left.svg" className="as-backIcon" alt="" />
          <span className="as-backTxt">BACK</span>
        </button>
        <button onClick={toEditProfilePage} className="as-editProfileBtn">
          <img src="/pencil.svg" className="as-editIcon" alt="" />
          <span className="as-editProfileTxt">EDIT PROFILE</span>
        </button>
        <button className="as-accountSettingsBtn as-selectedBtn">
          <img src="/user_circle.svg" className="as-accountIcon" alt="" />
          <span className="as-accountSettingsTxt">ACCOUNT SETTINGS</span>
        </button>
      </div>
      <div className="as-rightContent">
        <div className="as-headingRow">
          <div className="as-leftHeading">
            <h1 className="as-hTxt">Account Settings</h1>
            <h2 className="as-hDescription">Set your login preferences and personalize your account.</h2>
          </div>
          <div className="as-rightHeading">
            <button className="as-doneBtn">Done</button>
            <button className="as-cancelBtn">Cancel</button>
          </div>
        </div>
        <span className="as-emailLbl">EMAIL</span>
        <input type="email" className="as-emailInpt" />
        <span className="as-passwordLbl">PASSWORD</span>
        <input type="password" className="as-passwordInpt" />
        <span className="as-countryLbl">COUNTRY/REGION</span>
        <input type="text" className="as-countryInpt" />

        <span className="as-genderLbl">GENDER</span>
        <div className="as-maleRow">
          <input type="radio" className="as-maleRadio" />
          <span className="as-maleLbl">MALE</span>
        </div>
        <div className="as-femaleRow">
          <input type="radio" className="as-femaleRadio" />
          <span className="as-femaleLbl">FEMALE</span>
        </div>
        <div className="as-otherRow">
          <input type="radio" className="as-otherRadio" />
          <input type="text" placeholder="OTHER" className="as-otherInpt" />
        </div>
      </div> 
    </div>
  </div>
}

const ASNavBar = ({}) => {
  return <div className="as-navbar">
    <img src="/GO_OFF_LOGO.svg" alt="Go Off Logo" className="as-goOffLogo" />
    <div className="as-searchBox">
      <img src="/search_icon.svg" className="as-searchIcon" alt="Search Icon" />
      <input type="search" className="as-inputSearch" placeholder="Search" />
    </div>
    <div className="as-emptySpace"></div>
    <div className="as-optionsRow">
      <img src="/home.svg" className="as-homeIcon" alt="" />
      <a href="##" className="as-amount">0</a>
      <img src="/plus.svg" alt="" className="as-plus" />
    </div>
    <div className="as-profileRow">
      <img src="https://miro.medium.com/max/316/1*LGHbA9o2BKka2obwwCAjWg.jpeg" className="as-profileAvatar" alt="profileAvatar" />
      <img src="/chevron_down.svg" className="as-arrowDown" alt="" />
    </div>
  </div>
}

export default AccountSettingsPage;