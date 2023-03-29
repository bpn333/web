document.getElementById("add").addEventListener("click", add);
document.getElementById("sub").addEventListener("click", sub);
document.getElementById("mul").addEventListener("click", mul);
document.getElementById("div").addEventListener("click", div);
function add(){
	document.getElementById("java").innerHTML = parseInt(document.getElementById("num1").value) + parseInt(document.getElementById("num2").value);
}
function sub(){
	document.getElementById("java").innerHTML = parseInt(document.getElementById("num1").value) - parseInt(document.getElementById("num2").value);
}
function mul(){
	document.getElementById("java").innerHTML = parseInt(document.getElementById("num1").value) * parseInt(document.getElementById("num2").value);
}
function div(){
	document.getElementById("java").innerHTML = parseInt(document.getElementById("num1").value) / parseInt(document.getElementById("num2").value);
}
