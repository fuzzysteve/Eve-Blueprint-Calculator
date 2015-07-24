<?php

include('../../includes/db.inc.php');
include('../../includes/nonce.inc.php');

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if (!isset($_SESSION['auth_id'])
    or !isset($_POST['nonce'])
    or !isset($_POST['listid'])
    ) {
    echo '{"error":"Bad Settings"}';
    exit;
}


if ($_POST['nonce'] != md5($session_nonce.$_SESSION['auth_id'].$_SESSION['auth_state'])) {
    echo '{"error":"Bad Nonce"}';
    exit;
}




$sql=<<<EOS
SELECT it.typeid,it.typename,quantity,slk.identifier,sli.id,quantity*price sellprice,volume*quantity/portionSize volume
FROM industrySupport.shoppingList sl
JOIN industrySupport.shoppingListKey slk on (slk.shoppingList=sl.id)
JOIN industrySupport.shoppingListItem sli on (sli.shoppingListKey=slk.id)
JOIN invTypes it on (sli.typeid=it.typeid)
join evesupport.sellprices on (sellprices.typeid=it.typeid and region=10000002)
WHERE sl.id=:id
AND sl.owner=:owner
EOS;

$stmt=$dbh->prepare($sql);
try {
    $stmt->execute(array(":owner"=>$_SESSION['auth_id'], ":id"=>$_POST['listid']));
} catch (PDOException  $e) {
    echo '{"error":"Cannot find list"}';
    exit;
}
$items=array();
while ($row=$stmt->fetchObject()) {
    $items[]=array(
        'id'=>$row->id,
        'identifier'=>$row->identifier,
        'typename'=>$row->typename,
        'typeid'=>$row->typeid,
        'quantity'=>$row->quantity,
        'sellprice'=>$row->sellprice,
        'volume'=>$row->volume
    );
}

echo json_encode($items, JSON_NUMERIC_CHECK);
