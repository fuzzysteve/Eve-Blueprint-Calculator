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
    if (isFinite($.urlParam('typeid')) && ($.urlParam('typeid')!=null)) {
        temp=$.urlParam('typeid');
        loadBlueprint(parseInt(temp));
    }
});

</script>
{/literal}
{/block}
{block name=body}
<div id="mainbody">
<div id="name_div"><h1 id='nameDiv'></h1></div>
<div id="link_div"></div>
{nocache}
{if $auth_characterid}
<div id="loggedin" class="panel-group">
    <div id="loggedin_panel" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#loggedin_panel" href="#collapseShopping">Shopping Lists</a></h1></div>
        <div id="collapseShopping" class="panel-collapse collapse">
            <div class="panel-body">
                <div class=row>
                    <div class="col-md-6">
                        <select id="shoppingListSelect" name="shoppingListSelect">
                        </select>
                    </div>
                    <div class="col-md-6"> 
                        <button onclick="saveList();">Add to list</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="newlistmodal">
    <label for="listname">List Identifier</label>
    <input name="listname" maxwidth=30 class="text ui-widget-content ui-corner-all" id="listname">
</div>


{/if}
{/nocache}
<div id="facility_div">
    <div id="facility_div_panel" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#facility_div" href="#collapseFacilities">Facility</a></h1></div>
        <div id="collapseFacilities" class="panel-collapse collapse in">
            <div class="panel-body">
                <label for="facility">Facility</label>
                <select name="facility" id="facility" onchange='saveFacility();'>
                    <option value="1">Station/Assembly array</option>
                    <option value="5" selected>Engineering Complex</option>
                    <option value="6">Other Structure</option>
                </select>
                <label for="SecStatus">Sec Status</label>
                <select name="SecStatus" id="SecStatus" onchange='saveFacility();'>
                    <option value="1">High Sec</option>
                    <option value="1.9">Low Sec</option>
                    <option value="2.1">Null Sec</option>
                    <option value="-1">Wormhole</option>
                </select>
                <label for="FacilitySize">Structure Size</label>
                <select name="FacilitySize" id="FacilitySize" onchange='saveFacility();'>
                    <option value="1">Medium</option>
                    <option value="2">Large</option>
                    <option value="3">X-Large</option>
                </select>
                <label for="MERig">Material Rig type</label>
                <select name="MERig" id="MERig" onchange='saveFacility();'>
                    <option value="0">No Rig</option>
                    <option value="2">T1 Rig</option>
                    <option value="2.4">T2 Rig</option>
                </select>
                <label for="TERig">Time type</label>
                <select name="TERig" id="TERig" onchange='saveFacility();'>
                    <option value="0">No Rig</option>
                    <option value="20">T1 Rig</option>
                    <option value="24">T2 Rig</option>
                </select>
                    
<br>
                <label for="taxRate">Facility Tax Rate</label><input type=text value=0 name="taxRate" id="taxRate">
                <label for="systemName">SystemName</label><input type=text value="Jita" name="system" id="systemName">
                <label for="indexEntry" style="display:none">Industrial Index</label><input type=text value="0.01" name="indexEntry" id="indexEntry" style="display:none">
                <img src="/blueprint/css/factory.png" class="pull-right" id="facilities" width=40 height=40>
            </div>
        </div>
    </div>
</div>

<div id="materials_div">
    <div id="materials_div_panel" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#materials_div" href="#collapseOne">Materials</a></h1></div>
        <div id="collapseOne" class="panel-collapse collapse ">
            <div class="panel-body">
            <div class=row>
                <div class="col-md-4">
                    <label for="me">Blueprint ME</label>
                    <input type=text value=0 id="me" size=3 style='width:3em;margin-right:1em;margin-left:1em'>
                    <div id="meslider" style='width:100px;display:inline-block;height:0.5em'></div>
                </div>
                <div class="col-md-4">
                    <label for="te">Blueprint TE</label>
                    <input type=text value=0 id="te" size=3 style='width:3em;margin-right:1em;margin-left:1em'>
                    <div id="teslider" style='width:100px;display:inline-block;height:0.5em'></div>
                </div>
                <div class="col-md-4">
                    <label for="runs">Runs</label><input type=text value=1 name='runs' id='runs'><br>
                    <input type=button value="Update ME/TE" onclick="runNumbers();">
                </div>
            </div>
                <table border=1 id="materialsTable" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Typeid</th>
                            <th>Material</th>
                            <th>Initial Quantity per run</th>
                            <th>Reduced Quantity</th>
                            <th>Job Quantity</th>
                            <th>Regional Price</th>
                            <th title="Price used for manufacturing quotes, and costs.">Adjusted Price</th>
                            <th>Job Price</th>
                        </tr>
                    </thead>
                    <tbody id="materialsBody">
                    </tbody>
                    <tfoot>
                    <tr><th colspan=7>Item Unit Price</th><td id='unitPrice' class='text-right'></td></tr>
                    <tr><th colspan=7>Job Material Cost</th><td id='jobCost' class='text-right'></td></tr>
                    <tr><th colspan=7 title="The price that is then multiplied by the cost index, to work out the install cost">Job Base Price</th><td id='adjustedCost' class='text-right'></td></tr>
                    <tr><th colspan=7>Install Price</th><td id='installCost' class='text-right'></td></tr>
                    <tr><th colspan=7>Build Time</th><td id='buildTime' class='text-right'></td></tr>
                    <tr id="inventioncosttr"><th colspan=7>Invention Cost</th><td id='inventionCost' class='text-right'></td></tr>
                    <tr><th colspan=7>Profit (Sell - Material - Install)</th><td id='profit' class='text-right'></td></tr>
                    <tr><th colspan=3>Profit isk/hr</th><td id="iskhr"></td><th colspan=3>Profit isk/hr (Normalized to 24 hours)</th><td id="isktfhr"></td></tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</div>


<div id="mat_materials_div">
    <div id="mat_materials_div_panel" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#mat_materials_div" href="#mat_collapseOne">Materials for Materials</a></h1></div>
        <div id="mat_collapseOne" class="panel-collapse collapse ">
            <div class="panel-body">
            <div id="Material-blueprint-details">

            </div>
                <h2>Materials for materials</h2>
                <table border=1 id="mat_materialsTable" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>For</th>
                            <th>Material</th>
                            <th>Initial Quantity per run</th>
                            <th>Reduced Quantity</th>
                            <th>Job Quantity</th>
                            <th>Regional Price</th>
                            <th title="Price used for manufacturing quotes, and costs.">Adjusted Price</th>
                            <th>Job Price</th>
                        </tr>
                    </thead>
                    <tbody id="mat_materialsBody">
                    </tbody>
                    <tfoot>
                    </tfoot>
                </table>
                <h2>Total Materials</h2>
                <table border=1 id="allMaterials" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Material</th>
                            <th>Job Quantity</th>
                        </tr>
                    </thead>
                    <tbody id="mat_materialsBody">
                    </tbody>
                    <tfoot>
                    </tfoot>
                </table>

            </div>
        </div>
    </div>
</div>




<div id="player_skills_div">
    <div id="playser_skills_div_panel" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#skills_div" href="#collapsePlayerSkills">Player Skills</a></h1></div>
        <div id="collapsePlayerSkills" class="panel-collapse collapse">
            <div class="panel-body">
                <div class=row>
                    <div class="col-md-3">
                        <label for="industry">Industry</label>
                    </div><div class="col-md-3">
                        <select name='industry'  id='industry' onchange='industry=parseInt($("#industry").val());runNumbers();'>
                        <option>1</option><option>2</option><option>3</option><option>4</option><option selected>5</option></select>
                    </div>
                    <div class="col-md-3">
                        <label for="aindustry">Advanced Industry</label>
                    </div><div class="col-md-3">
                        <select name='aindustry' id='aindustry' onchange='aindustry=parseInt($("#aindustry").val());runNumbers();'>
                         <option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option selected>5</option></select>
                    </div>
                </div>
                <div class=row>
                    <div class="col-md-3">
                        <label for="research">Research</label>
                    </div><div class="col-md-3">
                        <select name='research' id='research' onchange='research=parseInt($("#research").val());runTimeNumbers();'>
                         <option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option selected>5</option></select>
                    </div>
                    <div class="col-md-3">
                        <label for="metallurgy">Metallurgy</label>
                    </div><div class="col-md-3">
                        <select name='metallurgy' id='metallurgy' onchange='metallurgy=parseInt($("#metallurgy").val());runTimeNumbers();'>
                        <option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option selected>5</option></select>
                    </div>
                </div>
                <div class=row>
                    <div class="col-md-3">
                        <label for="science">Science</label>
                    </div><div class="col-md-3">
                        <select name='science' id='science' onchange='science=parseInt($("science").val());runTimeNumbers();'>
                        <option>1</option><option>2</option><option>3</option><option>4</option><option selected>5</option></select>
                    </div>
                </div>
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
                <div class=row>
                    <div class="col-md-6">
                        <p><label for="meresearch">ME Research</label>
                        <input type="text" id="meresearch" readonly style="border:0; color:#f6931f; font-weight:bold;"></p>
                        <div id="meresearchslider"></div>
                    </div>
                    <div class="col-md-6">
                        <table class="table table-bordered">
                            <tr><th>Research Time</th><td id=metime class=text-right></td></tr>
                            <tr><th>Research Cost</th><td id=mecost class=text-right></td></tr>
                        </table>
                    </div>
                </div>
                <hr>
                <div class=row>
                    <div class="col-md-6">
                        <p><label for="teresearch">TE Research</label>
                        <input type="text" id="teresearch" readonly style="border:0; color:#f6931f; font-weight:bold;"></p>
                        <div id="teresearchslider"></div>
                    </div>
                    <div class="col-md-6">
                        <table class="table table-bordered">
                            <tr><th>Research Time</th><td id=tetime class=text-right></td></tr>
                            <tr><th>Research Cost</th><td id=tecost class=text-right></td></tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
</div>

<div id="invention_div">
    <div id="invention_div_panel" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#invention_div" href="#collapseInvention">Invention</a></h1></div>
        <div id="collapseInvention" class="panel-collapse collapse">
            <div class="panel-body">
                <p>Basic functionality for now. Eventually skills will be saveable, and will be the actual skills, not just the generics.</p>
                <div class="row">
                    <div class="col-md-4">
                        <p><label for="encryption">Encryption Skill</label></p>
                        <p><input type="text" id="encryption" readonly style="border:0; color:#f6931f; font-weight:bold;"></p>
                        <div id="encryptionslider"></div>
                    </div>
                    <div class="col-md-4">
                        <p><label for="dc1skill">Datacore Science Skill 1</label></p>
                        <p><input type="text" id="dc1skill" readonly style="border:0; color:#f6931f; font-weight:bold;"></p>
                        <div id="dc1skillslider"></div>
                    </div>
                    <div class="col-md-4">
                        <p><label for="dc2skill">Datacore Science Skill 2</label></p>
                        <p><input type="text" id="dc2skill" readonly style="border:0; color:#f6931f; font-weight:bold;"></p>
                        <div id="dc2skillslider"></div>
                    </div>
                </div>
                <div class=row>
                    <div class="col-md-12">
                        <table id="inventionCosts" class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Material Name</th>
                                    <th>Quantity</th>
                                    <th>Consumed</th>
                                    <th>Cost per successful run</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                            <tfoot>
                                <tr><th colspan=3>Blueprint copy install cost</th><td id="blueprintCost" class="text-right"></td></tr>
                                <tr><th colspan=3>Install cost</th><td id="inventionInstall" class="text-right"></td></tr>
                                <tr><th colspan=3>Total cost per successful run</th><td id="perRunCost" class="text-right"></td></tr>
                                <tr><th colspan=3>Probability</th><td id="inventionProbability" class="text-right"></td></tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class=row>
                    <div class="col-md-12">
                    <table id="decryptors" class="table table-striped">
                        <thead>
                            <tr>
                                <th>Decryptor Name</th>
                                <th>Probability</th>
                                <th>&#177;ME</th>
                                <th>&#177;TE</th>
                                <th>&#177;Runs</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                    </table>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="costindex_div">
    <div id="costindex_div_panel" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#costinted_div" href="#collapseCostIndex">Cost Indexes</a></h1></div>
        <div id="collapseCostIndex" class="panel-collapse collapse">
            <div class="panel-body">
                <table border=1 id="costIndexTable" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Activity</th>
                            <th>Index Value</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>



<div id="prices" style="position:absolute;<?php echo $pricepos;?>" class="panel panel-info">
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
               <div>
                   <a href="/blueprint/override.php">Manage Overrides</a><br>
                   <select id="typeOverride">
                   <option value="0">Select Type to override</select>
                   </select>
                   <input id="priceOverride" type=number>
                   <button id="newprices" onclick="overridePrices()">Override</button>
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
</div>
    <div id="blueprintSelection" class="panel panel-default">
        <div class="panel-heading"><h1 class="panel-title">Blueprint Selection</h1></div>
        <div class="panel-body">
            <input id="itemname">
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
