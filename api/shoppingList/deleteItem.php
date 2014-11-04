<?php

include('../../includes/db.inc.php');
include('../../includes/nonce.inc.php');

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if (!isset($_SESSION['auth_id'])
    or !isset($_POST['nonce'])
    or !isset($_POST['itemid'])
    ) {
    echo '{"error":"Bad Settings"}';
    exit;
}


if ($_POST['nonce'] != md5($session_nonce.$_SESSION['auth_id'].$_SESSION['auth_state'])) {
    echo '{"error":"Bad Nonce"}';
    exit;
}




$sql=<<<EOS
SELECT sli.id
FROM industrySupport.shoppingListItem sli
join industrySupport.shoppingListKey slk on (sli.shoppingListkey=slk.id)
join industrySupport.shoppingList sl on (slk.shoppingList=sl.id)
WHERE sli.id=:id
AND owner=:owner
EOS;

$stmt=$dbh->prepare($sql);
try {
    $stmt->execute(array(":owner"=>$_SESSION['auth_id'], ":id"=>$_POST['itemid']));
} catch (PDOException  $e) {
    echo '{"error":"Cannot find Item"}';
    exit;
}
if ($row=$stmt->fetchObject()) {
    $itemid=$row->id;
} else {
    echo '{"error":"Cannot find item"}';
    exit;
}

$dbh->beginTransaction();

$sql=<<<EOS
delete from industrySupport.shoppingListItem
WHERE id=:id
EOS;

$stmt=$dbh->prepare($sql);

try {
    $stmt->execute(array(":id"=>$itemid));
} catch (PDOException  $e) {
    echo '{"error":"Cannot delete"}';
    exit;
}
$dbh->commit();
echo '{"status":"success"}';
