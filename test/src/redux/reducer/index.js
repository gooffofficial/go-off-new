import { combineReducers } from 'redux';
import { globalReducer } from './globalReducer';
import { signupreducers }from './signupreducers';

export default combineReducers({
	global: globalReducer, 
	signupreducers: signupreducers,

});
