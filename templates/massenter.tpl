{extends file='layout.tpl' }
{block name=title}Blueprint Calculations{/block}
{block name=extrajavascript}
<script type="text/javascript" src="{$baseurl}/js/massenter.js">
</script>
{/block}
{block name=body}
<p>In System {$systemname}</p>
<table class="blueprints table" id="blueprints">
<thead>
    <tr>
        <th title="Original or Copy?">O</th>
        <th>ID</th>
        <th>Blueprint</th>
        <th title="All for BPC, 1 day or 1 run for BPO">Runs</th>
        <th>Material Cost</th>
        <th>Build Cost</th>
        <th title="Seconds">Build Duration</th>
        <th>isk/hr</th>
        <th>isk/hr 24hr</th>
        <th title="Per run">Jita Unit Price</th>
        <th title="All runs for BPC, 1 day or 1 run for BPO">Profit</th>
    </tr>
</thead>
<tbody>
{foreach from=$blueprints item=blueprint}
<tr><td>{if $blueprint.copy}C{else}O{/if}</td><td>{$blueprint.typeid}</td><td><a target="_NEW"  href="/blueprint/?typeid={$blueprint.typeid}">{$blueprint.name}</a></td><td>{$blueprint.runs}</td><td>{$blueprint.materialcost}</td><td>{$blueprint.buildcost}</td><td>{$blueprint.duration}</td><td>{$blueprint.iskhr}</td><td>{$blueprint.iskhr24}</td><td>{$blueprint.jitaprice}</td><td>{$blueprint.profit}</td></tr>
{/foreach}
</tbody>
</table>
{/block}
