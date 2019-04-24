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


function FinDataTable(wrap,smu,readonlyf) {
  this.smu = smu;
  this.readonlyf = readonlyf;
  this.items = [];
  this.wrap = wrap;
  this.vemplist = {}
  for (var i=0;i<this.smu.emplist.length;i++){
    this.vemplist[this.smu.emplist[i].Code] = this.smu.emplist[i];
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
          if ($(this).parent().children().index($(this))!=2){
            $(th).find("input").inputmask("decimal", {allowMinus: false,digitsOptional:false,digits:2});
          }
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
        var self = this;
        var wrap = $('#temp_table_wrap').clone();
        
        $(wrap).attr("id","").addClass("table_wrap").css("display","block");
        var ntable = $(wrap).find("table");
        $(this.wrap).find("#cost_table_wrap").append(wrap);
        $(wrap).find(".itemname input").val(itemname).change(function(){
          var oldval = $(this).get(0).defaultValue;
          self.items.push($(this).val());
          self.AddEmptyItems();
        });
        
        $(wrap).find(".itemprice input").val(itemprice);
        if (this.readonlyf==false) {
          $(wrap).find(".itemprice input").inputmask("decimal", {allowMinus: false,digitsOptional:false,digits:2});
        } else {
           $(wrap).find(".itemname input").attr("readonly","");
           $(wrap).find(".itemprice input").attr("readonly","");
        }
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
        if (this.readonlyf==false){
          this.AddTableEvents(table,ntable,wrap);   
        }
   }
   
   this.AddEmptyItem = function(button){
     var data = [];
     data.push(["","","","","","",""]);
   
     this.AddItemTable(data,"","");
     if ($(this.wrap).find("#cost_table_wrap .table_wrap").length>=3) {
       $(button).remove();
     }
   }
   
   this.setFinData = function(){
      var self = this;
      $(this.wrap).find('#temp_table_wrap').css("display","none");
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
        self.items.push(itemname);
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
        if (this.readonlyf==false){
          data.push(["","","","",""]);
        }
        self.AddItemTable(data,itemname,itemprice);
      }
      if (this.readonlyf==false){
        if ($("#cost_table_wrap .table_wrap").length>=3) {
          $("#add_item_button").remove();
        } else {
          $("#add_item_button").click(function(){
            self.AddEmptyItem(this);
          });
        }
      }
   }
   this.setFinData();
}


function FinPlanDataTable(wrap,smu,readonlyf){
  this.smu = smu;
  this.readonlyf = readonlyf;
  this.wrap = wrap;
  
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
   
   this.AddEmptyItemPlan = function(rows,item){
     $("#eventlist option").each(function(){
       var t = this;
       var arr = [$(t).val(),$(t).text(),item,"","","","","","",$(t).val()];
       rows.push(arr);
     });    
   }
   
   this.AddEmptyItems = function(){
     var self = this;
     var rows = this.plantable.data().toArray();
     var items = {};
     for (var i=0;i<rows.length;i++){
       items[rows[i][2]] = true;
     }
     for (var i=0;i<this.items.length;i++){
       if (!items[this.items[i]]) {
         self.AddEmptyItemPlan(rows,this.items[i]);
       }
     }
     this.plantable.destroy();
     this.CreatePlanTable(rows);
   }
   
   this.CreatePlanTable = function(data){
      var ntable = $(this.wrap).find("#finplan_table");
      data = data.sort(Comparator);
      let table = $(ntable).DataTable({
          searching: false,
          info: false,
          select: false,
          paging: false,
          ordering: false,
          data: data,
          rowsGroup: [0,1],
          "columnDefs": [
          {
              "targets": [ 0 ],
              "visible": false,
              "searchable": false
          }],
          language: {
            zeroRecords: jal_str["zeroRecords"]
          }
      });
      this.plantable = table;
      this.SumupPlanTable(table,ntable);
      if (this.readonlyf==false){
        this.AddPlanTableEvents(table,ntable);
      };      
   
   }

   this.setFinPlan = function(){
      var data = [];
      for (var i=0;i<this.smu.FinData.eventturnover.length;i++) {
        var it = this.smu.FinData.eventturnover[i];
        for (var j=0;j<it.turnover.length;j++){
          l = it.turnover[j];
          var arr = [l.EventID,l.EventName,it.ItemName,l.UCost,l.UPrice,l.SoldUnits,l.Income,l.Costs,l.Profit,l.EventID];
          data.push(arr);
        }
      } 
      this.CreatePlanTable(data);
      if (this.readonlyf==false){
        this.AddEmptyItems();
      }

   }
   this.setFinPlan();
}