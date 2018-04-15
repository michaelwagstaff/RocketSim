<?php
$data = json_decode(file_get_contents('php://input'), true);
require "../../password.php";
$mysqli = new mysqli("localhost", "root", $password, "rocketsim");

require 'auth.php';

$info = [];
$info["Name"] = $data["Name"];
$info["RocketID"] = $data["RocketID"];
unset($data["Name"]);
unset($data["userID"]);
unset($data["RocketID"]);
$date = new DateTime();
$info["DateCreated"] = date('Y-m-d',$date->getTimestamp());
echo $info["DateCreated"];

$mysqli->query("DELETE FROM Stages WHERE RocketID = '".$info["RocketID"]."'");
$mysqli->query("DELETE FROM Rockets WHERE RocketID = '".$info["RocketID"]."' AND UserID = '".$googleID."'");


$mysqli->query("INSERT INTO Rockets VALUES('".$info["RocketID"]."','".$googleID."','".$info["Name"]."','".$info["DateCreated"]."')");

$i = 1;
foreach($data as $s)
{
	$mysqli->query("INSERT INTO Stages VALUES(".$i.",'".$info["RocketID"]."',".$s["thrust"].",".$s["massInitial"].",".$s["massFinal"].",".$s["burnTime"].",".$s["drag"].")");
	$i++;
}
echo $info["Name"]." has been saved";
?>