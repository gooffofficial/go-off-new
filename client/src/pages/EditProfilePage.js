import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from '../styles/EditProfilePage/editProfile.module.css';

const EditProfilePage = ({}) => {
	let history = useHistory();

	const toAccountSettingsPage = (evt) => {
		history.push('/account_settings');
	};

	return (
		<div className="editProfile">
			<EPNavBar />
			<div className={styles['ep-content']}>
				<div className={styles['ep-leftContent']}>
					<button className={styles['ep-backBtn']}>
						<img
							src="/short_left.svg"
							className={styles['ep-backIcon']}
							alt=""
						/>
						<span className={styles['ep-backTxt']}>BACK</span>
					</button>
					<button className={styles['ep-editProfileBtn ep-selectedBtn']}>
						<img src="/pencil.svg" className={styles['ep-editIcon']} alt="" />
						<span className={styles['ep-editProfileTxt']}>EDIT PROFILE</span>
					</button>
					<button
						onClick={toAccountSettingsPage}
						className={styles['ep-accountSettingsBtn']}
					>
						<img
							src="/user_circle.svg"
							className={styles['ep-accountIcon']}
							alt=""
						/>
						<span className={styles['ep-accountSettingsTxt']}>
							ACCOUNT SETTINGS
						</span>
					</button>
				</div>
				<div className={styles['ep-rightContent']}>
					<div className={styles['ep-headingRow']}>
						<div className={styles['ep-leftHeading']}>
							<h1 className={styles['ep-hTxt']}>Edit Profile</h1>
							<h2 className={styles['ep-hDescription']}>
								Users will be able to view the information provided.
							</h2>
						</div>
						<div className={styles['ep-rightHeading']}>
							<button className={styles['ep-doneBtn']}>Done</button>
							<button className={styles['ep-cancelBtn']}>Cancel</button>
						</div>
					</div>
					<div className={styles['ep-profImgRow']}>
						<div className={styles['ep-leftProfImg']}>
							<h3 className={styles['ep-profImgTxt']}>PROFILE IMAGE</h3>
							<img alt="" className={styles['ep-profImg']} />
						</div>
						<div className={styles['ep-rightProfImg']}>
							<button className={styles['ep-chooseFileBtn']}>
								Choose File
							</button>
							<span className={styles['ep-fileName']}>No file chosen</span>
						</div>
					</div>
					<div className={styles['ep-namesRow']}>
						<div className={styles['ep-leftnames']}>
							<span className={styles['ep-fNameLbl']}>FIRST NAME</span>
							<input type="text" className={styles['ep-fNameInpt']} />
						</div>
						<div className={styles['ep-rightnames']}>
							<span className={styles['ep-lNameLbl']}>LAST NAME</span>
							<input type="text" className={styles['ep-lNameInpt']} />
						</div>
					</div>
					<span className={styles['ep-bioLabel']}>BIO</span>
					<textarea className={styles['ep-bioTextArea']} />
				</div>
			</div>
		</div>
	);
};

const EPNavBar = ({}) => {
	return (
		<div className="ep-navbar">
			<img
				src="/GO_OFF_LOGO.svg"
				alt="Go Off Logo"
				className={styles['ep-goOffLogo']}
			/>
			<div className={styles['ep-searchBox']}>
				<img
					src="/search_icon.svg"
					className={styles['ep-searchIcon']}
					alt="Search Icon"
				/>
				<input
					type="search"
					className={styles['ep-inputSearch']}
					placeholder="Search"
				/>
			</div>
			<div className={styles['ep-emptySpace']}></div>
			<div className={styles['ep-optionsRow']}>
				<img src="/home.svg" className={styles['ep-homeIcon']} alt="" />
				<a href="##" className={styles['ep-amount']}>
					0
				</a>
				<img src="/plus.svg" alt="" className={styles['ep-plus']} />
			</div>
			<div className={styles['ep-profileRow']}>
				<img
					src="https://miro.medium.com/max/316/1*LGHbA9o2BKka2obwwCAjWg.jpeg"
					className={styles['ep-profileAvatar']}
					alt="profileAvatar"
				/>
				<img
					src="/chevron_down.svg"
					className={styles['ep-arrowDown']}
					alt=""
				/>
			</div>
		</div>
	);
};

export default EditProfilePage;
