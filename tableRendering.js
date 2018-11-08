if (text) {
    let techerInfo = JSON.parse(text);

    let table = $('#table_id').DataTable( {
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
            {extend: 'pdf', text: '.PDF', exportOptions: {
                    modifier: {
                        page: 'current'
                    }
                }}
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
                        return "<p class='status-btn apstiprinatBtn'>APSTIPRINĀT</p>" +
                            "<p class='status-btn noraditBtn'>NORAIDĪT</p>";

                    } else if (data === '1') {
                        return "<p class='status-btn astiprinat-yes'></p>" +
                            "<p class='status-btn noraditBtn'>NORAIDĪT</p>";

                    } else if (data === '2') {
                        return "<p class='status-btn apstiprinatBtn'>APSTIPRINĀT</p>" +
                            "<p class='status-btn noradit-no'></p>";
                    }
                },
                className: "column-btn column-btn-st"
            },
            { data: 'Labot',
                render: () => {
                    return "<a id='labotBtn' class='labot-btn'>Labot</a>";
                },
                className: "column-btn labotBtn"
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


    let tableApstiprinatie = $('#apstiprinatie').DataTable( {
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
                    data = '3';
                    if (data !== "3") {
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
                className: "column-btn labotApsti"
            },
            { data: 'Pievienot sertifikātu sarakstam',
                render: () => {
                    return "<a class='labot-btn'>PIEVIENOT</a>";

                },
                className: "column-btn pievienotBtn"
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

    $('.dataTable').on('click', '.apstiprinatBtn', function() {
        let data = table.row(this.parentNode.parentNode.rowIndex - 1).data();

        data.Statuss = '1';
        table.row(this.parentNode.parentNode.rowIndex - 1).data(data).draw();

        let xhr = new XMLHttpRequest();

        console.log('status ', data.Statuss);

        xhr.open('GET',`/WEBJALTeacherAccChangeStatus.hal?sernr=${data.SerNr}&status=${data.Statuss}`,true);
        xhr.send();

        console.log( xhr );
    });

    $('.dataTable').on('click', '.noraditBtn', function() {
        let data = table.row(this.parentNode.parentNode.rowIndex - 1).data();

        data.Statuss = '2';
        table.row(this.parentNode.parentNode.rowIndex - 1).data(data).draw();

        let xhr = new XMLHttpRequest();

        console.log('status ', data.Statuss);

        xhr.open('GET',`/WEBJALTeacherAccChangeStatus.hal?sernr=${data.SerNr}&status=${data.Statuss}`,true);
        xhr.send();

        console.log( xhr );
    });

    $('.dataTable').on('click', '.labotBtn', function() {
        let data = table.row(this.parentNode.rowIndex - 1).data();

        data.Statuss = '1';
        table.row(this.parentNode.rowIndex - 1).data(data).draw();

        let xhr = new XMLHttpRequest();

        console.log('status ', data.Statuss);

        xhr.open('GET',`/WEBJALTeacherAccChangeStatus.hal?sernr=${data.SerNr}&status=${data.Statuss}`,true);
        xhr.send();

        console.log( xhr );
    });

    $('.dataTable').on('click', '.pievienotBtn', function() {
        let data = tableApstiprinatie.row(this.parentNode.rowIndex - 2).data();
        let xhr = new XMLHttpRequest();

        xhr.open('GET',`/WEBJALCreateNewTask.hal?sernr=${data.SerNr}`,true);
        xhr.send();

        if (xhr.status !== 200) {
            console.log( xhr.status + ': ' + xhr.statusText );
        } else {
            console.log( xhr.responseText );
        }
    });

    let taskControl = new CountInConfirmBtn();

    $('.submitBtnAll').on('click', function () {
        let xhr = new XMLHttpRequest();

        console.log('taskControl.getArray() ', JSON.stringify(taskControl.getArray()));

        xhr.open('POST',`/WEBJALCreateNewTask.hal`,true);
        xhr.send(JSON.stringify(taskControl.getArray()));

        if (xhr.status !== 200) {
            console.log( xhr.status + ': ' + xhr.statusText );
        } else {
            console.log( xhr.responseText );
        }
    });

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

    function checkPievienot(event) {
        if (event.path[2].cells[8].childNodes.length < 2 &&
            event.path[2].cells[10].childNodes.length < 2) {

            if (event.path[2].cells[6].childNodes[0].className === "astiprinat-yes" &&
                event.path[2].cells[8].childNodes[0].className === "astiprinat-yes" &&
                event.path[2].cells[10].childNodes[0].className === "astiprinat-yes") {
                event.path[2].cells[12].childNodes[0].className = "activaite-btn";
                event.path[2].cells[12].childNodes[0].parentElement.style.background = '#24bc4b';
                event.path[2].cells[11].childNodes[0].parentElement.style.background = 'white';
                event.path[2].cells[11].childNodes[0].style.color = '#d0d0d0';

                $('.submitBtnAll').text(`IESNIEGT SERTIFIKĀTU SARAKSTU (${taskControl.getCount()})`);

                let data = tableApstiprinatie.row(event.path[2].cells[8].parentNode.rowIndex - 2).data();
                taskControl.setInArray(data.SerNr);
            } else {
                event.path[2].cells[12].childNodes[0].className = "labot-btn";
            }

        } else {
            event.path[2].cells[12].childNodes[0].className = "labot-btn";
        }
    }



    function CountInConfirmBtn() {
        this.count = 0;
        this.array = [];

         this.getCount= function() {
            return ++this.count;
        };

        this.getArray = function() {
            return this.array;
        };

        this.setInArray= function (item) {
            this.array.push({serNr: +item })
        }
    }

    // $('.dataTable').on('click', '.labotApsti', function() {
        //     let data = tableApstiprinatie.row(this.parentNode.rowIndex - 2);
        //
        //     console.log('data ', data);
        // });
        //
        // $('.dataTable').on('click', '.checkYes', function () {
        //     let data = tableApstiprinatie.row(this.parentNode.parentNode.rowIndex - 2).data();
        //
        //     console.log('data ', data);
        // });
        //
        // $('.dataTable').on('click', '.checkNo', function () {
        //     let data = tableApstiprinatie.row(this.parentNode.parentNode.rowIndex - 2).data();
        //
        //     console.log('data ', data);
        // });
}