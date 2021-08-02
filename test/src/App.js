// import logo from './logo.svg';
import React from 'react';
import './App.css';
import Splash from './components/splash.js';
import Login from './components/login.js';
import Sform from './components/sform.js';
import Cform from './components/cform.js';
import Ver from './components/ver.js';
import SMSAuth from './components/smsauth.js';
import EAuth from './components/eauth.js';
import LiveChat from './components/LiveChat'
import { Route, Switch } from 'react-router-dom';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import { v4 as uuid_v4 } from 'uuid';

const App = () => {
  // This will create a unique pubnub client with sub and pub keys. These are test keys we will need to buy full feature ones. 
  const pubnub = new PubNub({
    publishKey: 'pub-c-59ae5e55-4285-42c4-b609-dbe4f6ceb5e2', 
    subscribeKey: 'sub-c-58789894-ce3c-11eb-9144-ea6857a81ff7',
    uuid:uuid_v4(), //should not generate new one each time should create one for the user upon account creation and use that.
    //logVerbosity:true // logs HTTP request info 
  })

  return (
    <div className="App">
      {/* routes (sets different url paths) / should be splash*/}
      <PubNubProvider client={pubnub}>
        <Switch>
          <Route path="/splash">
            <Splash/>
          </Route>
          <Route path="/livechat/:code?">
            <LiveChat/>
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup/sform">
            <Sform />
          </Route>
          <Route path="/signup/cform">
            <Cform />
          </Route>
          <Route path="/signup/ver">
            <Ver/>
          </Route>
          <Route path="/signup/smsauth">
            <SMSAuth/>
          </Route>
          <Route path="/signup/eauth">
            <EAuth/>
          </Route>
        </Switch>
      </PubNubProvider>
    </div>
  );
}

export default App;


