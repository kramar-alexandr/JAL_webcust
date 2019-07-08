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

function GetDateStr(td)
{
  res = td;
  
  if (td!=""){
    res = td.substr(-2) + "." + td.substr(6,2);
  }

  return res;
}

$(document).ready(function(){

  $("#event_reg").on("submit",function(){
    var res = false;
    var form = $(this).clone(false).get(0);
    var form2 = $(this).get(0);
    $(form2).find('select').each(function(i) {
      $(form).find('select').eq(i).val($(this).val())
    })
    $(form).find("input[type='file']").remove();
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
                var upl = $(form2).find("input[type='file']");
                if ($(upl).length>0) {
                  let files = [];
                  $(upl).each(function(){
                    let f = $(this).get(0);
                    if (f.files.length>0) {
                      files.push(f.files[0]);
                    }
                  });
                  var uplf = new FileUpload(files,"jal",id,func);
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
        '    <div class="event-box">\n' +
        '        <div class="ev_col date"></div>\n' +
        '        <div class="ev_col reg_date"></div>\n' +
        '        <div class="ev_col descr"></div>\n' +
        '        <div class="block-btn">\n' +
        // '            <button class="btn-info spbutton">Papildus info</button>\n' +
        '            <input type="hidden" id="code" name="code" value="">\n' +
        '            <button class="btn-info spbutton grey">Papildu info</button>\n' +
        '            <button class="btn-submit spbutton grey">Pieteikties</button>\n' +
        '            <button class="btn-applications spbutton grey">Ielūgumi</button>\n' +
        '            <div class="block-teach">\n' +
        '            <div class="block-teach-text">Ieradīšos pasākumā:</div>\n' +
        '               <div class="block-teach-btn "><button class="teach-ev-yes spbutton">Jā</button>\n' +
        '               <button class="teach-ev-no spbutton">Nē</button></div>\n' +
        '           </div>\n' +
        '        </div>\n' +
        '        <div class="event-participants">Apstiprinātie SMU dalībai pasākumā:<br></div>\n' +
        '        <div class="event-description"></div>\n' +
        '    </div>\n' +
        '</div>';
    this.createEvents = function() {
        $(".application").append("<div class='events_wrap'><div id='events_header'><div class='ev_col date'>Datums</div><div class='ev_col reg_date'>Pieteikuma termiņš</div><div class='ev_col descr'>Pasākuma nosaukums</div><div class=''></div></div><div id='pagenave'></div><div id='orig_items' style='display:none'></div></div>");
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
          $(document.body).find(".btn-applications").hide();
        }
        if (this.submittedEvents.length) {
          var self = this;
          if (this.teacher!=""){
            var vEv = {};
            var vApp = {};
            for (let event of this.submittedEvents) {
              if (!vEv[event.event]){
                 vEv[event.event] = [];
              }
              if (!vApp[event.event]){
                 vApp[event.event] = false;
              }
              vEv[event.event].push(event.name);
              if (event.teacherPart=="1"){
                 vApp[event.event] = true;
              }
            }
            for (let event of this.events) {
              var smu_list = "";
              if (vEv[event.serNr]){
                smu_list = vEv[event.serNr].join("<br>");
                $(event.el).find(".btn-applications").show().append("<div class='event_badge'>" + vEv[event.serNr].length + "</div>");
                if (vApp[event.serNr]){
                  $(event.el).find(".teach-ev-no").addClass("grey");
                } else {
                  $(event.el).find(".teach-ev-yes").addClass("grey");
                }
                $(event.el).find(".teach-ev-yes").click(function(){
                  self.SetTeacherComing(event.el,event.serNr,1);
                });
                $(event.el).find(".teach-ev-no").click(function(){
                  self.SetTeacherComing(event.el,event.serNr,0);
                });
              } else {
                $(event.el).find(".btn-applications").remove();
                $(event.el).find(".block-teach").remove();
              }
              $(event.el).find('.event-participants').append(smu_list);            
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
           if (this.teacher==""){
             $(document.body).find(".btn-applications").remove();
           }
            $('.technical-info').show();
        }
    };
    this.SetTeacherComing = function(el,sernr,stat){
        $.ajax({
            type: "GET",
            data: {
                event: sernr,
                stat: stat
            },
            url: '/WebSetTeacherEventStat.hal',
            success: function() {
              if (stat==1){
                $(el).find(".teach-ev-no").addClass("grey");
                $(el).find(".teach-ev-yes").removeClass("grey");
              } else {
                $(el).find(".teach-ev-yes").addClass("grey");
                $(el).find(".teach-ev-no").removeClass("grey");
              }
            }
        });
    }

    this.getTemplate = function(temp) {
        return $(temp).clone();
    };

    this.setInfo = function (template, event, container) {
        template.find('.date').text(GetDateStr(event.dataStart));
        if (event.regStart!=""){
          template.find('.reg_date').text(getMonthDay(event.regStart));
        };
        if (event.regEnd!=""){
          template.find('.reg_date').append(" - " + getMonthDay(event.regEnd));
        }
        template.find('.descr').text(event.nameEvent);
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
            $(this).parent().parent().find('.event-description').toggle();
        });
        $('.btn-applications').click(function(){
            $(this).parent().parent().find('.event-participants').toggle();
            $(this).parent().parent().find('.block-teach').toggle();

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
        let months = [ "jan.", "feb.", "mar.", "apr.", "mai.", "jūn.",
            "jūl.", "aug.", "sep.", "okt.", "nov.", "dec." ];
        let month = parseInt(date.substr(0,2),10)-1;
        let day = date.substr(3,2);

        return `${day}. ${months[month]}`;

    }
}
