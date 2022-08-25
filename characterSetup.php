<?php
require_once 'includes/head.php';

$smarty->assign('auth_characterid', $_SESSION['auth_characterid'], true);

$smarty->display('character.tpl');
