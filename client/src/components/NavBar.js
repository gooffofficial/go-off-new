import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import styles from "./styles/NavBar.module.scss";
import { useHistory } from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import axios from "axios";
import { UserContext, fillerUser } from "../contexts/userContext";
import SettingModal from "./SettingModal";

const NavBar = (props) => {
  const { name, avatarSource, host, admin = "" } = props;
  const { currentUser, setCurrentUser, fetchData, setModal } = useContext(UserContext);
  const [searchInput, setSearchInput] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [suggestionsHider, setSuggestionsHider] = useState("");
  const [show, setShow] = useState('')
  const history = useHistory();

const toggleShow = () => {
	if(show==='show'){
		setShow('')
	}else{
		setShow('show')
    setTimeout(() =>{
      setShow('')
    },5000)
	}
}

  const goToHomePage = (evt) => {
    let isHost = host === "(Host)";
    let isAdmin = admin === "(Host)";
    if (isHost | isAdmin) history.push("/hosthome");
    else history.push("/home");
  };

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
        .get(`${process.env.REACT_APP_NODE_API}/api/users/all`, {withCredentials:true})
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
      searchInput === ""
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
    setSearchInput("");
    history.push(`/profile/${username}`);
  };

  const logoutHandler = async(e) => {
    e.preventDefault();
	toggleShow()
	const result = await axios.get(`${process.env.REACT_APP_NODE_API}/api/users/logout`, {withCredentials:true})
  const result2 = await axios.get(`${process.env.REACT_APP_FLASK_API}/logout`, {withCredentials:true})
  if (result.status==200 && result2.status==200)
  {
    setCurrentUser('')
    history.push('/')
  }
  };

  return (
	  <>
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
        </div>

        <div className={`${styles.suggestionsContainer} ${suggestionsHider}`}>
          <div className={styles.suggestionTab} onClick={usernameClickHandler}>
            <p className={styles.suggestionText}>
              {filteredUsers[0] ? filteredUsers[0].username : ""}
            </p>
          </div>

          <div className={styles.suggestionTab} onClick={usernameClickHandler}>
            <p className={styles.suggestionText}>
              {filteredUsers[1] ? filteredUsers[1].username : ""}
            </p>
          </div>

          <div className={styles.suggestionTab} onClick={usernameClickHandler}>
            <p className={styles.suggestionText}>
              {filteredUsers[2] ? filteredUsers[2].username : ""}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.menuIcons}>



      </div>

      <div
        className={styles.loginInfo}
        onClick={() => toggleShow()}
      >

        <div class="dropdown">
		<img
          className={styles.navUserImage}
          src={avatarSource ? avatarSource : "/images/stock-face.jpg"}
          width="24px"
          height="24px"
          alt="avatar"
        />
	          <ul class={`dropdown-menu ${show}`} aria-labelledby="dropdownMenuButton1">
            <li>
              <a class="dropdown-item" href="#" onClick={() => {
				  toggleShow()
				  history.push('/profile')
			  }}>
                Go to profile
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" onClick={()=>setModal(p=>!p)}>
                Account settings
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" onClick={logoutHandler}>
                Logout
              </a>
            </li>
          </ul>
        </div>
		<p className={styles.navUserText}>{name ? name : "<pass in name>"}</p>
        <div className={styles.navArrowContainer}>
        </div>
      </div>
    </div>
	</>
  );
};

export default NavBar;
