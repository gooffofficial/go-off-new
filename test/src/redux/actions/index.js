import * as globalActions from './globalActions';
import * as signupactions from './signupactions';

// for organization and ease of imports and exports, we have a file that exports the action from one place
// if a new action file is created, make sure to import it in here and add it to the exports below
export { globalActions, signupactions };
