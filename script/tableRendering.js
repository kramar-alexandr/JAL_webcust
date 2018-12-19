if (text) {
    $('.main-table-container').show();
    let techerInfo = JSON.parse(text);

    // initializate Skolēnu pieteikumi table table
    let table = $('#table_id').DataTable({
        data: techerInfo.SMU,
        dom: '<"top"B>t<"bottom"p><"clear">',
        buttons: [
            {
                text: 'KLASSE',
                attr: {
                    id: 'klasseSrt'
                },
                action: function () {
                    $('#table_id #klasse').click();
                    $('#datumsSrt').removeClass('sorting-asc sorting-desc');

                    if ($('#klasseSrt').hasClass('sorting-asc')) {
                        $('#klasseSrt').toggleClass('sorting-asc sorting-desc');
                    } else if ($('#klasseSrt').hasClass('sorting-desc')) {
                        $('#klasseSrt').toggleClass('sorting-asc sorting-desc');
                    } else {
                        $('#klasseSrt').toggleClass('sorting-asc');
                    }
                }
            },
            {
                text: 'DATUMS',
                attr: {
                    id: 'datumsSrt'
                },
                action: function () {
                    $('#table_id #datums').click();
                    $('#klasseSrt').removeClass('sorting-asc sorting-desc');

                    if ($('#datumsSrt').hasClass('sorting-asc')) {
                        $('#datumsSrt').toggleClass('sorting-asc sorting-desc');
                    } else if ($('#datumsSrt').hasClass('sorting-desc')) {
                        $('#datumsSrt').toggleClass('sorting-asc sorting-desc');
                    } else {
                        $('#datumsSrt').toggleClass('sorting-asc');
                    }
                }
            },
            {extend: 'excel', text: 'Exel'},
            {
                extend: 'pdf', text: '.PDF', exportOptions: {
                    modifier: {
                        page: 'current'
                    }
                }
            }
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
            {data: 'Nr'},
            {data: 'Skolens', width: '60%',},
            {
                data: 'Klase',
                ordering: true
            },
            {
                data: 'Datums',
                ordering: true
            },
            {
                data: 'Statuss',
                render: (data) => {
                    if (data === '0') {
                        return "<p class='status-btn apstiprinatBtn'>APSTIPRINĀT</p>" +
                            "<p class='status-btn noraditBtn'>NORAIDĪT</p>";

                    } else if (data === '1') {
                        return "<p class='status-btn astiprinat-yes'></p>" +
                            "<p class='status-btn'>NORAIDĪT</p>";

                    } else if (data === '2') {
                        return "<p class='status-btn apstiprinatBtn'>APSTIPRINĀT</p>" +
                            "<p class='status-btn noradit-no'></p>";
                    }
                },
                className: "column-btn column-btn-st"
            }
            ,
            {
                data: 'Labot',
                visible: false,
                render: () => {
                    return "<a id='labotBtn' class='labot-btn'>Labot</a>";
                },
                className: "column-btn labotBtn"
            }

        ]
    });

    let apstiprinatie = [];

    for (let i of techerInfo.SMU) {
        if (i.Statuss === '1') {
            apstiprinatie.push(i);
        }
    }

    let pamatskola = [];

    for (let i of techerInfo.SMU) {

        let klase = i.Klase.replace(/\D+/g, '');
        if (klase <= 9) {
            pamatskola.push(i);
        }
    }

    // initializate apstiprinatie table
    let tableApstiprinatie = $('#apstiprinatie').DataTable({
        data: apstiprinatie,
        searching: false,
        info: false,
        select: false,
        dom: '<"top"B>t<"bottom"p><"clear">',
        buttons: [
            {
                text: 'KLASSE',
                attr: {
                    id: 'klasseSrt'
                },
                action: function () {
                    $('#apstiprinatie #klasse').click();

                    if ($('#apstiprinatie_wrapper #klasseSrt').hasClass('sorting-asc')) {
                        $('#apstiprinatie_wrapper #klasseSrt').toggleClass('sorting-asc sorting-desc');
                    } else if ($('#apstiprinatie_wrapper #klasseSrt').hasClass('sorting-desc')) {
                        $('#apstiprinatie_wrapper #klasseSrt').toggleClass('sorting-asc sorting-desc');
                    } else {
                        $('#apstiprinatie_wrapper #klasseSrt').toggleClass('sorting-asc');
                    }
                }
            },
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
            {data: 'Nr'},
            {data: 'Skolens'},
            {data: 'Klase'},
            {data: 'Datums'},
            {
                data: 'Mācību gads',
                render: () => {
                    return "2018/2019";
                }
            },
            {data: 'Nosaukums'},
            {
                data: 'Likvidēts',
                render: (data, type, full) => {
                    if (data !== "3") {
                        return '<p class="noradit-no"></p>';
                    } else {
                        return '<p class="astiprinat-yes"></p>';
                    }
                }
            },
            {
                data: 'Mācību gads',
                render: () => {
                    return "2018/2019";
                }
            },
            {
                data: 'Piedalījās',
                render: (data) => {
                    if (!data) {
                        return '<p class="noradit-no"></p>';
                    }
                }
            },
            {
                data: 'Mācību gads',
                render: () => {
                    return "2018/2019";
                }
            },
            {
                data: 'Piedalījās',
                render: (data) => {
                    if (!data) {
                        return "<p class=\"noradit-no\"></p>";
                    }
                }
            },
            {
                data: 'Statuss',
                render: () => {
                    return "<a class='labot-btn' onclick='labotApsti(event)'>Labot</a>";

                },
                className: "column-btn labotApsti"
            },
            {
                data: 'Pievienot sertifikātu sarakstam',
                render: () => {
                    return "<a class='labot-btn'>PIEVIENOT</a>";

                },
                className: "column-btn pievienotBtn"
            }

        ]
    });

    // initializate pamatskola table
    $('#pamatskola').DataTable({
        data: pamatskola,
        searching: false,
        info: false,
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
            {data: 'Nr'},
            {data: 'Skolens'},
            {data: 'Klase'},
            // { data: 'Datums' },
            {
                data: 'Mācību gads',
                render: () => {
                    return "2018/2019";
                }
            },
            {data: 'Nosaukums'},
            {
                data: 'Likvidēts',
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
    });

    // $( ".dt-buttons" ).prepend( "<p>Eksportēt sarakstu: </p>" );

    vidusskolaBtn.style.background = '#24bc4b';
    vidusskolaBtn.style.color = 'white';


    // set event to chanche tab in 'Apstiprinātie' table
    pamatskolaBtn.addEventListener('click', function () {
        chancheTab(pamatskola_wrapper, pamatskolaBtn, vidusskolaBtn, apstiprinatie_wrapper);
    });

    vidusskolaBtn.addEventListener('click', function () {
        chancheTab(apstiprinatie_wrapper, vidusskolaBtn, pamatskolaBtn, pamatskola_wrapper);
    });

    // main logic for chanche table in Apstiprinātie'
    function chancheTab(showWrapper, activeBtn, disActiveBtn, hideWrapper) {
        showWrapper.style.display = 'block';
        activeBtn.style.background = '#24bc4b';
        activeBtn.style.color = 'white';
        disActiveBtn.style.color = '#d0d0d0';
        disActiveBtn.style.background = 'inherit';
        hideWrapper.style.display = 'none';
    }

    // set events on button in table
    $('.dataTable').on('click', '.apstiprinatBtn', function () {
        if (confirm('Apstiprinot skolēnu šī darbība nav labojama')) {
            let data = table.row(this.parentNode.parentNode.rowIndex - 1).data();

            data.Statuss = '1';
            table.row(this.parentNode.parentNode.rowIndex - 1).data(data).draw();

            getData(`/WEBJALTeacherAccChangeStatus.hal?sernr=${data.SerNr}&status=${data.Statuss}`);
        }
    });

    $('.dataTable').on('click', '.noraditBtn', function () {
        let data = table.row(this.parentNode.parentNode.rowIndex - 1).data();

        data.Statuss = '2';
        table.row(this.parentNode.parentNode.rowIndex - 1).data(data).draw();

        getData(`/WEBJALTeacherAccChangeStatus.hal?sernr=${data.SerNr}&status=${data.Statuss}`);
    });

    $('.dataTable').on('click', '.labotBtn', function () {
        let data = table.row(this.parentNode.rowIndex - 1).data();

        data.Statuss = '1';
        table.row(this.parentNode.rowIndex - 1).data(data).draw();

        getData(`/WEBJALTeacherAccChangeStatus.hal?sernr=${data.SerNr}&status=${data.Statuss}`);
    });

    $('.dataTable').on('click', '.pievienotBtn', function () {
        let data = tableApstiprinatie.row(this.parentNode.rowIndex - 2).data();

        getData(`/WEBJALCreateNewTaskOne.hal?sernr=${data.SerNr}`);
    });

    let taskControl = new CountInConfirmBtn();

    $('.submitBtnAll').on('click', function () {
        let data = {};
        data.root = taskControl.getArray();

        getData(`/WEBJALCreateNewTaskMass.hal`, data);
    });


    // function http get
    function getData(url, data) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status !== 200) {
                console.log('[GET] STATUS ' + xhr.status + ': ' + xhr.statusText);
            } else {
                console.log('RESPONSE: ' + xhr.responseText);
            }
        };

        xhr.open('GET', url, true);
        if (data) {
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }

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

        this.getCount = function () {
            return ++this.count;
        };

        this.getArray = function () {
            return this.array;
        };

        this.setInArray = function (item) {
            this.array.push({serNr: item})
        }
    }
}
