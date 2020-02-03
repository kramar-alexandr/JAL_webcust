function ComparatorSMUData(a, b) {
   if (a["approvalstatus"] ==='0') {
     let ret = 1;
     if (a["approvalstatus"] == b["approvalstatus"]){
       if (a["title"].toLowerCase() > b["title"].toLowerCase()) ret = -1;
     }
     return ret;
   }
   if (b["approvalstatus"] ==='0') {
     return -1;
   }
   if (a["approvalstatus"] < b["approvalstatus"]) return 1;
   if (a["approvalstatus"] > b["approvalstatus"]) return -1;
   if (a["title"].toLowerCase() < b["title"].toLowerCase()) return 1;
   if (a["title"].toLowerCase() > b["title"].toLowerCase()) return -1;
   return 0;
 }

let template = document.createElement('div');
template.innerHTML = $("#smu_doc_template").html();
$(template).attr("class","smu-border");

let companyTemp = $("#smu_info_template").html();//companyTempInfo;

function SetEventStatus(node,val,cls){
  
  var tval = "/img/space.png";
  hstr = jal_str["event_empty"];

  switch (val) {
    case "2":
      tval = "/img/no.png";
      hstr = jal_str["event_rejected"];
      break;
    case "0":
      tval = "/img/mail.png";
      hstr = jal_str["event_sent"];
      break;
    case "1":
      tval = "/img/yes.png";
      hstr = jal_str["event_approved"];
      break;
    case "4":
      tval = "/img/yes.png";
      hstr = jal_str["event_approved"];
      break;
  }
  
  $(node).find("." + cls + " img").attr("src",tval);
  $(node).find("." + cls).attr("title",hstr);

}

if (SMUData) {
    let smus = JSON.parse(SMUData);
    smus = smus.sort(ComparatorSMUData);
    smus.reverse();

    let count = 0;
    let dataSource = [];
    for (let smu of smus) {
        count += 1;
        let smuNode = $(template).clone();
        let companyInfo = $(companyTemp).clone();
        let emplist = [];
        for (let i=0;i<smu.emplist.length;i++){
          emplist.push(smu.emplist[i].Name);
        }
        let emplist_str = emplist.join(",");

        if (smuNode) {
            smuNode.find('.title').text(count + '. ' + smu.title);
            smuNode.find('.title', '.show-info').click(function () {
                $(this).parent().parent().parent().parent().find('.company-detail').toggleClass('show');

            });
            smuNode.find('.show-info').click(function () {
                $(this).toggleClass('active-btn');

            });
            if (smu.printCert=="1"){
              smuNode.find(".reg-succes").addClass("done");
            }
            smuNode.find(".reg-succes").click(function(){
              $(this).toggleClass("done");
              $.get("/WebSetPrintCertStat.hal?smu=" + smu.regNr,function(){
                
              });
            
            });
            smuNode.find('.show-info-btn').click(function () {
                if ($(this).html()==jal_str["CloseApplication"]){
                  $(this).html(jal_str["OpenApplication"]);                
                } else {
                  $(this).html(jal_str["CloseApplication"]);
                }
                $(this).parent().parent().parent().find('.company-detail').toggleClass('show');
                /*worst workaround
                  following was needed to make the row grouping work. Seems that it doesn't work when the element is hidden
                */
                var rows = smuNode.data("plantable").plantable.data().toArray();
                smuNode.data("plantable").plantable.destroy();
                smuNode.data("plantable").CreatePlanTable(rows);

            });
            companyInfo.find('.leader').append(smu.leader);  
            companyInfo.find('.members').append(emplist_str);
            smuNode.find('.leader').append(smu.leader);  
            smuNode.find('.members').append(emplist_str);
            
            companyInfo.find(".button-tab").hide();

            smuNode.find('.submitTeacher,.submitJAL,.posted').parent().attr('title',jal_str["reg_pending"]);
            if (smu.approvalstatus === '1') {
                smuNode.find('.posted').attr('src', '/img/docs.png').parent().attr('title',jal_str["reg_approved"]);
                companyInfo.find(".button-tab").show();
            }
            if (smu.approvalstatus === '2') {
                smuNode.find('.submitTeacher,.posted').attr('src', '/img/docs.png').parent().attr('title',jal_str["reg_approved"]);
            }
            if (smu.approvalstatus === '3') {
                smuNode.find('.submitTeacher,.submitJAL,.posted').attr('src', '/img/docs.png').parent().attr('title',jal_str["reg_approved"]);
            }
            if (smu.approvalstatus === '4') {
                smuNode.find('.submitTeacher,.posted').attr('src', '/img/docs.png').parent().attr('title',jal_str["reg_approved"]);
                smuNode.find('.submitJAL').attr('src', '/img/docs-red.png').parent().attr('title',jal_str["reg_rejected"]);;
            }
            
            SetEventStatus(smuNode,smu.cbziema,"cbziema");
            SetEventStatus(smuNode,smu.cbreg,"cbreg");
            SetEventStatus(smuNode,smu.cbpav,"cbpav");
            SetEventStatus(smuNode,smu.judiena,"judiena");

            companyInfo.find('.register-number').append(smu.regNr);
            companyInfo.find('.prod-descr').append(smu.prodDescr);
            companyInfo.find('.education').append(smu.education);

            companyInfo.find('.type-company').append(smu.companyType);
            companyInfo.find('.target-type').append(smu.targetAudit);
            companyInfo.find('#confirmBtn').click(function () {
              if (confirm(jal_str["Msg_ApproveSMU"])) {
/*
                let xhr = new XMLHttpRequest();
                xhr.open('GET', `/WEBJALSMUChangeDocsStatus.hal?status=2&sernr=${smu.regNr}`, true);
                xhr.send();

                xhr.onload = function () {
                    if (xhr.status !== 200) {
                        console.log('[GET] STATUS ' + xhr.status + ': ' + xhr.statusText);
                    } else {
                        console.log('RESPONSE: ' + xhr.responseText);
                    }
                };
                location.reload();
*/
                $.get(`/WEBJALSMUChangeDocsStatus.hal?status=2&sernr=${smu.regNr}`,function(){
                  location.reload();
                });
              }
            });

            companyInfo.find('#rejectBtn').click(function () {
              if (confirm(jal_str["Msg_DeclineSMU"])) {
              /*
                let xhr = new XMLHttpRequest();
                xhr.open('GET', `/WEBJALSMUChangeDocsStatus.hal?status=0&sernr=${smu.regNr}`, true);
                xhr.send();

                xhr.onload = function () {
                    if (xhr.status !== 200) {
                        console.log('[GET] STATUS ' + xhr.status + ': ' + xhr.statusText);
                    } else {
                        console.log('RESPONSE: ' + xhr.responseText);
                    }
                };
                
                location.reload();
                */
                $.get(`/WEBJALSMUChangeDocsStatus.hal?status=6&sernr=${smu.regNr}`,function(){
                  location.reload();
                });
              }
            });
            companyInfo.find("#printBtn").click(function(){
              companyInfo.printThis();
            
            });

            if (smu.members) {
                let members = smu.members.split(',');

                companyInfo.find('.memberOne').text(members[0]);
                companyInfo.find('.memberTwo').text(members[1]);
                companyInfo.find('.memberTree').text(members[2]);
                companyInfo.find('.memberFour').text(members[3]);
                companyInfo.find('.memberFive').text(members[4]);
            }

            companyInfo.find('.company-smu').text(`Vadītājs: ${smu.leader},  ${smu.members}`);
            /*
            let data = [];
            for (var i=0;i<smu.FinData.materials.length && i<smu.emplist.length;i++) {
              var e = smu.emplist[i];
              var d = smu.FinData.materials[i];
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
 
            
            let table = $(smuNode).find("#company-table").DataTable({
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
            SumupTable(table,$(smuNode).find("#company-table"));
            */
            
            smuNode.append(companyInfo);
            dataSource.push(smuNode);
            smuNode.data("fintable",new FinDataTable($(smuNode),smu,true));
            smuNode.data("plantable",new FinPlanDataTable($(smuNode),smu,true));

        }
    }
    if (count==0) {
      $('#smu-wrapper').append("<div class='msg'>" + jal_str['NoSMU'] + "</div>");
    } else {
      $("<div class='smu_search_wrap'><input type='text' placeholder='" + jal_str["search"] + "'></div>").insertBefore("#smu-wrapper");
      listFilter($(".smu_search_wrap input"));
      $('.smu-profile').pagination({
          dataSource: dataSource,
          prevText: 'IEPRIEKŠĒJĀ',
          nextText: 'NĀKAMĀ',
          callback: function (data, pagination) {
              $('#smu-wrapper').html(data);
          }
      });
    }
    $(".docs-card").hover(function(){
      var tt = $("<div id='docTooltip'></div>");
      $(this).data("tooltip",tt);
      $(document.body).append(tt);
      $(tt).css({ top : $(this).offset().top + 50 + 'px' , left : $(this).offset().left + 'px' });
      $(tt).html($(this).attr("title")).fadeIn();
    },function(){
      $($(this).data("tooltip")).fadeOut(function(){
        $(this).remove();
      });
    });
}
function SumupTable(table,el){
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
     $(el).find("tfoot td:nth-child(3)").html(emps);
     $(el).find("tfoot td:nth-child(5)").html(mat);
     $(el).find("tfoot td:nth-child(6)").html(emps+mat);
}


(function ($) {
  jQuery.expr[':'].Contains = function(a,i,m){
      return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
  };
  
 
}(jQuery));
 
  function listFilter(input) {
 
    $(input)
      .change( function () {
        var filter = $(this).val();
        if(filter) {
          $(".smu-border:not(:Contains(" + filter + "))").slideUp();
          $(".smu-border:Contains(" + filter + ")").slideDown();
        } else {
          $(".smu-border").each(function(){
            $(this).slideDown();
          
           });
        }
        return false;
      })
    .on('keypress', function () {
        $(this).change();
    }).on('keyup', function() {
      $(this).change();
    })

  }
