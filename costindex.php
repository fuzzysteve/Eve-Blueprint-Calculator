<?php
require_once 'includes/head.php';


$sql='select regionname,regionid from mapRegions where regionid<=10000069 order by regionname asc';

$stmt = $dbh->prepare($sql);
$stmt->execute();
$regions=array();
while ($row = $stmt->fetchObject()) {
    $regions[$row->regionid]=$row->regionname;
}

$smarty->assign('region', $regions);

$smarty->display('costindex.tpl');
