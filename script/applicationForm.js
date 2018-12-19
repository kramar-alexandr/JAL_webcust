let eventInfo = {
    dataStart: new Date(2018, 11, 10),
    dataEnd: new Date(2018, 11, 12),
    nameEvent: 'Name Evant Neme',
    description: 'Neme description description  Evn Description Neme description description  Evn Description Neme description description  Evn Description '
};

let submitEvent = {
    dataStart: new Date(2018, 11, 10),
    dataEnd: new Date(2018, 11, 12),
    nameEvent: 'Name Evant Neme',
    description: 'Neme description description  Evn Description'
};

let events = [];
let submittedEvents = [];
for(let i = 0; i < 2 ;i++) {
    events.push(eventInfo);
}

for(let i = 0; i < 2 ;i++) {
    submittedEvents.push(submitEvent);
}

let applicationForm = new EventDisplay(events, submittedEvents);
applicationForm.createEvents();

function init() {
    let applicationForm = new EventDisplay(events, submittedEvents);
    applicationForm.createEvents();
}

function EventDisplay(events, submittedEvents) {
    this.events = events;
    this.submittedEvents = submittedEvents || [];
    this.template = '<div class="avents-box">\n' +
        '    <div class="event-box application-border">\n' +
        '        <div>\n' +
        '            <p class="date"></p>\n' +
        '        </div>\n' +
        '        <div>\n' +
        '            <h2 class="name-event"></h2>\n' +
        '            <p class="event-description"></p>\n' +
        '        </div>\n' +
        '        <div class="block-btn">\n' +
        // '            <button class="btn-info spbutton">Papildus info</button>\n' +
        '            <button class="btn-submit spbutton">Pieteikties</button>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>';
    this.additionalTemplate = '<div class="main-additional">\n' +
        '    <div class="addtional-box">\n' +
        '        <button class="btn-cancel">Atpakal</button>\n' +
        '        <p class="additionla-p">Lūdzam rūpīgi iepazīties ar paskaidrojošo informāciju un aizpildīt anketu uzmanīgi, pārbaudot, vai norādītie dati ir pareizi. Ja kaut kas nav saprotams, tad lūdzam konsultēties ar savu skolotāju/konsultantu!\n' +
        '            UZMANĪBU! Nekorekti aizpildīti lauki var būt par iemeslu atteikumam vai laicīgai informācijas nesaņemšanai! Dalībnieku skaits "CITS BAZĀRS" - minimums 2 dalībnieki, maksimums 5 dalībnieki vienā SMU!\n' +
        '            Pasākums tiek īstenots LIAA projekta "Inovācijas motivācijas programma" ietvaros, ko līdzfinansē Eiropas Reģionālās attīstības fonds un Eiropas Savienība.</p>\n' +
        '    </div>\n' +
        '\n' +
        '    <div class="smu-box">\n' +
        '        <p class="smu-name">Vārds, Uzvārds: oleg vinn</p>\n' +
        '        <p class="school">Skola: Ādažu vidusskola</p>\n' +
        '        <p class="product-info">E-pasts: fl250450@gmail.comcom</p>\n' +
        '        <p class="product-type">Izvēlētais skolotājs, SMU konsultants: </p>\n' +
        '        <p class="social-link">Izvēlētais skolotājs, SMU konsultants: </p>\n' +
        '        <p class="techer">Izvēlētais skolotājs, SMU konsultants: </p>\n' +
        '    </div>\n' +
        '\n' +
        '    <div class="employee-box">\n' +
        '        <div class="empname">\n' +
        '            <span>Vārds, Uzvārds: </span>\n' +
        '            <p>oleg vinn</p>\n' +
        '        </div>\n' +
        '        <div class="addEmpBtn">\n' +
        '            <button class="spbutton" type="button">Pievienot</button>\n' +
        '            <button type="button" class="spbutton addEmpCancel">Atpakaļ</button>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '\n' +
        '    <div class="materil-box">\n' +
        '        <h2>Plānotie mārketinga materiāli:</h2>\n' +
        '        <button class="spbutton" type="button">a. Bukleti</button>\n' +
        '        <button class="spbutton" type="button">b. Vizītkartes</button>\n' +
        '        <button class="spbutton" type="button">d. Baneris</button>\n' +
        '        <button class="spbutton" type="button">a. Bukleti</button>\n' +
        '    </div>\n' +
        '</div>';

    this.createEvents = function() {
        for (let event of this.events) {
            let eventBox = this.getTemplate(this.template);
            this.setInfo(eventBox, event, '.application');
        }

        this.setEvents();

        if (this.submittedEvents) {
            $('.technical-info').hide();
            for (let event of this.submittedEvents) {
                let eventBox = this.getTemplate(this.template);
                eventBox.find('.btn-submit').text('Aizpildīt');
                eventBox.find('.btn-submit').click(function () {
                    hideEventInfo();

                    applicationForm.showAdditionalBox();
                });
                this.setInfo(eventBox, event, '.technical');
            }
        }
    };

    this.getTemplate = function(temp) {
        console.log('getTemplate', $(this.createTemplate(temp)).clone());
        return $(this.createTemplate(temp)).clone();
    };

    this.setInfo = function (template, event, container) {
        template.find('.date').text(getMonthDay(event.dataStart) + ' - ' + getMonthDay(event.dataEnd));
        template.find('.name-event').text(event.nameEvent);
        template.find('.event-description').text(event.description);
        template.appendTo( container );
    };

    this.createTemplate = function(temp) {
        let template = document.createElement('div');
        template.innerHTML = temp.trim();
        return template;
    };

    this.setEvents = function () {
        $('.btn-info').click(function(){
            $(this).parent().parent().find('.event-description').toggleClass('show');
            // $('.addEmp').hide();
        });
        $('.btn-submit').click(function () {
            console.log('submit', );
            // postData(url, data);
        })
    };

    this.showAdditionalBox = function () {
        let additionalMainBox = this.getTemplate(this.additionalTemplate);
        additionalMainBox.append('.addit-main-box');
    };
    
    function hideEventInfo() {
        $('.application').hide();
        $('.technical').hide();
    }

    function postData(url, data) {
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function() {
                alert("Pieņemtas izmaiņas!");
            }
        });
    }

    function getMonthDay(date) {
        let months = [ "jan.", "feb.", "mar.", "apr.", "may.", "jun.",
            "jul.", "aug.", "sep.", "oct.", "nov.", "dec." ];
        let month = new Date(date).getMonth();
        let day = new Date(date).getDate();
        let formatDate = `${day}.${months[month]}`;

        return formatDate;
    }
}
