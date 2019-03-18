$.get("/WebGetSMUDataForEditing.hal",function(data){InitSMUProfile(data)});

function InitSMUProfile(data) {
  var js = JSON.parse(data);
  if (js){
    let SMUProfile = new SMUProfileApp(js);
  }
}

function SMUProfileApp(js) {
  this.smu = js;
  this.activecol = false;
  this.table = null;

  this.SetProfile = function () {
    this.setMainInfo();
    if (this.smu.SMFCode!==undefined){
      this.setEmployees();
      this.setFinData();
      this.setFinPlan();
    } else {
      $(".table-emps").hide();
      $(".table-salary").hide();
      $(".save_submit").hide();
    }
    this.showSubmitButtons();
  };

  this.setMainInfo = function () {
    $('.smu_name').val(this.smu.SMFName);
    $('.smu_descr').text(this.smu.Text);
    $('.smu_items').val(this.smu.ProdSpec);
    $('.smu_period').val(this.smu.ActDateStart + "-" + this.smu.ActDateEnd);
    $('.smu_education').val(this.smu.Education);
    $('.smu_targetaud').val(this.smu.TargetAud);
   
    $('.smu_period').daterangepicker({
      locale: {
        format: 'YYYY-MM-DD'
      }
    });  
  }
   
   this.setEmployees = function(){
     var self = this;
     var empline = $("#emplist-table tbody tr").clone();
     this.emplist = $("<select></select>");
     $("#emplist-table tbody tr").remove();
     for (var i=0;i<this.smu.emplist.length;i++){
       let emp = this.smu.emplist[i];
       let tline = $(empline).clone();
       if (emp.type=="0"){
         $(this.emplist).append("<option value='" + emp.Code + "'>" + emp.Name + "</option>");
       }
       $(tline).find("td:nth-child(1)").html(emp.Name);
       $(tline).find("td:nth-child(2)").html(emp.eMail);
       if (emp.type=="0") {
         $(tline).find("td:nth-child(3)").addClass("emp_rem").click(function(){
           $.get("/WebDeleteEmp.hal?emp=" + emp.Code + "&smu=" + self.smu.SMFCode,
             function(){
               if (confirm(jal_str["ConfirmDelete"])) {
                 $(tline).remove();
               }
             });
         });
        } else {
          $(tline).find("td:nth-child(3)").html(jal_str["Invited"]);
        }
       $("#emplist-table tbody").append(tline);
     }
     this.setPossibleEmployees();
     $(".newEmp_button a").click(function(){
       $(this).parent().hide();
       $(".newEmp_form").show()
       
       $(".newEmp_button_submit a").click(function(){
         $.get("WebSaveCompEmp2.hal?nemp=" + $(".newEmp_form select").val(),function(){
           self.refreshData();
           alert(jal_str["InvitationSent"]);
         });
       });
     });
   }
   this.setPossibleEmployees = function(){
     for (var i=0;i<this.smu.newemplist.length;i++){
       let e = this.smu.newemplist[i];
       $(".newEmp_form select").append("<option value='" + e.Code + "'>" + e.Name + "</option>");
     }
   }
   
   this.SumupTable = function(table){
     let rows = table.data().toArray();
     var emps = 0;
     var mat = 0;
     for (var i=0;i<rows.length;i++){
       if (!isNaN(parseFloat(rows[i][2]))) {
         emps+= parseFloat(rows[i][2]);
       }
       if (!isNaN(parseFloat(rows[i][4]))) {
         mat+= parseFloat(rows[i][4]);
       }
     }
     $('#findata_table tfoot td:nth-child(3)').html(emps);
     $('#findata_table tfoot td:nth-child(5)').html(mat);
     $('#findata_table tfoot td:nth-child(6)').html(emps+mat);
   }
   
   this.AddTableEvents = function(){
     var self = this;
      $('#findata_table tbody td:first-child').addClass("hidden");
      $('#findata_table tbody td').not("td:nth-child(2)").click(function(){
        var th = this;
        if (!self.activecol) {
          self.activecol = true;
          $(th).html("<input class='table_edit' value='" + $(th).html() + "'>");
          $(th).find("input").focus().blur(function(){
            $(th).html();
            var cell = self.table.cell( th );
            cell.data($(this).val()).draw();
            if ($(th).parent().is(':last-child') && $(th).html()!="") {
              self.table.row.add(["","","","","","",""]).draw( false );
              self.AddTableEvents();
            }
            self.activecol = false;
            self.SumupTable(self.table);
          });
        }
      });
      $('#findata_table tbody td:nth-child(2)').click(function(){
        if (!self.activecol) {
          self.activecol = true;
          let th = this;
          let ep = $(self.emplist).clone();
          $(ep).val($(th).prev().html());
          $(th).html("");
          $(th).append(ep);
          $(ep).on('blur change',function(){
            $(th).prev().html($(ep).val());
            var cell = self.table.cell($(th).prev());
            cell.data($(ep).val()).draw();
            var cell = self.table.cell($(th));
            cell.data($(ep).children("option").filter(":selected").text()).draw();
            self.activecol = false;
          });
        }
      });      
   }
   
   this.setFinData = function(){
        var self = this;
        let data = [];
        for (var i=0;i<this.smu.FinData.materials.length && i<this.smu.emplist.length;i++) {
          var e = this.smu.emplist[i];
          var d = this.smu.FinData.materials[i];
          var arr = [];
          if (e && e.type=="0") {
            arr[0] = e.Code;
            arr[1] = e.Name;
            arr[2] = e.Salary;
          } else {
            arr[0] = "";
            arr[1] = "";
            arr[2] = "";
          }
          if (d) {
            arr[3] = d.ProdName;
            arr[4] = d.UCost;
          } else {
            arr[3] = "";
            arr[4] = "";
          }
          arr[5] = "";
          arr[6] = "";
          data.push(arr);
        }
        data.push(["","","","","","",""]);
        this.table = $('#findata_table').DataTable({
            searching: false,
            info: false,
            select: false,
            paging: false,
            ordering: false,
            data: data,
            language: {
              zeroRecords: jal_str["zeroRecords"]
            }
        });
        this.SumupTable(this.table);
        this.AddTableEvents();
   }
   this.setFinPlan = function(){
   
   }
   this.showSubmitButtons = function(){
     var self = this;
     $(".save_only").click(function(){
       self.submitSMUData(false);
     });
     $(".save_submit").click(function(){
       self.submitSMUData(true);
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
   
  this.submitSMUData = function(approvef){
    //if (this.ValidateForm()){
      let drp = $('.smu_period').data('daterangepicker');
      let sd = drp.startDate.format('YYYY-MM-DD');
      let ed = drp.endDate.format('YYYY-MM-DD');
      let name = $('.smu_name').val();
      let text = $('.smu_descr').val();
      let items = $('.smu_items').val();
      let educ = $('.smu_education').val();
      let targetaud = $('.smu_targetaud').val();
      let appr = (approvef?"1":"0");
      let data = {"SMFName":name,"ProdSpec":items,"TargetAud":targetaud,"Education":educ,"ActDateStart":sd,"ActDateEnd":ed,"Text":text,"Approve":appr};
      if (this.smu.SMFCode!==undefined) {
        let rows = this.table.data().toArray();
        data.FinData = {};
        data = this.FillEmployees(data,rows);
        data = this.FillMaterials(data,rows);
      }
      $.ajax({
        type: "POST",
        url: `WebSaveSMUDataFromEditing.hal`,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            location.reload();
        },
        complete:function (data) {
            location.reload();
        },
        failure: function (err) {
            console.log(err);
        }
      });
    //}
  }

  this.SetProfile();
}
