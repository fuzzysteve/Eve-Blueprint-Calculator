$(document).ready(function() {


    items=$("#items").dataTable({
            "bInfo": false,
            "paging":false,
            "bAutoWidth": false,
            "bDeferRender": false,
            "sDom": 'C<"clear">lfrtip',
            "columnDefs": [{
                "targets": [ 0,1  ],
                   "visible": false,
                   "searchable": false
                }],
                "drawCallback": function ( settings ) {
                    var api = this.api();
                    var rows = api.rows( {page:'current'} ).nodes();
                    var last=null;
                    api.column(1, {page:'current'} ).data().each( function ( group, i ) {
                        if ( last !== group ) {
                            $(rows).eq( i ).before(
                                '<tr class="group"><td colspan="5">'+group+'</td></tr>'
                            );
                            last = group;
                        }
                    });
                }
    });
    totals=$("#totals").dataTable({
            "bInfo": false,
            "paging":false,
            "bAutoWidth": false,
            "bDeferRender": false,
            "sDom": 'C<"clear">lfrtip',
     });

    $('#items tbody').on( 'click', 'tr.group', function () {
        var currentOrder = items.order()[0];
        if ( currentOrder[0] === 1 && currentOrder[1] === 'asc' ) {
            items.order( [ 1, 'desc' ] ).draw();
        }
        else {
            items.order( [ 1, 'asc' ] ).draw();
        }
    } ); 

    if (characterid) {
        loadLists();
    }


});

function loadLists() {
    if (!characterid) {
        return;
    }

    $.getJSON('/blueprint/api/shoppingList/listNames.php?listnonce='+listnonce,function( data ) {
        $.each( data, function( key, val ) {
            $('#shoppingListSelect')
                .append($('<option>',{value:val.id})
                .text(val.name));
        });
    });
}


function deleteItem(button,itemid) {
    $.post('/blueprint/api/shoppingList/deleteItem.php',{'nonce':nonce,'itemid':itemid},function( data )
    {
        if (data.status=='success') {
            loadListContents();
        }
    },'json');

}

function loadListContents() {

    listid=$('#shoppingListSelect').val();
    if (listid=='die') {
        return;
    }
    material=new Object();
    matname=new Object();
    $.post('/blueprint/api/shoppingList/listContents.php',{'nonce':nonce,'listid':listid},function( data )
    {
        items=$("#items").DataTable(); 
        items.rows().remove();
        $.each(data,function(key,item){
            if (isFinite(material[item.typeid])) {
                material[item.typeid]=material[item.typeid]+item.quantity;
            } else {
                material[item.typeid]=item.quantity;
                matname[item.typeid]=item.typename;
            }
            items.row.add([
                item.id,
                item.identifier,
                item.typename,
                $.number(item.quantity),
                $.number(item.sellprice),
                '<button onclick="deleteItem(this,'+item.id+');">Delete</button>'
                ]);
        });
        items.draw();
        totals=$("#totals").DataTable();
        totals.rows().remove();
        $.each(material,function(key,value){
            totals.row.add([matname[key],$.number(value)]);
        });
        totals.draw();
    },'json');
}
