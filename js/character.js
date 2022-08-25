function getCharacterSheet()
{
    vcode=$('#vcode').val();
    key=$('#key').val();
    charid=$('#characterID').val();
    myurl=apiurl+'?keyid='+key+'&vcode='+vcode+'&characterid='+charid;
    
    $.ajax({
            type: "GET",
            url: myurl,
            dataType: "xml",
            crossDomain:true,
            success: processSheet
    });
};

function processSheet(xml)
{
    skills=$("#skills").DataTable();
    xmldata=xml;
    $(xmldata).find("rowset[name='skills'] row").each(function(index) {
        typeid=parseInt($(this)[0].attributes.getNamedItem('typeID').value);
        level=parseInt($(this)[0].attributes.getNamedItem('level').value);
        skills.row.add([skillLookup[typeid],level]);
    });
    skills.draw();

};

$(document).ready(function() {


   $("#skills").dataTable({
            "bPaginate": false,
            "bFilter": false,
            "bInfo": false,
            "bAutoWidth": false,
            "bSortClasses": false,
            "bDeferRender": false,
            "sDom": 'C<"clear">lfrtip'
    });
});


apiurl='https://api.testeveonline.com/char/CharacterSheet.xml.aspx';
character=Array();
var xmldata;
