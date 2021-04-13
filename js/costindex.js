$(document).ready(function() {


    basematerials=$("#costIndex").dataTable({
            "bInfo": false,
            "paging":false,
            "bAutoWidth": false,
            "bDeferRender": false,
            "sDom": 'C<"clear">lfrtip',
            "columnDefs": [{
                "targets": [ 1,2,3,4,5,6,7 ],
                className: "textright"
                },
                {"targets": [8],
                className: "textright security"
                }
                ],
    });
});

  $(function() {
        $("#systemname").autocomplete({
            source:"/blueprint/api/systemName.php",
            minLength:2
        });
    });





function populateIndexes(indexJson) {
    indexData=indexJson;
    currentindex=$('#region').val();
    cit=$("#costIndex").DataTable();
    cit.rows().remove();
    for (var systemidx in indexJson) {
        system=indexJson[systemidx];
        cit.row.add([
        system.solarSystemName,
        $.number(system.costIndexes[1]*100,2)+'%',
        $.number(system.costIndexes[3]*100,2)+'%',
        $.number(system.costIndexes[4]*100,2)+'%',
        $.number(system.costIndexes[5]*100,2)+'%',
        $.number(system.costIndexes[7]*100,2)+'%',
        $.number(system.costIndexes[8]*100,2)+'%',
        $.number(system.costIndexes[11]*100,2)+'%',
        system.security.toFixed(2),
        system.manuf.toFixed(2),
        system.resea.toFixed(2),
        system.length
        ]);
    }
    cit.draw();
    $('td.security').each(function(){
        security=parseFloat($(this).text());
        classvar='nullsec';
        if (security>0.4501) {
            classvar='highsec';
        } else if (security>0) {
            classvar='lowsec';
        }
        $(this).addClass(classvar);
    });
}

function hideshow(classvar){
    $('td.'+classvar).parent().toggle();
}

function loadRegionIndexes()
{
    addparam='';
    if ($("#factory").is(':checked')) {
        addparam='&factory=1';
    }
    if ($("#lab").is(':checked')) {
        addparam=addparam+'&lab=1';
    }
    if (currentindex!=$('#region').val()) {
        queryurl="https://www.fuzzwork.co.uk/blueprint/api/regionIndexes.php?region="+$('#region').val()+addparam;
        $.getJSON(queryurl,function(data){populateIndexes(data);});
    }
}

function loadRangeIndexes()
{
    addparam='';
    if ($("#factory").is(':checked')) {
        addparam='&factory=1';
    }
    if ($("#lab").is(':checked')){
        addparam=addparam+'&lab=1';
    }
    queryurl="https://www.fuzzwork.co.uk/blueprint/api/regionIndexes.php?system="+$('#systemname').val()+"&jumps="+$('#jumps').val()+addparam;
    $.getJSON(queryurl,function(data){populateIndexes(data);});
}

var currentindex='';
