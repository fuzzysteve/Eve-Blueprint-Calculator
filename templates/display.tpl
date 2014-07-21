{extends file='layout.tpl' }
{block name=title}Blueprint Display{/block}
{block name=extrajavascript}
<script src="{$baseurl}/js/core.js"></script>
<script src="{$baseurl}/js/display.js"></script>
<script src="{$baseurl}/js/items.js"></script>
{literal}
<script type="text/javascript">
$(document).ready(function() {
    $("input#itemname").autocomplete({ source: source });
    loadBlueprint({typeid:1319});
});

</script>
{/literal}
{/block}
{block name=body}
<div id="name_div"></div>
<div id="link_div"></div>

<div id="materials_div">
    <div id="materials_div_panel" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#materials_div" href="#collapseOne">Materials</a></h1></div>
        <div id="collapseOne" class="panel-collapse collapse in">
            <div class="panel-body">
                <label for="ml">Blueprint ML</label>
                <input type=text value=0 id="ml" size=3 style='width:3em;margin-right:1em;margin-left:1em'>
                <label for="runs">Runs</label><input type=text value=1 name='runs' id='runs'><br>
                <div id="mlslider" style='width:100px;display:inline-block;height:0.5em'></div><br>
                <select name="facility" id="facility" onchange='facility=parseFloat($("#facility").val());runNumbers();'>
                    <option value="1">Station</option>
                    <option value="0.98">Assembly Array</option>
                    <option value="0.90">Thukker Component Array</option>
                    <option value="1.05">Rapid Assembly Array</option>
                </select>
                <input type=text value="Jita" name="system" id="systemName">
                <input type=button value="Update ML/ME" onclick="runNumbers();">

                <table border=1 id="materialsTable" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Typeid</th>
                            <th>Material</th>
                            <th>Initial Quantity per run</th>
                            <th>Reduced Quantity</th>
                            <th>Job Quantity</th>
                            <th>Regional Price</th>
                            <th>Adjusted Price</th>
                            <th>Job Price</th>
                        </tr>
                    </thead>
                    <tbody id="materialsBody">
                    </tbody>
                    <tfoot>
                    <tr><th colspan=7>Job Material Cost</th><td id='jobCost' class='text-right'></td></tr>
                    <tr><th colspan=7>Job Base Price</th><td id='adjustedCost' class='text-right'></td></tr>
                    <tr><th colspan=7>Install Price</th><td id='installCost' class='text-right'></td></tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</div>

<div id="time_div"></div>

<div id="invention_div"></div>

<div id="prices" style="position:absolute;<? echo $pricepos;?>" class="panel panel-info">
    <div id="priceheader" class="panel-heading"><span style="float:right" class="glyphicon glyphicon-chevron-up" data-toggle="collapse" data-target="#pricedetail"></span>Prices</div>
        <div id="pricedetail" class="panel-body collapse in">
                <div>
                {literal}
                <select id="priceregion" onchange='updatePrices()'>
                {/literal}
{foreach $regions as $regionid=>$regionname}
                <option value='{$regionid}' {if $regionid==10000002}selected{/if}>{$regionname}</option>
{/foreach}
                </select>

               </div>
                      <div id="pricetablediv">
                      <table border=1 id="priceTable" class="table table-striped table-bordered table-condensed">
                      <thead>
                      <tr><th>Name</th><th>Sell Price</th><th>Buy Price</th><th>Adjusted</th></tr>
                      </thead>
                      <tbody>
                      </tbody>
                      </table>
                      </div>
            </div>
    </div>
</div>


{/block}
