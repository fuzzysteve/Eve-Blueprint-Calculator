<?php
header("Access-Control-Allow-Origin: *");
require_once('../includes/db.inc.php');
require_once('/home/web/fuzzwork/htdocs/blueprint/vendor/autoload.php');

if (array_key_exists('typename', $_REQUEST)) {
    $bpid=$_REQUEST['typename'];
    $sql='select typename,typeid from invTypes where lower(typename)=lower(?)';
} elseif (array_key_exists('typeid', $_GET)) {
    $bpid=$_GET['typeid'];
    $sql='select typename,typeid from invTypes where typeid=?';
} else {
    exit;
}



$stmt = $dbh->prepare($sql);
$stmt->execute(array($bpid));

if ($row = $stmt->fetchObject()) {
    $itemname=$row->typename;
    $itemid=$row->typeid;
} else {
    $itemname="bad item";
    $itemid=0;
    exit;
}





use EveBlueprint\EveBlueprint;
use EveCharacter\EveCharacter;

$character= new EveCharacter(5);
$blueprint= new EveBlueprint($dbh, $itemid);
$returnarray=array();


$returnarray['blueprintSkills']=$blueprint->blueprintSkills();
$returnarray['blueprintDetails']=$blueprint->blueprintDetails();
$returnarray['activityMaterials']=$blueprint->activityMaterials();
$returnarray['metaVersions']=$blueprint->metaVersions();


echo json_encode($returnarray);
