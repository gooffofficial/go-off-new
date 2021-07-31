import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from '../styles/LoginPage/login.css';
const Login = (props) => {
	let history = useHistory();

	const signupbuttonhandler = (events) => {
		events.preventDefault();
		history.push('/Profile');
	};

	return (
		<div>
			<div classNameName={styles['left-side1']}>
				<div classNameName={styles['left-container1']}>
					<p id="main-text1">Adventure starts here.</p>
					<p id="sub-text">Log in to join the community</p>
				</div>
			</div>

			<div className={styles['right-side1']}>
				<div className={styles['right-container1']}>
					<img src="/GO_OFF_LOGO.svg" id="logo" />

					<p id="head-text">LOG IN</p>
					<p id="desc-text">Log into your account</p>

					<form
						action="/api/users/login"
						method="post"
						className={styles['field-container']}
						id="test-container123"
					>
						<label>
							USERNAME <span className={styles['required']}>*</span>
						</label>
						<br />
						<input
							type="text"
							className={styles['field-input']}
							id="username"
							name="username"
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
						/>
						<br />
						<br />
						<input
							type="hidden"
							name="redirectLinkName"
							id="redirectLink"
							value=""
						/>

						<button type="submit" id="submit-button">
							LOG IN
						</button>
						<p id="ques-text">
							Don't have an account?{' '}
							<button onClick={signupbuttonhandler}>Sign up here</button>
						</p>
					</form>
				</div>

				<div className={styles['wave-container']}>
					<img src="/wave_thin.svg" id="wave1" />
				</div>
			</div>
		</div>
	);
};

export default Login;
