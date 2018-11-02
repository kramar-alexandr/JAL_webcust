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
                        return "<a class='status-btn'>APSTIPRINĀT</a>" +
                            "<a class='status-btn'>NORAIDĪT</a>";
                    } else if (data === '1') {
                        return "<input disabled checked type=\"checkbox\"><a class='status-btn'>NORAIDĪT</a>";
                    } else if (data === '2') {
                        return "<a class='status-btn'>APSTIPRINĀT</a><input disabled type=\"checkbox\">";
                    }
                },
                className: "column-btn"
            },
            { data: 'Labot',
                render: () => {
                    return "<a class='labot-btn'>Labot</a>";
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
                            return '<input disabled type=\"checkbox\">';
                        } else {
                            return '<input disabled checked type=\"checkbox\">';
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
                        return '<input disabled type=\"checkbox\">';
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
                        return "<input disabled type=\"checkbox\">";
                    }
                }
            },
            { data: 'Statuss',
                render: () => {
                return "<a class='labot-btn'>Labot</a>";

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
                            return '<input disabled type=\"checkbox\">';
                        } else {
                            return '<input disabled checked type=\"checkbox\">';
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
}