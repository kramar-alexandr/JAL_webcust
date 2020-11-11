
var smu_archive_template = "<div class='smu_item'><div class='smu_title'><div class='smu_code'><div class='smu_label'>Reģ. Nr.</div><div class='smu_field'></div></div><div class='smu_name'><div class='smu_label'>Nosaukums</div><div class='smu_field'></div></div>";
smu_archive_template += "<div class='smu_startdate'><div class='smu_label'>Sākuma datums</div><div class='smu_field'></div></div>";
smu_archive_template += "<div class='smu_enddate'><div class='smu_label'>Beigu datums</div><div class='smu_field'></div></div>";
smu_archive_template += "<div class='spbutton'>Vairāk informācijas</div></div>";

smu_archive_template += "<div class='smu_details'>";
smu_archive_template += "<div class='smu_descr'><div class='smu_label'>Apraksts</div><div class='smu_field'></div></div>";
smu_archive_template += "<div class='smu_items'><div class='smu_label'>Nozare</div><div class='smu_field'></div></div>";
smu_archive_template += "<div class='smu_education'><div class='smu_label'>Izglītības pakāpe</div><div class='smu_field'></div></div>";
smu_archive_template += "<div class='smu_targetaud'><div class='smu_label'>Mērķauditorija</div><div class='smu_field'></div></div></div>";

$(document).ready(function(){
  $.get("/WebgetStudentSMUArchive.hal",function(data){
    var js = JSON.parse(data); 
    if (js.SMU){
      for (i=0;i<js.SMU.length;i++){
        var smu = $(smu_archive_template);
        var emplist = "";
        for (var j of js.SMU[i].emplist){
          emplist = emplist + j.Name + "<br>";
        }
        $(smu).find(".smu_code .smu_field").html(js.SMU[i].SMU);
        $(smu).find(".smu_name .smu_field").html(js.SMU[i].Nosaukums);
        $(smu).find(".smu_descr .smu_field").html(js.SMU[i].prodText);
        $(smu).find(".smu_items .smu_field").html(js.SMU[i].ProdSpec);
        $(smu).find(".smu_startdate .smu_field").html(js.SMU[i].startdate);
        $(smu).find(".smu_enddate .smu_field").html(js.SMU[i].enddate);
        $(smu).find(".smu_education .smu_field").html(js.SMU[i].education);
        $(smu).find(".smu_targetaud .smu_field").html(js.SMU[i].targetAudit);
        $(smu).find(".smu_emplist .smu_field").html(emplist);
        $(smu).find(".smu_title").click(function(){
          $(this).parent().find(".smu_details").slideToggle(500);
        })
        $("#smu_archive_list").append(smu);

      }

    }
  })
});