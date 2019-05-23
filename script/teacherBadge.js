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
});