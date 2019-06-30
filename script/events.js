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

$(document).ready(function(){

  $("#event_reg").on("submit",function(){
    var res = false;
    var form = $(this).clone(false).get(0);
    var form2 = $(this).get(0);
    $(form2).find('select').each(function(i) {
      $(form).find('select').eq(i).val($(this).val())
    })
    $(form.upload_form).remove();
    $.ajax({
      url:"/WebJALEventValidate.hal",
      data: $(form).serialize(),
      async: false,
      success: function(data){
        if ($(data).attr("err")!="0"){
          res = false;
          alert($(data).attr("err_msg"));
          form2[$(data).attr("errfield")].focus();
        } else {
          $.ajax({
            url: "/WebJALEventReg.hal",
            method: "POST",
            data: $(form).serialize(),
            async: false,
            success: function(data){
              if ($(data).attr("err")=="0") {
                var id = $(data).attr("id");
                var func = function(){
                  window.location.href = "/kalendars";           
                }
                var upl = $("input[name='upload_form']");
                if ($(upl).length>0) {
                  var uplf = new FileUpload($(upl).parent(),$(upl).get(0),"jal",id,func);
                } else {
                  window.location.href = "/kalendars"; 
                }
              }
            }
          });
        };
      }
    
    });
    

    
    return false;
  });
  
})

let applicationForm = new EventDisplay(events, submittedEvents);
applicationForm.createEvents();

function EventDisplay(events, submittedEvents) {
    this.events = events;
    this.submittedEvents = submittedEvents["submittedevents"];
    this.teacher = submittedEvents["teacher"];
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
        '            <button class="btn-applications spbutton grey">Ielūgumi</button>\n' +
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
        if (this.teacher!=""){
          $(document.body).find(".btn-info").remove();
          $(document.body).find(".btn-applications").hide();
        }
        if (this.submittedEvents.length) {
          if (this.teacher!=""){
            var vEv = {};
            for (let event of this.submittedEvents) {
              if (!vEv[event.event]){
                 vEv[event.event] = [];
              }
              vEv[event.event].push(event.name);
            }
            for (let event of this.events) {
              var smu_list = "";
              if (vEv[event.serNr]){
                smu_list = vEv[event.serNr].join(",");
                $(event.el).find(".btn-applications").show().append("<div class='event_badge'>" + vEv[event.serNr].length + "</div>");
              } else {
                $(event.el).find(".btn-applications").remove();
              }
              $(event.el).find('.event-description').html(smu_list);            
            }
          } else {
            $(document.body).find(".btn-applications").remove();
            
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
        $('.btn-applications').click(function(){
            $(this).parent().parent().find('.event-description').show();
        });
        
        $('.btn-submit').click(function () {
            //createQuestionnaire($(this).parent().find('#code').val(), student.smuCode);
            window.location.href = "/kalendars/pasakumi/" + $(this).parent().find('#code').val() + "/pieteikties";
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
