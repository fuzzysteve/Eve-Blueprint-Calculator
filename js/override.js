prices=$("#priceTable").dataTable({
        "bPaginate": false,
        "bFilter": false,
        "bInfo": false,
        "bAutoWidth": false,
        "bSortClasses": false,
    });



function listOverrides() {
    prices=$('#priceTable').DataTable();
    const regex="^priceOverride-";


    prices.rows().remove();
    for (var keyid in Object.keys(localStorage)) {
        mykey=localStorage.key(keyid);
        if (mykey.match(regex)) {
            typeid=mykey.substring(14)
            prices.row.add([materialTypeNames[typeid],localStorage.getItem(mykey),'<span class=deleteoverride data-typeid='+typeid+'>Delete</span>']);
        }
    }

    
    prices.draw();
    $(".deleteoverride").on('click',function(event){
        deleteOverride(event.target.getAttribute("data-typeid"));
        listOverrides();
    });
}


function deleteOverride(typeid){
    localStorage.removeItem('priceOverride-'+typeid);
    listOverrides();
}
