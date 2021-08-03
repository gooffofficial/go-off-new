// Module Imports
import { Switch, Route } from 'react-router-dom';
import './styles/index.scss';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import { v4 as uuid_v4 } from 'uuid';

// Component Imports
import Home from './pages/Home';
import HostHome from './pages/HostHome';
import Profile from './pages/Profile';
import AccountSettingsPage from './pages/AccountSettingsPage';
import LiveChat from './pages/LiveChat';
import EditProfilePage from './pages/EditProfilePage';
import DiscoverPage from './pages/DiscoverPage';
import Login from './pages/login';
import Signup from './pages/signup';
import Sform from './pages/sform';
import Cform from './pages/cform';
import Ver from './pages/ver';
import Eauth from './pages/eauth';
import SMSauth from './pages/smsauth';
import Splash from './pages/splash';
import UserProfile from './pages/UserProfile';
// import Log from '../../../apify/types/utils_log';

const App = () => {
	// This will create a unique pubnub client with sub and pub keys. These are test keys we will need to buy full feature ones.
	const pubnub = new PubNub({
		publishKey: 'pub-c-59ae5e55-4285-42c4-b609-dbe4f6ceb5e2',
		subscribeKey: 'sub-c-58789894-ce3c-11eb-9144-ea6857a81ff7',
		uuid: uuid_v4(), //should not generate new one each time should create one for the user upon account creation and use that.
		//logVerbosity:true // logs HTTP request info
	});

	return (
		// Routes
		<PubNubProvider client={pubnub}>
			<Switch>
				<Route path="/hosthome" component={HostHome} />
				<Route path="/home" component={Home} />
				<Route path="/profile/:username" component={UserProfile} />
				<Route path="/profile" component={UserProfile} />
				<Route path="/accountsettings" component={AccountSettingsPage} />
				<Route path="/editprofile" component={EditProfilePage} />
				<Route path="/discover" component={DiscoverPage} />
				<Route path="/chat/:code?" component={LiveChat} />
				<Route path="/signup/eauth" component={Eauth} />
				<Route path="/signup/smsauth" component={SMSauth} />
				<Route path="/signup/ver" component={Ver} />
				<Route path="/signup/cform" component={Cform} />
				<Route path="/signup/sform" component={Sform} />
				<Route path="/login" component={Login} />
				<Route path="/signup" component={Signup} />
				<Route path="/" component={Splash} />
			</Switch>
		</PubNubProvider>
	);
};

export default App;
