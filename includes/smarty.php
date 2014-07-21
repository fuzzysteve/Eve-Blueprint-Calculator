<?php

require_once $basedir."/vendor/autoload.php";

$smarty = new SmartyBC();

$smarty->setTemplateDir($basedir.'/templates');
$smarty->setCompileDir($basedir.'/templates_c');
$smarty->setCacheDir($basedir.'/cache');
$smarty->setConfigDir($basedir.'/configs');
$smarty->security=false;

$smarty->setCaching(Smarty::CACHING_LIFETIME_SAVED);
$smarty->assign('baseurl', $baseurl);
