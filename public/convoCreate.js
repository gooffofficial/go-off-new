function submitBarConvo(){
    var dateInput = new Date(document.getElementById('convoTime').value)
	var epoch = dateInput.getTime();
	//document.getElementById('timezone2').value = dateInput.getTimezoneOffset();
	document.getElementById('datetime-bar').value = epoch;
	document.getElementById('createConvoBar').submit();
}