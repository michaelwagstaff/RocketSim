<?php
//$temp = json_decode(file_get_contents('php://input'));
$data["userID"] = $_GET["userID"];
require "../../password.php";
$mysqli = new mysqli("localhost", "root", $password, "rocketsim");

require 'auth.php';

$result = $mysqli->query("SELECT * FROM Rockets WHERE UserID = " . $googleID);
if ($result->num_rows != 0) {
	$rockets = $result->fetch_all(MYSQLI_ASSOC);
	$returnRockets = [];
	foreach($rockets as $rocket)
	{
		$result = $mysqli->query("SELECT * FROM Stages WHERE RocketID = '" . $rocket["RocketID"]."'");
		$stages = $result->fetch_all(MYSQLI_ASSOC);
		if(!empty($stages))
		{
			unset($rocket["UserID"]);
			foreach($stages as $stage)
			{
				$stageName = "Stage " . $stage["StageNum"];
				$rocket[$stageName] = [];
				$rocket[$stageName]["thrust"] = $stage["Thrust"];
				$rocket[$stageName]["massInitial"] = $stage["InitialMass"];
				$rocket[$stageName]["massFinal"] = $stage["FinalMass"];
				$rocket[$stageName]["burnTime"] = $stage["BurnTime"];
				$rocket[$stageName]["drag"] = $stage["Drag"];
				$rocket["numStages"] = $stage["StageNum"];
			}
			$returnRockets[] = $rocket;
		}
	}
	echo json_encode($returnRockets);
}
?>