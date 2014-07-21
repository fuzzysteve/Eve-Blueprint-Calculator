function populateTables(blueprintJson)
{
    blueprintData=blueprintJson;
    materials=$('#materialsTable').DataTable();
    
    for (materialid in blueprintData['activityMaterials'][1]) {
        material=blueprintData['activityMaterials'][1][materialid];
        var newrow=materials.row.add([material.typeid,material.name,material.quantity,0,0,0,0,0]).draw().node();
        $(newrow).attr('id', 'material-'+material.typeid);
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

    for (materialid in materialList) {
        typeid=materialList[materialid];
        prices.row.add([materialNames[typeid],priceData[typeid].sell,priceData[typeid].buy,priceData[typeid].adjusted]);
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
    }
}

function loadPrices()
{
    queryurl="https://www.fuzzwork.co.uk/blueprint/api/prices.php?regionid="+regionid+"&typeids="+JSON.stringify(materialList)
     $.getJSON(queryurl,function(data){populatePrices(data);});
}

function loadBlueprint(blueprint)
{
    blueprintid=blueprint.typeid
    queryurl="https://www.fuzzwork.co.uk/blueprint/api/blueprint.php?typeid="+blueprintid;
    $.getJSON(queryurl,function(data){populateTables(data);});
}

function runNumbers()
{
    ml=parseInt($('#ml').val());
    materials=$('#materialsTable').DataTable();
    totalPrice=0;
    runCost=0;
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
        runCost=priceData[material.typeid].adjusted*material.quantity*runs;
    }
    $('#jobCost').number(totalPrice,2);
    $('#adjustedCost').number(runCost,2);
    $('#installCost').number(runCost*indexData.costIndexes["1"],2);

    materials.draw();
}

function updatePrices()
{
    prices=$('#priceTable').DataTable();
    prices.rows().remove();
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


ml=0
me=0
pl=0
industry=0
research=0
metallurgy=0
var blueprintData;
var materialList;
var materialNames;
var priceData;
var indexData;
var runCost;
currentindex=0;
runs=1;
facility=1;
regionid=10000002;
