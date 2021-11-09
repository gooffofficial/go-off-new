import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../contexts/userContext";
import MobileSetting from "../pages/mobile/MobileSetting";
import styles from "./styles/NavBar.module.scss";


const SettingModal = () => {
  
  
  const { modal, setModal, currentUser } = useContext(UserContext);
  let file=useRef()
  const [selectedFile, setSelectedFile] = useState('')

  const onSubmit = (e) => {
    e.preventDefault();
    let row1 = e.target.children[0]
    let row2 = e.target.children[1].children
    const form = {
      name:row2[2].value,
      password:row2[5].value,
      email:row2[8].value,
      phone:row2[11].value,
      picture:selectedFile,
    }
    console.log(form, selectedFile)
  };

  const handleFileInput = (e) => {
    console.log(e.target.files)
    setSelectedFile(e.target.files[0]);
}

  useEffect(() => {
    return () => {};
  }, [modal]);
  return (
    <>
      {modal ? (
                <div className={styles.settingModal}>
                <div className="card shadow-lg container">
                  <div className="card-body">
                    <h4 className="card-title text-muted">Account Settings</h4>
                    <br />
                    <h6 className="card-subtitle mb-2">
                    Users on Go Off will be able see the information provided below
                    </h6>
                    <br />
                    <form onSubmit={onSubmit}>
                      {/* 
                      <div className="row w-100">
                        
                        <div className="col-4">
                          <img
                            src={currentUser.propic}
                            className="w-75 rounded-circle"
                            alt="profile picture"
                          />
                        </div>
                        
                        <div className="col-8"> 
                        <span className='row h-25'></span>
                        <input onChange={handleFileInput} type="file" hidden ref={file} />
                          <div className='btn btn-primary row' onClick={()=>file.current.click()}><i className="bi bi-upload h1" /> upload profile picture</div>
                        </div>
                        <div className="invisible">
                      </div>
                      */}
                    <div className="container">
                      <div className="row">
                        <label className="col-3 p-1" htmlFor="name">
                        <p className={styles.acctSettingsText}>USER NAME</p>
                        </label>
                      </div>
                      <div className="row">
                        <input className="col-3 p-1" name="name" type="text" placeholder='John Smith'/>
                      </div>
                      <div className="row">
                        <div className="line23"/>
                      </div>
                      
                      <br />
      
                      <div className="row">
                        <label className="col-3 p-1" htmlFor="password">
                        <p className={styles.acctSettingsText}>PASSWORD</p>
                        </label>
                      </div>
                      <div className="row">
                          <input className="col-3 p-1" name="password" type="password" placeholder='Password123!'/>
                        <div className="col-6">
                          <button type="submit" className={styles.acctSettingsButtonPass}> 
                          Change Password
                          </button>
                        </div>
                      </div>
                      
                      <br />
      
                      <div className="row">
                        <label className="col-3 p-1" htmlFor="email">
                        <p className={styles.acctSettingsText}>EMAIL</p>
                        </label>
                      </div>
                      <div className="row">
                        <input className="col-3 p-1" name="email" type="email" placeholder='jSmith@gmail.com' />
                      </div>
      
                      <br />
      
                      <div className="row">
                        <label className="col-3 p-1" htmlFor="phone">
                          <p className={styles.acctSettingsText}>PHONE</p>
                        </label>
                      </div>
                      <div className="row">
                        <input className="col-3 p-1" name="phone" type="text" placeholder='+123-456-7890' />
                      </div>
      
                      <br />
      
                    </div>
                      <p className="card-text">
                        Delete Account
                      </p>
                      <button type="button" className={styles.acctSettingsButton}>
                        Delete
                      </button>
                      <br />
                      <br />
                      <br />
      
                      <button type="submit" className={styles.acctSettingsButton}>
                        Cancel
                      </button>
                      
                      &nbsp;
      
                      <span className="w-25"> </span>
                      <button
                        className={styles.acctSettingsButtonSave}
                        onClick={() => setModal((p) => !p)}>
                        Save
                      </button>
                    </form>
                  </div>
                </div>
              </div>
        ) : (
          <></>
          )}
    </>
  );
};

export default SettingModal;
/*<div className={styles.settingModal}>
          <div className="card shadow-lg">
            <div className="card-body">
              <h5 className="card-title">Settings</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                update your settings
              </h6>
              <form onSubmit={onSubmit}>
                <div className="row w-100">
                  <div className="col-4">
                    <img
                      src={currentUser.propic}
                      className="w-75 rounded-circle"
                      alt="profile picture"
                    />
                  </div>
                  <div className="col-8"> 
                  <span className='row h-25'></span>
                  <input onChange={handleFileInput} type="file" hidden ref={file} />
                    <div className='btn btn-primary row' onClick={()=>file.current.click()}><i className="bi bi-upload h1" /> upload profile picture</div>
                  </div>
                </div>
                <div className="row">
                  <br />
                  <label className="col-3 p-1" htmlFor="name">
                    Name
                  </label>
                  <input className="col-3 p-1" name="name" type="text" placeholder='Emily Paterson' />
                  <br />
                  <label className="col-3 p-1" htmlFor="password">
                    Password
                  </label>
                  <input  className="col-3 p-1" name="password" type="password" placeholder='Something good' />
                  <br />
                  <label className="col-3 p-1" htmlFor="email">
                    Email
                  </label>
                  <input  className="col-3 p-1" name="email" type="email" placeholder='Emily@email.com' />
                  <br />
                  <label className="col-3 p-1" htmlFor="phone">
                    Phone
                  </label>
                  <input  className="col-3 p-1" name="phone" type="text" placeholder='+1123-456-7890' />
                </div>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>

                <button type="submit" className="btn btn-primary">
                  save
                </button>
                <span className="w-25"> </span>
                <button
                  className="btn btn-danger"
                  onClick={() => setModal((p) => !p)}
                >
                  cancel
                </button>
              </form>
            </div>
          </div>
        </div>*/