if (text) {
    let techerInfo = JSON.parse(text);

    $('#table_id').DataTable( {
        data: techerInfo.SMU,
        searching: false,
        buttons: [
            'copy', 'excel', 'pdf'
        ],
        info: false,
        bLengthChange: false,
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
            { data: 'Statuss',
                render: (data) => {
                    if (data === '0') {
                        return "<div onclick='astiprinat(event)' class='status-btn'>APSTIPRINĀT</div>" +
                            "<div onclick='noradit(event)' class='status-btn'>NORAIDĪT</div>";
                    } else if (data === '1') {
                        return "<div class='status-btn'>Y</div><div class='status-btn'>NORAIDĪT</div>";
                    } else if (data === '2') {
                        return "<div class='status-btn'>APSTIPRINĀT</div><div class='status-btn'>X</div>";
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
        bLengthChange: false,
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
                    if (!data) {
                        if (full.Statuss !== "3") {
                            return '<div>X</div>';
                        } else {
                            return '<div>Y</div>';
                        }
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
                        return '<div>X</div>';
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
                        return "<div>X</div>";
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
        bLengthChange: false,
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
                            return '<div>X</div>';
                        } else {
                            return '<div>Y</div>';
                        }
                    }
                }
            }
        ]
    } );

    vidusskolaBtn.style.background = '#16B01A';
    vidusskolaBtn.style.color = 'white';

    pamatskolaBtn.addEventListener('click', function () {
        pamatskola_wrapper.style.display = 'block';
        pamatskolaBtn.style.background = '#16B01A';
        pamatskolaBtn.style.color = 'white';
        vidusskolaBtn.style.color = '#d0d0d0';
        vidusskolaBtn.style.background = 'inherit';
        apstiprinatie_wrapper.style.display = 'none';
    });

    vidusskolaBtn.addEventListener('click', function () {
        apstiprinatie_wrapper.style.display = 'block';
        vidusskolaBtn.style.background = '#16B01A';
        vidusskolaBtn.style.color = 'white';
        pamatskolaBtn.style.color = '#d0d0d0';
        pamatskolaBtn.style.background = 'inherit';
        pamatskola_wrapper.style.display = 'none';
    });

    function labot(e) {
        event.target.parentElement.style.background = 'green';
        e.path[2].cells[4].innerHTML = "<div class='status-btn'>Y</div><div onclick='noradit(event)' class='status-btn'>NORAIDĪT</div>"
    }

    function labotApsti(e) {
        event.target.parentElement.style.background = 'green';
        e.path[2].cells[4].innerHTML = "<div class='status-btn'>Y</div><div onclick='noradit(event)' class='status-btn'>NORAIDĪT</div>"
    }

    function astiprinat(e) {
        console.log('event.target ', event.target.style.background);
        event.target.style.background = 'green';
        e.path[2].cells[4].innerHTML = "<div class='status-btn'>Y</div><div onclick='noradit(event)' class='status-btn'>NORAIDĪT</div>"
    }

    function noradit(e) {
        console.log('event.target ', event.target.style.background);
        event.target.style.background = 'green';
        e.path[2].cells[4].innerHTML = "<div onclick='astiprinat(event)' class='status-btn'>APSTIPRINĀT</div><div class='status-btn'>X</div>"
    }
}