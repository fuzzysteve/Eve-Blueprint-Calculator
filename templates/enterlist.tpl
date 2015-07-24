{extends file='layout.tpl' }
{block name=title}Mass Entry{/block}
{block name=extrajavascript}
{literal}
<script>
$(document).ready(function() {
    $(function() {
        $("#systemName").autocomplete({
            source:"/blueprint/api/systemName.php",
            minLength:2,
            change: function( event, ui ) { $("#systemName").val(ui.item.value);},
            select: function( event, ui ) { $("#systemName").val(ui.item.value);}
        });
    });
});

</script>
{/literal}

{/block}
{block name=body}
<div id="mainbody">
<p>This expects a list of blueprints, in the format spit out by <a href="https://github.com/fuzzysteve/eve-googledocs-script/blob/master/blueprints.gs">https://github.com/fuzzysteve/eve-googledocs-script/blob/master/blueprints.gs</a> as I needed something to specify a format.</p>
<p>T2 doesn't take invention costs into account, just manufacturing</p>
<form action="/blueprint/massEntry.php" method="POST">
<label for="systemName">SystemName</label><input type=text value="Jita" name="system" id="systemName"><br>
<textarea name="masslist" placeholder="paste a list of blueprints from the client here" rows=20 cols=140></textarea><br>
<input type=submit name="submit" value="ISK/HR">
<!-- <input type=submit name="submit" value="Invention ISK/HR"> -->
</form>
</div>
{/block}
