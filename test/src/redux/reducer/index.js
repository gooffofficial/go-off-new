import { combineReducers } from 'redux';
import { globalReducer } from './globalReducer';
import { signupreducers } from './signupreducers';

// for organization and ease of imports and exports, we have a file that combines all the reducers into one
// if a new reducer is created, make sure to import it in here and add it to the exports below
export default combineReducers({
	global: globalReducer,
	signupreducers: signupreducers,
});
