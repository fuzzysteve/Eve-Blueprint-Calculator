<?php

include('../includes/db.inc.php');

$name=$_GET['term'];
if (strlen($name)<2) {
    exit;
}
$exactname=$name;
$name="%".$name."%";
$sql=<<<EOS
SELECT typename,invTypes.typeid from industryActivityProducts,invTypes 
WHERE invTypes.typeid=productTypeID
and activityID=1
AND invTypes.published=1 
AND typename LIKE ? 
ORDER BY instr(typename,?) 
LIMIT 15
EOS;

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
$stmt=$dbh->prepare($sql);
$stmt->execute(array($name,$exactname));
$names=array();
while ($row=$stmt->fetchObject()) {
    $names[]=array('id'=>$row->typeid,'label'=>$row->typename,'value'=>$row->typename);
}

echo json_encode($names);
