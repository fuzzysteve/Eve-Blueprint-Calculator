function populateTables(blueprintJson)
{
    blueprintData=blueprintJson;
    $('#Material-blueprint-details').empty();
    materials=$('#materialsTable').DataTable();
    materials.rows().remove();
    if (facilities in blueprintData.blueprintDetails) {
        $("#facilities").attr('title',blueprintData.blueprintDetails.facilities.join("\n"));
    }
    activityid=1
    if (!(activityid in  blueprintData.activityMaterials) && "11" in blueprintData.activityMaterials ) {
        activityid=11
    }
    for (var materialid in blueprintData.activityMaterials[activityid]) {
        blueprintData.activityMaterials[activityid][materialid].make=0;
        blueprintData.activityMaterials[activityid][materialid].me=0;
        blueprintData.activityMaterials[activityid][materialid].te=0;
        material=blueprintData.activityMaterials[activityid][materialid];
        var newrow='';
        if (material.maketype>0) {
            newrow=materials.row.add([material.typeid,'<a href="/blueprint/?typeid='+material.maketype+'">'+material.name+"</a>",material.quantity,0,0,0,0,0]).draw().node();
        } else {
            newrow=materials.row.add([material.typeid,material.name,material.quantity,0,0,0,0,0]).draw().node();
        }
        $(newrow).attr('id', 'material-'+material.typeid);
    }
    $("#collapseOne").collapse('show');
    $("#nameDiv").html('<a href="/blueprint/?typeid='+blueprintData.blueprintDetails.productTypeID+'">'+blueprintData.blueprintDetails.productTypeName+'</a>');
    try {
        var stateObj = {};
        history.pushState(stateObj, blueprintData.blueprintDetails.productTypeName, "/blueprint/?typeid="+blueprintData.blueprintDetails.productTypeID);
    }
    catch(err) { console.log("No pushstate");}
    skills=$("#skillsTable").DataTable();
    skills.rows().remove();
    for (var activity in blueprintData.blueprintSkills) {
        for (var skill in blueprintData.blueprintSkills[activity]) {
            skills.row.add([activityNames[activity],blueprintData.blueprintSkills[activity][skill].name,blueprintData.blueprintSkills[activity][skill].level]);
        }
    }
    skills.draw();

    if (blueprintData.blueprintDetails.techLevel==2 && ('8' in blueprintData.activityMaterials)) {
        invention=$('#inventionCosts').DataTable();
        invention.rows().remove();
        for (materialid in blueprintData.activityMaterials[8]) {
             material=blueprintData.activityMaterials[8][materialid];
             var inventionnewrow=invention.row.add([
                material.name,
                material.quantity,
                'Yes',
                0
            ]).draw().node();
            $(inventionnewrow).attr('id', 'inventionmaterial-'+material.typeid);
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


function togglebuild(materialid){
    for (var materid in blueprintData.activityMaterials[1]) {
        if (blueprintData.activityMaterials[1][materid].typeid==materialid) {
            matid=materid;
        }
    }
    if (typeof blueprintData.activityMaterials[1][matid].materialdata == 'undefined')
    {
        getMatMaterials(materialid);
    } else {
        if (blueprintData.activityMaterials[1][matid].make){
            blueprintData.activityMaterials[1][matid].make=0;
        } else {
            blueprintData.activityMaterials[1][matid].make=1;
        }
        runNumbers();
    }
}

function getMatMaterials(materialid) {
   queryurl="https://www.fuzzwork.co.uk/blueprint/api/blueprint.php?typeid="+materialid;
   $.getJSON(queryurl,function(data){getMatMaterials2(materialid,data);});
}

function getMatMaterials2(materialid,blueprintdetails) {
    for (var materid in blueprintData.activityMaterials[1]) {
        if (blueprintData.activityMaterials[1][materid].typeid==materialid) {
            matid=materid;
        }
    }
    blueprintData.activityMaterials[1][matid].materialdata=blueprintdetails.activityMaterials[1];
    blueprintData.activityMaterials[1][matid].materialtime=blueprintdetails.blueprintDetails.times[1];
    blueprintData.activityMaterials[1][matid].materialquantity=blueprintdetails.blueprintDetails.productQuantity;
    blueprintData.activityMaterials[1][matid].make=1;
    blueprintData.activityMaterials[1][matid].me=10;
    blueprintData.activityMaterials[1][matid].te=20;

    p = document.createElement('p');
    label = document.createElement('label');
    text = document.createTextNode(blueprintdetails.blueprintDetails.productTypeName+" ME:");
    input = document.createElement('input');
    label.appendChild(text);
    label.setAttribute("for", "spin-me-"+matid);
    p.appendChild(label);
    input.setAttribute("id", "spin-me-"+matid);
    input.setAttribute("name", "spin-me-"+matid);
    input.setAttribute("value", 10);
    p.appendChild(input);
    label = document.createElement('label');
    text = document.createTextNode("TE:");
    input = document.createElement('input');
    label.appendChild(text);
    label.setAttribute("for", "spin-te-"+matid);
    p.appendChild(label);
    input.setAttribute("id", "spin-te-"+matid);
    input.setAttribute("name", "spin-te-"+matid);
    input.setAttribute("value", 20);
    p.appendChild(input);
    $('#Material-blueprint-details').append(p);
    $('#Material-blueprint-details').append('<label for="facility-'+matid+'">Facility</label><select name="facility-'+matid+'" id="facility-'+matid+'" onchange=\'saveFacility('+matid+');\'><option value="1">Station/Assembly Array</option><option value="5" selected>Engineering Complex</option><option value="6">Other Structure</option></select><label for="SecStatus-'+matid+'">Sec Status</label><select name="SecStatus-'+matid+'" id="SecStatus-'+matid+'" onchange=\'saveFacility('+matid+');\'><option value="1">High Sec</option><option value="1.9">Low Sec</option><option value="2.1">Null Sec/WH</option></select><label for="FacilitySize-'+matid+'">Structure Size</label><select name="FacilitySize-'+matid+'" id="FacilitySize-'+matid+'" onchange=\'saveFacility('+matid+');\'><option value="1">Medium</option><option value="2">Large</option><option value="3">X-Large</option></select><label for="MERig-'+matid+'">Material Rig type</label><select name="MERig-'+matid+'" id="MERig-'+matid+'" onchange=\'saveFacility('+matid+');\'><option value="0">No Rig</option><option value="2">T1 Rig</option><option value="2.4">T2 Rig</option></select><label for="TERig-'+matid+'">Time type</label><select name="TERig-'+matid+'" id="TERig-'+matid+'" onchange=\'saveFacility('+matid+');\'><option value="0">No Rig</option><option value="20">T1 Rig</option><option value="24">T2 Rig</option></select>');
    $("#spin-me-"+matid).data("matid",matid);
    $("#spin-te-"+matid).data("matid",matid);
    $("#spin-me-"+matid).spinner({min:0,max:10,spin:function(event,ui){blueprintData.activityMaterials[1][$(this).data("matid")].me=parseInt(ui.value);runNumbers();},change:function(event,ui){blueprintData.activityMaterials[1][$(this).data("matid")].me=parseInt($(this).val());runNumbers();}});
    $("#spin-te-"+matid).spinner({min:0,max:20,spin:function(event,ui){blueprintData.activityMaterials[1][$(this).data("matid")].te=parseInt(ui.value);runNumbers();},change:function(event,ui){blueprintData.activityMaterials[1][$(this).data("matid")].te=parseInt($(this).val());runNumbers();}});
    mfacilityme[matid]=0.99;
    mfacilityte[matid]=0.85;
    generateMaterialList();
    loadPrices();
}



function generateMaterialList()
{
    materialList=[];
    materialNames={};
    materialNames[parseInt(blueprintData.blueprintDetails.productTypeID)]=blueprintData.blueprintDetails.productTypeName;
    for (var activityid in blueprintData.activityMaterials) {
        activity=blueprintData.activityMaterials[activityid];
        for (var materialid in activity) {
            materialNames[activity[materialid].typeid]=activity[materialid].name;
            if (typeof activity[materialid].materialdata !== 'undefined')
            {
                for (var materialid2 in activity[materialid].materialdata) {
                    materialNames[activity[materialid].materialdata[materialid2].typeid]=activity[materialid].materialdata[materialid2].name;
                }
            }
        }
    }
    for (var metaid in blueprintData.metaVersions) {
        materialNames[parseInt(blueprintData.metaVersions[metaid].typeid)]=blueprintData.metaVersions[metaid].name;
    }
    for (var decid in blueprintData.decryptors) {
        materialNames[parseInt(blueprintData.decryptors[decid].typeid)]=blueprintData.decryptors[decid].name;
    }

    for (var matid in materialNames) {
        materialList.push(matid);
    }

}


function overridePrices() {
  if (parseInt($("#typeOverride").val())!=0){
    priceData[parseInt($("#typeOverride").val())].sell=parseFloat($("#priceOverride").val())
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("priceOverride-"+parseInt($("#typeOverride").val()), parseFloat($("#priceOverride").val()));
    }
  }
  runNumbers();


}

function populatePrices(pricejson) {
    priceData=pricejson;
    prices=$('#priceTable').DataTable();
    $("#typeOverride").empty();
        $("#typeOverride").append("<option value='0'>Select Type to Override price</option>");
    prices.rows().remove();
    for (var materialid in materialList) {
        typeid=materialList[materialid];
        override=""
        if (typeof(localStorage.getItem("priceOverride-"+typeid)) == "string" ) {
            override=" - O"
            priceData[typeid].sell=localStorage.getItem("priceOverride-"+typeid);
        }
        $("#typeOverride").append("<option value='"+typeid+"'>"+materialNames[typeid]+"</option>");
        prices.row.add([materialNames[typeid],$.number(priceData[typeid].sell,2)+override,$.number(priceData[typeid].buy,2),$.number(priceData[typeid].adjusted,2)]);
    }
    prices.draw();
    loadIndexes();
}

function populateIndexes(indexJson) {
    indexData=indexJson;
    currentindex=$('#systemName').val();
    cit=$("#costIndexTable").DataTable();
    cit.rows().remove();
    for (var activity in indexJson.costIndexes) {
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

String.prototype.format = function () {
  var i = 0, args = arguments;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};


function loadPrices()
{
    queryurl=priceurlstring.format(regionid,JSON.stringify(materialList));
     $.getJSON(queryurl,function(data){populatePrices(data);});
}

function loadBlueprint(blueprint)
{
    $("#mainbody").show();
    queryurl="https://www.fuzzwork.co.uk/blueprint/api/blueprint.php?typeid="+blueprint;
    $.getJSON(queryurl,function(data){populateTables(data);});
}


function setIndexes(indexValue)
{
    cit=$("#costIndexTable").DataTable();
    cit.rows().remove();
    cit.row.add(["All Indexes",$.number(parseFloat(indexValue),5)]);
    cit.draw();
    indexNumber=parseFloat(indexValue);
    indexData.costIndexes={"1":indexNumber,"2":indexNumber,"3":indexNumber,"4":indexNumber,"5":indexNumber,"6":indexNumber,"7":indexNumber,"8":indexNumber,"11":indexNumber};
    currentindex="wormhole";
    runNumbers();
}

function updatewhindex()
{
    setIndexes($("#indexEntry").val());
}


function showIndexEntry(showit)
{
    if (showit){
        $('label[for=systemName], input#systemName').hide();
        $('label[for=indexEntry], input#indexEntry').show();
        $("#indexEntry").change(function() {updatewhindex();});
        setIndexes("0.01");
    } else {
        $('label[for=indexEntry], input#indexEntry').hide();
        $('label[for=systemName], input#systemName').show();
        loadIndexes();
    }

}


function saveFacility(materialid)
{

    var fsuffix='';
    if (typeof materialid == 'undefined') {
        fsuffix='';
    } else {
        fsuffix='-'+materialid;
    }

    var facility=parseInt($('#facility'+fsuffix).val());



    if (facility in facilitymelookup)
    {
        lfacilityme=facilitymelookup[facility];
        lfacilityte=facilitytelookup[facility];
    } else {

        if (facility==5) {
            facilitymemod=0.99;
            switch (parseInt($('#FacilitySize'+fsuffix).val())) {
                case 1:
                    tebonus=0.85;
                    break;
                case 2:
                    tebonus=0.80;
                    break;
                case 3:
                    tebonus=0.75;
                    break;
            }
        } else {
            facilitymemod=1;
            tebonus=1;
        }

        secstatus=parseFloat($('#SecStatus'+fsuffix).val());
        
        if (secstatus==-1) {
            secstatus=2.1;
            showIndexEntry(true);
        } else if ( typeof materialid == 'undefined') {
            showIndexEntry(false);
        }

        lfacilityme=((100-(parseFloat($('#MERig'+fsuffix).val())*secstatus))/100)*facilitymemod;
        lfacilityte=((100-(parseFloat($('#TERig'+fsuffix).val())*secstatus))/100)*tebonus;
    }

    if (typeof materialid == 'undefined') {
        facilityme=lfacilityme;
        facilityte=lfacilityte;
    } else {
        mfacilityme[materialid]=lfacilityme;
        mfacilityte[materialid]=lfacilityte;
    }

    runNumbers();
}





function runNumbers()
{
    inventionCost=0;
    me=parseInt($('#me').val());
    te=parseInt($('#te').val());
    materials=$('#materialsTable').DataTable();
    mat_materials=$('#mat_materialsTable').DataTable();
    mat_materials.clear();
    totalPrice=0;
    totalPriceWT=0;
    runCost=0;
    taxmultiplier=(taxRate/100)+1;
    additionalTime=0;
    var allMaterials= {};
    activityid=1
    if (!(activityid in  blueprintData.activityMaterials) && "11" in blueprintData.activityMaterials ) {
        activityid=11
    }
    for (var materialid in blueprintData.activityMaterials[activityid]) {
        material=blueprintData.activityMaterials[activityid][materialid];
        reducedquantity=material.quantity*(1-(me/100))*facilityme;
        jobquantity=Math.max(runs,Math.ceil((material.quantity*(1-(me/100))*facilityme)*runs));
        jobquantityWT=Math.max(runs,Math.ceil((material.quantity*(1-(me/100))*facilityme)*runs));
        if (material.maketype>0) {
            name='<button onclick="togglebuild('+material.typeid+')" title="Toggle making yourself" class="makeme">M</button> <a href="/blueprint/?typeid='+material.maketype+'" target="_blank">'+material.name+"</a>";
        } else {
            name=material.name;
        }
        if (material.make==1) {
            matTotalPrice=0;
            matRunCost=0;
            for (var matmatid in blueprintData.activityMaterials[activityid][materialid].materialdata) {
                matme=blueprintData.activityMaterials[activityid][materialid].me;
                matte=blueprintData.activityMaterials[activityid][materialid].te;
                materialin=blueprintData.activityMaterials[activityid][materialid].materialdata[matmatid];
                matreducedquantity=materialin.quantity*(1-(matme/100))*mfacilityme[materialid];
                matjobquantity=Math.max(jobquantity,Math.ceil((materialin.quantity*(1-(matme/100))*mfacilityme[materialid])*jobquantity));
                mat_materials.row.add([
                    name,
                    materialin.name,
                    materialin.quantity,
                    matreducedquantity.toFixed(2),
                    matjobquantity,
                    $.number(priceData[materialin.typeid].sell,2),
                    $.number(priceData[materialin.typeid].adjusted,2),
                    $.number(priceData[materialin.typeid].sell*matjobquantity,2)
                ]);
                matTotalPrice=matTotalPrice+priceData[materialin.typeid].sell*matjobquantity/blueprintData.activityMaterials[1][materialid].materialquantity;
                //matRunCost=matRunCost+priceData[materialin.typeid].adjusted*materialin.quantity*runs*jobquantity;
                matRunCost=matRunCost+priceData[materialin.typeid].adjusted*materialin.quantity*jobquantity;
                allMaterials[materialin.typeid]=(typeof allMaterials[materialin.typeid] == "undefined")?matjobquantity:allMaterials[materialin.typeid]+matjobquantity;
            }
            totalPriceWT=totalPriceWT+matTotalPrice;
            totalPrice=totalPrice+matTotalPrice;
            runCost=runCost+(priceData[material.typeid].adjusted*material.quantity*runs);
            runCost=runCost+matRunCost;
            materials.row($('#material-'+material.typeid)).data([
                material.typeid,
                name,
                'N/A',
                'N/A',
                'N/A',
                'N/A',
                'N/A',
                $.number(matTotalPrice,2)
            ]);
            thistime=blueprintData.activityMaterials[activityid][materialid].materialtime*jobquantity*(1-(matte/100))*(1-((industry*4)/100))*(1-((aindustry*3)/100))*mfacilityte[materialid];
            thistime=thistime/blueprintData.activityMaterials[activityid][materialid].materialquantity;
            additionalTime=additionalTime+thistime;
        } else {
            materials.row($('#material-'+material.typeid)).data([
                material.typeid,
                name,
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
            allMaterials[material.typeid]=(typeof allMaterials[material.typeid] == 'undefined')?jobquantity:allMaterials[material.typeid]+jobquantity;
        }
    }
    allmat=$('#allMaterials').DataTable();
    allmat.clear();
    for (var matid in allMaterials) {
            allmat.row.add([
                materialNames[matid],
                allMaterials[matid]
            ]);
    }
    allmat.draw();
    if (blueprintData.blueprintDetails.techLevel==2) {
        inventionNumbers();
    }
    $('#unitPrice').number(priceData[blueprintData.blueprintDetails.productTypeID].sell,2);
    $('#materialSaving').number(totalPriceWT-totalPrice,2);
    $('#jobCost').number(totalPrice,2);
    $('#adjustedCost').number(runCost,2);
    $('#installCost').number((runCost*indexData.costIndexes[activityid])*taxmultiplier*(1+(salary/100)),2);
    profitNumber=(((priceData[blueprintData.blueprintDetails.productTypeID].sell*blueprintData.blueprintDetails.productQuantity*runs)-totalPrice)-(runCost*indexData.costIndexes["1"]*taxmultiplier*(1+(salary/100))))-inventionCost;
    if (blueprintData.blueprintDetails.techLevel==2 && ('8' in blueprintData.activityMaterials)) {
        dc1skill=parseInt($("#dc1skill").val());
        dc2skill=parseInt($("#dc2skill").val());
        dcmultiplier=(1-(dc1skill/100))*(1-(dc2skill/100));
    } else {
        dcmultiplier=1;
    }
     if (activityid==1) {
         buildTime=blueprintData.blueprintDetails.times[activityid]*(1-(te/100))*(1-((industry*4)/100))*(1-((aindustry*3)/100))*facilityte*runs*dcmultiplier;
     } else if (activityid==11) {
         buildTime=blueprintData.blueprintDetails.times[activityid];
     }

    buildTime=additionalTime+buildTime;
    $('#buildTime').text(String(buildTime).toHHMMSS());
    $('#profit').number(profitNumber,2);
    $('#iskhr').number((profitNumber/buildTime)*3600,2);
    $('#isktfhr').number((profitNumber/Math.ceil(buildTime/86400))/24,2);

    materials.draw();
    mat_materials.draw();
    runTimeNumbers();
}


function inventionNumbers()
{
     if (blueprintData.blueprintDetails.techLevel==2 && ('8' in blueprintData.activityMaterials)) {
        encryptionskill=parseInt($("#encryption").val()); 
        dc1skill=parseInt($("#dc1skill").val()); 
        dc2skill=parseInt($("#dc2skill").val()); 
        decryptor=parseInt($('#decryptors input[type="radio"]:checked').val());
        decryptormult=1;
        if (decryptor>-1) {
            decryptormult=blueprintData.decryptors[decryptor].multiplier;
        }
        taxmultiplier=(taxRate/100)+1;
        inventionChance=Math.min(((blueprintData.blueprintDetails.probability*100) * (1 + ((dc1skill+dc2skill)/30)+(encryptionskill/40)))*decryptormult,100);
        invention=$('#inventionCosts').DataTable();
        $("#inventionProbability").number(inventionChance,1);
        for (var materialid in blueprintData.activityMaterials[8]) {
            material=blueprintData.activityMaterials[8][materialid];
            inventionCost=inventionCost+Math.ceil((material.quantity*priceData[material.typeid].sell));
            invention.row($('#inventionmaterial-'+material.typeid)).data([material.name, material.quantity,'Yes',$.number(Math.ceil((material.quantity*priceData[material.typeid].sell)/(inventionChance/100)))]);
        }
        invention.draw();
        blueprintcost=blueprintData.blueprintDetails.precursorAdjustedPrice*indexData.costIndexes["5"]*0.02;
        $('#blueprintCost').number(blueprintcost);
        $('#inventionInstall').number(((runCost/runs)*0.02*indexData.costIndexes["8"])*taxmultiplier);
        if (decryptor>-1)
        {
            inventionCost=inventionCost+(priceData[blueprintData.decryptors[decryptor].typeid].sell);
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
    mecost=0;
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

    $('#metime').text(String(metime*rfacility*(1-(metallurgy*5/100))*(1-((aindustry*3)/100))).toHHMMSS());
    $('#tetime').text(String(tetime*rfacility*(1-(research*5/100))*(1-((aindustry*3)/100))).toHHMMSS());
    $('#mecost').number(mecost*indexData.costIndexes["4"]*taxmultiplier,2);
    $('#tecost').number(tecost*indexData.costIndexes["3"]*taxmultiplier,2);
}

$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results===null) {
        return null;
    } else {
        return results[1] || 0;
    }
};


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
    for (var materialid in blueprintData.activityMaterials[1]) {
        material=blueprintData.activityMaterials[1][materialid];
        mats.push({'typeid':material.typeid,'jobquantity':Math.max(runs,Math.ceil((material.quantity*(1-(me/100))*facilityme)*runs))});
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
var facilityme=0.99;
var rfacility=1;
var facilityte=0.85;
var mfacilityme=[];
var mfacilityte=[];
var regionid=10000002;
var taxRate=0;
var profitNumber=0;
var activityNames={'1':'Manufacturing','3':'TE Research','4':'ME research','5':'Copying','7':'Reverse Engineering','8':'Invention','11':'Reactions'};
var facilitymelookup={'1':1,'2':0.98,'3':0.85,'4':1.05};
//,5:0.97,6:0.955,7:0.95,8:0.964,9:0.94,10:0.976,11:0.964,12:0.96,13:0.9712,14:0.9568,15:0.952};
var facilitytelookup={'1':1,'2':0.75,'3':0.75,'4':0.65};
//var rfacilityme={'1':1,'2':0.7,'3':0.65,'4':Infinity};
//var rfacilityte={'1':1,'2':0.7,'3':0.65,'4':Infinity};
var researchMultiplier=[1,29/21,23/7,39/5,278/15,928/21,2200/21,5251/21,4163/7,29660/21];
var salary=0;
var inventionCost=0;
priceurlstring="https://www.fuzzwork.co.uk/blueprint/api/prices.php?regionid={}&typeids={}";
