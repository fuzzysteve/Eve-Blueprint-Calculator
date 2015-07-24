<?php
require_once 'includes/head.php';


if (isset($_SESSION['auth_characterid'])) {
    $smarty->assign('auth_characterid', $_SESSION['auth_characterid']);
    $smarty->assign('sessionnonce', md5($session_nonce.$_SESSION['auth_id'].$_SESSION['auth_state']));
    $smarty->assign('listnonce', md5($list_nonce.$_SESSION['auth_id'].$_SESSION['auth_state']));
} else {
    $smarty->assign('auth_characterid', 0);
}


$smarty->display('shoppinglist.tpl');
