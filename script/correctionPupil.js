init(JSON.parse(pupil));

function init(pupil) {
    let correctionSMU = new CorrectionSMU(pupil.smu,pupil);
    correctionSMU.setEvent();
    correctionSMU.showSmuInfo(pupil.director);
    correctionSMU.setEmployees();
}

function CorrectionSMU (smu,pupil) {
    this.smu = smu;
    this.pupil = pupil;

    this.setEvent = function () {
/*
        $('.addEmp').click(function(){//nice naming of classes :)
            $('.addemp').css('display', 'flex');
            $('.addEmp').hide();
        });

        $('.addEmpCancel').click(function(){
            $('.addemp').hide();
            $('.addEmp').show();
        });
*/
        if (this.pupil.ApprovalStatus==3) {
          $(".addemp").show();
        } 
        $('#confirmMainInfo').click(function(){
            postData("/WebChangeCompEmp.hal", $('#forma').serialize());
        });

        $('#confirmSmuInfo').click(function(){
            postData("/WebChangeProfile.hal", $('#formaTwo').serialize());
        });
        $('#sendconfirmSmu').click(function(){
            postData("/WebSendForTeacherApproval.hal", "");
        });


        $('#confirmParentInfo').click(function(){
            postData("/WebChangeCompParent.hal", $('#formaTree').serialize());
        });

    };
    
    this.showSmuInfo = function (director) {
        if (this.smu != 'false') {
            $('#removeemp').show();
            $('.correction-smu-info').show();
        } else {
            $('#removeemp').hide();
            $('.correction-smu-info').hide();
        }

        if (!director) {
            $('#removeemp').hide();
            $('.correction-smu-info').hide();
        } else {
          if (this.hasSMU=="0") {
            $('#removeemp').hide();          
          }
        }

    };

    function postData(url, data) {
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function() {
                alert("Pieņemtas izmaiņas!");
                if (pupil.hasSMU=="0"){
                  location.reload();
                }
            }
        });
    }
    
  this.SetPositionDropDown = function(emp,el,val){
    var self = this;
    let sel = $(".nemp_pos").clone();
    $(sel).attr("class","");
    $(sel).val(val);
    if (emp.type=="1"){
      $(sel).attr("disabled","true");
    }
    $(el).html("").append(sel);
    $(sel).bind("change",function(){
      self.StoreEmpPos(emp,el,sel);
    });
  }
  
  this.StoreEmpPos = function(emp,el,sel){
    var self = this;
    $.get("/WebSetEmpPosition.hal?emp=" + emp.Code + "&njob=" + $(sel).val(),function(){
    });
  }
  
  this.setPossibleEmployees = function(){
     for (var i=0;i<this.pupil.newemplist.length;i++){
       let e = this.pupil.newemplist[i];
       $(".newEmp_form .nemp_code").append("<option value='" + e.Code + "'>" + e.Name + "</option>");
     }
   }   
   
   this.setEmployees = function(){
     var self = this;
     var empline = $("#emplist-table tbody tr").clone();
     this.emplist = $("<select></select>");
     this.vemplist = {};
     $("#emplist-table tbody tr").remove();
     for (var i=0;i<this.pupil.emplist.length;i++){
       let emp = this.pupil.emplist[i];
       this.vemplist[emp.Code] = emp;
       let tline = $(empline).clone();
       if (emp.type=="0"){
         $(this.emplist).append("<option value='" + emp.Code + "'>" + emp.Name + "</option>");
       }
       $(tline).find("td:nth-child(1)").html(emp.Name);
       $(tline).find("td:nth-child(2)").html(emp.eMail);
       self.SetPositionDropDown(emp,$(tline).find("td:nth-child(3)"),emp.JobDesc);
       if (emp.type=="0") {
         $(tline).find("td:nth-child(4)").addClass("emp_rem").click(function(){
           if (confirm(jal_str["ConfirmDelete"])) {
            $.get("/WebDeleteEmp.hal?emp=" + emp.Code + "&smu=" + self.pupil.smuCode,
              function(data){
                if ($(data).attr("err")!="0") {
                  alert($(data).attr("errmsg"));
                } else {
                 $(tline).remove();
                }
              });
            }
         });
        } else {
          $(tline).find("td:nth-child(4)").html(jal_str["Invited"]);
        }
       $("#emplist-table tbody").append(tline);
     }
     this.setPossibleEmployees();
     $(".newEmp_button a").click(function(){
       $(this).parent().hide();
       $(".newEmp_form").show()
       $(".newEmp_form select").chosen();

       $(".newEmp_button_submit a").click(function(){
         if ($(".newEmp_form .nemp_code").val()=="" || $(".newEmp_form  .nemp_pos").val()=="") {
           alert(jal_str["FillAllFields"]);
         } else {
           $.get("WebSaveCompEmp2.hal?nemp=" + $(".newEmp_form .nemp_code").val() + "&nemp_pos=" + $(".newEmp_form  .nemp_pos").val(),function(){
             $(".newEmp_form .nemp_code option:selected").remove();
             //self.refreshData();
             //alert(jal_str["InvitationSent"]);
             location.reload();
           });
          }
       });
     });
   }
    
}
