<?php
$temp = json_decode(file_get_contents('php://input'));
$data["userID"] = $temp;
require "../../password.php";
$mysqli = new mysqli("localhost", "root", $password, "rocketsim");

require 'auth.php';

$result = $mysqli->query("SELECT * FROM Rockets WHERE UserID = " . $googleID);
if ($result->num_rows != 0) {
	$rockets = $result->fetch_all(MYSQLI_ASSOC);
	
	/*
	for($i = 0; $i<$numRows;$i++)
	{
		$rocket = $result->fetch_assoc();
		echo "SELECT * FROM Stages WHERE RocketID = " . $rocket["RocketID"];
		$result = $mysqli->query("SELECT * FROM Stages WHERE RocketID = " . $rocket["RocketID"]);
		//echo json_encode($result->fetch_all());
	}
	*/
	/*
	while ($rocket = $result->fetch_assoc())
	{
		echo "SELECT * FROM Stages WHERE RocketID = " . $rocket["RocketID"];
		$result = $mysqli->query("SELECT * FROM Stages WHERE RocketID = " . $rocket["RocketID"]);
		//echo json_encode($result->fetch_all());
	}
	*/
	foreach($rockets as $rocket)
	{
		//echo json_encode($rocket["RocketID"]);
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
			}
			echo json_encode($rocket);
		}
	}
}
?>