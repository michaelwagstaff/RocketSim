var addStage = function(e)
{
	e.preventDefault();
	var rocket = getAllStageValues();
	$(".formContainer").append(formElement);
	formCount+=1;
	addStageButton = document.querySelectorAll(".addStage")[formCount];
	console.log(addStageButton);
	addStageButton.addEventListener("click",addStage);
	main(rocket);
}
var saveStage = function(e)
{
	e.preventDefault();
	var rocket = getAllStageValues();
	rocket["userID"] = userID;
	var data = JSON.stringify(rocket);
	sendRequest("./api/create.php", data);
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
		rocket[stageName]["thrust"] = parseInt(stage[0].value);
		rocket[stageName]["massInitial"] = parseInt(stage[1].value);
		rocket[stageName]["massFinal"] = parseInt(stage[2].value);
		rocket[stageName]["burnTime"] = parseInt(stage[3].value);
		rocket[stageName]["drag"] = parseFloat(stage[4].value);
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

var userID;

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
function onSignIn(googleUser)
{
	var profile = googleUser.getBasicProfile();
	$("#saveButton").removeClass("hiddenSave");
	$(".g-signin2").addClass("hiddenSave");
	userID = profile.getId(); // Do not send to your backend! Use an ID token instead.
	//For now I will send this to the backend. I'm storing rocket configs not credit card details.
}