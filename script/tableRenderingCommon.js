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


function FinDataTable(wrap,smu,readonlyf,obj) {
  this.smu = smu;
  this.readonlyf = readonlyf;
  this.items = [];
  this.wrap = wrap;
  this.vemplist = {}
  this.obj = obj;
  
  for (var i=0;i<this.smu.emplist.length;i++){
    this.vemplist[this.smu.emplist[i].Code] = this.smu.emplist[i];
  }
      
   this.SumupTable = function(table,ntable,wrap){
     let rows = table.data().toArray();
     var self = this;
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
     if (this.obj){
       if (this.obj.tables.plantable.UpdateItemCost){
         this.obj.tables.plantable.UpdateItemCost($(wrap).find('.itemname input').val(),emps+mat);
         this.obj.tables.plantable.UpdateItemPrice($(wrap).find('.itemname input').val(),$(wrap).find('.itemprice input').val());
       } else {
         setTimeout(function(){
           self.obj.tables.plantable.UpdateItemCost($(wrap).find('.itemname input').val(),emps+mat);
           self.obj.tables.plantable.UpdateItemPrice($(wrap).find('.itemname input').val(),$(wrap).find('.itemprice input').val());
         },1000);
       }
     }
   }
   
   this.CleanEmpSelect = function(table,ep){
   
     let rows = table.data().toArray();
     for (var j=0;j<ep.length;j++){
       for (var i=0;i<rows.length;i++){
         if (rows[i][0]==ep.options[j].value){
           $(ep.options[j]).remove();
           i = rows.length;
         }
       }
     }
     return ep;
   }
   
   this.AddTableEvents = function(table,ntable,wrap,samplef){
     var self = this;
      //$(ntable).find('tbody td:first-child').addClass("hidden");
      if (samplef){
        $(wrap).find(".itemname input").addClass("sample_input");
        $(wrap).find(".itemprice input").addClass("sample_input");
        $(wrap).find(".sample_input").click(function(){
          $(ntable).find('tbody td:nth-child(1)').click();
          $(this).focus();
        });
        $(wrap).addClass("sample");
        $(ntable).find('tbody td').bind("click",function(event){
          table.row(0).remove();
          table.row(0).remove();
          table.row.add(["","","","","","",""]).draw( false );
          $(wrap).find(".itemname input").val("").removeClass("sample_input");
          $(wrap).find(".itemprice input").val("").removeClass("sample_input");
          //$(ntable).find('tbody td').unbind("click",f);
          self.AddTableEvents(table,ntable,wrap,false);
          event.stopImmediatePropagation();
          $(ntable).find('tbody td').unbind(event);
          $(wrap).removeClass("sample");
          self.SumupTable(table,ntable,wrap);
        
        });
      }
      $(ntable).find('tbody td').not("td:nth-child(1)").click(function(){
        var th = this;
        if (!self.activecol) {
          self.activecol = true;
          $(th).html("<input class='table_edit' value='" + $(th).html() + "'>");
          if ($(this).parent().children().index($(this))!=2){
            $(th).find("input").inputmask("decimal", {allowMinus: false,digitsOptional:false,digits:2});
          }
          $(th).find("input").focus().blur(function(){
            let curact = null;
            let nextact = null;
            if (self.nextcol){
              curact = $(self.nextcol).closest("td");
              self.nextcol = null;
            }
            $(th).html();
            var cell = table.cell( th );
            cell.data($(this).val()).draw();
            if ($(th).parent().is(':last-child') && $(th).html()!="") {
              table.row.add(["","","","","","",""]).draw( false );
              self.AddTableEvents(table,ntable,wrap,false);
            }
            if (curact){
              nextact = $(curact).next();
              if (nextact.length==0){
                nextact = $(curact).closest("tr").next().find("td").first();
              }
            }
            self.activecol = false;
            self.SumupTable(table,ntable,wrap);
            if (nextact){
              $(nextact).click();
            }
          });
          $(th).find("input").on( 'keydown', function( e ) {
            if( e.which == 9 ) {
              self.nextcol = this;
            }
          });
        }
      });
      $(ntable).find('tbody td:nth-child(1)').click(function(){
        if (!self.activecol) {
          self.activecol = true;
          let th = this;
          let ep = $(self.obj.emplist).clone().get(0);
          ep = self.CleanEmpSelect(table,ep);
          var currow = table.cell(th).index().row;
          $(ep).val(table.cell({row: currow, column:0}).data());
          /*
          $(ep).val($(th).prev().html());
          */
          $(th).html("");
          $(th).append(ep);
          $(ep).focus();
          $(ep).on('blur change',function(){
            let curact = null;
            let nextact = null;
            if (self.nextcol){
              curact = $(self.nextcol).closest("td");
              self.nextcol = null;
            }
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
            if (curact){
              nextact = $(curact).next();
              if (nextact.length==0){
                nextact = $(curact).closest("tr").next().find("td").first();
              }
            }
            if (nextact){
              $(nextact).click();
            }
          });
          $(ep).on( 'keydown', function( e ) {
            if( e.which == 9 ) {
              self.nextcol = this;
            }
          });
        }
      });      
   }
   
   this.AddItemTable = function(data,itemname,itemprice,samplef){
        var self = this;
        var twrap = $('#temp_table_wrap').clone();
        
        $(twrap).attr("id","").addClass("table_wrap").css("display","block");
        var ntable = $(twrap).find("table");
        $(this.wrap).find("#cost_table_wrap").append(twrap);
        
        $(twrap).find(".itemprice input").val(itemprice).change(function(){
          self.obj.tables.plantable.UpdateItemPrice($(twrap).find('.itemname input').val(),$(this).val());
        });;
        if (this.readonlyf){
          $(twrap).find(".itemdelete").remove();
        } else {
          $(twrap).find(".itemdelete").click(function(){
            var item = $(twrap).find(".itemname input").val();
            for (var i=0;i<self.items.length;i++){
              if (self.items[i]==item){
                self.items.splice(i,1);
                $(twrap).remove();
                break;
              }
            }
            self.obj.tables.plantable.AddEmptyItems();
          });;
        }
        if (this.readonlyf==false) {
          $(twrap).find(".itemprice input").inputmask("decimal", {allowMinus: false,digitsOptional:false,digits:2});
        } else {
           $(twrap).find(".itemname input").attr("readonly","");
           $(twrap).find(".itemprice input").attr("readonly","");
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
            },
            {
        		'targets': "_all",
        		'createdCell':  function (td, cellData, rowData, row, col) {
           			$(td).attr('cname', $(ntable).find("thead tr:nth-child(2) th:nth-child(" + (col+1) + ")").html()); 
           	  }
        	  }]
        });
        $(twrap).find(".itemname input").val(itemname).attr("oldval",itemname).change(function(){
          var foundf = false;
          var oldval = $(this).attr("oldval");
          var newval = $(this).val();
          $(this).attr("oldval",$(this).val());
          for (var i=0;i<self.items.length;i++){
            if (self.items[i]==oldval){
              self.items[i] = $(this).val();
              foundf = true;
              break;
            }
          }
          if (!foundf) {
            self.items.push($(this).val());
          }
          if (oldval=="" || oldval=="Riteņu statīvs"){
            oldval=null;
          }
          self.obj.tables.plantable.AddEmptyItems(oldval,newval);
          self.SumupTable(table,ntable,twrap);

        });
        $(ntable).data("tabledata",table);
        this.SumupTable(table,ntable,twrap);
        if (this.readonlyf==false){
          this.AddTableEvents(table,ntable,twrap,samplef);   
        }
   }
   
   
   this.AddEmptyItem = function(button){
     var data = [];
     data.push(["","Jānis Bērziņš","15.00","Alumīnija caurule","10.00"]);
     data.push(["","","","Plastmasas āķis","3.00"]);
     let itemname = "Riteņu statīvs";
     let itemprice = "99.99";

     this.AddItemTable(data,itemname,itemprice,true);
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
            if (self.vemplist.hasOwnProperty(c.code)){
              arr[0] = c.code;
              arr[1] = self.vemplist[c.code].Name;
              arr[2] = c.salary;
              emparr.push(arr);
            }
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
        let samplef = false;

        if (this.readonlyf==false){
          if (data.length==0) {
            data.push(["","Jānis Bērziņš","15.00","Alumīnija caurule","10.00"]);
            data.push(["","","","Plastmasas āķis","3.00"]);
            itemname = "Riteņu statīvs";
            itemprice = "99.99";
            samplef = true;
          }
          data.push(["","","","",""]);
        }
        self.AddItemTable(data,itemname,itemprice,samplef);
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


function FinPlanDataTable(wrap,smu,readonlyf,obj){
  this.smu = smu;
  this.readonlyf = readonlyf;
  this.wrap = wrap;
  this.obj = obj;

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
       if (!isNaN(parseFloat(rows[i][3]))) {
         cost = parseFloat(rows[i][3]);
       } else {
         showf = false;
       }
       if (!isNaN(parseFloat(rows[i][4]))) {
         price = parseFloat(rows[i][4]);
       } else {
         showf = false;
       }
       if (!isNaN(parseFloat(rows[i][5]))) {
         sold = parseFloat(rows[i][5]);
       } else {
         showf = false;
       }
       if (showf){
         rows[i][6] = (cost*sold).toFixed(2);
         rows[i][7] = (price*sold).toFixed(2);
         rows[i][8] = ((price*sold)-(cost*sold)).toFixed(2);
         totcost = totcost + (cost*sold);
         totprice = totprice + (price*sold);
         totprof = totprof + (price*sold)-(cost*sold);
       } else {
         rows[i][6] = "";
         rows[i][7] = "";
         rows[i][8] = "";
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
      $(ntable).find('tbody td').not("td:nth-child(2),td:nth-child(1),td:nth-child(3),td:nth-child(4)").click(function(){
        var th = this;
        if (self.activecol!==th) {
          self.activecol = th;
          $(th).html("<input class='table_edit' value='" + $(th).html() + "'>");
          if (table.cell(th).index().column==5) {
            $(th).find("input").inputmask("decimal", {allowMinus: false,digitsOptional:true,digits:0});
          } else {
            $(th).find("input").inputmask("decimal", {allowMinus: false,digitsOptional:false,digits:2});          
          }
          $(th).find("input").focus().blur(function(){
            let curact = null;
            let nextact = null;
            if (self.nextcol){
              curact = $(self.nextcol).closest("td");
              self.nextcol = null;
            }
            $(th).html();
            var cell = table.cell( th );
            cell.data($(this).val()).draw();
            self.activecol = false;
            self.SumupPlanTable(table,ntable);
            if (curact){
              nextact = $(curact).next();
              if (nextact.length==0){
                nextact = $(curact).closest("tr").next().find("td:nth-child(5)");
              }
            }
            if (nextact){
              $(nextact).click();
            }
          });
          $(th).find("input").on( 'keydown', function( e ) {
            if( e.which == 9 ) {
              self.nextcol = this;
            }
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
   
   this.AddEmptyItems = function(oldval,newval){
     var self = this;
     var rows = this.plantable.data().toArray();
     items = {};
     for (var i=0;i<rows.length;i++){
       items[rows[i][2]] = true;
     }
     var vitems = {};
     var allitems = this.obj.tables.fintable.items;
     for (var i=0;i<allitems.length;i++){
       if (!items[allitems[i]] && !oldval) {
         self.AddEmptyItemPlan(rows,allitems[i]);
       }
       vitems[allitems[i]] = true;
     }
     for (var i=0;i<rows.length;i++){
       if (!vitems[rows[i][2]]){
         if (!oldval){
           rows.splice(i,1);
           i--;
         } else {
           if (oldval==rows[i][2]){
             rows[i][2] = newval;
             //i = rows.length;
           }
         }
       }  
     }
     this.plantable.destroy();
     this.CreatePlanTable(rows);
   }

   this.UpdateItemPrice = function(item,price){
     var self = this;
     var rows = this.plantable.data().toArray();
     for (var i=0;i<rows.length;i++){
       if (rows[i][2]==item){
         rows[i][4] = price;
       }
     }
     this.plantable.destroy();
     this.CreatePlanTable(rows);
   }
   
   this.UpdateItemCost = function(item,cost){
     var self = this;
     var rows = this.plantable.data().toArray();
     for (var i=0;i<rows.length;i++){
       if (rows[i][2]==item){
         rows[i][3] = cost.toFixed(2);
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
          },
          {
        		'targets': "_all",
        		'createdCell':  function (td, cellData, rowData, row, col) {
           			$(td).attr('cname', $(ntable).find("thead th:nth-child(" + (col+1) + ")").html()); 
        	  }
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