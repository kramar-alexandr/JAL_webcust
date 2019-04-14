$.get("/WebgetTeacherInfo.hal",function(data){
  let teacherInfo = JSON.parse(data);

  let totcnt = parseInt(teacherInfo.totcnt);
  if (totcnt>0) {
    $(".main-tab li:first-child").append("<div class='teacher_badge'>" + totcnt + "</div>");
  }
});