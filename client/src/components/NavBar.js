import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styles from './styles/NavBar.module.scss';
import { useHistory } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import axios from 'axios';

const NavBar = (props) => {
	const { name, avatarSource, host, admin = "" } = props;

	const [searchInput, setSearchInput] = useState('');
	const [isFetched, setIsFetched] = useState(false);
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [suggestionsHider, setSuggestionsHider] = useState('');
	const history = useHistory();

  const goToHomePage = (evt) => {
	let isHost = host === "(Host)";
	let isAdmin = admin === "(Host)";
	if (isHost | isAdmin)
      history.push('/hosthome')
    else 
      history.push('/home')
  }

	// this.state = {
	// 	displayMenu: false,
	// };

	// const showDropdownMenu = this.showDropdownMenu.bind(this);
	// const hideDropdownMenu = this.hideDropdownMenu.bind(this);

	

	// const showDropdownMenu = (event) => {
	// 	event.preventDefault();
	// 	this.setState({ displayMenu: true }, () => {
	// 		document.addEventListener('click', this.hideDropdownMenu);
	// 	});
	// };

	// const hideDropdownMenu = () => {
	// 	this.setState({ displayMenu: false }, () => {
	// 		document.removeEventListener('click', this.hideDropdownMenu);
	// 	});
	// };

	useEffect(() => {
		if (searchInput.length && isFetched === false) {
			axios
				.get('/api/users/all')
				.then((res) => {
					setIsFetched(true);
					setUsers(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [searchInput, isFetched]);

	useEffect(() => {
		setFilteredUsers(
			searchInput === ''
				? []
				: users.filter((user) => user.username.startsWith(searchInput))
		);
	}, [searchInput, users]);

	useEffect(() => {
		if (filteredUsers.length === 0) {
			setSuggestionsHider(`${styles.hide}`);
		}

		if (filteredUsers.length) {
			setSuggestionsHider(``);
		}
	}, [filteredUsers]);

	const inputHandler = (e) => {
		setSearchInput(e.target.value);
	};

	const usernameClickHandler = (e) => {
		// e.preventDefault();

		const username = e.target.innerHTML;
		setSuggestionsHider(`${styles.hide}`);
		setSearchInput('');
		history.push(`/profile/${username}`);
	};

	const logoutHandler = (e) => {
		e.preventDefault();

		axios.get('/api/users/logout').then((res) => history.push('/'));
	};

	return (
		<div className={styles.NavBarContainer}>
			<div className={styles.logo} onClick={goToHomePage}>
				<svg
					width="65"
					height="58"
					viewBox="0 0 150 143"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M61.2235 0.990251C35.5465 5.52275 14.0195 22.6168 4.71951 45.8593C3.59101 48.6788 2.07201 53.5163 1.34351 56.6093C0.174515 61.5743 0.0170155 63.2868 0.00051555 71.2328C-0.0194844 81.0588 0.533015 84.7368 3.30602 93.2308C11.4575 118.199 34.2795 137.334 61.449 141.979C69.33 143.326 80.0405 143.339 87.8095 142.011C109.999 138.217 129.534 124.902 140.208 106.296C147.168 94.1628 150.185 81.8558 149.538 68.2328C147.951 34.7818 122.407 6.86925 87.998 0.986751C80.2935 -0.330249 68.696 -0.328749 61.2235 0.990251ZM125.632 37.3388C127.465 38.7078 128.054 41.0228 127.293 43.8688C126.959 45.1188 124.785 50.5803 122.464 56.0048C120.142 61.4298 116.751 69.6628 114.928 74.3008C113.104 78.9383 111.468 82.8878 111.293 83.0768C111.117 83.2663 109.886 83.1878 108.557 82.9023C106.271 82.4118 106.158 82.3123 106.476 81.0583C107.137 78.4508 108.755 69.5478 110.713 57.7368C113.482 41.0363 114.436 38.2493 117.922 36.6698C119.99 35.7328 123.94 36.0758 125.632 37.3388ZM76.2515 38.4223C78.0545 38.9948 80.8435 40.3838 82.45 41.5088C85.67 43.7643 85.3325 43.8738 87.563 39.8578L88.8825 37.4828H92.803C94.9595 37.4828 96.7175 37.5388 96.71 37.6078C96.7025 37.6768 95.1555 43.0203 93.2715 49.4828L89.8465 61.2328L86.285 61.3798L82.7235 61.5268L82.7175 60.1298C82.7145 59.3613 82.408 57.6078 82.0365 56.2328C79.797 47.9378 75.518 44.2218 67.529 43.6333C54.119 42.6458 43.0315 51.9568 39.1575 67.4583C38.304 70.8733 38.15 72.6488 38.3555 76.7083C38.6865 83.2563 39.7015 85.9373 43.2235 89.5663C46.654 93.1003 49.893 94.2318 55.5435 93.8693C63.902 93.3328 70.613 87.6388 74.051 78.1678L75.207 74.9828H68.715C64.117 74.9828 62.2235 74.8133 62.2235 74.4018C62.2235 74.0823 62.602 72.6198 63.065 71.1518L63.906 68.4828H80.815C94.477 68.4828 97.7235 68.6093 97.7235 69.1418C97.7235 69.5048 97.3775 70.9673 96.954 72.3918L96.185 74.9828H91.4755H86.7665L85.214 80.1078C84.3605 82.9263 83.352 86.2453 82.9735 87.4828C82.595 88.7203 81.5865 92.0393 80.733 94.8578L79.1805 99.9828H75.5165H71.8525L71.512 96.5228L71.171 93.0628L67.9885 95.4713C59.355 102.006 46.366 102.764 37.0065 97.2783C34.2005 95.6343 30.094 91.1808 28.5205 88.0758C23.524 78.2158 25.377 63.8313 32.9775 53.4773C38.858 45.4663 48.8765 39.3243 59.088 37.4698C63.1625 36.7298 72.5645 37.2513 76.2515 38.4223ZM108.684 88.7753C111.157 89.7648 112.224 91.3488 112.224 94.0313C112.224 99.2328 107.055 102.388 101.997 100.275C99.4915 99.2278 98.548 97.4873 98.8395 94.4513C99.3155 89.4963 103.892 86.8578 108.684 88.7753Z"
						fill="#3A86FF"
					/>
				</svg>
			</div>
			<div className={styles.searchTab}>
				<div className={styles.iconContainer}>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M5 11C5 7.691 7.691 5 11 5C14.309 5 17 7.691 17 11C17 14.309 14.309 17 11 17C7.691 17 5 14.309 5 11ZM20.707 19.293L17.312 15.897C18.365 14.543 19 12.846 19 11C19 6.589 15.411 3 11 3C6.589 3 3 6.589 3 11C3 15.411 6.589 19 11 19C12.846 19 14.543 18.365 15.897 17.312L19.293 20.707C19.488 20.902 19.744 21 20 21C20.256 21 20.512 20.902 20.707 20.707C21.098 20.316 21.098 19.684 20.707 19.293Z"
							fill="#757D8A"
						/>
					</svg>
				</div>

				<input
					placeholder="Search Go Off! Hosts"
					type="text"
					value={searchInput}
					onChange={inputHandler}
				/>

				<div className={styles.iconContainer}>
					{/* <svg
						className={styles.navOptionsIcon}
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M11 19C10.448 19 10 18.552 10 18C10 17.448 10.448 17 11 17C11.552 17 12 17.448 12 18C12 18.552 11.552 19 11 19ZM21 17H13.815C13.401 15.839 12.302 15 11 15C9.698 15 8.599 15.839 8.185 17H3C2.447 17 2 17.447 2 18C2 18.553 2.447 19 3 19H8.185C8.599 20.161 9.698 21 11 21C12.302 21 13.401 20.161 13.815 19H21C21.553 19 22 18.553 22 18C22 17.447 21.553 17 21 17ZM19 13C18.448 13 18 12.552 18 12C18 11.448 18.448 11 19 11C19.552 11 20 11.448 20 12C20 12.552 19.552 13 19 13ZM19 9C17.698 9 16.599 9.839 16.185 11H3C2.447 11 2 11.447 2 12C2 12.553 2.447 13 3 13H16.185C16.599 14.161 17.698 15 19 15C20.654 15 22 13.654 22 12C22 10.346 20.654 9 19 9ZM7 5C7.552 5 8 5.448 8 6C8 6.552 7.552 7 7 7C6.448 7 6 6.552 6 6C6 5.448 6.448 5 7 5ZM3 7H4.185C4.599 8.161 5.698 9 7 9C8.302 9 9.401 8.161 9.815 7H21C21.553 7 22 6.553 22 6C22 5.447 21.553 5 21 5H9.815C9.401 3.839 8.302 3 7 3C5.698 3 4.599 3.839 4.185 5H3C2.447 5 2 5.447 2 6C2 6.553 2.447 7 3 7Z"
							fill="#757D8A"
						/>
					</svg> */}
				</div>

				<div className={`${styles.suggestionsContainer} ${suggestionsHider}`}>
					<div className={styles.suggestionTab} onClick={usernameClickHandler}>
						<p className={styles.suggestionText}>
							{filteredUsers[0] ? filteredUsers[0].username : ''}
						</p>
					</div>

					<div className={styles.suggestionTab} onClick={usernameClickHandler}>
						<p className={styles.suggestionText}>
							{filteredUsers[1] ? filteredUsers[1].username : ''}
						</p>
					</div>

					<div className={styles.suggestionTab} onClick={usernameClickHandler}>
						<p className={styles.suggestionText}>
							{filteredUsers[2] ? filteredUsers[2].username : ''}
						</p>
					</div>
				</div>
			</div>

			<div className={styles.menuIcons}>
				{/* <div className={styles.iconContainer}>
					<svg
						width="35"
						height="35"
						viewBox="0 0 35 35"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M14.5833 7.29167C16.1919 7.29167 17.5 8.59979 17.5 10.2083C17.5 11.8169 16.1919 13.125 14.5833 13.125C12.9748 13.125 11.6667 11.8169 11.6667 10.2083C11.6667 8.59979 12.9748 7.29167 14.5833 7.29167ZM14.5833 16.0417C17.8004 16.0417 20.4167 13.4254 20.4167 10.2083C20.4167 6.99125 17.8004 4.375 14.5833 4.375C11.3662 4.375 8.75 6.99125 8.75 10.2083C8.75 13.4254 11.3662 16.0417 14.5833 16.0417ZM14.5833 18.9583C8.95562 18.9583 4.375 23.5375 4.375 29.1667C4.375 29.9717 5.02688 30.625 5.83333 30.625C6.63979 30.625 7.29167 29.9717 7.29167 29.1667C7.29167 25.146 10.5627 21.875 14.5833 21.875C18.604 21.875 21.875 25.146 21.875 29.1667C21.875 29.9717 22.5269 30.625 23.3333 30.625C24.1398 30.625 24.7917 29.9717 24.7917 29.1667C24.7917 23.5375 20.211 18.9583 14.5833 18.9583ZM29.1667 8.75H30.625C31.4271 8.75 32.0833 9.40625 32.0833 10.2083C32.0833 11.0104 31.4271 11.6667 30.625 11.6667H29.1667V13.125C29.1667 13.9271 28.5104 14.5833 27.7083 14.5833C26.9063 14.5833 26.25 13.9271 26.25 13.125V11.6667H24.7917C23.9896 11.6667 23.3333 11.0104 23.3333 10.2083C23.3333 9.40625 23.9896 8.75 24.7917 8.75H26.25V7.29167C26.25 6.48958 26.9063 5.83333 27.7083 5.83333C28.5104 5.83333 29.1667 6.48958 29.1667 7.29167V8.75Z"
							fill="#757D8A"
						/>
					</svg>
				</div> */}

				{/* <div className={styles.iconContainer}>
					<svg
						width="35"
						height="35"
						viewBox="0 0 35 35"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M8.0421 23.3333L9.76293 21.6096C10.3142 21.0583 10.6175 20.3263 10.6175 19.5475V12.7269C10.6175 10.7479 11.4779 8.85646 12.98 7.54104C14.4938 6.21396 16.4217 5.63063 18.4298 5.89458C21.8233 6.34521 24.3827 9.41354 24.3827 13.0331V19.5475C24.3827 20.3263 24.6861 21.0583 25.2358 21.6081L26.9581 23.3333H8.0421ZM20.4161 26.7473C20.4161 28.0583 19.0802 29.1667 17.4994 29.1667C15.9186 29.1667 14.5827 28.0583 14.5827 26.7473V26.25H20.4161V26.7473ZM29.9258 22.1783L27.2994 19.5475V13.0331C27.2994 7.95667 23.6506 3.64438 18.8119 3.00417C16.009 2.63083 13.1798 3.48688 11.0579 5.34771C8.92293 7.21729 7.70085 9.90646 7.70085 12.7269L7.69939 19.5475L5.07293 22.1783C4.38897 22.8638 4.18627 23.8831 4.55668 24.7771C4.92856 25.6725 5.79335 26.25 6.76168 26.25H11.6661V26.7473C11.6661 29.6902 14.2823 32.0833 17.4994 32.0833C20.7165 32.0833 23.3327 29.6902 23.3327 26.7473V26.25H28.2371C29.2054 26.25 30.0688 25.6725 30.4392 24.7785C30.8111 23.8831 30.6098 22.8623 29.9258 22.1783Z"
							fill="#757D8A"
						/>
					</svg>
				</div> */}

				{/* <div className={styles.iconContainer} onClick={logoutHandler}>
					<svg
						width="35"
						height="35"
						viewBox="0 0 35 35"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M21.875 26.0136L19.1683 17.8951L27.2883 9.77361L21.875 26.0136ZM25.2262 7.71152L17.1062 15.8315L8.98621 13.1249L25.2262 7.71152ZM32.0687 4.29902C32.0614 4.1634 32.0366 4.03215 31.9914 3.90527C31.9768 3.86007 31.9608 3.81632 31.9404 3.77257C31.8704 3.61652 31.7814 3.46923 31.656 3.34382C31.5306 3.2184 31.3833 3.12944 31.2258 3.05944C31.1835 3.03902 31.1412 3.02298 31.096 3.0084C30.9662 2.96319 30.8335 2.93694 30.695 2.92965C30.6629 2.92819 30.6337 2.9209 30.6002 2.9209C30.4543 2.92382 30.307 2.94423 30.1641 2.9909L3.91413 11.7409C3.31767 11.9407 2.91663 12.4963 2.91663 13.1249C2.91663 13.7534 3.31767 14.3105 3.91413 14.5088L16.3464 18.6534L20.4925 31.0871C20.6908 31.6821 21.2464 32.0832 21.875 32.0832C22.5035 32.0832 23.0591 31.6821 23.2575 31.0871L32.0075 4.83715C32.0541 4.69277 32.076 4.54694 32.0775 4.40111C32.0789 4.36611 32.0702 4.33402 32.0687 4.29902Z"
							fill="#757D8A"
						/>
					</svg>
				</div> */}
			</div>

			{/* <Dropdown 
				options={options}  
				value={defaultOption} 
				// onChange={this._onSelect}
				placeholder={name ? name : '<pass in name>'}
				className={styles.loginInfo}
				placeholderClassName={styles.navUserText}
				arrowClassName={styles.navArrowContainer}
			/> */}
			<div
				className={styles.loginInfo}
				onClick={() => history.push('/profile')}
			>
				{/* { displayMenu ? (
          			<ul>
						<li><a className="active" href="#Create Page">Create Page</a></li>
						<li><a href="#Manage Pages">Manage Pages</a></li>
						<li><a href="#Create Ads">Create Ads</a></li>
						<li><a href="#Manage Ads">Manage Ads</a></li>
						<li><a href="#Activity Logs">Activity Logs</a></li>
						<li><a href="#Setting">Setting</a></li>
						<li><a href="#Log Out">Log Out</a></li>
					</ul>
					):
					(
						null
					)
				} */}
				<img
					className={styles.navUserImage}
					src={avatarSource ? avatarSource : '/images/stock-face.jpg'}
					width="24px"
					height="24px"
					alt="avatar"
				/>
				<p className={styles.navUserText}>{name ? name : '<pass in name>'}</p>

				<div className={styles.navArrowContainer}>
					{/* <svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g id=" Outline / arrow-ios-down">
							<path
								id="Verctor"
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M12 16C11.772 16 11.545 15.923 11.36 15.768L5.36003 10.768C4.93603 10.415 4.87803 9.78398 5.23203 9.35998C5.58503 8.93598 6.21503 8.87898 6.64003 9.23198L12.011 13.708L17.373 9.39298C17.803 9.04698 18.433 9.11498 18.779 9.54498C19.125 9.97498 19.057 10.604 18.627 10.951L12.627 15.779C12.444 15.926 12.222 16 12 16Z"
								fill="#757D8A"
							/>
						</g>
					</svg> */}
				</div>
				{/* <Select options ={ options } /> */}
			</div>
		</div>
	);
};

export default NavBar;
