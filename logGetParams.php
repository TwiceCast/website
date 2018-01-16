<?php

$myfile = fopen("GET_log.txt", "w");

if ($myfile == FALSE)
    print_r(error_get_last());

foreach($_GET as $key => $value){
  fwrite($myfile, $key . " : " . $value . "\r\n");
}

fclose($myfile);

?>
