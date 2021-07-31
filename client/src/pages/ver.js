import React from 'react';
import { sendEmailRegister, sendSMSRegister } from '../api.js';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styles from '../styles/SignupPage/signup.module.css';

const Ver = (props) => {
	const userInfo = useSelector((state) => state.signupreducers.form_values);
	// const { firstname, lastname, email, username, password, birthdate, checkbox, phonenumber, location, gender } = userInfo
	console.log('userInfo: ', userInfo);
	// let serverResponse = await axios.post('http:/localhost:8000/api/users/ecreate')
	let history = useHistory();

	//handle the axios call
	const emailbuttonhandler = (events) => {
		events.preventDefault();
		sendEmailRegister(userInfo);
		history.push('/signup/eauth');
		// axios.post("https://cors-anywhere.herokuapp.com/localhost:8000/api/users/ecreate", JSON.stringify(data)).then(res =>{
		//   console.log(res)
		// }).catch(error =>{
		//   console.log(error)
		// })
	};

	const smsbuttonhandler = async (evt) => {
		evt.preventDefault();
		sendSMSRegister(userInfo);
		history.push('/signup/smsauth');

		// axios.post("https://cors-anywhere.herokuapp.com/localhost:8000/api/users/ecreate", JSON.stringify(data)).then(res =>{
		//   console.log(res)
		// }).catch(error =>{
		//   console.log(error)
		// })
	};

	return (
		<div>
			<div className="whole-container">
				<div className="left-side">
					<div className="left-container">
						<img src="/GO_Off300.png" id="left-logo"></img>
						<span
							className={styles['dot']}
							id="pdot1"
							style={{ background: '#3A86FF', left: '40%' }}
						></span>
						<span
							className={styles['bar']}
							id="pbar1"
							style={{ background: '#3A86FF', left: '40%' }}
						></span>
						<span
							className={styles['dot']}
							id="pdot2"
							style={{ background: '#3A86FF', left: '45%' }}
						></span>
						<span
							className={styles['bar']}
							id="pbar2"
							style={{ background: '#3A86FF', left: '45%' }}
						></span>
						<span
							className={styles['dot']}
							id="pdot3"
							style={{ background: '#3A86FF', left: '50%' }}
						></span>
						<p id="head-text">Verify your account</p>
						<p id="desc-text">Choose your account verification method</p>
						{/* two forms each submit to a different verification form*/}

						<button
							className={styles['verbutton']}
							onClick={emailbuttonhandler}
						>
							<img src="/mail.svg" id="mailbutton"></img>
							<p id="evertext">VERIFY WITH EMAIL</p>
							<p id="evertext2">{userInfo.email}</p>
							<img src="/Arrow.svg" id="rightarrow"></img>
						</button>

						<button className={styles['verbutton']} onClick={smsbuttonhandler}>
							<img src="/Phone.svg" id="phonebutton"></img>
							<p id="svertext">VERIFY WITH SMS</p>
							<p id="svertext2">({userInfo.phonenumber})</p>
							<img src="/Arrow.svg" id="rightarrow"></img>
						</button>
					</div>
					<div className={styles['wave-container']}>
						<img src="/wave_thin.svg" id="wave" />
					</div>
				</div>
				<div className={styles['right-side']}>
					<div className={styles['right-container']}>
						<p id="main-text">Welcome to Go Off!</p>
						<p id="sub-text">A community made for you!</p>
						{/* <img src="/GO_OFF_LOGO.svg" id="logo"/> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Ver;
