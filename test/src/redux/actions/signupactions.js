export const update_form_values = (form_values) => (dispatch) => {
    //pulls updated values from sform page and sends them to reducer to update it
    return dispatch({ type: 'UPDATE_ALL_FORM_VALUES', payload: form_values });
    
}