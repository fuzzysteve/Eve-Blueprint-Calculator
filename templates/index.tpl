{extends file='layout.tpl' }
{block name=title}Blueprint Selection{/block}
{block name=extrajavascript}
<script src="{$baseurl}/js/items.js"></script>
<script type="text/javascript">
$(document).ready(function() {
    $("input#itemname").autocomplete({ source: source });
});

</script>
{/block}
{block name=body}
<h2>Blueprint Selection</h2>
<p>Enter the name of the item, or the name of the blueprint below. If you want to get details from a specific database, select it as well.</p>
<form action="{$baseurl}/display.php" method="GET">
<input type="text" name="itemname" id="itemname">
<select name="database">
{foreach $databases as $id=>$name}
    <option value="{$id}">{$name}</option>
{/foreach}
    <option value="0" selected>Current</option>
</select>
<input type="submit" value="Next">
</form>

<h2>Saved Blueprints</h2>
<p>If you save a blueprint on the main blueprint display page (currently done with cookies. When CCP finally get the SSO working, I'll probably allow saving with that.) then it will show up here, with the details autolinked.</p>

<ul id="blueprintlist">

</ul>

{/block}
