import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from '../styles/LoginPage/login.module.css';
import Logo from '../images/GO_OFF_LOGO.svg';
import Wave from '../images/wave_thin.svg';

const Login = (props) => {
	const [loginFormValues, setLoginFormValues] = useState({
		username: '',
		password: '',
	});
	let history = useHistory();

	const signupbuttonhandler = (events) => {
		events.preventDefault();
		history.push('/Signup');
	};

	const loginSubmitHandler = (e) => {
		e.preventDefault();

		if (loginFormValues.username === '' || loginFormValues.password === '') {
			console.log('Username/Password Required');
			return;
		}

		axios
			.post('/api/users/login', {
				username: loginFormValues.username,
				password: loginFormValues.password,
			})
			.then((res) => {
				history.push('/profile');
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

	return (
		<div>
			<div className={styles['left-side1']}>
				<div className={styles['left-container1']}>
					<p className={styles['main-text1']}>Authentic conversations starts here.</p>
					<p className={styles['sub-text']}>Log in. Be heard.</p>
				</div>
			</div>

			<div className={styles['right-side1']}>
				<div className={styles['right-container1']}>
					<img src={Logo} className={styles['logo']} />

					<p className={styles['head-text']}>LOG IN</p>
					<p className={styles['desc-text']}>Log into your account</p>

					<form className={styles['field-container']} id="test-container123">
						<label>
							USERNAME <span className={styles['required']}>*</span>
						</label>
						<br />
						<input
							type="text"
							className={styles['field-input']}
							id="username"
							name="username"
							value={loginFormValues.username}
							onChange={inputHandler}
						/>
						<br />

						<label>
							PASSWORD <span className={styles['required']}>*</span>
						</label>
						<br />
						<input
							type="password"
							className={styles['field-input']}
							id="password"
							name="password"
							value={loginFormValues.password}
							onChange={inputHandler}
						/>
						<br />
						<br />
						<input
							type="hidden"
							name="redirectLinkName"
							className={styles['redirectLink']}
							value=""
						/>

						<button
							className={styles['submit-button']}
							onClick={loginSubmitHandler}
						>
							LOG IN
						</button>
						<p className={styles['ques-text']}>
							Don't have an account?{' '}
							<button onClick={signupbuttonhandler}>Sign up here</button>
						</p>
					</form>
				</div>

				<div className={styles['wave-container']}>
					<img src={Wave} className={styles['wave1']} />
				</div>
			</div>
		</div>
	);
};

export default Login;
