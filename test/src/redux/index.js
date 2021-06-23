// the redux store gets created here and all the reducers get connected
// if you want to access the dev tools for redux, install the google chrome extension: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducer';
import thunk from 'redux-thunk';

const store = createStore(
	reducers,
	composeWithDevTools(applyMiddleware(thunk))
);

export default store;
