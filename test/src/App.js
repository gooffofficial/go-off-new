import './App.css';
import Splash from './components/splash.js';
import Login from './components/login.js';
import Sform from './components/sform.js';
import Cform from './components/cform.js';
import Ver from './components/ver.js';
import SMSAuth from './components/smsauth.js';
import EAuth from './components/eauth.js';
import LiveChat from './components/LiveChat'
import EditProfilePage from './components/EditProfilePage'
import AccountSettingsPage from './components/AccountSettingsPage'
import DiscoverPage from './components/DiscoverPage'
import { Route, Switch } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      {/* routes (sets different url paths) / should be splash*/}
      <Switch>
        <Route path="/splash">
          <Splash/>
        </Route>
        <Route path="/live_chat">
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
        <Route path="/profile_edit">
          <EditProfilePage/>
        </Route>
        <Route path="/account_settings">
          <AccountSettingsPage/>
        </Route>
        <Route path="/discover">
          <DiscoverPage/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;


