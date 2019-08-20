let pupilInfo = JSON.parse(pupil);

function downloadURI(uri) {
  var link = document.createElement("a");
  link.setAttribute("target","_blank");
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

$('.document-smu-info').html(`Reģistrācijas apliecība: Reģ. nr.: ${pupilInfo.smuCode}|   Reģ. datums: ${pupilInfo.regDate}   |   Darbības termiņš: ${pupilInfo.perfrom}&nbsp;&nbsp;-&nbsp;&nbsp;${pupilInfo.perto}`);

$(".bg-doc").click(function(){
  downloadURI("/WebDownloadSMUDoc.hal");
});

let emps = getData(`/WebGetEmployers.hal?code=${pupilInfo.smuCode}`);
let documents = getData(`/WebGetDocuments.hal?code=${pupilInfo.smuCode}`);

function getData(url) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();

    if (xhr.status != 200) {
        console.log('[GET] STATUS ' + xhr.status + ': ' + xhr.statusText );
    } else {
        return JSON.parse(xhr.responseText);
    }
}
if (documents) {
    let documentController = new DocumentsDisplay(documents);
    documentController.createDocuments();
}

function DocumentsDisplay(documents) {
    this.documents = documents;
    this.template = '<div class="document-box">\n' +
        '        <div class="doc-info">\n' +
        '        <div class="date-doc">\n' +
        '            <p class="date"></p>\n' +
        '        </div>\n' +
        '        <div class="">\n' +
        '            <p class="name-document"></p>\n' +
        '        </div>\n' +
        '        </div>\n' +
        // '        <div>\n' +
        // '            <p class="document-description"></p>\n' +standBtnTwo
        // '        </div>\n' +
        '        <div class="block-btn flex-row">\n' +
        // '            <button class="btn-info spbutton">Papildus info</button>\n' +
        '            <input type="hidden" id="code" name="code" value="">\n' +
        '            <button class="btn-submit spbutton grey">Iesniegt atskaiti</button>\n' +
        '        </div>\n' +
        '    </div>\n';
    this.reportTemplate = '';
    this.employeeTemplate = '<div class="emp">\n' +
        '    <span class="empName"></span>\n' +
        '    <div class="btn-group">\n' +
        '        <button class="dark-grey yes"></button>\n' +
        '        <button class="dark-grey no"></button>\n' +
        '    </div>\n' +
        '</div>';
    this.tableTemplate = '<h3>Finanšu tabula</h3>\n' +
        '<table id="reportTable" class="display">\n' +
        '    <thead>\n' +
        '    <tr>\n' +
        '        <th>Produkta nosaukums</th>\n' +
        '        <th>1 vienības pašizmaksa EUR</th>\n' +
        '        <th>Cena par 1 vienību EUR</th>\n' +
        '        <th>Pārdoto vienību skaits</th>\n' +
        '        <th>Ienākumi EUR</th>\n' +
        '        <th>Izdevumi EUR</th>\n' +
        '    </tr>\n' +
        '    </thead>\n' +
        '    <tbody>\n' +
        '    <tr>\n' +
        '        <td></td>\n' +
        '        <td></td>\n' +
        '        <td></td>\n' +
        '        <td></td>\n' +
        '        <td></td>\n' +
        '        <td></td>\n' +
        '    </tr>\n' +
        '    <tr>\n' +
        '        <td></td>\n' +
        '        <td></td>\n' +
        '        <td></td>\n' +
        '        <td></td>\n' +
        '        <td></td>\n' +
        '        <td></td>\n' +
        '    </tr>\n' +
        '    </tbody>\n' +
        '</table>\n' +
        '<button class="addRow spbutton grey">pievienot produktu</button>\n' +
        '<button class="btn-confirm spbutton grey">iesniegt</button>\n';
    this.createDocuments = function () {
        for (let document of this.documents) {
            let documentBox = this.getTemplate(this.template);
            this.setInfo(documentBox, document, '.documents-container');
        }

        let reportBox = this.getTemplate(this.reportTemplate);

        this.setReportBox(reportBox, '.document');
        this.setEvents();
        this.createTable();
    };

    this.createTable = function () {
        let data = null;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/WebGetFinSMU.hal', false);
        xhr.send();

        if (xhr.status != 200) {
            console.log('[GET] STATUS ' + xhr.status + ': ' + xhr.statusText );
        } else {
            data = JSON.parse(xhr.responseText);
            if (data == "Not exist Finance table" ||
                data == "You havnt company" ||
                data == "You might be registered") {

                data = [];
            }
        }

        let table = $('#reportTable').DataTable({
            searching: false,
            info: false,
            select: false,
            paging: false,
            ordering: false,
            data: data || [,,,,,]
        });

        table.MakeCellsEditable({
            "onUpdate": myCallbackFunction,
            'inputCss': 'edit-input'
        });

        function myCallbackFunction(cell, row) {
            let data = row.data();

            if (cell.index().column === 1) {
                let cellFirst = +row.data()[1];
                let cellSecond = +row.data()[3] || 1;
                data[5] = cellFirst * cellSecond;

                if (data[5]) row.data(data).draw();


            }
            if (cell.index().column === 2) {
                let cellFirst = +row.data()[2];
                let cellSecond = +row.data()[3] || 1;
                data[4] = cellFirst * cellSecond;

                if (data[4]) row.data(data).draw();
            }

            if (cell.index().column === 3) {
                let cellFirst = +row.data()[1];
                let cellSecond = +row.data()[2];
                let cellThird = +row.data()[3] || 1;
                data[5] = cellFirst * cellThird;
                data[4] = cellSecond * cellThird;

                if (data[5] || data[4]) row.data(data).draw();
            }
        }

        $('#reportTable').on( 'click', 'tbody td', function () {
            // console.log('this ', this);
            // table.cell(this).edit('bubble');
        } );

        $('.addRow').click(function() {
            table.row.add([ '', '', '', '', '', '' ]).draw();
        });

        $('.btn-confirm').click(function () {
            if (confirm('Save this document?')) {
                let rows = table.data().toArray();
                $.ajax({
                    type: "POST",
                    url: `WebFillFinSMU.hal`,
                    data: JSON.stringify(rows),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (data) alert('Document saved');
                    },
                    failure: function (err) {
                        console.log(err);
                    }
                });
            }

        });
    };

    this.getTemplate = function (temp) {
        return $(this.createTemplate(temp)).clone();
    };

    this.setReportBox = function (template, container) {
        $('.reports-header').hide();

        let empContainer = this.getTemplate('');

        $("<p></p>").text("Pievienot dalībniekus:").appendTo(empContainer);
        empContainer.addClass('emp-container');

        if (!emps.length) {
            $("<p></p>").text("Nav darbinieku").appendTo(empContainer);
        }

        for (let emp of emps) {
            let employeeBox = this.getTemplate(this.employeeTemplate);
            employeeBox.addClass('dalibnieki');
            employeeBox.find('.empName').text(emp.name);

            if (emp.status) {
                employeeBox.find('.yes').addClass('green');
            } else {
                employeeBox.find('.no').addClass('red');
            }

            employeeBox.appendTo(empContainer);
        }

        empContainer.appendTo(template);

        let financialBox = this.getTemplate(this.tableTemplate);
        financialBox.addClass('reportTable');
        financialBox.appendTo(template);

        template.addClass('reports');
        template.hide();
        template.appendTo(container);
    };

    this.setInfo = function (template, document, container) {
        template.find('.date').text(getMonthDay(document.regDate));
        template.find('.name-document').text(document.docName);
        if (document.status !== 0) {
            template.find('.btn-submit').text('ATSKAITE IESNIEGTA');
        }

        if (document.status == 2) {
            let downloadBtn = '<button class="btn-download spbutton grey bg-doc">Apliecinājumi par dalību pasākumā</button>\n'
            template.find('.block-btn').append(this.getTemplate(downloadBtn));
        }
        // template.find('.document-description').text(document.description);
        template.find('#code').val(document.serNr);
        template.appendTo(container);
    };

    this.createTemplate = function (temp) {
        let template = document.createElement('div');
        template.innerHTML = temp.trim();
        return template;
    };

    this.setEvents = function () {
        $('.btn-submit').click(function () {
            $('.documents-container').hide();
            $('.documents-header').hide();
            $('.programms').hide();
            $('.reports-header').show();
            $('.reports').show();
        });

        $('.btn-cancel').click(function () {
            $('.documents-container').show();
            $('.documents-header').show();
            $('.programms').show();
            $('.reports-header').hide();
            $('.reports').hide();
        });

    };

    function getMonthDay(date) {
        let months = ["jan.", "feb.", "mar.", "apr.", "may.", "jun.",
            "jul.", "aug.", "sep.", "oct.", "nov.", "dec."];
        let month = new Date(date).getMonth();
        let day = new Date(date).getDate();

        return `${day}.${months[month]}`;

    }
}
