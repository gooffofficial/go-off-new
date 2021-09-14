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
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SettingModal;
