function validateInput(node, pattern, misMatchStr) {
	
	var str = node.val();
	if(str.length == 0) {
		node.after("<span class='help-block form-warning'>This field must be filled.</span>");
		return false;
	}
	
	if(!pattern.test(str)) {
		node.after(`<span class='help-block form-warning'> ${misMatchStr} </span>`);
		return false;
	}
	
	return true;
}