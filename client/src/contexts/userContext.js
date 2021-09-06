import { createContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
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
  const [upcoming, setUpComing] = useState(fillerUpcoming);
  const [convos, setConvos] = useState([fillerConvo, fillerConvo, fillerConvo]);
  const [isLoading, setisLoading] = useState(true);

  const refetchUser = async () => {
    setisLoading(true)
    try {
      const res = await axios.get(`/api/users/current`, {
        withCredentials: true,
      });
      const res2 = await axios.get(
        `/api/users/profile/${res.data.user.username}`,
        {
          withCredentials: true,
        }
      );
      console.log(res,'hello')
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

  const refetchUpcoming = async () => {
    try {
      const res3 = await axios.get("/api/upcoming", { withCredentials: true });
      if(res3.status==200){
        setUpComing(res3.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const refetchConvos = async () => {
    try {
      const res4 = await axios.get("/api/getconvos", { withCredentials: true });
      if(res4.status==200){
        setConvos(res4.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  function getCookie(name: string) {
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
    try {
      const res = await axios.get(`/api/users/current`, {
        withCredentials: true,
      });
      const res2 = await axios.get(
        `/api/users/profile/${res.data.user.username}`,
        {
          withCredentials: true,
        }
      );
      const res3 = await axios.get("/api/upcoming", { withCredentials: true });
      const res4 = await axios.get("/api/getconvos", { withCredentials: true });
      console.log(res);
      if (res2.data.user) {
        setCurrentUser({ ...res2.data.user, signedIn: true });
        setUpComing(res3.data);
        setConvos(res4.data);
        console.log(res2, res3, res4);
      }
    } catch (err) {
      console.log(err);
    }

    setisLoading(false);
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
        isLoading,
        refetchUser,
        refetchUpcoming,
        refetchConvos,
        getCookie
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
