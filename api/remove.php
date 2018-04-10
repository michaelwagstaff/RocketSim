<?php
$data = json_decode(file_get_contents('php://input'), true);
require "../../password.php";
$mysqli = new mysqli("localhost", "root", $password, "rocketsim");

require 'auth.php';

$mysqli->query("DELETE FROM Stages WHERE RocketID = '".$data["RocketID"]."'"); //Add some check that the user is deleting their own data
$mysqli->query("DELETE FROM Rockets WHERE RocketID = '".$data["RocketID"]."' AND UserID = '".$googleID."'");

?>