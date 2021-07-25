// Module Imports
import { Switch, Route } from 'react-router-dom';
import './styles/index.scss';

// Component Imports
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
	return (
		// Routes
		<Switch>
			<Route path="/home" component={Home} />
			<Route path="/profile" component={Profile} />
		</Switch>
	);
}

export default App;
