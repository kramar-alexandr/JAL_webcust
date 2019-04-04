$.get("/WebGetSMUDataForEditing.hal",function(data){InitSMUProfile(data)});

function InitSMUProfile(data) {
  var js = JSON.parse(data);
  if (js){
    let SMUProfile = new SMUProfileApp(js);
  }
}

function Comparator(a, b) {
   if (a[0] < b[0]) return -1;
   if (a[0] > b[0]) return 1;
   return 0;
 }

function Comparator2(a, b) {
   if (a[1] < b[1]) return -1;
   if (a[1] > b[1]) return 1;
   return 0;
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
        format: 'YYYY-MM-DD',
        applyLabel: jal_str["Apply"],
        cancelLabel: jal_str["Cancel"]
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
         $(tline).find("td:nth-child(4)").addClass("emp_rem").click(function(){
           $.get("/WebDeleteEmp.hal?emp=" + emp.Code + "&smu=" + self.smu.SMFCode,
             function(){
               if (confirm(jal_str["ConfirmDelete"])) {
                 $(tline).remove();
               }
             });
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
       
       $(".newEmp_button_submit a").click(function(){
         $.get("WebSaveCompEmp2.hal?nemp=" + $(".newEmp_form .nemp_code").val() + "&nemp_pos=" + $(".newEmp_form  .nemp_pos").val(),function(){
           self.refreshData();
           alert(jal_str["InvitationSent"]);
         });
       });
     });
   }
   this.setPossibleEmployees = function(){
     for (var i=0;i<this.smu.newemplist.length;i++){
       let e = this.smu.newemplist[i];
       $(".newEmp_form .nemp_code").append("<option value='" + e.Code + "'>" + e.Name + "</option>");
     }
   }
   
   this.SumupTable = function(table,ntable,wrap){
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
     
     $(ntable).find('tfoot td:nth-child(2)').html(emps.toFixed(2));
     $(ntable).find('tfoot td:nth-child(4)').html(mat.toFixed(2));
     $(wrap).find('.costprice input').val((emps+mat).toFixed(2));
   }
   
   this.AddTableEvents = function(table,ntable,wrap){
     var self = this;
      //$(ntable).find('tbody td:first-child').addClass("hidden");
      $(ntable).find('tbody td').not("td:nth-child(1)").click(function(){
        var th = this;
        if (!self.activecol) {
          self.activecol = true;
          $(th).html("<input class='table_edit' value='" + $(th).html() + "'>");
          $(th).find("input").inputmask("decimal", {allowMinus: false,digitsOptional:false,digits:2});

          $(th).find("input").focus().blur(function(){
            $(th).html();
            var cell = table.cell( th );
            cell.data($(this).val()).draw();
            if ($(th).parent().is(':last-child') && $(th).html()!="") {
              table.row.add(["","","","","","",""]).draw( false );
              self.AddTableEvents(table,ntable,wrap);
            }
            self.activecol = false;
            self.SumupTable(table,ntable,wrap);
          });
        }
      });
      $(ntable).find('tbody td:nth-child(1)').click(function(){
        if (!self.activecol) {
          self.activecol = true;
          let th = this;
          let ep = $(self.emplist).clone();
          var currow = table.cell(th).index().row;
          $(ep).val(table.cell({row: currow, column:0}).data());
          /*
          $(ep).val($(th).prev().html());
          */
          $(th).html("");
          $(th).append(ep);
          $(ep).on('blur change',function(){
            $(th).prev().html($(ep).val());
            var currow = table.cell(th).index().row;
            table.cell({row: currow, column:0}).data($(ep).val()).draw();
            table.cell({row: currow, column:1}).data($(ep).children("option").filter(":selected").text()).draw();
            /*
            var cell = table.cell($(th).prev());
            cell.data($(ep).val()).draw();
            var cell = table.cell($(th));
            cell.data($(ep).children("option").filter(":selected").text()).draw();
            */
            self.activecol = false;
          });
        }
      });      
   }
   
   this.AddItemTable = function(data,itemname,itemprice){
        var wrap = $('#temp_table_wrap').clone();
        
        $(wrap).attr("id","").addClass("table_wrap").css("display","block");
        var ntable = $(wrap).find("table");
        $("#cost_table_wrap").append(wrap);
        $(wrap).find(".itemname input").val(itemname);
        $(wrap).find(".itemprice input").val(itemprice);
        let table = $(ntable).DataTable({
            searching: false,
            info: false,
            select: false,
            paging: false,
            ordering: false,
            data: data,
            language: {
              zeroRecords: jal_str["zeroRecords"]
            },
            "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            }]
        });
        $(ntable).data("tabledata",table);
        this.SumupTable(table,ntable,wrap);
        this.AddTableEvents(table,ntable,wrap);   
   }
   
   this.AddEmptyItem = function(){
     var data = [];
     data.push(["","","","","","",""]);
   
     this.AddItemTable(data,"","");
   }
   
   this.setFinData = function(){
      var self = this;
      $('#temp_table_wrap').css("display","none");
      for (var i=0;i<this.smu.FinData.materials.length;i++) {
        var data = [];
        var d = this.smu.FinData.materials[i];
        var emparr = [];
        var itemarr = [];
        for (var j=0;j<d.costs.length;j++) {
          let c = d.costs[j];
          var arr = [];
          if (c.type=="1") {
            arr[0] = c.code;
            arr[1] = self.vemplist[c.code].Name;
            arr[2] = c.salary;
            emparr.push(arr);
          } else {
            arr[0] = c.ProdName;
            arr[1] = c.UCost;
            itemarr.push(arr);
          }

        }
        let itemname = d.ItemName;
        let itemprice = d.Price;
        for (var s=0;s<emparr.length||s<itemarr.length;s++){
          let a1 = emparr[s];
          if (a1===undefined){
            a1 = ["","",""];
          }
          let a2 = itemarr[s];
          if (a2===undefined){
            a2 = ["",""];
          }
          data.push(a1.concat(a2));
        }
        data.push(["","","","",""]);
        self.AddItemTable(data,itemname,itemprice);
      }
      $("#add_item_button").click(function(){
        self.AddEmptyItem();
      });
   }
   
   
   this.SumupPlanTable = function(table,ntable){
     let rows = table.data().toArray();
     var emps = 0;
     var mat = 0;
     var totcost = 0,totprice = 0,totprof = 0;
     for (var i=0;i<rows.length;i++){
       var cost = 0;
       var price = 0;
       var sold = 0;
       var showf = true;
       if (!isNaN(parseFloat(rows[i][2]))) {
         cost = parseFloat(rows[i][2]);
       } else {
         showf = false;
       }
       if (!isNaN(parseFloat(rows[i][3]))) {
         price = parseFloat(rows[i][3]);
       } else {
         showf = false;
       }
       if (!isNaN(parseFloat(rows[i][4]))) {
         sold = parseFloat(rows[i][4]);
       } else {
         showf = false;
       }
       if (showf){
         rows[i][5] = (cost*sold).toFixed(2);
         rows[i][6] = (price*sold).toFixed(2);
         rows[i][7] = ((price*sold)-(cost*sold)).toFixed(2);
         totcost = totcost + (cost*sold);
         totprice = totprice + (price*sold);
         totprof = totprof + (price*sold)-(cost*sold);
       } else {
         rows[i][5] = "";
         rows[i][6] = "";
         rows[i][7] = "";
       }
       table.row(i).data(rows[i]).draw();
     }
     $(ntable).find("tfoot td:nth-child(2)").html(totcost.toFixed(2));
     $(ntable).find("tfoot td:nth-child(3)").html(totprice.toFixed(2));
     $(ntable).find("tfoot td:nth-child(4)").html(totprof.toFixed(2));
     //table.data(rows).draw();
     
   }
   
   this.AddPlanTableEvents = function(table,ntable){
     var self = this;
      $(ntable).find('tbody td').not("td:nth-child(2),td:nth-child(1)").click(function(){
        var th = this;
        if (self.activecol!==th) {
          self.activecol = th;
          $(th).html("<input class='table_edit' value='" + $(th).html() + "'>");
          $(th).find("input").inputmask("decimal", {allowMinus: false,digitsOptional:false,digits:2});
          $(th).find("input").focus().blur(function(){
            $(th).html();
            var cell = table.cell( th );
            cell.data($(this).val()).draw();
            self.activecol = false;
            self.SumupPlanTable(table,ntable);
          });
        }
      });
   }

   this.setFinPlan = function(){
      var ntable = $("#finplan_table");
      var data = [];
      for (var i=0;i<this.smu.FinData.eventturnover.length;i++) {
        var it = this.smu.FinData.eventturnover[i];
        for (var j=0;j<it.turnover.length;j++){
          l = it.turnover[j];
          var arr = [l.EventName,it.ItemName,l.UCost,l.UPrice,l.SoldUnits,l.Income,l.Costs,l.Profit,l.EventID];
          data.push(arr);
        }
      } 
      data = data.sort(Comparator);

      let table = $(ntable).DataTable({
          searching: false,
          info: false,
          select: false,
          paging: false,
          ordering: false,
          data: data,
          rowsGroup: [0],
          language: {
            zeroRecords: jal_str["zeroRecords"]
          }
      });
      this.SumupPlanTable(table,ntable);
      this.AddPlanTableEvents(table,ntable);
        
   }
   this.showSubmitButtons = function(){
     var self = this;
     $(".save_only").click(function(){
       self.submitSMUData(this,false);
     });
     $(".save_submit").click(function(){
       self.submitSMUData(this,true);
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
    alert(rows[i][0] + ":" + rows[i][1] + ":" + rows[i][2]);
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
    console.log(rows);
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
    var lastitem = "";
    var obj = {};
    for (var i=0;i<table.length;i++){
      if (lastitem!=table[i][1]){
        if (lastitem!=""){
          resarr.push(obj);
        }
        obj = {ItemName:table[i][1],costs:[]};
        lastitem = table[i][1];
      }
      obj.costs.push({EventID:table[i][8],UCost:table[i][2],UPrice:table[i][3],SoldUnits:table[i][4]});
    }
  
    resarr.push(obj);
    return resarr;
  } 
   
  this.submitSMUData = function(el,approvef){
      var self = this;
    //if (this.ValidateForm()){
      $(el).unbind("click").html(jal_str["Wait"]);
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
