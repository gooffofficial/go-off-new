const initState = {
    //pasting in values from sform.js
	form_values : { fullname: "", email: "", username: "", password: "", birthdate: "", checkbox: false, phonenumber: "", location: "", gender: ""}

};

export const signupreducers = (state = initState, action) => {
	switch (action.type) {
        case "UPDATE_ALL_FORM_VALUES": 
        
            const mergedObj = {...state.form_values, ...action.payload}
            
            //gets and updates form (action.payload)
            return {
                ...state,
                form_values: mergedObj
            }
		default:
            return state;
	}
};
