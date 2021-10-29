import { createContext, useEffect, useState } from "react";
import {useHistory} from 'react-router-dom'
import axios from "axios";
import { createHmac } from "crypto";

export const fillerUser = {
  admin: "",
  age: -1,
  Posts: 0,
  article1author: "",
  article1img: "",
  article1link: "",
  article1readtime: "",
  article1title: "",
  article2author: "",
  article2img: "",
  article2link: "",
  article2readtime: "",
  article2title: "",
  article3author: "",
  article3img: "",
  article3link: "",
  article3readtime: "",
  article3title: "",
  bio: null,
  email: "",
  firstname: "",
  lastname: "",
  followercount: 0,
  followingcount: 0,
  host: "",
  id: -1,
  location: "",
  name: "Username",
  propic: "/images/stock-face.jpg",
  username: "username",
  phonenumber: "",
  username: "",
  signedIn: false,
};

const fillerUpcoming = [];

const fillerConvo = {
  articleImg: "",
  articleURL: "",
  convTitle: "",
  desc: "",
  hostID: -1,
  hostName: "",
  hostNum: "",
  hostpfp: "",
  roomId: "",
  time: "",
  userID: -1,
  userPnum: "",
  useremail: "",
  username: "",
};

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(fillerUser);
  const [myUpcoming, setMyUpcoming] = useState(fillerUpcoming)
  const [upcoming, setUpComing] = useState(fillerUpcoming);
  const [convos, setConvos] = useState([fillerConvo, fillerConvo, fillerConvo]);
  const [past, setPast] = useState([fillerConvo, fillerConvo, fillerConvo]);
  const [isLoading, setisLoading] = useState(true);
  const history = useHistory()
  const [modal, setModal] = useState(false)

  const refetchUser = async () => {
    setisLoading(true)
    try {
      const res = await axios.get(`${process.env.REACT_APP_NODE_API}/api/users/current`, {
        withCredentials: true,
      });
      const res2 = await axios.get(
        `${process.env.REACT_APP_NODE_API}/api/users/profile/${res.data.user.username}`,
        {
          withCredentials: true,
        }
      );
      if(res.status==200){
        setCurrentUser({ ...res2.data.user, signedIn: true });
      }else{
          setCurrentUser(fillerUser)
      }
    } catch (err) {
      console.log(err);
    }
    setisLoading(false)
  };

  const refetchUpcoming = async (username=null) => {
      try {
        const res3 = await axios.get(`${process.env.REACT_APP_NODE_API}/api/upcoming`, { withCredentials: true });
        if(res3.status==200){
          setUpComing(res3.data);
        }
      } catch (err) {
        console.log(err);
      }
  };

  const refetchMyUpcoming = async (username) => {
    try{
    const res3 = await axios.get(`${process.env.REACT_APP_NODE_API}/api/upcoming${username}`, { withCredentials: true });
    if(res3.status==200){
      setMyUpcoming(res3.data);
    }
  } catch (err) {
    console.log(err);
  }
  }

  const refetchConvos = async () => {
    try {
      const res4 = await axios.get(`${process.env.REACT_APP_NODE_API}/api/getconvos`, { withCredentials: true });
      if(res4.status==200){
        setConvos(res4.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const refetchPast = async (username) => {
    try {
      const res4 = await axios.get(`${process.env.REACT_APP_NODE_API}/api/pastconv/${username}`, { withCredentials: true });
      if(res4.status==200){
        setPast(res4.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const fetchData = async () => {
    setisLoading(true)
    try{
    const res = await axios.get(`${process.env.REACT_APP_NODE_API}/api/users/current`, {
      withCredentials: true,
    });
    const res2 = await axios.get(
      `${process.env.REACT_APP_NODE_API}/api/users/profile/${res.data.user.username}`,
      {
        withCredentials: true,
      }
    );
    const res3 = await axios.get(`${process.env.REACT_APP_NODE_API}/api/upcoming`, { withCredentials: true });
    const res4 = await axios.get(`${process.env.REACT_APP_NODE_API}/api/getconvos`, { withCredentials: true });
    const res5 = await axios.get(`${process.env.REACT_APP_NODE_API}/api/upcoming/${res2.data.user.username}`, { withCredentials: true });
    const res6 = await axios.get(`${process.env.REACT_APP_NODE_API}/api/pastconv/${res2.data.user.username}`, { withCredentials: true });
    console.log(res);
    if (res2.data.user) {
      setCurrentUser({ ...res2.data.user, signedIn: true });
      setUpComing(res3.data);
      setConvos(res4.data);
      setMyUpcoming(res5.data)
      setPast(res6.data)
      console.log(res2, res3, res4);
    }}catch(err){
      console.log(`error: ${err}`)
    }
    setisLoading(false);
  }

  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  //*! going foward we should all use similar data throughout the app therefore it would benefit us
  //*! to useContext and just make axios calls only when necessary.
  //*! if setting needs to be done use or add one of the setters passed in the provider value below

  useEffect(async () => {
    fetchData()
  }, []);
  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        upcoming,
        setUpComing,
        convos,
        setConvos,
        past,
        setPast,
        myUpcoming,
        setMyUpcoming,
        isLoading,
        refetchMyUpcoming,
        refetchPast,
        refetchUser,
        refetchUpcoming,
        refetchConvos,
        getCookie,
        fetchData,
        modal, 
        setModal
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
