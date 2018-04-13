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
	sendRequest("./api/create.php", data, "POST");
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
var loadStage = function()
{
	//console.log(userID);
	$(".shipSelector").children().remove();
	for (rocket of rockets)
	{
		$(".shipSelector").append('<div class = "ship"><h2>'+rocket["Name"]+'</h2><p>'+rocket["numStages"]+' Stage(s)</p><button class = "useShip">Use Ship</button></div>');
	}
	$(".shipSelector").show();
}

var formCount = 0;
var addStageButton = document.querySelectorAll(".addStage")[0];
addStageButton.addEventListener("click",addStage);

var saveButton = document.querySelectorAll("#saveButton")[0];
saveButton.addEventListener("click",saveStage);

var loadButton = document.querySelectorAll(".loadButton")[0];
loadButton.addEventListener("click",loadStage);

var formElement = '<form class = "stage"><label>Thrust</label><input class = "thrust"><label>Initial Mass</label><input class = "initialMass"><label>Final Mass</label><input class = "finalMass"><label>Burn Time</label><input class = "burnTime"><label>Drag co-efficient</label><input class = "drag"><button class = "addStage">Add Stage</button></form>';

var userID = "";

var rockets = [];
rockets.push(falcon9);

var sendRequest = function(url,data, method)
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() { 
		if (xhr.readyState == 4 && xhr.status == 200)
		{
			if(method === "GET")
			{
				var userRockets = JSON.parse(xhr.responseText);
				userRockets.forEach(function(rocket){
					rockets.unshift(rocket); //Adds to the fornt of the array
				});
			}
			else
			{
				alert("Action successfully completed")
			}
		}
	}
	if(method === "POST")
	{
		xhr.open(method, url, true);
		xhr.send(data);
	}
	else if(method === "GET")
	{
		console.log(url+data);
		xhr.open(method, url+data, true);
		xhr.send(null);
	}
	//return xhr.responseText;
}

function loadRockets()
{
	var data = "?userID="+userID;
	sendRequest("./api/read.php",data, "GET");
}
function onSignIn(googleUser)
{
	var profile = googleUser.getBasicProfile();
	$("#saveButton").removeClass("hiddenSave");
	$(".g-signin2").addClass("hiddenSave");
	userID = googleUser.getAuthResponse().id_token;

	//Load user configurations
	loadRockets();
}