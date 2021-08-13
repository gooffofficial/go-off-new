
import axios from 'axios'
import firebase from '../../firebase.js'

const db = firebase.firestore();
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const hour = today.getHours();
  const minute = today.getMinutes();
  const second = today.getSeconds();
  return `${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day} ${hour<10?'0'+hour:hour}:${minute<10?'0'+minute:minute}:${second<10?'0'+second:second}`
}

// let isLocalhost = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'; 
// export let API_LINK = isLocalhost ? 'http://localhost:8000' : 'PRODUCTION_SITE_LINK_HERE'

// export const sendEmailRegister = async (userInfo) => {
//   try {
//     let axiosResponse = await axios.post(`/api/users/ecreate`, userInfo)
//     let serverResponse = axiosResponse.data // serverResponse returns us a huge HTML file that we dont need to use
//     console.log("sendEmailRegister: ", serverResponse)
//   } catch (err) { 
//     console.log("error: ", err) 
//   }
// }

export const sendEmailRegister = async (userInfo) => {
  let errorResponse = {}
  try {
    let axiosResponse = await axios.post(`/api/users/ecreate`, userInfo)
    let serverResponse = axiosResponse.data 

    if (serverResponse.error) {
      errorResponse = serverResponse;
      throw serverResponse
    }
    console.log("sendEmailRegister: ", serverResponse)
    return { res: serverResponse, isError: false }
  } catch (err) { 
    errorResponse = isEmpty(errorResponse) ? err.response.data : errorResponse;
    console.log("Error: ", errorResponse) 
    return { res: errorResponse, isError: true }
  }
}

export const sendSMSRegister = async (userInfo) => {
  let errorResponse = {}
  try {
    let axiosResponse = await axios.post(`/api/users/screate`, userInfo)
    let serverResponse = axiosResponse.data 

    if (serverResponse.error) {
      errorResponse = serverResponse;
      throw serverResponse
    }
    console.log("sendSMSRegister: ", serverResponse)
    return { res: serverResponse, isError: false }
  } catch (err) { 
    errorResponse = isEmpty(errorResponse) ? err.response.data : errorResponse;
    console.log("Error: ", errorResponse) 
    return { res: errorResponse, isError: true }
  }
}

export const sendVerifyCheck = async (email, verifyCode) => {
  let errorResponse = {}
  try {
    let axiosResponse = await axios.get(`/api/users/verification?email=${email}&smscode=${verifyCode}`)
    let serverResponse = axiosResponse.data 

    if (serverResponse.error) {
      errorResponse = serverResponse;
      throw serverResponse
    }
    console.log("sendVerifyCheck: ", serverResponse)
    return { res: serverResponse, isError: false }
  } catch (err) { 
    errorResponse = isEmpty(errorResponse) ? err.response.data : errorResponse;
    console.log("Error: ", errorResponse) 
    return { res: errorResponse, isError: true }
  }
}

// export const sendVerifyCheck = async (email, verifyCode) => {
//   try {
//     let axiosResponse = await axios.get(`/api/users/verification?email=${email}&smscode=${verifyCode}`)
//     let serverResponse = axiosResponse.data 
//     return true;
//   } catch (err) { console.log("error", err); return false; }
// }

export const getUpcomingChats = async (username = "") => { 
  if (username === "") return (await axios.get(`/api/upcoming`)).data
  else return (await axios.get(`/api/upcoming/${username}`)).data
}
export const getAllUpcomingChats = async (username) => (await axios.get('/api/getconvos')).data;

export const getPastChats = async (username = "") => { 
  if (username === "") return (await axios.get(`/api/pastconv`)).data;
  else return (await axios.get(`/api/pastconv/${username}`)).data;
}

export const charLimit = (text, charMaxLength) => {
  console.log(text)
  return text.length > charMaxLength ? text.slice(0, charMaxLength) + "..." : text
  
}

export const sendCreateConv = async (convCreationInfo,userId) => {
  const { articleURL, time, title, description } = convCreationInfo; //*!description is the same as articleURL when
  const convTime = new Date(time)
  const currentDate= getCurrentDate()
  const infoSent = { 
    article: articleURL, 
    convoTime: convTime.getTime() + "", 
    // convoTime: time,
    convoTitle: title,
    convoDesc: description,
    tz: "",
    roomId: Math.floor(1000000000 + Math.random() * 9000000000),
  }
  db.collection('Conversations').add({
    convoId:String(infoSent.roomId),
    title:title,
    description:description,
    articleURL:articleURL,
    hostId:userId,
    isOpen:false,
    time:convTime.getTime() + "",
    rsvp:[],
    ended:false,
    createdAt:currentDate,
    updatedAt:currentDate,
    tz:0
  }).then(doc =>console.log(`conversation ${title} added`)).catch(err => console.log(err));
  
  return (await axios.post(`/api/convos/create`, infoSent)).data; //*!not working
}

const isEmpty = (obj) => obj && Object.keys(obj).length === 0 && obj.constructor === Object