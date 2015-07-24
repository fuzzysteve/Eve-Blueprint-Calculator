$(document).ready(function() {


    blueprints=$("#blueprints").dataTable({
            "bInfo": false,
            "paging":false,
            "bAutoWidth": true,
            "bDeferRender": false,
            "sDom": 'C<"clear">lfrtip',
            "columnDefs": [{
                "targets": [ 3,4,5,6,7,8,9,10 ],
                className: "textright"
                },
                {
                 "targets": [0,1,2],
                 className: "textcenter"
                }
                ],
    });
});
