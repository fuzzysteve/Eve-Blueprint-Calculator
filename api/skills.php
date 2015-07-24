<?php
$expires = 14400;
header("Pragma: public");
header("Cache-Control: maxage=".$expires);
header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$expires) . ' GMT');
header('Content-Type: application/javascript');

require_once('../includes/db.inc.php');

$sql='select typename,typeid from invTypes join invGroups on (invTypes.groupid=invGroups.groupid) where categoryid=16 order by typename';

$stmt = $dbh->prepare($sql);

$stmt->execute();

echo "skillLookup={";
$row = $stmt->fetchObject();
    echo "'".$row->typeid."':". "'".$row->typename."'";
while ($row = $stmt->fetchObject()) {
    echo ",'".$row->typeid."':". "'".$row->typename."'";
}
echo "};\n";
