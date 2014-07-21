<?php

require_once('../includes/db.inc.php');

if (isset($_REQUEST['solarsystem'])) {
    $systemname=$_REQUEST['solarsystem'];
    $sql='SELECT solarSystemID,solarSystemName FROM mapSolarSystems WHERE LOWER(solarSystemName)=lower(?)';
} else {
    header("HTTP/1.1 500 Internal Server Error");
    exit;
}



$stmt = $dbh->prepare($sql);
$stmt->execute(array($systemname));

if ($row = $stmt->fetchObject()) {
    $solarsystemid=(int)$row->solarSystemID;
    $solarsystemname=$row->solarSystemName;
} else {
    header("HTTP/1.1 500 Internal Server Error");
    exit;
}

$sql="SELECT activityID,costIndex FROM evesupport.costIndex WHERE solarSystemID=?";

$stmt = $dbh->prepare($sql);
$stmt->execute(array($solarsystemid));

$activity=array();
while ($row = $stmt->fetchObject()) {
    $activity[(int)$row->activityID]=$row->costIndex;
}


$return=array('solarSystemName'=>$solarsystemname,'solarSystemID'=>$solarsystemid,'costIndexes'=>$activity);
echo json_encode($return, JSON_NUMERIC_CHECK);
