{extends file='layout.tpl' }
{block name=title}Regional Cost Indexes{/block}
{block name=extrajavascript}
<script type="text/javascript" src="{$baseurl}/js/costindex.js">
</script>
{/block}
{block name=body}
<div class="row">
<div class="col-md-4">
<p>Just select a region</p>
<select id="region" onchange="loadRegionIndexes();">
<option value=0>Select a region</option>
{foreach $region as $id=>$name}
    <option value="{$id}">{$name}</option>
{/foreach}
</select>
</div>
<div class="col-md-4">
<p>Or pick a system, and a number of jumps</p>
<label for="systemname">System name</label><input type=text placeholder='System Name' id="systemname">
<select id="jumps">
<option>1</option>
<option>2</option>
<option>3</option>
<option selected>4</option>
<option>5</option>
<option>6</option>
<option>7</option>
<option>8</option>
<option>9</option>
<option>10</option>
</select><br>
<input type="button" onclick="loadRangeIndexes();" value="Load Range">
</div>
<div class="col-md-4">
<p>These only work, when you have them set before loading.</p>
<p>Set both for systems with both factories and labs (may be different stations)</p>
<label for="factory">Require Factory</label><input type="checkbox" id="factory"><br>
<label for="lab">Require Lab</label><input type="checkbox" id="lab"><br>
</div>
</div>
<hr>
<input type=button value="hide/show Low Sec" onclick="hideshow('lowsec');">
<input type=button value="hide/show High Sec" onclick="hideshow('highsec');">
<input type=button value="hide/show Null Sec" onclick="hideshow('nullsec');">
<table class="table" id="costIndex">
<thead>
    <tr>
        <th>System Name</th>
        <th>Manufacturing</th>
        <th>TE Research</th>
        <th>ME Research</th>
        <th>Copying</th>
        <th>Reverse Engineering</th>
        <th>Invention</th>
        <th>Reactions</th>
        <th>Security</th>
        <th title="Affects the impact of installing jobs on the cost index">Manuf Multi</th>
        <th Title="Affects the impact of installing jobs on the cost index">Research Multi</th>
        <th>Jumps</th>
    </tr>
</thead>
<tbody>
</tbody>
</table>


{/block}
