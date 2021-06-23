import { combineReducers } from 'redux';
import { globalReducer } from './globalReducer'
import { homeReducer } from './homeReducer';

export default combineReducers({
    global: globalReducer,
    home: homeReducer
})