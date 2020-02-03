if (pupil) {
    let pupilInfo = JSON.parse(pupil);
    let pupilTableData = {};

    pupilTableData.Nr = 1;
    pupilTableData.Skolens = pupilInfo.fullName;
    pupilTableData.Klase = pupilInfo.class;
    pupilTableData.Nosaukums = pupilInfo.school;
    pupilTableData.Likvidets = pupilInfo.ApprovalStatus;
    pupilTableData.MacibuGads = pupilInfo.Semester;

    $('#programms').DataTable({
        data: [pupilTableData],
        searching: false,
        info: false,
        select: false,
        dom: '<"top"B>t<"bottom"><"clear">',
        buttons: [
            {
                text: 'KLASSE',
                attr: {
                    id: 'klasseSrt'
                },
                action: function () {
                    // $('#programms #klasse').click();
                    //
                    // if ($('#apstiprinatie_wrapper #klasseSrt').hasClass('sorting-asc')) {
                    //     $('#apstiprinatie_wrapper #klasseSrt').toggleClass('sorting-asc sorting-desc');
                    // } else if ($('#apstiprinatie_wrapper #klasseSrt').hasClass('sorting-desc')) {
                    //     $('#apstiprinatie_wrapper #klasseSrt').toggleClass('sorting-asc sorting-desc');
                    // } else {
                    //     $('#apstiprinatie_wrapper #klasseSrt').toggleClass('sorting-asc');
                    // }
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
        columns: [
            {data: 'Nr'},
            {data: 'Skolens'},
            {data: 'Klase'},
            {data: 'MacibuGads'},
            {data: 'Nosaukums'},
            {
                data: 'Likvidets',
                render: (data) => {
                    if (data !== "5") {
                        return '<p class="noradit-no"></p>';
                    } else {
                        return '<p class="astiprinat-yes"></p>';
                    }
                }
            },
            {data: 'MacibuGads'},
            {
                data: 'Piedalījās',
                render: (data) => {
                    if (!data) {
                        return '<p class="noradit-no"></p>';
                    }
                }
            },
            {data: 'MacibuGads'},
            {
                data: 'Piedalījās',
                render: (data) => {
                    if (!data) {
                        return "<p class=\"noradit-no\"></p>";
                    }
                }
            }

        ]
    });

    // // set events on button in table
    // $('.dataTable').on('click', '.apstiprinatBtn', function () {
    //     if (confirm('Apstiprinot skolēnu šī darbība nav labojama')) {
    //         let data = table.row(this.parentNode.parentNode.rowIndex - 1).data();
    //
    //         data.Statuss = '1';
    //         table.row(this.parentNode.parentNode.rowIndex - 1).data(data).draw();
    //
    //         get(`/WEBJALTeacherAccChangeStatus.hal?sernr=${data.SerNr}&status=${data.Statuss}`);
    //     }
    // });
    //
    // $('.dataTable').on('click', '.noraditBtn', function () {
    //     let data = table.row(this.parentNode.parentNode.rowIndex - 1).data();
    //
    //     data.Statuss = '2';
    //     table.row(this.parentNode.parentNode.rowIndex - 1).data(data).draw();
    //
    //     get(`/WEBJALTeacherAccChangeStatus.hal?sernr=${data.SerNr}&status=${data.Statuss}`);
    // });
    //
    // $('.dataTable').on('click', '.labotBtn', function () {
    //     let data = table.row(this.parentNode.rowIndex - 1).data();
    //
    //     data.Statuss = '1';
    //     table.row(this.parentNode.rowIndex - 1).data(data).draw();
    //
    //     get(`/WEBJALTeacherAccChangeStatus.hal?sernr=${data.SerNr}&status=${data.Statuss}`);
    // });
    //
    // $('.dataTable').on('click', '.pievienotBtn', function () {
    //     let data = tableProgramms.row(this.parentNode.rowIndex - 2).data();
    //
    //     get(`/WEBJALCreateNewTaskOne.hal?sernr=${data.SerNr}`);
    // });
    //
    //
    // // function http get
    // function get(url, data) {
    //     let xhr = new XMLHttpRequest();
    //     xhr.onload = function () {
    //         if (xhr.status !== 200) {
    //             console.log('[GET] STATUS ' + xhr.status + ': ' + xhr.statusText);
    //         } else {
    //             console.log('RESPONSE: ' + xhr.responseText);
    //         }
    //     };
    //
    //     xhr.open('GET', url, true);
    //     if (data) {
    //         xhr.send(JSON.stringify(data));
    //     } else {
    //         xhr.send();
    //     }
    //
    // }
    //
    // function labotApsti(event) {
    //     event.target.parentElement.style.background = '#24bc4b';
    //     event.target.style.color = 'white';
    //     event.path[2].cells[8].innerHTML = "<p onclick='checkYes(event)' class='astiprinat-yes'></p><p onclick='checkNo(event)' class='noradit-no'></p>";
    //     event.path[2].cells[10].innerHTML = "<p onclick='checkYes(event)' class='astiprinat-yes'></p><p onclick='checkNo(event)' class='noradit-no'></p>";
    //
    // }
    //
    // function checkYes(event) {
    //     event.path[1].innerHTML = "<p class='astiprinat-yes'></p>";
    //     checkPievienot(event);
    // }
    //
    // function checkNo(event) {
    //     event.path[1].innerHTML = "<p class='noradit-no'></p>";
    //     checkPievienot(event);
    // }
    //
    // function checkPievienot(event) {
    //     if (event.path[2].cells[8].childNodes.length < 2 &&
    //         event.path[2].cells[10].childNodes.length < 2) {
    //
    //         if (event.path[2].cells[6].childNodes[0].className === "astiprinat-yes" &&
    //             event.path[2].cells[8].childNodes[0].className === "astiprinat-yes" &&
    //             event.path[2].cells[10].childNodes[0].className === "astiprinat-yes") {
    //             event.path[2].cells[12].childNodes[0].className = "activaite-btn";
    //             event.path[2].cells[12].childNodes[0].parentElement.style.background = '#24bc4b';
    //             event.path[2].cells[11].childNodes[0].parentElement.style.background = 'white';
    //             event.path[2].cells[11].childNodes[0].style.color = '#d0d0d0';
    //
    //             $('.submitBtnAll').text(`IESNIEGT SERTIFIKĀTU SARAKSTU (${taskControl.getCount()})`);
    //
    //             let data = tableProgramms.row(event.path[2].cells[8].parentNode.rowIndex - 2).data();
    //             taskControl.setInArray(data.SerNr);
    //         } else {
    //             event.path[2].cells[12].childNodes[0].className = "labot-btn";
    //         }
    //
    //     } else {
    //         event.path[2].cells[12].childNodes[0].className = "labot-btn";
    //     }
    // }
}
