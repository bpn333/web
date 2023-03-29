function ran(){
	document.getElementById("java").innerHTML = Math.floor(Math.random() * 100);
}

document.getElementById("b1").addEventListener("click", ran);

