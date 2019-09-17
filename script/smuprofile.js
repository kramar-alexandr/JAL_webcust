$.get("/WebGetSMUDataForEditing.hal",function(data){InitSMUProfile(data)});

function InitSMUProfile(data) {
  var js = JSON.parse(data);
  if (js){
    let SMUProfile = new SMUProfileApp(js);
  }
}

$(function() {
    $.datepicker.setDefaults($.datepicker.regional['lv']);
}); 

function SMUProfileApp(js) {
  this.smu = js;
  this.activecol = false;
  this.table = null;
  this.items = [];
  this.plantable = null;
  this.tables = {fintable:{},plantable:{}}

  this.SetProfile = function () {
    this.setMainInfo();
    if (this.smu.SMFCode!==undefined){
      this.setEmployees();
      if (this.smu.ApprovalStatus==0){
        this.tables.fintable = new FinDataTable($("#temp_table_wrap").parent().parent(),this.smu,false,this);
        this.tables.plantable = new FinPlanDataTable($(".table-plan"),this.smu,false,this);
      } else {
        this.tables.fintable = new FinDataTable($("#temp_table_wrap").parent().parent(),this.smu,true,this);
        this.tables.plantable = new FinPlanDataTable($(".table-plan"),this.smu,true,this);
      }
    } else {
      $(".table-emps").hide();
      $(".table-salary").hide();
      $(".save_submit").hide();
      $(".table-plan").hide();
    }
    if (this.smu.ApprovalStatus==='0' || this.smu.ApprovalStatus===undefined) {
      this.showSubmitButtons();
    } else {
      this.RestrictProfileApp();
    }
  };
  
  this.RestrictProfileApp = function(){
  
    if (parseInt(this.smu.ApprovalStatus)>0) {
      var info = $("<div class='smu_profile_info'></div>");
    
      $(info).html(jal_str["ApprovalMsg" + this.smu.ApprovalStatus]);
      $(info).insertBefore($('.smu_name').parent().parent().parent());
    } else {
      if (parseInt(this.smu.OldApprovalStatus)>3) {
        var info = $("<div class='smu_profile_info'></div>");
        $(info).html(jal_str["ApprovalMsg" + this.smu.OldApprovalStatus]);
        $(info).insertBefore($('.smu_name').parent().parent().parent());
      }
    }
    $('.smu_name').attr("disabled","");
    $('.smu_descr').attr("disabled","");
    $('.smu_items').attr("disabled","");
    $('.smu_period_start').attr("disabled","");
    $('.smu_period_end').attr("disabled","");
    $('.smu_education').attr("disabled","");
    $('.smu_targetaud').attr("disabled","");
    $('#add_item_button').css("display","none");
    if (this.smu.ApprovalStatus==='2' || this.smu.ApprovalStatus==='3'){
      $(".table-emps").hide();
    } else {
      $(".newEmp_button a").remove();
    }
    $(".save_only").remove();
    $(".save_submit").remove();
  }

  this.setMainInfo = function () {
    $('.smu_name').val(this.smu.SMFName);
    $('.smu_descr').text(this.smu.Text);
    $('.smu_items').val(this.smu.ProdSpec);
    $('.smu_period_start').val(this.smu.ActDateStart);
    $('.smu_period_end').val(this.smu.ActDateEnd);
    $('.smu_education').val(this.smu.Education);
    $('.smu_targetaud').val(this.smu.TargetAud);
    $('.smu_period_start').datepicker({dateFormat: 'yy-mm-dd',firstDay:1});  
    $('.smu_period_end').datepicker({dateFormat: 'yy-mm-dd',firstDay:1});  
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
    /*
    $(el).html($(sel).val());
    $(el).click(function(){
      self.SetPositionDropDown(emp,this,$(sel).val());
    });
    */
  }
   
   this.setEmployees = function(){
     var self = this;
     var empline = $("#emplist-table tbody tr").clone();
     this.emplist = $("<select></select>");
     this.vemplist = {};
     $("#emplist-table tbody tr").remove();
     for (var i=0;i<this.smu.emplist.length;i++){
       let emp = this.smu.emplist[i];
       this.vemplist[emp.Code] = emp;
       let tline = $(empline).clone();
       if (emp.type=="0"){
         $(this.emplist).append("<option value='" + emp.Code + "'>" + emp.Name + "</option>");
       }
       $(tline).find("td:nth-child(1)").html(emp.Name);
       $(tline).find("td:nth-child(2)").html(emp.eMail);
       self.SetPositionDropDown(emp,$(tline).find("td:nth-child(3)"),emp.JobDesc);
       if (emp.type=="0") {
         if (emp.Code==self.smu.Owner){
           $(tline).find("td:nth-child(4)").html("");
         } else {
           $(tline).find("td:nth-child(4)").addClass("emp_rem").click(function(){
             if (confirm(jal_str["ConfirmDelete"])) {
              $.get("/WebDeleteEmp.hal?emp=" + emp.Code + "&smu=" + self.smu.SMFCode,
                function(data){
                  if ($(data).attr("err")!="0") {
                    alert($(data).attr("errmsg"));
                  } else {
                   $(tline).remove();
                  }
                });
              }
           });
          }
        } else {
          $(tline).find("td:nth-child(4)").html(jal_str["Invited"] + "<br><div class='emp_rem'>" + jal_str["Remove"] + "</div>").click(function(){
           if (confirm(jal_str["ConfirmDelete"])) {
            $.get("/WebDeleteEmpApplication.hal?emp=" + emp.Code + "&smu=" + self.smu.SMFCode,
              function(data){
                if ($(data).attr("err")!="0") {
                  alert($(data).attr("errmsg"));
                } else {
                 $(tline).remove();
                }
              });
            }
          });
        }
       $("#emplist-table tbody").append(tline);
     }
     this.setPossibleEmployees();
     $(".newEmp_button a").click(function(){
       $(this).parent().hide();
       $(".newEmp_form").show();
       $(".newEmp_form select").chosen();
       
       $(".newEmp_button_submit a").click(function(){
         if ($(".newEmp_form .nemp_code").val()=="" || $(".newEmp_form  .nemp_pos").val()=="") {
           alert(jal_str["FillAllFields"]);
         } else {
           $.get("WebSaveCompEmp2.hal?nemp=" + $(".newEmp_form .nemp_code").val() + "&nemp_pos=" + $(".newEmp_form  .nemp_pos").val(),function(data){
             if ($(data).attr("err")=="1"){
               alert(jal_str["TooManyEmployees"]);
             } else {
               $(".newEmp_form .nemp_code option:selected").remove();
               self.refreshData();
               alert(jal_str["InvitationSent"]);
              }
           });
          }
       });
     });
   }
   this.setPossibleEmployees = function(){
     for (var i=0;i<this.smu.newemplist.length;i++){
       let e = this.smu.newemplist[i];
       $(".newEmp_form .nemp_code").append("<option value='" + e.Code + "'>" + e.Name + "</option>");
     }
   }   
   
   this.showSubmitButtons = function(){
     if (parseInt(this.smu.OldApprovalStatus)>3) {
       var info = $("<div class='smu_profile_info'></div>");
       $(info).html(jal_str["ApprovalMsg" + this.smu.OldApprovalStatus]);
       $(info).insertBefore($('.smu_name').parent().parent().parent());
     }
     var self = this;
     $(".save_only").click(function(event){
       self.submitSMUData(this,false,event);
     });
     $(".save_submit").click(function(event){
       self.submitSMUData(this,true,event);
     });
   
   }
   this.refreshData = function(){
     var self = this;
     $.get("/WebGetSMUDataForEditing.hal",function(data){
       self.smu = JSON.parse(data);
       
     });
   }
   
  this.FillEmployees = function(data,rows){
    let tarr = [];
    for (var i=0;i<rows.length;i++) {
      obj = {"CustCode":rows[i][0],"Salary":rows[i][2]};
      tarr.push(obj);
    }
    data.FinData.employees = tarr;
    return data;
  }
  this.FillMaterials = function(data,rows){
    let tarr = [];
    for (var i=0;i<rows.length;i++) {
      obj = {"UCost":rows[i][4],"ProdName":rows[i][3],"UPrice":rows[i][5]};
      tarr.push(obj);
    }
    data.FinData.materials = tarr;
    return data;
  }
  
  this.GetSingleItem = function(p,table){
    var item = {};
    
    item.ItemName = $(p).find(".itemname input").val();
    item.UPrice = $(p).find(".itemprice input").val();
    item.emps = [];
    item.costs = [];
    let rows = table.data().toArray();
    for (var i=0;i<rows.length;i++) {
      if (rows[i][0]!=""){
        item.emps.push({"custcode":rows[i][0],"salary":rows[i][2]});
      }
    }
    for (var i=0;i<rows.length;i++) {
      if (rows[i][3]!=""){
        item.costs.push({"UCost":rows[i][4],"ProdName":rows[i][3]});
      }
    }
    return item;
  }
   
  this.GetPlanArray = function(plantable){
    let table = plantable.data().toArray().sort(Comparator2);
    var resarr = [];
    var itemlist = {};
    for (var i=0;i<table.length;i++){
      if (itemlist.hasOwnProperty(table[i][2])==false){
        itemlist[table[i][2]] = {ItemName:table[i][2],costs:[]};
      }
      itemlist[table[i][2]].costs.push({EventID:table[i][9],UCost:table[i][3],UPrice:table[i][4],SoldUnits:table[i][5]});
    }
  
    for (var item in itemlist) {
      resarr.push(itemlist[item]);
    }
    return resarr;
  } 
  
  this.ValidateForm = function(){
    var res = true;
    $('.table_wrap').each(function(){
      let p = this;
      var price = parseFloat($(p).find(".itemprice input").val());
      var cost = parseFloat($(p).find(".costprice input").val());
      if (price<cost) {
        alert(jal_str["PriceLowerThanCost"].replace("{item}",$(p).find(".itemname input").val()));
        $(p).find(".itemprice input").focus();
        res = false;
        return false;
      }
      if ($(this).hasClass("sample")){
        res = false;
        alert(jal_str["ItemWithSampleData"]);
        return false;
      }
    });
    return res;
  }
  
  this.TreatSubmitResponse = function(data){
    if (data.errtype!==undefined){
      switch (data.errtype){
        case "2":
          alert(jal_str["SMUName"]);
          $('.smu_name').focus();
          break;
        case "3":
          alert(jal_str["EmpCnt"]);
          break;
        case "1":
          alert(jal_str["SMUDate"]);
          $('.smu_period').focus();
          break;
        case "4":
          alert(jal_str["SMUDate2"]);
          $('.smu_period').focus();
          break;
        case "5":
          alert(jal_str["AllFieldFilled"]);
          break;
        default: 
          location.reload();
      }
    } else {
      location.reload();
    }
  }
   
  this.submitSMUData = function(el,approvef,event){
      var self = this;
      event.stopPropagation();
    if (this.ValidateForm()){
      //$(el).unbind("click").html(jal_str["Wait"]);
      $(el).css("visibility","hidden");
      //let drp = $('.smu_period').data('daterangepicker');
      let sd = $(".smu_period_start").val();
      let ed = $(".smu_period_end").val();
      let name = $('.smu_name').val();
      let text = $('.smu_descr').val();
      let items = $('.smu_items').val();
      let educ = $('.smu_education').val();
      let targetaud = $('.smu_targetaud').val();
      let appr = (approvef?"1":"0");
      let data = {"SMFName":name,"ProdSpec":items,"TargetAud":targetaud,"Education":educ,"ActDateStart":sd,"ActDateEnd":ed,"Text":text,"Approve":appr};
      if (this.smu.SMFCode!==undefined) {
        data.FinData = {"materials":[],"eventturnover":[]};
        $('.table_wrap').each(function(){
          let p = this;
//          let table = $(this).find("table").get(0);
          var tt = $(p).find("table");
          var ptable = $(tt).data("tabledata");//$($(this).find("table")).DataTable({"retrieve": true});
          pobj = self.GetSingleItem(p,ptable);
          data.FinData.materials.push(pobj); 
        });
        var plantable = $('#finplan_table').DataTable({"retrieve": true});
        arr = self.GetPlanArray(plantable);
        data.FinData.eventturnover = arr; 

      }

      $.ajax({
        type: "POST",
        url: `WebSaveSMUDataFromEditing.hal`,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
          self.TreatSubmitResponse(data);
          $(el).css("visibility","visible");

        },
        failure: function (err) {
            console.log(err);
        }
      });
    }
  }

  this.SetProfile();
}
