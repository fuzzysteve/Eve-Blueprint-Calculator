<?php

include('../../includes/db.inc.php');

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);





$sql=<<<EOS
SELECT slk.id 
FROM industrySupport.shoppingListKey slk 
LEFT JOIN industrySupport.shoppingListItem sli ON (sli.shoppingListKey=slk.id)
WHERE sli.shoppingListKey IS NULL
EOS;

$stmt=$dbh->prepare($sql);
try {
    $stmt->execute();
} catch (PDOException  $e) {
    echo '{"error":"Cannot find Item"}';
    exit;
}

$sql="delete from industrySupport.shoppingListKey where id=?";

$stmt2=$dbh->prepare($sql);


while ($row=$stmt->fetchObject()) {
    $itemid=$row->id;
    $stmt2->execute(array($itemid));
}
