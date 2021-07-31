// Module Imports
import { Switch, Route } from 'react-router-dom';
import './styles/index.scss';

// Component Imports
import Home from './pages/Home';
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
// import Log from 'apify/types/utils_log';

function App() {
	return (
		// Routes
		<Switch>
			<Route path="/home" component={Home} />
			<Route path="/profile" component={Profile} />
			<Route path="/accountsettings" component={AccountSettingsPage} />
			<Route path="/editprofile" component={EditProfilePage} />
			<Route path="/chat" component={LiveChat} />
			<Route path="/login" component={Login} />
			<Route path="/signup" component={Signup} />
			<Route path="/signup/sform" component={Sform} />
			<Route path="/signup/cform" component={Cform} />
			<Route path="/signup/ver" component={Ver} />
			<Route path="/signup/eauth" component={Eauth} />
			<Route path="/signup/smsauth" component={SMSauth} />
			<Route path="/" component={Splash} />
		</Switch>
	);
}

export default App;
