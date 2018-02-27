<?php
$data = json_decode(file_get_contents('php://input'), true);
if(array_key_exists(0,$data)) // If more than one stage
{
	foreach($data as $stage)
	{
		$thrust = $stage["thrust"];
		echo $thrust;
	}
}
else
{
	echo $data["thrust"];
}
?>