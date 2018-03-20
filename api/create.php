<?php
$data = json_decode(file_get_contents('php://input'), true);
//echo file_get_contents('php://input');
//$mysqli = new mysqli("localhost", "root", "", "rocketsim");
$rocket = [];
$rocket["userID"] = $data["userID"];

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
$query = http_build_query([
		 'id_token' => $data["userID"]
		]);
$ch = curl_init("https://www.googleapis.com/oauth2/v3/tokeninfo?".$query);
$options = array(
    CURLOPT_RETURNTRANSFER => false,   // return web page
    CURLOPT_HEADER         => false,  // don't return headers
    CURLOPT_FOLLOWLOCATION => true,   // follow redirects
    CURLOPT_MAXREDIRS      => 10,     // stop after 10 redirects
    CURLOPT_ENCODING       => "",     // handle compressed
    CURLOPT_USERAGENT      => "", // name of client
    CURLOPT_AUTOREFERER    => true,   // set referrer on redirect
    CURLOPT_CONNECTTIMEOUT => 120,    // time-out on connect
    CURLOPT_TIMEOUT        => 120,    // time-out on response
    CURLOPT_SSL_VERIFYPEER => false,
); 
curl_setopt_array($ch, $options);
curl_exec($ch);
if (!curl_errno($ch)) {
	if ($http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE)) {
		echo "200";
	}
}
else
{
	echo curl_error($ch);
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