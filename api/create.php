<?php
$data = json_decode(file_get_contents('php://input'), true);
//echo file_get_contents('php://input');
//$mysqli = new mysqli("localhost", "root", "", "rocketsim");
$rocket = [];
$rocket["userID"] = $data["userID"];
//echo "ID Token: " . $rocket["userID"];
$rocket["Name"] = $data["Name"];
$rocket["RocketID"] = getAlphaNumericID();
$date = new DateTime();
$rocket["DateCreated"] = date('Y-m-d H:i:s',$date->getTimestamp());
//$mysqli->query("INSERT INTO 'rockets' VALUES('Person', 'hfrughbsk', 'Name', '2018-03-02 10:43:20')");
//$mysqli->close();
//$stmt->execute();

//echo $rocket["DateCreated"];
foreach($data as $stage)
{
	/*$thrust = $stage["thrust"];
	echo $thrust;*/
}



function getAlphaNumericID()
{
	$characters = array_merge(range(0,9), range('a', 'z'),range('A', 'Z'));
	$id = "";
	for($i=0; $i < 10; $i++) {
		$id .= $characters[mt_rand(0, count($characters) - 1)];
	}
	return $id;
}
?>