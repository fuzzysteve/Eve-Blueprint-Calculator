<?php
require_once 'includes/head.php';


$sql='select regionname,regionid from mapRegions where regionid<=10000069 order by regionname asc';

$stmt = $dbh->prepare($sql);
$stmt->execute();
$regions=array();
while ($row = $stmt->fetchObject()) {
    $regions[$row->regionid]=$row->regionname;
}

$smarty->assign('regions', $regions);
if (isset($_SESSION['auth_characterid'])) {
    $smarty->assign('auth_characterid', $_SESSION['auth_characterid']);
    $smarty->assign('sessionnonce', md5($session_nonce.$_SESSION['auth_id'].$_SESSION['auth_state']));
    $smarty->assign('listnonce', md5($list_nonce.$_SESSION['auth_id'].$_SESSION['auth_state']));
} else {
    $smarty->assign('auth_characterid', 0);
}


$smarty->display('override.tpl');
