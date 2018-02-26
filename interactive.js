var addStage = function(e)
{
	e.preventDefault();
	var newStage = getStageValues();

	main(newStage["thrust"],newStage["massIntial"],newStage["massFinal"],newStage["burnTime"],newStage["drag"]);
}
var saveStage = function(e)
{
	e.preventDefault();
	var newStage = getStageValues();
	var data = JSON.stringify(newStage);
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
var addStageButton = document.querySelectorAll("#addStage")[0];
addStageButton.addEventListener("click",addStage);

var saveButton = document.querySelectorAll("#saveButton")[0];
saveButton.addEventListener("click",saveStage);



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