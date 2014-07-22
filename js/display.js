$(document).ready(function() {


    basematerials=$("#materialsTable").dataTable({
            "bPaginate": false,
            "bFilter": false,
            "bInfo": false,
            "bAutoWidth": false,
            "bSortClasses": false,
            "bDeferRender": false,
            "sDom": 'C<"clear">lfrtip',
            "columnDefs": [{
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
                },
                {
                "targets": [ 2,3,4,5,6,7 ],
                className: "textright"
                } 
                ],
    });

    prices=$("#priceTable").dataTable({
        "bPaginate": false,
        "bFilter": false,
        "bInfo": false,
        "bAutoWidth": false,
        "bSortClasses": false,
        "columnDefs": [{
            "targets": [ 2,3 ],
            "visible": false,
            "searchable": false,
            className: "textright"
            },
            {
            "targets": [ 1 ],
            className: "textright"
            }
            ]
        });

    skills=$("#skillsTable").dataTable({
         "bPaginate": false,
         "bFilter": false,
         "bInfo": false,
         "ordering": false,
         "bAutoWidth": true,
         "bSortClasses": false,
         "columnDefs": [{
                "targets": [ 0 ],
                "visible": false
                }],
         "drawCallback": function ( settings ) {
             var api = this.api();
             var rows = api.rows( {page:'current'} ).nodes();
             var last=null;
 
             api.column(0, {page:'current'} ).data().each( function ( group, i ) {
                 if ( last !== group ) {
                     $(rows).eq( i ).before(
                         '<tr class="group"><th colspan="3">'+group+'</th></tr>'
                     );
 
                     last = group;
                 }
             } );
           }
         });

    $(function() {
                $( "#mlslider" ).slider({
                        value:ml,
                        min: 0,
                        max: 10,
                        step: 1,
                        slide: function( event, ui ) {
                                $( "#ml" ).val( ui.value );
                                runNumbers()
                        }
                });
                $( "#ml" ).val( $( "#mlslider" ).slider( "value" ) );
    });

    $(function() {
                $( "#teslider" ).slider({
                        value:pl,
                        min: -6,
                        max: 500,
                        step: 1,
                        slide: function( event, ui ) {
                                $( "#te" ).val( ui.value );
                                runNumbers()
                        }
                });
                $( "#te" ).val( $( "#teslider" ).slider( "value" ) );
    });

    $(function() {
                $( "#indslider" ).slider({
                        value:industry,
                        min: 1,
                        max: 5,
                        step: 1,
                        slide: function( event, ui ) {
                                $( "#ind" ).val( ui.value );
                                runNumbers()
                        }
                });
                $( "#ind" ).val( $( "#indslider" ).slider( "value" ) );
    });

    $(function() {
                $( "#metslider" ).slider({
                        value:metallurgy,
                        min: 0,
                        max: 5,
                        step: 1,
                        slide: function( event, ui ) {
                                $( "#met" ).val( ui.value );
                                runNumbers()
                        }
                });
                $( "#met" ).val( $( "#metslider" ).slider( "value" ) );
    });

    $(function() {
                $( "#researchslider" ).slider({
                        value:research,
                        min: 0,
                        max: 5,
                        step: 1,
                        slide: function( event, ui ) {
                                $( "#research" ).val( ui.value );
                                runNumbers()
                        }
                });
                $( "#research" ).val( $( "#researchslider" ).slider( "value" ) );
    });


    $(function() {
                $( "#prices" ).draggable({ handle: "#priceheader" }).mouseup(function(){
                    var coords=[];
                    var coord = $(this).position();
                    var item={ coordTop:  Math.floor(coord.top), coordLeft: Math.floor(coord.left),width: $("#prices").css('width') };
                    coords.push(item);
                    createCookie("pricepos",JSON.stringify(coords),700);
                 });
    });

    $(function() {
                $( "#slider-encryption" ).slider({
                        orientation: "vertical",
                        range: "min",
                        min: 1,
                        max: 5,
                        value: 1,
                        slide: function( event, ui ) {
                                $( "#encryption" ).val( ui.value );
                                calculateresult();
                        }
                });
                $( "#encryption" ).val( $( "#slider-encryption" ).slider( "value" ) );
    });
    
    $(function() {
                $( "#slider-datacore1" ).slider({
                        orientation: "vertical",
                        range: "min",
                        min: 1,
                        max: 5,
                        value: 1,
                        slide: function( event, ui ) {
                                $( "#datacore1" ).val( ui.value );
                                calculateresult();
                        }
                });
                $( "#datacore1" ).val( $( "#slider-datacore1" ).slider( "value" ) );
    });

    $(function() {
                $( "#slider-datacore2" ).slider({
                        orientation: "vertical",
                        range: "min",
                        min: 1,
                        max: 5,
                        value: 1,
                        slide: function( event, ui ) {
                                $( "#datacore2" ).val( ui.value );
                                calculateresult();
                        }
                });
                $( "#datacore2" ).val( $( "#slider-datacore2" ).slider( "value" ) );
    });

    $(function() {
                $( "#slider-metaitem" ).slider({
                        orientation: "vertical",
                        range: "min",
                        min: 0,
                        max: 4,
                        value: 0,
                        slide: function( event, ui ) {
                                $( "#metaitem" ).val( ui.value );
                                calculateresult();
                        }
                });
                $( "#metaitem" ).val( $( "#slider-metaitem" ).slider( "value" ) );


    });
    $(function() {
        var spinner= $("#runs").spinner({min:1,spin: function(event,ui) {runs=ui.value;runNumbers();},change: function(event,ui) {runs=$("#runs").val();runNumbers();}});
        });
    $(function() {

$(function() {
        var spinner= $("#taxRate").spinner({min:0,max:100,step: 0.01,spin: function(event,ui) {taxRate=ui.value;runNumbers();},change: function(event,ui) {taxRate=$("#taxRate").val();runNumbers();}});
        });


    $("#systemName").autocomplete({source:"/blueprint/api/systemName.php",minLength:2,change: function( event, ui ) {loadIndexes();},select: function( event, ui ) { $("systemName").val(ui.item.value);loadIndexes();}});
        });
});
