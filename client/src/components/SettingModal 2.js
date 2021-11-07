import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../contexts/userContext";
import styles from "./styles/NavBar.module.scss";
import AWS from 'aws-sdk'

const SettingModal = () => {
  
  const S3_BUCKET ='go-off.co';
  const REGION ='us-west-1';
  
  
  AWS.config.update({
    accessKeyId: 'AKIA4OTKLUMM5GNJVS6F',
    secretAccessKey: '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'
  })
  
  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
  })
  
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

  const uploadFile = (file) => {

    const params = {
        ACL: 'public-read',
        Body: file,
        Bucket: S3_BUCKET,
        Key: file.name
    };

    myBucket.putObject(params)
        .send((err) => {
            if (err) console.log(err)
        })
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
