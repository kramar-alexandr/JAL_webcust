let events = [];
let submittedEvents = [];
let student = {};
if ("pupil" in window){
  student = JSON.parse(pupil);
}
if (calf===undefined) {
  var calf = 0;
}

$.ajax({
    url: '/WebGetEvents.hal?calf=' + calf,
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
        '        </div>\n' +
        '        <div class="block-btn">\n' +
        // '            <button class="btn-info spbutton">Papildus info</button>\n' +
        '            <input type="hidden" id="code" name="code" value="">\n' +
        '            <button class="btn-submit spbutton grey">Pieteikties</button>\n' +
        '            <button class="btn-info spbutton grey">Info</button>\n' +
        '        </div>\n' +
        '        <div class="event-description"></div>\n' +
        '    </div>\n' +
        '</div>';
    this.createEvents = function() {
        $(".application").append("<div id='pagenave'></div>");
        $(".application").append("<div id='orig_items' style='display:none'></div>");
        if (this.events.length) {
            for (let event of this.events) {
                $('.events-info').hide();
                let eventBox = this.getTemplate(this.template);
                event.el = eventBox;
                this.setInfo(eventBox, event, '#orig_items');
            }

          $('.application.smu-border').pagination({
              dataSource: function(done){
                  var result = [];
                  for (let li of $('.smu-border .avents-box')) {
                      result.push(li);
                  }
                  done(result);
              },
              prevText: '',
              nextText: '',
          showPageNumbers: false,
          pageSize: 5,
              callback: function (data, pagination) {
                  // template method of yourself
                  // var html = template(data);
                  $('#pagenave').html(data);
              }
          });

        }

        this.setEvents(this.smuCode);

        if (this.submittedEvents.length) {
            for (let event of this.submittedEvents) {
                let foundf = false;
                for (let ev of this.events) {
                    if (ev.serNr === event.event) {
                      foundf = true;
                      event.nameEvent = ev.nameEvent;
                      $(ev.el).find(".btn-submit").unbind("click").text("Esmu pieteicies")
                    }
                }
                if (!foundf){
                  continue;
                }
                let eventBox = this.getTemplate(this.template);
                $(eventBox).find(".btn-info").remove();

                if (+event.filled) {
                  continue;
                } else {
                  $('.technical-info').hide();
                  switch (event.satus){
                    case "4":
                      eventBox.find('.btn-submit').text('Aizpildīt');
                      eventBox.find('.btn-submit').click(function () {
                          window.location.href = `/application-form?code=${event.serNr}`;
                      });
                      break;
                    case "0":
                      eventBox.find('.btn-submit').text('Gaida skolotāja apstiprinājumu');
                      break;
                    case "1":
                      eventBox.find('.btn-submit').text('Gaida apstiprinājumu');
                      break;
                   
                  }
                  this.setInfo(eventBox, event, '.technical');
                }
            }
        } else {
            $('.technical-info').show();
        }
    };

    this.getTemplate = function(temp) {
        return $(temp).clone();
    };

    this.setInfo = function (template, event, container) {
        template.find('.date').text(getMonthDay(event.dataStart) + ' - ' + getMonthDay(event.dataEnd));
        template.find('.name-event').text(event.nameEvent);
        template.find('.event-description').html(event.description);
        template.find('#code').val(event.serNr);
        template.appendTo( container );
        if (event.allowApply=="0" || !student.smuCode){
          template.find('.btn-submit').hide();
        }
        if (event.description==""){
          template.find('.btn-info').hide();
        }
    };

    this.createTemplate = function(temp) {
        let template = document.createElement('div');
        template.innerHTML = temp.trim();
        return template;
    };

    this.setEvents = function () {
        $('.btn-info').click(function(){
            $(this).parent().parent().find('.event-description').show();
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
              //if (calf) {
                //window.location.href = `/application-form?code=${eventCode}`;
              //} else {
                alert("Pieņemtas izmaiņas!");              
              //}
            }
        });
    }

    function getMonthDay(date) {
        let months = [ "jan.", "feb.", "mar.", "apr.", "may.", "jun.",
            "jul.", "aug.", "sep.", "oct.", "nov.", "dec." ];
        let month = parseInt(date.substr(0,2),10)-1;
        let day = date.substr(3,2);

        return `${day}.${months[month]}`;

    }
}
