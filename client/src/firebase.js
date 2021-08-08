import firebase from "firebase";
import config from "./config.js";
import 'firebase/storage';

const configuration = {
    apiKey: config.apiKey,
    authDomain: config.au,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId:config.appId,
    measurementId:config.measurementId
  };
  // Initialize Firebase
  firebase.initializeApp(configuration);
export default firebase