<?php
header("Access-Control-Allow-Origin: *");
require_once('/home/web/fuzzwork/htdocs/blueprint/vendor/autoload.php');

if (isset($_GET['regionid']) and is_numeric($_GET['regionid'])) {
    $regionid=$_GET['regionid'];
} else {
    $regionid=10000002;
}

if (isset($_GET['typeids'])) {
    $typeids=json_decode($_GET['typeids']);
    if (!is_array($typeids)) {
        $typeids=array();
    }
    $typeids=array_values(array_filter($typeids, 'is_numeric'));
} else {
    $typeids=array();
}


use EvePrices\EvePrices;

$prices=new \EvePrices\EvePrices(array(
    'source'=>'redis',
    'region'=>$regionid,
    'host'=>'127.0.0.1',
    'port'=>6379,
    'scheme'=>'tcp'
    ));



$pricearray=$prices->returnPriceArray($typeids);

echo json_encode($pricearray, JSON_NUMERIC_CHECK);
