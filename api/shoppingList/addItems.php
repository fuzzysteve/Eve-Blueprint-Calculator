<?php

include('../../includes/db.inc.php');
include('../../includes/nonce.inc.php');

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if (!isset($_SESSION['auth_id'])
    or !isset($_POST['nonce'])
    or !isset($_POST['listid'])
    or !isset($_POST['identifier'])
    or !isset($_POST['itemJson'])
    ) {
    echo '{"error":"Bad Settings"}';
    exit;
}


if ($_POST['nonce'] != md5($session_nonce.$_SESSION['auth_id'].$_SESSION['auth_state'])) {
    echo '{"error":"Bad Nonce"}';
    exit;
}
$identifier=preg_replace("/[^A-Za-z0-9 ]/", '', $_POST['identifier']);


if (strlen($identifier)>70) {
    exit;
}

$items=json_decode($_POST['itemJson'], true);

if (is_null($items)) {
    exit;
}




$sql=<<<EOS
SELECT identifier,id
FROM industrySupport.shoppingList
WHERE id=:id
AND owner=:owner
EOS;

$stmt=$dbh->prepare($sql);
try {
    $stmt->execute(array(":owner"=>$_SESSION['auth_id'], ":id"=>$_POST['listid']));
} catch (PDOException  $e) {
    echo '{"error":"Cannot find list"}';
    exit;
}
if ($row=$stmt->fetchObject()) {
    $listid=$row->id;
    $listidentifier=$row->identifier;
} else {
    echo '{"error":"Cannot find list"}';
    exit;
}

$dbh->beginTransaction();

$sql=<<<EOS
insert into industrySupport.shoppingListKey (shoppingList,identifier) values (:shoppinglist,:identifier)
EOS;

$stmt=$dbh->prepare($sql);

try {
    $stmt->execute(array(":shoppinglist"=>$listid, ":identifier"=>$identifier));
} catch (PDOException  $e) {
    echo '{"error":"Cannot insert"}';
    exit;
}
$keyid=$dbh->lastInsertId();


$sql=<<<EOS
insert into industrySupport.shoppingListItem (shoppingListKey,typeid,quantity) 
values (:shoppinglistkey,:typeid,:quantity)
EOS;



$stmt=$dbh->prepare($sql);

foreach ($items as $item) {
    try {
        $stmt->execute(array(":shoppinglistkey"=>$keyid, ":typeid"=>$item['typeid'],":quantity"=>$item['jobquantity']));
    } catch (PDOException  $e) {
        echo '{"error":"Cannot insert items"}';
        exit;
    }
}
$dbh->commit();
echo '{"status":"success"}';
