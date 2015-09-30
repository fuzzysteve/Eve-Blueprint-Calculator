<?php
header("Access-Control-Allow-Origin: *");
header("Content-type: application/xml");
$seconds_to_cache = 43200;
$ts = gmdate("D, d M Y H:i:s", time() + $seconds_to_cache) . " GMT";
header("Expires: $ts");
header("Pragma: cache");
header("Cache-Control: max-age=$seconds_to_cache");
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

$blueprint= new EveBlueprint($dbh, $itemid);
$returnarray=array();


$returnarray['blueprintDetails']=$blueprint->blueprintDetails();
$returnarray['activityMaterials']=$blueprint->activityMaterials();


$xml = new SimpleXMLElement('<eveapi/>');
foreach ($returnarray['activityMaterials'] as $activity => $details) {
    $activityXml=$xml->addChild('activity');
    $activityXml->addAttribute('activity', $activity);
    $materialXml=$activityXml->addChild('materials');
    if (isset($_GET['type']) and ($_GET['type']=='attribute')) {
        $add="addAttribute";
    } else {
        $add="addChild";
    }
    foreach ($details as $material) {
        $mat=$materialXml->addChild('material');
        $mat->$add('name', $material['name']);
        $mat->$add('typeid', $material['typeid']);
        $mat->$add('quantity', $material['quantity']);
        $mat->$add('consume', 1);
        $mat->$add(
            'condensed',
            $material['name'].";".$material['typeid'].";".$material['quantity'].";1"
        );
    }
}

print $xml->asXML();
