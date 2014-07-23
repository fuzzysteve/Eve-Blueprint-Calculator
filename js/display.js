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
                $( "#meslider" ).slider({
                        value:me,
                        min: 0,
                        max: 10,
                        step: 1,
                        slide: function( event, ui ) {
                                $( "#me" ).val( ui.value );
                                runNumbers()
                        }
                });
                $( "#me" ).val( $( "#meslider" ).slider( "value" ) );
    });

    $(function() {
                $( "#teslider" ).slider({
                        value:te,
                        min: 0,
                        max: 20,
                        step: 2,
                        slide: function( event, ui ) {
                                $( "#te" ).val( ui.value );
                                runNumbers()
                        }
                });
                $( "#te" ).val( $( "#teslider" ).slider( "value" ) );
    });
    
    $(function() {
                $( "#teresearchslider" ).slider({
                        values:[0,0],
                        min: 0,
                        max: 20,
                        step: 2,
                        range:true,
                        slide: function( event, ui ) {
                                $( "#teresearch" ).val( ui.values[0]+'-'+ui.values[1] );
                                runTimeNumbers()
                        }
                });
                $( "#teresearch" ).val( '0-0' );
    });

    $(function() {
                $( "#meresearchslider" ).slider({
                        values:[0,0],
                        min: 0,
                        max: 10,
                        step: 1,
                        range:true,
                        slide: function( event, ui ) {
                                $( "#meresearch" ).val( ui.values[0]+'-'+ui.values[1] );
                                runTimeNumbers()
                        }
                });
                $( "#meresearch" ).val( '0-0' );
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
        $("#systemName").autocomplete({source:"/blueprint/api/systemName.php",minLength:2,change: function( event, ui ) {loadIndexes();},select: function( event, ui ) { $("systemName").val(ui.item.value);loadIndexes();}});
        });
    $(function() {
        var spinner= $("#taxRate").spinner({min:0,max:100,step: 0.01,spin: function(event,ui) {taxRate=ui.value;runNumbers();},change: function(event,ui) {taxRate=$("#taxRate").val();runNumbers();}});
        });
});

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var days   = Math.floor(sec_num / 86400);
    var hours   = Math.floor((sec_num -(days*86400)) / 3600);
    var minutes = Math.floor((sec_num - ((days*86400) + (hours * 3600))) / 60);
    var seconds = (sec_num - ((days*86400) + (hours * 3600))) - (minutes * 60);
    daystring='';
    if (days>0) { daystring= days+ ' Days ' }
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = daystring+hours+':'+minutes+':'+seconds;
    return time;
}
