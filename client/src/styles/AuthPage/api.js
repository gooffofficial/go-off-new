
import axios from 'axios'

// let isLocalhost = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'; 
// export let API_LINK = isLocalhost ? 'http://localhost:8000' : 'PRODUCTION_SITE_LINK_HERE'

export const sendEmailRegister = async (userInfo) => {
  try {
    let axiosResponse = await axios.post(`/api/users/ecreate`, userInfo)
    let serverResponse = axiosResponse.data // serverResponse returns us a huge HTML file that we dont need to use
    console.log("sendEmailRegister: ", serverResponse)
  } catch (err) { console.log("error", err) }
}

export const sendSMSRegister = async (userInfo) => {
  try {
    let axiosResponse = await axios.post(`/api/users/screate`, userInfo)
    let serverResponse = axiosResponse.data 
    console.log("sendSMSRegister: ", serverResponse)
  } catch (err) { console.log("error", err) }
}

export const sendVerifyCheck = async (email, verifyCode) => { // Basically, if there is no error then the verify code was correct!
  try {
    let axiosResponse = await axios.get(`/api/users/verification?email=${email}&smscode=${verifyCode}`)
    let serverResponse = axiosResponse.data 
    return true;
  } catch (err) { console.log("error", err); return false; }
}

export const getUpcomingChats = async () => (await axios.get(`/api/upcoming`)).data;
export const getAllUpcomingChats = async () => (await axios.get('/api/getconvos')).data;
export const getPastChats = async () => (await axios.get(`/api/pastconv`)).data;

export const charLimit = (text, charMaxLength) => {
  return text.length > charMaxLength ? text.slice(0, charMaxLength) + "..." : text
}

export const sendCreateConv = async (convCreationInfo) => {
  const { articleURL, time, title, description } = convCreationInfo;
  const convTime = new Date(time)
  const infoSent = { 
    article: articleURL, 
    convoTime: convTime.getTime() + "", 
    // convoTime: time,
    convoTitle: title,
    convoDesc: description,
    tz: "",
    roomId: Math.floor(1000000000 + Math.random() * 9000000000),
  }
  return (await axios.post(`/api/convos/create`, infoSent)).data;
}