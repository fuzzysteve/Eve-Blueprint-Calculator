function populateTables(blueprintJson)
{
    blueprintData=blueprintJson;
    materials=$('#materialsTable').DataTable();
    materials.rows().remove(); 
    for (materialid in blueprintData['activityMaterials'][1]) {
        material=blueprintData['activityMaterials'][1][materialid];
        var newrow=materials.row.add([material.typeid,material.name,material.quantity,0,0,0,0,0]).draw().node();
        $(newrow).attr('id', 'material-'+material.typeid);
    }
    $("#collapseOne").collapse('show');
    $("#nameDiv").text(blueprintData.blueprintDetails.productTypeName);

    skills=$("#skillsTable").DataTable();
    skills.rows().remove();
    for (activity in blueprintData.blueprintSkills) {
        for (skill in blueprintData.blueprintSkills[activity]) {
            skills.row.add([activityNames[activity],blueprintData.blueprintSkills[activity][skill].name,blueprintData.blueprintSkills[activity][skill].level]);
        }
    }
    skills.draw();

    if (blueprintData.blueprintDetails.techLevel==2) {
        $("#invention_div").show();
        $("#inventioncosttr").show();
    } else {
        $("#invention_div").hide();
        $("#inventioncosttr").hide();
    }
    generateMaterialList();
    loadPrices();
}

function generateMaterialList()
{
    materialList=new Array();
    materialNames=new Object();
    materialNames[parseInt(blueprintData['blueprintDetails']['productTypeID'])]=blueprintData['blueprintDetails']['productTypeName'];
    for (activityid in blueprintData['activityMaterials']) {
        activity=blueprintData['activityMaterials'][activityid];
        for (materialid in activity) {
            materialNames[activity[materialid].typeid]=activity[materialid].name;
        }
    }
    for (metaid in blueprintData['metaVersions']) {
        materialNames[parseInt(blueprintData['metaVersions'][metaid].typeid)]=blueprintData['metaVersions'][metaid].name;
    }

    for (materialid in materialNames) {
        materialList.push(materialid);
    }

}

function populatePrices(pricejson) {
    priceData=pricejson;
    prices=$('#priceTable').DataTable();
    prices.rows().remove();

    for (materialid in materialList) {
        typeid=materialList[materialid];
        prices.row.add([materialNames[typeid],$.number(priceData[typeid].sell,2),$.number(priceData[typeid].buy,2),$.number(priceData[typeid].adjusted,2)]);
    }
    prices.draw();
    loadIndexes();
}

function populateIndexes(indexJson) {
    indexData=indexJson;
    currentindex=$('#systemName').val();
    runNumbers();
}

function loadIndexes()
{
    if (currentindex!=$('#systemName').val()) {
        queryurl="https://www.fuzzwork.co.uk/blueprint/api/costIndexes.php?solarsystem="+$('#systemName').val();
        $.getJSON(queryurl,function(data){populateIndexes(data);});
    } else {
        runNumbers();
    }
}

function loadPrices()
{
    queryurl="https://www.fuzzwork.co.uk/blueprint/api/prices.php?regionid="+regionid+"&typeids="+JSON.stringify(materialList)
     $.getJSON(queryurl,function(data){populatePrices(data);});
}

function loadBlueprint(blueprint)
{
    queryurl="https://www.fuzzwork.co.uk/blueprint/api/blueprint.php?typeid="+blueprint;
    $.getJSON(queryurl,function(data){populateTables(data);});
}

function runNumbers()
{
    ml=parseInt($('#ml').val());
    materials=$('#materialsTable').DataTable();
    totalPrice=0;
    runCost=0;
    taxmultiplier=(taxRate/100)+1;
    for (materialid in blueprintData['activityMaterials'][1]) {
        material=blueprintData['activityMaterials'][1][materialid];
        reducedquantity=material.quantity*(1-(ml/100))*facility;
        jobquantity=Math.max(runs,Math.ceil((material.quantity*(1-(ml/100))*facility)*runs));
        materials.row($('#material-'+material.typeid)).data([
            material.typeid,
            material.name,
            material.quantity,
            reducedquantity.toFixed(2),
            jobquantity,
            $.number(priceData[material.typeid].sell,2),
            $.number(priceData[material.typeid].adjusted,2),
            $.number(priceData[material.typeid].sell*jobquantity,2)
            ]);
        totalPrice=totalPrice+priceData[material.typeid].sell*jobquantity;
        runCost=runCost+(priceData[material.typeid].adjusted*material.quantity*runs);
    }
    $('#jobCost').number(totalPrice,2);
    $('#adjustedCost').number(runCost,2);
    $('#installCost').number((runCost*indexData.costIndexes["1"])*taxmultiplier,2);
    profitNumber=(((priceData[blueprintData.blueprintDetails.productTypeID].sell*runs)-totalPrice)-(runCost*indexData.costIndexes["1"]*taxmultiplier));
    $('#profit').number(profitNumber,2);
    materials.draw();
}

function updatePrices()
{
    prices=$('#priceTable').DataTable();
    regionid=$('#priceregion').val();
    loadPrices();

}

$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
        return null;
    } else {
        return results[1] || 0;
    }
}


var ml=0
var me=0
var pl=0
var industry=0
var research=0
var metallurgy=0
var blueprintData;
var materialList;
var materialNames;
var priceData;
var indexData;
var runCost;
var currentindex=0;
var runs=1;
var facility=1;
var regionid=10000002;
var taxRate=0;
var profitNumber=0;
var activityNames={'1':'Manufacturing','3':'TE Research','4':'ME research','5':'Copying','7':'Reverse Engineering','8':'Invention'};
