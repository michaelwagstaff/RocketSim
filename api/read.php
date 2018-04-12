<?php
//echo file_get_contents('php://input');
$temp = json_decode(file_get_contents('php://input'));
$data["userID"] = $temp;
require "../../password.php";
$mysqli = new mysqli("localhost", "root", $password, "rocketsim");

require 'auth.php';


$result = $mysqli->query("SELECT * FROM Rockets WHERE UserID = " . $googleID);
if ($result->num_rows != 0) {
	while ($rocket = $result->fetch_assoc())
	{
		echo json_encode($rocket);
	}
}
?>