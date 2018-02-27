var addStage = function(e)
{
	e.preventDefault();
	var rocket = getStageValues();
	$(".formContainer").append(formElement);
	formCount+=1;
	addStageButton = document.querySelectorAll(".addStage")[formCount];
	console.log(addStageButton);
	addStageButton.addEventListener("click",addStage);
	main(newStage["thrust"],newStage["massIntial"],newStage["massFinal"],newStage["burnTime"],newStage["drag"]);
}
var saveStage = function(e)
{
	e.preventDefault();
	var rocket = getAllStageValues();
	var data = JSON.stringify(rocket);
	sendRequest("./api/create.php", data);
}
var getStageValues = function()
{
	var form = document.getElementsByClassName("stage")[0];
	var newStage = {};
	newStage["thrust"] = form[0].value;
	newStage["massIntial"] = form[1].value;
	newStage["massFinal"] = form[2].value;
	newStage["burnTime"] = form[3].value;
	newStage["drag"] = form[4].value;
	return newStage;
}
var getAllStageValues = function()
{
	var stageInputs = document.getElementsByClassName("stage");
	var rocket = {};
	rocket["Name"] = document.getElementById("rocketName").innerHTML;
	var stageNum = 1;
	var stageName;
	for(var stage of stageInputs)
	{
		stageName = "Stage " + stageNum;
		rocket[stageName] = {};
		rocket[stageName]["thrust"] = stage[0].value;
		rocket[stageName]["massIntial"] = stage[1].value;
		rocket[stageName]["massFinal"] = stage[2].value;
		rocket[stageName]["burnTime"] = stage[3].value;
		rocket[stageName]["drag"] = stage[4].value;
		stageNum++;
	}
	console.log(rocket);
	return rocket;
}
var formCount = 0;
var addStageButton = document.querySelectorAll(".addStage")[0];
addStageButton.addEventListener("click",addStage);

var saveButton = document.querySelectorAll("#saveButton")[0];
saveButton.addEventListener("click",saveStage);

var formElement = '<form class = "stage"><label>Thrust</label><input class = "thrust"><label>Initial Mass</label><input class = "initialMass"><label>Final Mass</label><input class = "finalMass"><label>Burn Time</label><input class = "burnTime"><label>Drag co-efficient</label><input class = "drag"><button class = "addStage">Add Stage</button></form>';
console.log(formElement);
var sendRequest = function(url,data)
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() { 
		if (xhr.readyState == 4 && xhr.status == 200)
		{
			alert(xhr.responseText);
		}
	}
	xhr.open("POST", url, true);
	xhr.send(data);
}