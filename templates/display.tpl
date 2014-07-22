{extends file='layout.tpl' }
{block name=title}Blueprint Display{/block}
{block name=extrajavascript}
<script src="{$baseurl}/js/core.js"></script>
<script src="{$baseurl}/js/display.js"></script>
<script src="{$baseurl}/js/items.js"></script>
{literal}
<script type="text/javascript">
$(document).ready(function() {
    $("#itemname").autocomplete({ source:"/blueprint/api/blueprintName.php",minLength:2,select: function( event, ui ) { $("#itemname").val(ui.item.value);loadBlueprint(ui.item.id);}});
});

</script>
{/literal}
{/block}
{block name=body}
<div id="name_div"><h1 id='nameDiv'></h1></div>
<div id="link_div"></div>
<div id="facility_div">
    <div id="facility_div_panel" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#facility_div" href="#collapseFacilities">Facility</a></h1></div>
        <div id="collapseFacilities" class="panel-collapse collapse in">
            <div class="panel-body">
                <label for="facility">Manufacturing Facility</label>
                <select name="facility" id="facility" onchange='facility=parseFloat($("#facility").val());runNumbers();'>
                    <option value="1">Station</option>
                    <option value="0.98">Assembly Array</option>
                    <option value="0.90">Thukker Component Array</option>
                    <option value="1.05">Rapid Assembly Array</option>
                </select>
                <label for="rFacility">Research Facility</label>
                <select name="rfacility" id="rfacility" onchange='rfacility=$("#rfacility").val();runNumbers();'>
                    <option>Station</option>
                    <option>POS Lab</option>
                    <option>Advanced POS Lab</option>
                </select>
<br>
                <label for="taxRate">Facility Tax Rate</label><input type=text value=0 name="taxRate" id="taxRate">
                <label for="systemName">SystemName</label><input type=text value="Jita" name="system" id="systemName">
            </div>
        </div>
    </div>
</div>


<div id="materials_div">
    <div id="materials_div_panel" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#materials_div" href="#collapseOne">Materials</a></h1></div>
        <div id="collapseOne" class="panel-collapse collapse ">
            <div class="panel-body">
                <label for="ml">Blueprint ME</label>
                <input type=text value=0 id="ml" size=3 style='width:3em;margin-right:1em;margin-left:1em'>
                <label for="runs">Runs</label><input type=text value=1 name='runs' id='runs'><br>
                <div id="mlslider" style='width:100px;display:inline-block;height:0.5em'></div><br>
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
                    <tr id="inventioncosttr"><th colspan=7>Invention Cost</th><td id='inventionCost' class='text-right'></td></tr>
                    <tr><th colspan=7>Profit (Sell - Material - Install)</th><td id='profit' class='text-right'></td></tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</div>

<div id="skills_div">
    <div id="skills_div_panel" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#skills_div" href="#collapseSkills">Skills</a></h1></div>
        <div id="collapseSkills" class="panel-collapse collapse">
            <div class="panel-body">
                <table border=1 id="skillsTable" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Activity</th>
                            <th>Skill</th>
                            <th>Required Level</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>




<div id="time_div">
    <div id="time_div_panel" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#time_div" href="#collapseTime">Time Calculations</a></h1></div>
        <div id="collapseTime" class="panel-collapse collapse">
            <div class="panel-body">
I'm an Time div. Steve needs to write my math.
            </div>
        </div>
</div>

<div id="invention_div">
    <div id="invention_div_panel" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#invention_div" href="#collapseInvention">Invention</a></h1></div>
        <div id="collapseInvention" class="panel-collapse collapse">
            <div class="panel-body">
I'm an invention div. Steve needs to write my math.
            </div>
        </div>
    </div>
</div>

<div id="prices" style="position:absolute;<? echo $pricepos;?>" class="panel panel-info">
    <div id="priceheader" class="panel-heading"><span style="float:right" class="glyphicon glyphicon-chevron-down" data-toggle="collapse" data-target="#pricedetail"></span>Prices</div>
        <div id="pricedetail" class="panel-body collapse">
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
    <div id="blueprintSelection" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title">Blueprint Selection</h1></div>
        <div class="panel-body">
            <input id="itemname">
        </div>
    </div>
</div>
{/block}
