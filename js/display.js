$(document).ready(function() {

$("#mainbody").hide();


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

    $("#costIndexTable").dataTable({
        "bPaginate": false,
        "bFilter": false,
        "bInfo": false,
        "bAutoWidth": false,
        "bSortClasses": false,
        "columnDefs": [{
            "targets": [ 1 ],
            className: "textright"
            }
            ]
        });

    $('#allMaterials').dataTable({
         "bPaginate": false,
         "bFilter": false,
         "bInfo": false,
         "bAutoWidth": false,
         "bSortClasses": false
    });

    $("#inventionCosts").dataTable({
        "bPaginate": false,
        "bFilter": false,
        "bInfo": false,
        "bAutoWidth": false,
        "bSortClasses": false,
        "columnDefs": [{
            "targets": [ 1,2,3 ],
            className: "textright"
            }
            ]
        });
    
    
    $("#decryptors").dataTable({
        "bPaginate": false,
        "bFilter": false,
        "bInfo": false,
         "ordering": false,
        "bAutoWidth": false,
        "bSortClasses": false,
        "columnDefs": [{
            "targets": [ 1,2,3,4 ],
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
                $( "#encryptionslider" ).slider({
                        value:me,
                        min: 1,
                        max: 5,
                        step: 1,
                        slide: function( event, ui ) {
                                $( "#encryption" ).val( ui.value );
                                runNumbers()
                        }
                });
                $( "#encryption" ).val( $( "#encryptionslider" ).slider( "value" ) );
    });

    $(function() {
                $( "#dc1skillslider" ).slider({
                        value:me,
                        min: 1,
                        max: 5,
                        step: 1,
                        slide: function( event, ui ) {
                                $( "#dc1skill" ).val( ui.value );
                                runNumbers()
                        }
                });
                $( "#dc1skill" ).val( $( "#dc1skillslider" ).slider( "value" ) );
    });
    
    $(function() {
                $( "#dc2skillslider" ).slider({
                        value:me,
                        min: 1,
                        max: 5,
                        step: 1,
                        slide: function( event, ui ) {
                                $( "#dc2skill" ).val( ui.value );
                                runNumbers()
                        }
                });
                $( "#dc2skill" ).val( $( "#dc2skillslider" ).slider( "value" ) );
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


    // Floating prices box: starts top-right (inline style in display.tpl),
    // remembers where it was dragged, and is kept inside the window.
    $(function() {
                var PRICEPOS_KEY = 'blueprintPricePos';
                var $prices = $("#prices");

                function clampPrices() {
                    var pos = $prices.position();
                    var maxLeft = Math.max(0, $(window).width() - $prices.outerWidth() - 16);
                    $prices.css({
                        left: Math.min(Math.max(0, pos.left), maxLeft),
                        top: Math.max(0, pos.top)
                    });
                }

                // Switch from right-anchored to left/top so dragging doesn't stretch it.
                $prices.css({ left: $prices.position().left, right: 'auto' });
                try {
                    var saved = JSON.parse(localStorage.getItem(PRICEPOS_KEY));
                    if (saved && typeof saved.top === 'number' && typeof saved.left === 'number') {
                        $prices.css({ top: saved.top, left: saved.left });
                    }
                } catch (e) { /* storage unavailable or bad value: keep the default */ }
                clampPrices();

                $prices.draggable({
                    handle: "#priceheader",
                    stop: function(event, ui) {
                        clampPrices();
                        try {
                            var pos = $prices.position();
                            localStorage.setItem(PRICEPOS_KEY, JSON.stringify({ top: Math.floor(pos.top), left: Math.floor(pos.left) }));
                        } catch (e) { /* storage unavailable */ }
                    }
                });
                // Expanding widens the box; pull it back in if it now runs off the edge.
                $("#pricedetail").on('shown.bs.collapse', clampPrices);
                // Web fonts can widen the header after the first clamp.
                $(window).on('resize load', clampPrices);
    });

    $(function() {
        $("#runs").spinner({
            min:1,
            spin: function(event,ui) {runs=ui.value;runNumbers();},
            change: function(event,ui) {runs=$("#runs").val();runNumbers();}
        });
    });

    $(function() {
        $("#indexEntry").spinner({
            min:0.01,
            step:0.01,
            stop: function(event,ui) {updatewhindex(ui.value);},
        });
    });

    $(function() {
        $("#systemName").autocomplete({
            source:"/blueprint/api/systemName.php",
            minLength:2,
            change: function( event, ui ) { $("#systemName").val(ui.item.value);loadIndexes();},
            select: function( event, ui ) { $("#systemName").val(ui.item.value);loadIndexes();}
        });
    });

    $(function() {
        $("#facilityTaxRate").spinner({
            min:0,
            max:100,
            step: 0.01,
            spin: function(event,ui) {facilityTaxRate=ui.value;runNumbers();},
            change: function(event,ui) {facilityTaxRate=parseFloat($("#facilityTaxRate").val());runNumbers();}
        });
    });

    $(function() {
        $("#teamme").spinner({
            min:0,
            max:7.5,
            step: 0.5,
            spin: function(event,ui) {teamMe=ui.value;runNumbers();},
            change: function(event,ui) {teamMe=$("#teamme").val();runNumbers();}
        });
    });
    
    $(function() {
        $("#teamte").spinner({
            min:0,
            max:15,
            step: 1,
            spin: function(event,ui) {teamTe=ui.value;runNumbers();},
            change: function(event,ui) {teamTe=$("#teamte").val();runNumbers();}
        });
    });


    $(function() {
        $("#salary").spinner({
            min:0,
            max:18,
            step: 1,
            spin: function(event,ui) {salary=ui.value;runNumbers();},
            change: function(event,ui) {salary=$("#salary").val();runNumbers();}
        });
    });

    if (characterid) {
        newlist=$("#newlistmodal").dialog({
            autoOpen:false,
            modal:false,
            buttons: {
                "Create List":addList
            }
        })
        loadLists();
    }

});

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var days   = Math.floor(sec_num / 86400);
    var hours   = Math.floor((sec_num -(days*86400)) / 3600);
    var minutes = Math.floor((sec_num - ((days*86400) + (hours * 3600))) / 60);
    var seconds = (sec_num - ((days*86400) + (hours * 3600))) - (minutes * 60);
    daystring='';
    if (days>1) { daystring= days+ ' Days' } else if (days>0) { daystring= days+' Day ' }
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = daystring+hours+':'+minutes+':'+seconds;
    return time;
}
