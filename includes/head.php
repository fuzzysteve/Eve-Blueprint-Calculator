<?php
session_start();
$basedir="/home/web/fuzzwork/htdocs/blueprint";
$baseurl="/blueprint";


require_once $basedir.'/includes/smarty.php';
require_once $basedir.'/includes/db.inc.php';
require_once $basedir.'/includes/nonce.inc.php';
