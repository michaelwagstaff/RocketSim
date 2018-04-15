var canvas = document.getElementById("canvas");
console.log($(document).height());
$("#canvas").attr('height', $(document).height());
$("#canvas").attr('width', $(document).width());
console.log(canvas);
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgb(73, 188, 92)';
ctx.strokeStyle = 'rgb(255, 255, 255)';
ctx.beginPath();
ctx.arc(canvas.width * 0.5, canvas.height * 0.5, canvas.height * 0.3, 0,Math.PI * 2);
ctx.fill();
ctx.closePath();
console.log("Can Draw");
var originalHPosition;
var lastVPosition;


function dumpData(h, v)
{
	var hString = ", H Position: " + h;
	var vString = "V Position: " + v;
	console.log(vString + hString);
}

function draw(rocket, frequencyOfCalc, planet)
{
	ctx.lineTo(rocket.xPosition * canvasScale,rocket.yPosition * canvasScale)
	ctx.stroke();
	canvasRotation = Math.atan(rocket.xPosition/rocket.yPosition);
	if(rocket.yPosition < 0)
	{
		canvasRotation += Math.PI;
	}
}
function reset()
{
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.translate(canvas.width*0.5, canvas.height * 0.5);
	ctx.fillStyle = 'rgb(73, 188, 92)';
	ctx.strokeStyle = 'rgb(255, 255, 255)';
	ctx.beginPath();
	ctx.arc(0, 0, canvas.height * 0.3, 0,Math.PI * 2);
	ctx.fill();
	ctx.closePath();

	console.log("Can Draw");
	originalHPosition = canvas.width*0;
	lastVPosition = canvas.height*-0.3;
	canvasRotation = 0;
}
var canvasRotation = 0;
reset();


