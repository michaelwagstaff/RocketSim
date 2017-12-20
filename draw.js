var canvas = document.getElementById("canvas");
console.log($(document).height());
$("#canvas").attr('height', $(document).height());
$("#canvas").attr('width', $(document).width());
console.log(canvas);
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgb(0,0,0,)';
//ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.beginPath();
ctx.arc(canvas.width * 0.5, canvas.height * 0.5, canvas.height * 0.3, 0,Math.PI * 2);
ctx.fill();
ctx.closePath();
console.log("Can Draw");
function draw(rocket)
{

}