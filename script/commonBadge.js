$.get("/WebGetEventBadge.hal",function(data){
  let eventinfo = JSON.parse(data);

  let event_cnt = parseInt(eventinfo.event_cnt);
  if (application_cnt>0) {
    $(".main-tab li:nth-child(3)").append("<div class='teacher_badge'>" + event_cnt + "</div>");
  }
});