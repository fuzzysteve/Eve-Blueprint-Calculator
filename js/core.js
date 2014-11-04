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
    $("#nameDiv").html('<a href="/blueprint/?typeid='+blueprintData.blueprintDetails.productTypeID+'">'+blueprintData.blueprintDetails.productTypeName+'</a>');

    skills=$("#skillsTable").DataTable();
    skills.rows().remove();
    for (activity in blueprintData.blueprintSkills) {
        for (skill in blueprintData.blueprintSkills[activity]) {
            skills.row.add([activityNames[activity],blueprintData.blueprintSkills[activity][skill].name,blueprintData.blueprintSkills[activity][skill].level]);
        }
    }
    skills.draw();

    if (blueprintData.blueprintDetails.techLevel==2) {
        invention=$('#inventionCosts').DataTable();
        invention.rows().remove();
        for (materialid in blueprintData['activityMaterials'][8]) {
             material=blueprintData['activityMaterials'][8][materialid];
             var newrow=invention.row.add([
                material.name,
                material.quantity,
                material.consume ? 'Yes' : 'No',
                0
            ]).draw().node();
            $(newrow).attr('id', 'inventionmaterial-'+material.typeid);
        }
        $("#invention_div").show();
        $("#inventioncosttr").show();
        decryptors=$('#decryptors').DataTable();
        decryptors.rows().remove();
            decryptors.row.add(['None',1,0,0,0,'<input type="radio" name="decryptor" value="-1" checked onchange="runNumbers();">']);
        for (materialid in blueprintData.decryptors) {
            decryptors.row.add([
                blueprintData.decryptors[materialid].name,
                blueprintData.decryptors[materialid].multiplier,
                blueprintData.decryptors[materialid].me,
                blueprintData.decryptors[materialid].te,
                blueprintData.decryptors[materialid].runs,
                '<input type="radio" name="decryptor" value="'+materialid+'" onchange="runNumbers();">'
            ]);
        }
        decryptors.draw();
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
    for (decid in blueprintData['decryptors']) {
        materialNames[parseInt(blueprintData['decryptors'][decid].typeid)]=blueprintData['decryptors'][decid].name;
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
    cit=$("#costIndexTable").DataTable();
    cit.rows().remove();
    for (activity in indexJson.costIndexes) {
        cit.row.add([activityNames[activity],$.number(indexJson.costIndexes[activity],5)]);
    }
    cit.draw();
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
    $("#mainbody").show();
    queryurl="https://www.fuzzwork.co.uk/blueprint/api/blueprint.php?typeid="+blueprint;
    $.getJSON(queryurl,function(data){populateTables(data);});
}

function runNumbers()
{
    inventionCost=0;
    me=parseInt($('#me').val());
    te=parseInt($('#te').val());
    materials=$('#materialsTable').DataTable();
    totalPrice=0;
    totalPriceWT=0;
    runCost=0;
    taxmultiplier=(taxRate/100)+1;
    for (materialid in blueprintData['activityMaterials'][1]) {
        material=blueprintData['activityMaterials'][1][materialid];
        reducedquantity=material.quantity*(1-(me/100))*facilityme[facility]*(1-(teamMe/100));
        jobquantity=Math.max(runs,Math.ceil((material.quantity*(1-(me/100))*facilityme[facility]*(1-(teamMe/100)))*runs));
        jobquantityWT=Math.max(runs,Math.ceil((material.quantity*(1-(me/100))*facilityme[facility])*runs));
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
        totalPriceWT=totalPriceWT+priceData[material.typeid].sell*jobquantityWT;
        totalPrice=totalPrice+priceData[material.typeid].sell*jobquantity;
        runCost=runCost+(priceData[material.typeid].adjusted*material.quantity*runs);
    }
    if (blueprintData.blueprintDetails.techLevel==2) {
        inventionNumbers();
    }
    $('#materialSaving').number(totalPriceWT-totalPrice,2);
    $('#jobCost').number(totalPrice,2);
    $('#adjustedCost').number(runCost,2);
    $('#installCost').number((runCost*indexData.costIndexes["1"])*taxmultiplier*(1+(salary/100)),2);
    $('#teamCost').number((runCost*indexData.costIndexes["1"])*taxmultiplier*(salary/100),2);
    profitNumber=(((priceData[blueprintData.blueprintDetails.productTypeID].sell*blueprintData.blueprintDetails.productQuantity*runs)-totalPrice)-(runCost*indexData.costIndexes["1"]*taxmultiplier*(1+(salary/100))))-inventionCost;
    buildTime=blueprintData.blueprintDetails.times[1]*(1-(te/100))*(1-((industry*4)/100))*(1-((aindustry*3)/100))*facilityte[facility]*runs*(1-(teamTe/100));
    teamTimeSaving=blueprintData.blueprintDetails.times[1]*(1-(te/100))*(1-((industry*4)/100))*(1-((aindustry*3)/100))*facilityte[facility]*runs*(teamTe/100);
    $('#teamTimeReduction').text(String(teamTimeSaving).toHHMMSS());
    $('#buildTime').text(String(buildTime).toHHMMSS());
    $('#profit').number(profitNumber,2);
    $('#iskhr').number((profitNumber/buildTime)*3600,2);
    $('#isktfhr').number((profitNumber/Math.ceil(buildTime/86400))/24,2);

    materials.draw();
    runTimeNumbers();
}


function inventionNumbers()
{
     if (blueprintData.blueprintDetails.techLevel==2) {
        encryptionskill=parseInt($("#encryption").val()); 
        dc1skill=parseInt($("#dc1skill").val()); 
        dc2skill=parseInt($("#dc2skill").val()); 
        decryptor=parseInt($('#decryptors input[type="radio"]:checked').val());
        decryptormult=1;
        if (decryptor>-1) {
            decryptormult=blueprintData['decryptors'][decryptor].multiplier;
        }
        taxmultiplier=(taxRate/100)+1;
        inventionChance=Math.min(((blueprintData.blueprintDetails.probability*100) * (1 + ((dc1skill+dc2skill)/30)+(encryptionskill/40)))*decryptormult,100);
        invention=$('#inventionCosts').DataTable();
        $("#inventionProbability").number(inventionChance,1);
        for (materialid in blueprintData['activityMaterials'][8]) {
            material=blueprintData['activityMaterials'][8][materialid];
            inventionCost=inventionCost+Math.ceil((material.quantity*priceData[material.typeid].sell*material.consume));
            invention.row($('#inventionmaterial-'+material.typeid)).data([material.name, material.quantity,material.consume ? 'Yes' : 'No',$.number(Math.ceil((material.quantity*priceData[material.typeid].sell*material.consume)/(inventionChance/100)))]);
        }
        invention.draw();
        blueprintcost=blueprintData.blueprintDetails.precursorAdjustedPrice*indexData.costIndexes["5"]*0.02;
        $('#blueprintCost').number(blueprintcost)
        $('#inventionInstall').number(((runCost/runs)*0.02*indexData.costIndexes["8"])*taxmultiplier);
        if (decryptor>-1)
        {
            inventionCost=inventionCost+(priceData[blueprintData['decryptors'][decryptor].typeid].sell);
        }
        inventionCost=inventionCost+blueprintcost;
        inventionCost=inventionCost/(inventionChance/100);
        inventionCost=inventionCost+(((runCost/runs)*0.02*indexData.costIndexes["8"])*taxmultiplier);
        $('#perRunCost').number(inventionCost,2);
        $('#inventionCost').number(inventionCost,2);
     }
}


function updatePrices()
{
    prices=$('#priceTable').DataTable();
    regionid=$('#priceregion').val();
    loadPrices();

}

function runTimeNumbers()
{
    taxmultiplier=(taxRate/100)+1;
    meRes=$('#meresearch').val().split('-');
    teRes=$('#teresearch').val().split('-');
    meRes[0]=parseInt(meRes[0]);
    meRes[1]=parseInt(meRes[1]);
    teRes[0]=parseInt(teRes[0]);
    teRes[1]=parseInt(teRes[1]);
    metime=0;
    mecost=0
    tetime=0;
    tecost=0;
    for(i=meRes[0];i<meRes[1];i++) {
        metime=metime+(researchMultiplier[i]*blueprintData.blueprintDetails.times[4]);
        mecost=mecost+(researchMultiplier[i]*runCost*0.02);
    }
    for(i=teRes[0];i<teRes[1];i=i+2) {
        tetime=tetime+(researchMultiplier[i/2]*blueprintData.blueprintDetails.times[3]);
        tecost=tecost+(researchMultiplier[i/2]*runCost*0.02);
    }

    $('#metime').text(String(metime*rfacilityme[rfacility]*(1-(metallurgy*5/100))*(1-((aindustry*3)/100))).toHHMMSS());
    $('#tetime').text(String(tetime*rfacilityte[rfacility]*(1-(research*5/100))*(1-((aindustry*3)/100))).toHHMMSS());
    $('#mecost').number(mecost*indexData.costIndexes["4"]*taxmultiplier,2);
    $('#tecost').number(tecost*indexData.costIndexes["3"]*taxmultiplier,2);
}

$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
        return null;
    } else {
        return results[1] || 0;
    }
}


function loadLists() {
    if (!characterid) {
        return;
    }
    
    $('#shoppingListSelect').append($('<option>',{value:'new'}).text('Create New List'));
    $.getJSON('/blueprint/api/shoppingList/listNames.php?listnonce='+listnonce,function( data ) {
        $.each( data, function( key, val ) {
            $('#shoppingListSelect')
                .append($('<option>',{value:val.id})
                .text(val.name));
        });
        $('#shoppingListSelect')[0][1].defaultSelected=true;
        });
}

function addList() {
    identifier=$('#listname').val();
    if (identifier.length>30  || identifier.length<3){
    alert('Name must be between 4 and 30 characters');
    return;
    }
   $.post('/blueprint/api/shoppingList/makeList.php',{'nonce':nonce,'identifier':identifier},function( data ) 
   {
        listname=data.name;
        listid=data.id;
        $('#shoppingListSelect').append($('<option>',{value:listid}).text(listname));
        $('#shoppingListSelect option[value="'+listid+'"]').prop('selected', true);
        $("#newlistmodal").dialog("close");
        saveList();

   },'json');
}



function saveList() {
    if ($('#shoppingListSelect').val()=='new') {
        $("#newlistmodal").dialog("open");
        return;
    }
    mats=Array();
    for (materialid in blueprintData['activityMaterials'][1]) {
        material=blueprintData['activityMaterials'][1][materialid];
        mats.push({'typeid':material.typeid,'jobquantity':Math.max(runs,Math.ceil((material.quantity*(1-(me/100))*facilityme[facility]*(1-(teamMe/100)))*runs))});
    }
    $.post('/blueprint/api/shoppingList/addItems.php',{'nonce':nonce,'listid':$('#shoppingListSelect').val(),'identifier':blueprintData.blueprintDetails.productTypeName,'itemJson':JSON.stringify(mats)},function(data) {
        if (data.status != 'success') {
            alert('Error saving');
        } else {
            alert('saved to list');
        }
    },'json');


}

var te=0;
var me=0;
var teamTe=0
var teamMe=0
var industry=5;
var aindustry=5;
var research=5;
var metallurgy=5;
var blueprintData;
var materialList;
var materialNames;
var priceData;
var indexData;
var runCost;
var currentindex=0;
var runs=1;
var facility=1;
var rfacility=1;
var regionid=10000002;
var taxRate=0;
var profitNumber=0;
var activityNames={'1':'Manufacturing','3':'TE Research','4':'ME research','5':'Copying','7':'Reverse Engineering','8':'Invention'};
var facilityme={'1':1,'2':0.98,'3':0.9,'4':1.05};
var facilityte={'1':1,'2':0.75,'3':0.75,'4':0.65};
var rfacilityme={'1':1,'2':0.7,'3':0.65,'4':Infinity}
var rfacilityte={'1':1,'2':0.7,'3':0.65,'4':Infinity}
var researchMultiplier=[1,29/21,23/7,39/5,278/15,928/21,2200/21,5251/21,4163/7,29660/21];
var teamMe=0;
var teamTe=0;
var salary=0;
var inventionCost=0;
