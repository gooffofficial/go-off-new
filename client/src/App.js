// Module Imports
import { Switch, Route, useLocation, useHistory } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import "./styles/index.scss";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import { v4 as uuid_v4 } from "uuid";
import config from "./config";

// Component Imports
import Home from "./pages/Home";
import HostHome from "./pages/HostHome";
import Profile from "./pages/Profile";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import LiveChat from "./pages/LiveChat";
import EditProfilePage from "./pages/EditProfilePage";
import DiscoverPage from "./pages/DiscoverPage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Sform from "./pages/sform";
import Cform from "./pages/cform";
import Ver from "./pages/ver";
import Eauth from "./pages/eauth";
import SMSauth from "./pages/smsauth";
import Splash from "./pages/splash";
import PublicProfile from "./pages/PublicProfile";
import HostRoute from "./components/HostRoute";
// import Log from '../../../apify/types/utils_log';
import { UserContext } from "./contexts/userContext";
import { routeContext } from "./contexts/useReroute";
import SettingModal from "./components/SettingModal";

const App = () => {
  const { currentUser, isLoading, modal } = useContext(UserContext);
  const { currentLocation, setCurrentLocation } = useContext(routeContext);
  let history = useHistory();


  // This will create a unique pubnub client with sub and pub keys. These are test keys we will need to buy full feature ones.
  const pubnub = new PubNub({
    publishKey: config.pubKey,
    subscribeKey: config.subKey,
    //should not generate new one each time should create one for the user upon account creation and use that.
    //logVerbosity:true // logs HTTP request info
  });

  let location = useLocation().pathname;
  useEffect(() => {
    if (
      !currentUser.signedIn &&
      (location !== "/login" ||
        location !== "/signup" ||
        location !== "/" ||
        location !== "/signup/" ||
        location !== "/signup/ver" ||
        location !== "/signup/smsauth" ||
        location !== "/signup/eauth" ||
        location !== "/signup/cform" ||
        location !== "/signup/sform" ||
        location !== "/404ERROR")
    ) {
      setCurrentLocation(location);
      history.push("/");
    }
  }, []);

  if (isLoading) {
    return (
      <>
        <div style={{ height: "20vh" }}></div>
        <div className="row d-flex justify-content-center">
          <div
            style={{ width: "5rem", height: "5rem" }}
            class="spinner-border text-primary"
            role="status"
          >
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    // Routes
    <PubNubProvider client={pubnub}>
      <Switch>
        <Route path="/hosthome" component={HostHome} />
        <Route path="/home" component={Home} />
        {/* <HostRoute path="/home" component={HostHome} /> */}
        <Route path="/profile/:username" component={PublicProfile} />
        <Route path="/profile" component={Profile} />
        <Route path="/accountsettings" component={AccountSettingsPage} />
        <Route path="/editprofile" component={EditProfilePage} />
        {/* <Route path="/discover" component={DiscoverPage} /> */}
        <Route path="/chat/:code?" component={LiveChat} />
        <Route path="/signup/eauth" component={Eauth} />
        <Route path="/signup/smsauth" component={SMSauth} />
        <Route path="/signup/ver" component={Ver} />
        <Route path="/signup/cform" component={Cform} />
        <Route path="/signup/sform" component={Sform} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route exact path="/" component={Splash} />
        <Route exact path="/404ERROR">
          <div>Oops! Page Not Found</div>
        </Route>
      </Switch>
      <SettingModal show={modal} />
    </PubNubProvider>
  );
};

export default App;
