<?php

include('../../includes/db.inc.php');
include('../../includes/nonce.inc.php');

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if (!isset($_SESSION['auth_id']) or !isset($_POST['nonce']) or !isset($_POST['identifier'])) {
    echo '{"error":"Bad Values"}';
    exit;
}


if ($_POST['nonce'] != md5($session_nonce.$_SESSION['auth_id'].$_SESSION['auth_state'])) {
    echo '{"error":"Bad Nonce"}';
    exit;
}

$identifier=preg_replace("/[^A-Za-z0-9 ]/", '', $_POST['identifier']);


if (strlen($identifier)>30) {
    exit;
}


$sql=<<<EOS
insert into industrySupport.shoppingList (owner,identifier) values (:owner,:identifier)
EOS;

$stmt=$dbh->prepare($sql);

try {
    $stmt->execute(array(":owner"=>$_SESSION['auth_id'], ":identifier"=>$identifier));
} catch (PDOException  $e) {
    echo '{"error":"Cannot insert"}';
}
$id=$dbh->lastInsertId();
echo json_encode(array("id"=>$id,"name"=>$identifier));
