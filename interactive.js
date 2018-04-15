var addStage = function(e)
{
	if(e!=0)
	{
		e.preventDefault();
	}
	$(".formContainer").append(formElement);
	updateSim();
}	
var updateSim = function()
{
	var rocket = getAllStageValues();
	main(rocket);
}
var saveStage = function(e)
{
	e.preventDefault();
	var rocket = getAllStageValues();
	console.log(savedConfig);
	if(savedConfig)
	{
		rocket["RocketID"] = rocketID;
	}
	rocket["userID"] = userID;
	var data = JSON.stringify(rocket);
	if(savedConfig)
	{
		sendRequest("./api/update.php", data, "POST");
	}
	else
	{
		sendRequest("./api/create.php", data, "POST");
	}
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
	var i = 0;
	$(".shipSelector").children().remove();
	for (rocket of rockets)
	{
		$(".shipSelector").append('<div class = "ship"><h2>'+rocket["Name"]+'</h2><p>'+rocket["numStages"]+' Stage(s)</p><button class = "useShip" id = "rocket'+i+'">Use Ship</button></div>');
		i++;
	}
	$(".shipSelector").show();
	console.log(rockets);
}
var deleteRocket = function()
{
	var temp = {};
	temp["userID"] = userID;
	temp["RocketID"] = rocketID;
	var data = JSON.stringify(temp);
	sendRequest("./api/remove.php", data, "POST");
}

$("body").on('click','.useShip', function(){
	var index = $(this).attr('id').substring(6);
	var rocket = rockets[index];
	if(!("stockShip" in rocket))
	{
		savedConfig = true;
		$("#deleteButton").removeClass("hiddenSave");
		rocketID = rocket["RocketID"];
	}
	else
	{
		savedConfig = false;
		$("#deleteButton").addClass("hiddenSave");
	}
	console.log(savedConfig);
	$("#rocketName")[0].innerHTML = rocket["Name"];
	console.log(rocket);
	for(var i = 0;i<rocket["numStages"]; i++)
	{
		var stageName = "Stage " + (i+1);
		var stage = rocket[stageName];
		var sInput = $(".stage")[i];
		sInput[0].value = stage["thrust"];
		sInput[1].value = stage["massInitial"];
		sInput[2].value = stage["massFinal"];
		sInput[3].value = stage["burnTime"];
		sInput[4].value = stage["drag"];
		if(i != rocket["numStages"] - 1)
		{
			$(".formContainer").append(formElement);
		}
	}
	updateSim();
	$(".shipSelector").hide();
});
var formCount = 0;
var addStageButton = document.querySelectorAll(".addStage")[0];
addStageButton.addEventListener("click",addStage);

var updateButton = document.querySelectorAll(".updateSim")[0];
updateButton.addEventListener("click",updateSim);

var saveButton = document.querySelectorAll("#saveButton")[0];
saveButton.addEventListener("click",saveStage);

var loadButton = document.querySelectorAll(".loadButton")[0];
loadButton.addEventListener("click",loadStage);

var deleteButton = document.querySelectorAll("#deleteButton")[0];
console.log(deleteButton);
deleteButton.addEventListener("click",deleteRocket);

document.getElementById("rocketName").addEventListener("input", function() {
    savedConfig = false;
    $("#deleteButton").addClass("hiddenSave");
});

var formElement = '<form class = "stage"><label>Thrust</label><input class = "thrust" placeholder="kN"><label>Initial Mass</label><input class = "initialMass" placeholder="kg"><label>Final Mass</label><input class = "finalMass" placeholder="kg"><label>Burn Time</label><input class = "burnTime" placeholder="s"><label>Drag co-efficient</label><input class = "drag" placeholder="no units"></form>';

var userID = "";
var savedConfig = false;
var rocketID;
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