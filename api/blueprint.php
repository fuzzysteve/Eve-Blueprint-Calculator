<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
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
try {
    $blueprint= new EveBlueprint($dbh, $itemid);
} catch (Exception $e) {
    echo '{"requestedid":'.$itemid.'}';
    exit;
}
$returnarray=array();

$returnarray["requestedid"]=$itemid;
$returnarray['blueprintSkills']=$blueprint->blueprintSkills();
$returnarray['blueprintDetails']=$blueprint->blueprintDetails();
$returnarray['activityMaterials']=$blueprint->activityMaterials();
$returnarray['decryptors']=$blueprint->decryptors();


echo json_encode($returnarray, JSON_NUMERIC_CHECK);
