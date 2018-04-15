<?php
$data = json_decode(file_get_contents('php://input'), true);
require "../../password.php";
$mysqli = new mysqli("localhost", "root", $password, "rocketsim");

require 'auth.php';

$info = [];
$info["Name"] = $data["Name"];
unset($data["Name"]);
unset($data["userID"]);
$info["RocketID"] = getAlphaNumericID();
$date = new DateTime();
$info["DateCreated"] = date('Y-m-d H:i:s',$date->getTimestamp());


$mysqli->query("INSERT INTO Rockets VALUES('".$info["RocketID"]."','".$googleID."','".$info["Name"]."','2018-04-09')");

$i = 1;
foreach($data as $s)
{
	$mysqli->query("INSERT INTO Stages VALUES(".$i.",'".$info["RocketID"]."',".$s["thrust"].",".$s["massInitial"].",".$s["massFinal"].",".$s["burnTime"].",".$s["drag"].")");
	$i++;
}
echo $info["Name"]." has been saved";



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