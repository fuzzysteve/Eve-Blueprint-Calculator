<?php

include('../../includes/db.inc.php');
include('../../includes/nonce.inc.php');

if (!isset($_SESSION['auth_id']) or !isset($_GET['listnonce'])) {
    echo "no session";
    exit;
}


if ($_GET['listnonce'] != md5($list_nonce.$_SESSION['auth_id'].$_SESSION['auth_state'])) {
    exit;
}


$sql="SELECT id,identifier FROM industrySupport.shoppingList where owner=?";
$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
$stmt=$dbh->prepare($sql);
$stmt->execute(array($_SESSION['auth_id']));
$names=array();
while ($row=$stmt->fetchObject()) {
    $names[]=array('id'=>$row->id,'name'=>$row->identifier);
}

echo json_encode($names, JSON_NUMERIC_CHECK);
