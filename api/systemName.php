<?php

include('../includes/db.inc.php');

$name=$_GET['term'];
if (strlen($name)<2) {
    exit;
}
$name=$name."%";
$sql="SELECT solarSystemName FROM mapSolarSystems where solarSystemName like ? limit 5";

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
$stmt=$dbh->prepare($sql);
$stmt->execute(array($name));
$names=array();
while ($row=$stmt->fetchObject()) {
    $names[]=array('id'=>$row->solarSystemName,'label'=>$row->solarSystemName,'value'=>$row->solarSystemName);
}

echo json_encode($names);
