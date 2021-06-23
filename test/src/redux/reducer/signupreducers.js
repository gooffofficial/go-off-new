const initState = {
    //pasting in values from sform.js
	form_values : { fullname: "", email: "", username: "", password: "", birthdate: "", checkbox: false, phonenumber: "", location: "", gender: ""}

};

export const signupreducers = (state = initState, action) => {
	switch (action.type) {
        case "UPDATE_ALL_FORM_VALUES": 
        console.log(action.key)
            const data = action.payload;
            //gets and updates form (action.payload)
            return {
                ...state,
                form_values: {
                    fullname: data.fullname,
                    email: data.email,
                    username: data.username,
                    password: data.password,
                    birthdate: data.birthdate,
                    checkbox: data.checkbox,
                    phonenumber: data.phonenumber,
                    location: data.location,
                    gender: data.gender
                },
            }
		default:
            return state;
	}
};
