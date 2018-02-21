var addStage = function(e)
{
	e.preventDefault();
	var form = document.getElementsByClassName("newStage")[0];
	var thrust = form[0].value;
	var massIntial = form[1].value;
	var massFinal = form[2].value;
	var burnTime = form[3].value;
	var drag = form[4].value;
	main(thrust,massIntial,massFinal,burnTime,drag)
}
var addStageButton = document.querySelectorAll("#addStage")[0];
console.log(addStageButton);
addStageButton.addEventListener("click",addStage);