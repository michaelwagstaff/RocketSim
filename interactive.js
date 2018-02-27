var addStage = function(e)
{
	e.preventDefault();
	var stages = getAllStageValues();
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
	var stages = getAllStageValues();
	var data = JSON.stringify(stages);
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
	var stages = {};
	var stageNum = 1;
	var stageName;
	for(var stage of stageInputs)
	{
		stageName = "Stage " + stageNum;
		if(stageName == "Stage 2")
		{
			console.log("actually starts second stage");
		}
		stages[stageName] = {};
		stages[stageName]["thrust"] = stage[0].value;
		stages[stageName]["massIntial"] = stage[1].value;
		stages[stageName]["massFinal"] = stage[2].value;
		stages[stageName]["burnTime"] = stage[3].value;
		stages[stageName]["drag"] = stage[4].value;
		stageNum++;
	}
	console.log(stages);
	return stages;
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