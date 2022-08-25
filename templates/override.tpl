{extends file='layout.tpl' }
{block name=title}Blueprint Display{/block}
{block name=extrajavascript}
<script src="{$baseurl}/js/override.js"></script>
<script src="{$baseurl}/js/items.js"></script>
{literal}
<script>
materialTypeNames=Array()
$.getJSON("/api/typenames.php",function(data) {
 materialTypeNames=data;
 listOverrides();
}
);


</script>
{/literal}
{/block}
{block name=body}
<div id="mainbody">
<div id="name_div"><h1 id='nameDiv'></h1></div>
<div id="link_div"></div>
<div id="skills_div">
    <div id="skills_div_panel" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title">Overridden prices</h1></div>
        <div id="collapseSkills" class="panel">
            <div class="panel-body">
                <table border=1 id="priceTable" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Material</th>
                            <th>Overridden Price</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>



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
