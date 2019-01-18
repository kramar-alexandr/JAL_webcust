let events = [];
let submittedEvents = [];
let student = JSON.parse(pupil);


// function getData(url) {
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', url, false);
//     xhr.send();
//
//     if (xhr.status != 200) {
//         console.log( xhr.status + ': ' + xhr.statusText );
//     } else {
//         return JSON.parse(xhr.responseText);
//     }
// }



$.ajax({
    url: '/WebGetEvents.hal',
    async: false,
    success: function(res) {
        events = JSON.parse(res);
    }
});
$.ajax({
    url: '/WebGetEventsPieteikum.hal',
    async: false,
    success: function(res) {
        submittedEvents =  JSON.parse(res);
    }
});
//
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
        '            <input type="hidden" id="code" name="code" value="">\n' +
        '            <button class="btn-submit spbutton grey">Pieteikties</button>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>';
    this.createEvents = function() {
        for (let event of this.events) {
            let eventBox = this.getTemplate(this.template);
            this.setInfo(eventBox, event, '.application');
        }

        this.setEvents(this.smuCode);

        if (this.submittedEvents.length) {
            $('.technical-info').hide();
            for (let event of this.submittedEvents) {
                let eventBox = this.getTemplate(this.template);

                if (+event.filled) {
                    eventBox.find('.btn-submit').text('Piepildīta');
                    eventBox.find('.btn-submit').disabled = true;
                } else {
                    eventBox.find('.btn-submit').text('Aizpildīt');
                    eventBox.find('.btn-submit').click(function () {
                        window.location.href = `/application-form?code=${event.serNr}`;
                    });
                }

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
        template.find('#code').val(event.serNr);
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
        });
        $('.btn-submit').click(function () {
            createQuestionnaire($(this).parent().find('#code').val(), student.smuCode);
        });
    };

    function createQuestionnaire(eventCode, smuCode) {
        $.ajax({
            type: "GET",
            data: {
                event: eventCode,
                code: smuCode
            },
            url: '/WebCreateEventPieteikum.hal',
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

        return `${day}.${months[month]}`;

    }
}
