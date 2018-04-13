<?php
$query = http_build_query([
		 'id_token' => $data["userID"]
		]);
$ch = curl_init("https://www.googleapis.com/oauth2/v3/tokeninfo?".$query);
$options = array(
    CURLOPT_RETURNTRANSFER => true,   // return web page
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
$payload = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if (!curl_errno($ch)) {
    if ($http_code == 200) {
        $payload = json_decode($payload);
        $googleID = $payload->sub;
		handleUser($googleID, $mysqli);
	}
    else
    {
        echo $http_code;
        die($http_code);
    }
}
else
{
    echo $http_code;
	echo curl_error($ch); //change for production
    die();
}
function handleUser($id, $mysqli)
{
    $result = $mysqli->query("SELECT * FROM Users WHERE UserID = '". $id ."'");
    if($result->num_rows == 0) //$result is not an object -- to fix
    {
        $mysqli->query("INSERT INTO Users VALUES('".$id."','','2018-04-09')");
    }
    else
    {

    }
    echo $mysqli->error;
}
?>