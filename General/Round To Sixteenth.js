function round(n, denom=16, r="higher") {
	
	var result;
	if (r == "higher") {
		result = Math.ceil(n * denom) / denom;
  	} else {
		result = Math.floor(n * denom) / denom;
  	}
  	return result;
	
}
