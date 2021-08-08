import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Home from '../pages/Home.js';

const fillerUser = {
	host: " "
};


    
const HostRoute = ({ component: Component, ...rest }) => {
    const [currentUser, setCurrentUser] = useState(fillerUser);

	useEffect(() => {
		axios
			.get(`/api/users/current`, {
				withCredentials: true,
			})
			.then((res) => {
				setCurrentUser(res.data.user);
			})
			.catch((err) => {
				console.log(err);
			});
    }, []);

    const token = localStorage.getItem('token')
    console.log("ASFKS;DLKFGJ;LDSKGSAD", token)

    return (
        <Route render={() => {
            if (token) {
                return <Component />
            } else {
                return <Home />
            }
        }}
        />
    ) 
}

export default HostRoute