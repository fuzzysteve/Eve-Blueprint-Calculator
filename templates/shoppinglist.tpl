{extends file='layout.tpl' }
{block name=title}Shopping Lists{/block}
{block name=extrajavascript}
<script type="text/javascript" src="{$baseurl}/js/shoppinglist.js">
</script>
{/block}
{block name=body}
{nocache}
 {if $auth_characterid==0}
<p>Shopping lists are only available to logged in users</p>
{else}
<select id="shoppingListSelect" onchange='loadListContents();'>
<option selected value='die'>Select a list</option>
</select>
{/if}
{/nocache}
<table class="table" id="items">
<caption>Breakdown</caption>
<thead>
    <tr>
        <th>id</th>
        <th>key</th>
        <th>Item</th>
        <th>Quantity</th>
        <th>Ballpark Jita Price</th>
        <th>Delete</th>
    </tr>
</thead>
<tbody>
</tbody>
</table>
<hr>
<table class="table" id="totals">
<caption>Totals</caption>
<thead>
    <tr>
    <th>Item</th>
    <th>Quantity</th>
    </tr>
</thead>
<tbody>
</tbody>
</table>


<script type="text/javascript">
{nocache}
{if $auth_characterid>0}
nonce='{$sessionnonce}';
listnonce='{$listnonce}';
characterid='{$auth_characterid}';
{else}
characterid=0;
{/if}
{/nocache}
</script>


{/block}
