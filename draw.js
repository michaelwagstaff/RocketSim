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
var lastHPosition = 0;
var lastVPosition = 0;


function dumpData(h, v)
{
	var hString = ", H Position: " + h;
	var vString = "V Position: " + v;
	console.log(vString + hString);
}

function draw(rocket, frequencyOfCalc)
{
	var hDistance = rocket.hVelocity/frequencyOfCalc;
	var vDistance = rocket.vVelocity/frequencyOfCalc;
	var newHPosition = hDistance * canvasScale * 0.4 + lastHPosition;
	var newVPosition = vDistance * canvasScale + lastVPosition;
	ctx.lineTo(newHPosition, newVPosition);
	lastHPosition = newHPosition;
	lastVPosition = newVPosition;
	//dumpData(newHPosition, newVPosition);
}


