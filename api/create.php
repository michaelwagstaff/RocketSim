<?php
$stack = json_decode(file_get_contents('php://input'), true);
if(array_key_exists(0,$data)) // If more than one stage
{

}
else
{
	echo $data["thrust"];
}
?>