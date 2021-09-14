// state that is needed at global scope goes in this reducer
// reducers update the state -- actions run the logic
// by convention, case names should be all caps and have underscores:  case AN_EXAMPLE
// reducer case names should match action names in order to reference each other
const initState = {
	darkmode: false,
};

export const globalReducer = (state = initState, action) => {
	switch (action.type) {
		// create a case for each action function
		case 'THIS_IS_AN_EXAMPLE':
			// the state that will be updated goes inside of the return
			// to avoid mutating the initState above, ALWAYS spread in state
			return {
				...state, // state spread in using the spread operator
				darkmode: action.payload, // action.payload will come from the actions and it is what will be replaced/updated
			};

		default:
			return state;
	}
};
