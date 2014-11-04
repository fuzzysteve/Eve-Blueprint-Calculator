<?php

require_once('../includes/db.inc.php');
$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);

$servicesql='';
$servicewhere='';
if (isset($_REQUEST['lab']) or isset($_REQUEST['factory'])) {
    
    $servicesql=' 
    JOIN evesupport.bitSolarSystemServices bsss ON  (bsss.solarsystemid=mss.solarsystemid)
    ';

    if (isset($_REQUEST['lab']) and isset($_REQUEST['factory'])) {
        $servicewhere=' and bsss.service&24576 = 24576  ';
    } elseif (isset($_REQUEST['lab'])) {
        $servicewhere=' and bsss.service&16384 = 16384 ';
    } elseif (isset($_REQUEST['factory'])) {
        $servicewhere=' and bsss.service&8192 = 8192 ';

    }
}


if (isset($_REQUEST['region'])) {
    $region=$_REQUEST['region'];
    $param=$region;
    $sql='SELECT regionID id FROM mapRegions WHERE regionid=?';
    $sql2="SELECT ci.solarSystemID,solarSystemName,activityID,costIndex,mss.security,0 length
    FROM evesupport.costIndex ci 
    JOIN mapSolarSystems mss on (ci.solarSystemID=mss.solarSystemID) 
    $servicesql
    WHERE regionID=?
    $servicewhere
    ";
} elseif (isset($_REQUEST['system']) and isset($_REQUEST['jumps'])) {
    $systemname=$_REQUEST['system'];
    $param=$systemname;
    $jumps=$_REQUEST['jumps'];
    $sql="SELECT solarSystemID id from mapSolarSystems where solarsystemname=?";
    $sql2="
SELECT ci.solarSystemID,solarSystemName,activityID,costIndex,mss.security,length 
FROM evesupport.costIndex ci 
JOIN mapSolarSystems mss on (ci.solarSystemID=mss.solarSystemID) 
JOIN evesupport.routefullsmall on ((mss.solarSystemID=end and start=:system) and length<=:length)
$servicesql
where 1=1
$servicewhere
            ";
            error_log($sql2);
} else {
    header("HTTP/1.1 500 Internal Server Error");
    exit;
}



$stmt = $dbh->prepare($sql);
$stmt->execute(array($param));

if ($row = $stmt->fetchObject()) {
    $id=(int)$row->id;
    error_log($id);
} else {
    header("HTTP/1.1 500 Internal Server Error");
    exit;
}

$stmt = $dbh->prepare($sql2);

if (isset($jumps)) {
    if ($jumps<16) {
        $params=array(':system'=>$id,':length'=>$jumps);
    } else {
        $params=array(':system'=>$id,':length'=>10);
    }
} else {
    $params=array($id);
}


$stmt->execute($params);

$activity=array();
$solarsystems=array();
$security=array();
$length=array();
while ($row = $stmt->fetchObject()) {
    $activity[(int)$row->solarSystemID][(int)$row->activityID]=$row->costIndex;
    $security[(int)$row->solarSystemID]=$row->security;
    $solarsystems[(int)$row->solarSystemID]=$row->solarSystemName;
    $length[(int)$row->solarSystemID]=(int)$row->length;
}
$output=array();

foreach ($solarsystems as $id => $name) {
    $output[]=array('solarSystemName'=>$name,
        'solarSystemID'=>$id,
        'costIndexes'=>$activity[$id],
        'security'=>$security[$id],
        'length'=>$length[$id]);
}


echo json_encode($output, JSON_NUMERIC_CHECK);
