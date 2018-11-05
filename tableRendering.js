if (text) {
    let techerInfo = JSON.parse(text);

    $('#table_id').DataTable( {
        data: techerInfo.SMU,
        dom: '<"top"B>t<"bottom"p><"clear">',
        buttons: [
            // {
            //     text: 'KLASSE',
            //     attr: {
            //         id:'klasseSrt'
            //     },
            //     action: function ( e, dt, node, config ) {
            //
            //     }
            // },
            // {
            //     text: 'DATUMS',
            //     attr: {
            //         id:'datumsSrt'
            //     },
            //     action: function ( e, dt, node, config ) {
            //
            //     }
            // },
            {extend: 'excel', text: 'Exel'},
            {extend: 'pdf', text: '.PDF'}
        ],
        bLengthChange: false,
        oLanguage: {
            oPaginate: {
                sPrevious: "IEPRIEKŠĒJĀ",
                sNext: "NĀKAMĀ",
            }
        },
        columnDefs: [{
            orderable: false,
            targets: "no-sort"
        }],
        columns: [
            { data: 'Nr' },
            { data: 'Skolens' },
            { data: 'Klase',
                ordering: true
            },
            { data: 'Datums',
                ordering: true},
            { data: 'Statuss',
                render: (data) => {
                    if (data === '0') {
                        return "<p onclick='astiprinat(event)' class='status-btn'>APSTIPRINĀT</p><p onclick='noradit(event)' class='status-btn'>NORAIDĪT</p>";
                    } else if (data === '1') {
                        return "<p class='status-btn astiprinat-yes'></p><p onclick='noradit(event)' class='status-btn'>NORAIDĪT</p>";
                    } else if (data === '2') {
                        return "<p class='status-btn noradit'>APSTIPRINĀT</p><p class='status-btn noradit-no'></p>";
                    }
                },
                className: "column-btn column-btn-st"
            },
            { data: 'Labot',
                render: () => {
                    return "<a id='labotBtn' onclick='labot(event)' class='labot-btn'>Labot</a>";
                },
                className: "column-btn"
            }

        ]
    } );

    let apstiprinatie = [];

    for ( let i of techerInfo.SMU ) {
        if (i.Statuss === '1') {
            apstiprinatie.push(i);
        }
    }

    let pamatskola = [];

    for ( let i of techerInfo.SMU ) {

        let klase = i.Klase.replace(/\D+/g,'');
        if ( klase <= 9 ) {
            pamatskola.push(i);
        }
    }


    $('#apstiprinatie').DataTable( {
        data: apstiprinatie,
        searching: false,
        info: false,
        select: false,
        dom: '<"top"B>t<"bottom"p><"clear">',
        buttons: [
            // {
            //     text: 'KLASSE',
            //     attr: {
            //         id:'klasseSrt'
            //     },
            //     action: function ( e, dt, node, config ) {
            //         alert( 'Button activated' );
            //     }
            // },
            {extend: 'excel', text: 'Exel'},
            {extend: 'pdf', text: '.PDF'}
        ],
        bLengthChange: false,
        columnDefs: [{
            orderable: false,
            targets: "no-sort"
        }],
        oLanguage: {
            oPaginate: {
                sPrevious: "IEPRIEKŠĒJĀ",
                sNext: "NĀKAMĀ",
            }
        },
        columns: [
            { data: 'Nr' },
            { data: 'Skolens' },
            { data: 'Klase' },
            { data: 'Datums' },
            { data: 'Mācību gads',
              render: () => {
                   return "2018/2019";
                }
            },
            { data: 'Nosaukums' },
            { data: 'Likvidēts',
                render: (data, type, full) => {
                    full.Statuss = "3";
                    if (full.Statuss !== "3") {
                        return '<p class="noradit-no"></p>';
                    } else {
                        return '<p class="astiprinat-yes"></p>';
                    }
                }
            },
            { data: 'Mācību gads',
                render: () => {
                    return "2018/2019";
                }
            },
            { data: 'Piedalījās',
                render: (data) => {
                    if (!data) {
                        return '<p class="noradit-no"></p>';
                    }
                }
            },
            { data: 'Mācību gads',
                render: () => {
                    return "2018/2019";
                }
            },
            { data: 'Piedalījās',
                render: (data) => {
                    if (!data) {
                        return "<p class=\"noradit-no\"></p>";
                    }
                }
            },
            { data: 'Statuss',
                render: () => {
                return "<a class='labot-btn' onclick='labotApsti(event)'>Labot</a>";

                },
                className: "column-btn"
            },
            { data: 'Pievienot sertifikātu sarakstam',
                render: () => {
                    return "<a class='labot-btn'>PIEVIENOT</a>";

                },
                className: "column-btn"
            }

        ]
    } );



    $('#pamatskola').DataTable( {
        data: pamatskola,
        searching: false,
        info: false,
        select: false,
        dom: '<"top"B>t<"bottom"p><"clear">',
        buttons: [
            {extend: 'excel', text: 'Exel'},
            {extend: 'pdf', text: '.PDF'}
        ],
        bLengthChange: false,
        columnDefs: [{
            orderable: false,
            targets: "no-sort"
        }],
        oLanguage: {
            oPaginate: {
                sPrevious: "IEPRIEKŠĒJĀ",
                sNext: "NĀKAMĀ",
            }
        },
        columns: [
            { data: 'Nr' },
            { data: 'Skolens' },
            { data: 'Klase' },
            // { data: 'Datums' },
            { data: 'Mācību gads',
                render: () => {
                    return "2018/2019";
                }
            },
            { data: 'Nosaukums' },
            { data: 'Likvidēts',
                render: (data, type, full) => {
                    if (!data) {
                        if (full.Statuss !== "3") {
                            return '<p class="noradit-no"></p>';
                        } else {
                            return '<p class="astiprinat-yes"></p>';
                        }
                    }
                }
            }
        ]
    } );

    // $( ".dt-buttons" ).prepend( "<p>Eksportēt sarakstu: </p>" );

    vidusskolaBtn.style.background = '#24bc4b';
    vidusskolaBtn.style.color = 'white';

    pamatskolaBtn.addEventListener('click', function () {
        pamatskola_wrapper.style.display = 'block';
        pamatskolaBtn.style.background = '#24bc4b';
        pamatskolaBtn.style.color = 'white';
        vidusskolaBtn.style.color = '#d0d0d0';
        vidusskolaBtn.style.background = 'inherit';
        apstiprinatie_wrapper.style.display = 'none';
    });

    vidusskolaBtn.addEventListener('click', function () {
        apstiprinatie_wrapper.style.display = 'block';
        vidusskolaBtn.style.background = '#24bc4b';
        vidusskolaBtn.style.color = 'white';
        pamatskolaBtn.style.color = '#d0d0d0';
        pamatskolaBtn.style.background = 'inherit';
        pamatskola_wrapper.style.display = 'none';
    });

    function labot(event) {
        event.target.parentElement.style.background = '#24bc4b';
        event.target.style.color = 'white';
        event.path[2].cells[4].innerHTML = "<p class='status-btn astiprinat-yes'></p><p onclick='noradit(event)' class='status-btn'>NORAIDĪT</p>"
    }

    function labotApsti(event) {
        event.target.parentElement.style.background = '#24bc4b';
        event.target.style.color = 'white';
        event.path[2].cells[8].innerHTML = "<p onclick='checkYes(event)' class='astiprinat-yes'></p><p onclick='checkNo(event)' class='noradit-no'></p>";
        event.path[2].cells[10].innerHTML = "<p onclick='checkYes(event)' class='astiprinat-yes'></p><p onclick='checkNo(event)' class='noradit-no'></p>";

    }

    function checkYes(event) {
        event.path[1].innerHTML = "<p class='astiprinat-yes'></p>";
        checkPievienot(event);
    }

    function checkNo(event) {
        event.path[1].innerHTML = "<p class='noradit-no'></p>";
        checkPievienot(event);
    }

    function astiprinat(event) {
        event.target.style.background = '#24bc4b';
        event.path[2].cells[4].innerHTML = "<p class='status-btn astiprinat-yes'></p><p onclick='noradit(event)' class='status-btn'>NORAIDĪT</p>"
    }

    function noradit(event) {
        event.target.style.background = '#24bc4b';
        event.path[2].cells[4].innerHTML = "<p onclick='astiprinat(event)' class='status-btn'>APSTIPRINĀT</p><p class='status-btn noradit-no'></p>"
    }

    function checkPievienot(event) {
        if (event.path[2].cells[8].childNodes.length < 2 &&
            event.path[2].cells[10].childNodes.length < 2) {

            if (event.path[2].cells[6].childNodes[0].className === "astiprinat-yes" &&
                event.path[2].cells[8].childNodes[0].className === "astiprinat-yes" &&
                event.path[2].cells[10].childNodes[0].className === "astiprinat-yes") {
                event.path[2].cells[12].childNodes[0].className = "activaite-btn";
                event.path[2].cells[12].childNodes[0].parentElement.style.background = '#24bc4b';
                setCountInConfirmBtn();
            } else {
                event.path[2].cells[12].childNodes[0].className = "labot-btn";
            }

        } else {
            event.path[2].cells[12].childNodes[0].className = "labot-btn";
        }
    }

    function setCountInConfirmBtn() {

    }
}