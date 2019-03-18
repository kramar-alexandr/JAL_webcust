let tableTMP = '<table id="regionsTable" class="display">\n' +
    '    <thead>\n' +
    '    <tr>\n' +
    '        <th>Pedagogs - SMU konsultants</th>\n' +
    '        <th>Izglītības iestāde</th>\n' +
    '        <th>PSK</th>\n' +
    '        <th>VSK</th>\n' +
    '        <th>PROF</th>\n' +
    '        <th>E-pasts saziņai</th>\n' +
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
    '</table>\n';

$('.regions-teacher-table').append(tableTMP);

let table = $('#regionsTable').DataTable({
    data: [],
    searching: false,
    info: false,
    select: false,
    paging: false,
    ordering: false,
    columns: [{data: 'nameTeacher'}, {data: 'schoolName'}, {data: 'PSK'}, {data: 'VSK'}, {data: 'PROF'}, {data: 'email'}],
    language: {
      zeroRecords: "Nav datu"
    }}
);

$('#rīga').click(function () {
    table.clear();
    table.rows.add(getData('rīga'));
    table.draw();
    $('.regions-teacher-table').show();
});
$('#kurzeme').click(function () {
    table.clear();
    table.rows.add(getData('kurzeme'));
    table.draw();
    $('.regions-teacher-table').show();
});
$('#latgale').click(function () {
    table.clear();
    table.rows.add(getData('latgale'));
    table.draw();
    $('.regions-teacher-table').show()
});
$('#vidzeme').click(function () {
    table.clear();
    table.rows.add(getData('vidzeme'));
    table.draw();
    $('.regions-teacher-table').show()
});
$('#zemgale').click(function () {
    table.clear();
    table.rows.add(getData('zemgale'));
    table.draw();
    $('.regions-teacher-table').show()
});

function getData(region) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `WebGetTeacher.hal?reg=${region}`, false);
    xhr.send();

    xhr.onload = function () {
        if (xhr.status !== 200) {
            console.log('[GET] STATUS ' + xhr.status + ': ' + xhr.statusText);
        } else {
            console.log('[GET] STATUS ' + xhr.status);
        }
    };

    return JSON.parse(xhr.responseText);
}



