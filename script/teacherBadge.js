$.get("/WebgetTeacherInfo.hal",function(data){
  let teacherInfo = JSON.parse(data);

  let totcnt = parseInt(teacherInfo.totcnt);
  if (totcnt>0) {
    $(".main-tab li:first-child").append("<div class='teacher_badge'>" + totcnt + "</div>");
  }
  let totsmu = parseInt(teacherInfo.totsmu);
  if (totsmu>0) {
    $(".main-tab li:nth-child(2)").append("<div class='teacher_badge'>" + totsmu + "</div>");
  }
  let application_cnt = parseInt(teacherInfo.application_cnt);
  if (application_cnt>0) {
    $(".main-tab li:nth-child(3)").append("<div class='teacher_badge'>" + application_cnt + "</div>");
  }
  if (teacherInfo.regional_appl_show>0) {
    $(".main-tab li:nth-child(6)").show().append("<div class='teacher_badge'>" + teacherInfo.regional_appl_cnt + "</div>");
  }
  
});