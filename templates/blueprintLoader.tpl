{extends file='layout.tpl' }
{block name=title}Character Import{/block}
{block name=extrajavascript}
<script type="text/javascript" src="{$baseurl}/js/character.js">
</script>
<script type="text/javascript" src="{$baseurl}/js/skills.js">
</script>
{/block}
{block name=body}
<div class="panel panel-default">
<div class="panel-heading"><h1 class="panel-title">API details</h1></div>
<div class="panel-body">
<label for="key">Key</label><input type="text" id="key">
<label for="vcode">Vcode</label><input type="text" id="vcode">
<label for="characterID">Character ID</label><input type="text" id="characterID" value="{$auth_characterid}">
<label for="type">Type</label><select id=type><option>char</option><option>corp</option>
<button onclick="getblueprints();">Get Blueprints</button>
</div>
</div>
<div class="panel panel-default">
<div class="panel-heading"><h1 class="panel-title">Retrieved details</h1></div>
<div class="panel-body">
<table id="blueprints" class="table">
<thead>
<tr><th>Skill id</th><th>Skill level</th></tr>

</thead>
<tbody>
</tbody>
</table>
</div>
</div>
{/block}
