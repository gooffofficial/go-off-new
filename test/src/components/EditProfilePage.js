import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import '../styles/editProfile.css';

const EditProfilePage = ({}) => {
  let history = useHistory();

  const toAccountSettingsPage = (evt) => {
    history.push("/account_settings")
  }

  return <div className="editProfile">
    <EPNavBar />
    <div className="ep-content">
      <div className="ep-leftContent">
        <button className="ep-backBtn">
          <img src="/short_left.svg" className="ep-backIcon" alt="" />
          <span className="ep-backTxt">BACK</span>
        </button>
        <button className="ep-editProfileBtn ep-selectedBtn">
          <img src="/pencil.svg" className="ep-editIcon" alt="" />
          <span className="ep-editProfileTxt">EDIT PROFILE</span>
        </button>
        <button onClick={toAccountSettingsPage} className="ep-accountSettingsBtn">
          <img src="/user_circle.svg" className="ep-accountIcon" alt="" />
          <span className="ep-accountSettingsTxt">ACCOUNT SETTINGS</span>
        </button>
      </div>
      <div className="ep-rightContent">
        <div className="ep-headingRow">
          <div className="ep-leftHeading">
            <h1 className="ep-hTxt">Edit Profile</h1>
            <h2 className="ep-hDescription">Users will be able to view the information provided.</h2>
          </div>
          <div className="ep-rightHeading">
            <button className="ep-doneBtn">Done</button>
            <button className="ep-cancelBtn">Cancel</button>
          </div>
        </div>
        <div className="ep-profImgRow">
          <div className="ep-leftProfImg">
            <h3 className="ep-profImgTxt">PROFILE IMAGE</h3>
            <img alt="" className="ep-profImg" />
          </div>
          <div className="ep-rightProfImg">
            <button className="ep-chooseFileBtn">Choose File</button>
            <span className="ep-fileName">No file chosen</span>
          </div>
        </div>
        <div className="ep-namesRow">
          <div className="ep-leftnames">
            <span className="ep-fNameLbl">FIRST NAME</span>
            <input type="text" className="ep-fNameInpt" />
          </div>
          <div className="ep-rightnames">
            <span className="ep-lNameLbl">LAST NAME</span>
            <input type="text" className="ep-lNameInpt" />
          </div>
        </div>
        <span className="ep-bioLabel">BIO</span>
        <textarea className="ep-bioTextArea" />
      </div>
    </div>
  </div>
}

const EPNavBar = ({}) => {
  return <div className="ep-navbar">
    <img src="/GO_OFF_LOGO.svg" alt="Go Off Logo" className="ep-goOffLogo" />
    <div className="ep-searchBox">
      <img src="/search_icon.svg" className="ep-searchIcon" alt="Search Icon" />
      <input type="search" className="ep-inputSearch" placeholder="Search" />
    </div>
    <div className="ep-emptySpace"></div>
    <div className="ep-optionsRow">
      <img src="/home.svg" className="ep-homeIcon" alt="" />
      <a href="##" className="ep-amount">0</a>
      <img src="/plus.svg" alt="" className="ep-plus" />
    </div>
    <div className="ep-profileRow">
      <img src="https://miro.medium.com/max/316/1*LGHbA9o2BKka2obwwCAjWg.jpeg" className="ep-profileAvatar" alt="profileAvatar" />
      <img src="/chevron_down.svg" className="ep-arrowDown" alt="" />
    </div>
  </div>
}

export default EditProfilePage;