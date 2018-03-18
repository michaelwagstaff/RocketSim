var canvas = document.getElementById("canvas");
console.log($(document).height());
$("#canvas").attr('height', $(document).height());
$("#canvas").attr('width', $(document).width());
console.log(canvas);
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgb(73, 188, 92)';
ctx.strokeStyle = 'rgb(255, 255, 255)';
//ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.beginPath();
ctx.arc(canvas.width * 0.5, canvas.height * 0.5, canvas.height * 0.3, 0,Math.PI * 2);
ctx.fill();
ctx.closePath();
console.log("Can Draw");
var lastHPosition;
var lastVPosition;


function dumpData(h, v)
{
	var hString = ", H Position: " + h;
	var vString = "V Position: " + v;
	console.log(vString + hString);
}

function draw(rocket, frequencyOfCalc, planet)
{
	var hDistance = rocket.hVelocity/frequencyOfCalc;
	var vDistance = rocket.vVelocity/frequencyOfCalc;
	var newHPosition = hDistance * canvasScale + lastHPosition;
	var newVPosition = -vDistance * canvasScale + lastVPosition;
	ctx.lineTo(newHPosition, newVPosition);
	var circumference = (rocket.height + planet["radius"]) * Math.PI * 2;
	ctx.rotate((hDistance/circumference)/(Math.PI)*2);
	lastHPosition = newHPosition;
	lastVPosition = newVPosition;
	//dumpData(newHPosition, newVPosition);
}
function reset()
{
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'rgb(73, 188, 92)';
	ctx.strokeStyle = 'rgb(255, 255, 255)';
	//ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.beginPath();
	ctx.arc(canvas.width * 0.5, canvas.height * 0.5, canvas.height * 0.3, 0,Math.PI * 2);
	ctx.fill();
	ctx.closePath();
	console.log("Can Draw");
	lastHPosition = canvas.width*0.5;
	lastVPosition = canvas.height*0.2;
}
reset();


