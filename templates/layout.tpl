<html>
  <head>
    <title>Blueprint Calculator - {block name=title}{/block}</title>
    <link href="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/themes/base/jquery-ui.css" rel="stylesheet" type="text/css"/>
    <link href="{$baseurl}/css/main.css" rel="stylesheet" type="text/css"/>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
    <link href="//cdn.datatables.net/plug-ins/be7019ee387/integration/bootstrap/3/dataTables.bootstrap.css" rel="stylesheet" type="text/css" />

    <script type="text/javascript" src="//cdn.datatables.net/1.10.1/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" src="//cdn.datatables.net/plug-ins/be7019ee387/integration/bootstrap/3/dataTables.bootstrap.js"></script>
    <script type="text/javascript" src="{$baseurl}/js/jquery.number.min.js"></script>

{block name=extrajavascript}{/block}


{include file='file:/home/web/fuzzwork/htdocs/bootstrap/header.php' }
</head>
<body {block name=bodyattributes}{/block}>
{include_php file='/home/web/fuzzwork/htdocs/menu/menubootstrap.php' }
<div class='container'>
{block name=body}{/block}
</div>
{include file='file:/home/web/fuzzwork/htdocs/bootstrap/footer.php' }
