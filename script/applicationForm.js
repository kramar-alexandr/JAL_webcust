let eventInfo = {
    sernr: 234,
    dataStart: new Date(2018, 11, 10),
    dataEnd: new Date(2018, 11, 12),
    nameEvent: 'Name Evant Neme',
    description: ''
};

let submitEvent = {
    sernr: 234,
    dataStart: new Date(2018, 11, 10),
    dataEnd: new Date(2018, 11, 12),
    nameEvent: 'Name Evant Neme',
    description: ''
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

function EventDisplay(events, submittedEvents) {
    this.events = events;
    this.submittedEvents = submittedEvents;
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
        '            <button class="btn-submit spbutton grey">Pieteikties</button>\n' +
        '        </div>\n' +
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
                    window.location.href = '/application-form-first';
                });
                this.setInfo(eventBox, event, '.technical');
            }
        } else {
            $('.technical-info').show();
        }
    };

    this.getTemplate = function(temp) {
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
