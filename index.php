<?php
require_once 'includes/head.php';


$sql='select id,name from evesupport.dbversions where id>0 order by id desc';

$stmt = $dbh->prepare($sql);

$stmt->execute();

$databases=array();
while ($row = $stmt->fetchObject()) {
    $databases[$row->id]=$row->name;
}

$smarty->assign('databases', $databases);

$smarty->display('index.tpl');
