<?php

$myfile = fopen("GET_log.txt", "w");


foreach($_GET as $key => $value){
  fwrite($myfile, $key . " : " . $value . "\r\n");
}

fclose($myfile);

?>
