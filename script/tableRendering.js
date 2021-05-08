function openInNewTab2(url) {
    var a = document.createElement("a");
    a.target = "blank";
    a.href = url;
    //a.src = url;
    $(a).css("display","none");
    document.body.appendChild(a);
    //a.click();
    //document.body.removeChild(a);
    a.dispatchEvent((function(e){
      e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
                    false, false, false, false, 0, null);
      return e;
    }(document.createEvent('MouseEvents'))));
}

function GetCertStat(student){
  let certstat = 0;
  if (student.Klase2=="12" && student.Titan=="1" && student.Enudiena=="1" && student.ApprovalStatus=="5") {
    certstat = 2;
  }
  if (student.CertFlag=="1" && student.ApprovalStatus=="5"){
    certstat = 1;
  }
  return certstat;
}

function sortPieteikumi( a, b ) {
  if ( a.Skolens < b.Skolens ){
    return -1;
  }
  if ( a.Skolens > b.Skolens ){
    return 1;
  }
  return 0;
}

if (text) {
    $('.main-table-container').show();
    let techerInfo = JSON.parse(text);

    // initializate Skolēnu pieteikumi table table
    let smus = techerInfo.SMU.filter((i) => {
        if (i.Statuss !== '1') {
            i.rectype = 0;
            i.rectypename = jal_str["SMU"];
            i.Skolens2 = i.Skolens + " (" + i.Nosaukums + ")";
            return i;
        }
    });
    
    let students = techerInfo.Students.filter((i) => {
        if (i.Statuss !== '1') {
            i.rectype = 1;
            i.rectypename = jal_str["Student"];
            i.Skolens2 = i.Skolens;
            return i;
        }
    });
    let events = techerInfo.Events.filter((i) => {
        if (i.Statuss !== '1') {
            i.rectype = 2;
            i.rectypename = jal_str["Event"];
            i.Skolens2 = i.Skolens + " (" + i.EventName + ")";
            return i;
        }
    });
    let rej_students = techerInfo.RejectedStudents.filter((i) => {
        if (i.Statuss === '2') {
            i.rectype = 1;
            i.rectypename = jal_str["Student"];
            i.Skolens2 = i.Skolens;
            return i;
        }
    });
    let rej_events = techerInfo.RejectedEvents.filter((i) => {
        if (i.Statuss === '2') {
            i.rectype = 2;
            i.rectypename = jal_str["Event"];
            i.Skolens2 = i.Skolens + " (" + i.EventName + ")";
            return i;
        }
    });
    let tableData = smus.concat(students,events,rej_students,rej_events);

    for (let i = 0; i < tableData.length; i++) {
        let count = 1;
        tableData[i].Number = +count + i;
    }
    var num = 1;
  
    //tableData.sort(sortPieteikumi);
    let table = $('#table_id').DataTable({
        data: tableData,
        searching: true,
        dom: '<"top"B>t<"bottom"p><"clear">',
        buttons: [
            {
                text: 'KLASSE',
                attr: {
                    id: 'klasseSrt'
                },
                action: function () {
                    $('#table_id #klasse').click();
                    $('#datumsSrt').removeClass('sorting-asc sorting-desc');

                    if ($('#klasseSrt').hasClass('sorting-asc')) {
                        $('#klasseSrt').toggleClass('sorting-asc sorting-desc');
                    } else if ($('#klasseSrt').hasClass('sorting-desc')) {
                        $('#klasseSrt').toggleClass('sorting-asc sorting-desc');
                    } else {
                        $('#klasseSrt').toggleClass('sorting-asc');
                    }
                }
            },
            {
                text: 'DATUMS',
                attr: {
                    id: 'datumsSrt'
                },
                action: function () {
                    $('#table_id #datums').click();
                    $('#klasseSrt').removeClass('sorting-asc sorting-desc');

                    if ($('#datumsSrt').hasClass('sorting-asc')) {
                        $('#datumsSrt').toggleClass('sorting-asc sorting-desc');
                    } else if ($('#datumsSrt').hasClass('sorting-desc')) {
                        $('#datumsSrt').toggleClass('sorting-asc sorting-desc');
                    } else {
                        $('#datumsSrt').toggleClass('sorting-asc');
                    }
                }
            },
            {extend: 'excel', text: 'Exel'},
            {
                extend: 'pdf', text: '.PDF', exportOptions: {
                    modifier: {
                        page: 'current'
                    }
                }
            }
        ],
        bLengthChange: false,
        oLanguage: {
            oPaginate: {
                sPrevious: jal_str["prev"],
                sNext: jal_str["next"],
            },
            sEmptyTable: jal_str["zeroRecords"],
            sSearch: jal_str["search"]
        },
        columnDefs: [{
            orderable: false,
            targets: "no-sort"
        },
        {
        		'targets': [0,1,2,3,4],
        		'createdCell':  function (td, cellData, rowData, row, col) {
           			$(td).attr('cname', $('#table_id').find("thead th:nth-child(" + (col+1) + ")").html()); 
           	  }
        }        
        ],
        columns: [
            {data: 'Number',
             render: (data) => {
                return num++;
              
              }
            },
            {data: 'rectypename'},
            {data: 'Skolens2', width: '60%',},
            {
                data: 'Klase',
                ordering: true
            },
            {
                data: 'Datums',
                ordering: true
            },
            {
                data: 'Statuss',
                render: (data) => {
                    if (data === '0') {
                        return "<p class='status-btn apstiprinatBtn'>" + jal_str["Approve"] + "</p>" +
                            "<p class='status-btn noraditBtn'>" + jal_str["Decline"] + "</p>";

                    } else if (data === '1') {
                        return "<p class='status-btn astiprinat-yes'></p>" +
                            "<p class='status-btn'>" + jal_str["Decline"] + "</p>";

                    } else if (data === '2') {
                        return "<p class='status-btn apstiprinatBtn'>" + jal_str["Approve"] + "</p>" +
                            "<p class='status-btn noradit-no'></p>";
                    } else if (data === '4') {
                        return "<p class='status-btn astiprinat-yes'></p>" +
                            "<p class='status-btn'>" + jal_str["Decline"] + "</p>";
                    }
                },
                className: "column-btn column-btn-st"
            }
            ,
            {
                data: 'Labot',
                visible: false,
                render: () => {
                    return "<a id='labotBtn' class='labot-btn'>" + jal_str["Edit"] + "</a>";
                },
                className: "column-btn labotBtn"
            }

        ]
    });    

    //$('<div class="table-search"><input type="text" placeholder="' + jal_str["Search"] + '" /></div>').insertBefore('#table_id');
    let apstiprinatie = [];

    for (let i of techerInfo.ApprovedStudents) {
        if (i.Izglitiba!="1" && i.Statuss === '1') {
            apstiprinatie.push(i);
        }
     }

    apstiprinatie.sort(sortPieteikumi);
    for (let i = 0; i < apstiprinatie.length; i++) {
        let count = 1;
        apstiprinatie[i].Number = count + i;
        let certstat = GetCertStat(apstiprinatie[i]);
        apstiprinatie[i].CertStatus = certstat;
    }
    let pamatskola = [];

    for (let i of techerInfo.ApprovedStudents) {
        if (i.Izglitiba=="1") {
            pamatskola.push(i);
        }
    }
    for (let i = 0; i < pamatskola.length; i++) {
        let count = 1;
        pamatskola[i].Number = count + i;
    }
    
     // initializate apstiprinatie table
    var tableApstiprinatie = $('#apstiprinatie').DataTable({
        data: apstiprinatie,
        searching: true,
        info: false,
        select: false,
        order: [[ 10, "desc" ],[ 1, "asc" ],[ 3, "desc" ]],
        bLengthChange: false,
        rowsGroup: [11,1],
        columnDefs: [
         {
            "targets": [ 11 ],
            "visible": false,
            "searchable": false
        },
        {
            orderable: false,
            targets: "no-sort"
        },
        {
        		'targets': [0,1,2,3,4,5,6,7,8],
        		'createdCell':  function (td, cellData, rowData, row, col) {
        		   switch (col){
        		     case 0:
        		     case 1:
        		     case 2:
        		     case 3:
        		     case 4:
           		 	  $(td).attr('cname', $('#apstiprinatie').find("thead tr:nth-child(1) th:nth-child(" + (col+1) + ")").html()); 
        		       break;
        		     case 5:
        		     case 6:
           		 	$(td).attr('cname', $('#apstiprinatie').find("thead tr:nth-child(2) th:nth-child(" + (col-4) + ")").html()); 
           		 	   break;
        		     case 7:
        		     case 8:
           		 	  $(td).attr('cname', $('#apstiprinatie').find("thead tr:nth-child(1) th:nth-child(" + (col) + ")").html()); 
           		 }
           	 }
        }        
        ],
        oLanguage: {
            oPaginate: {
                sPrevious: jal_str["prev"],
                sNext: jal_str["next"],
            },
            sEmptyTable: jal_str["zeroRecords"],
            sSearchPlaceholder: jal_str["search"],
            sSearch:  ""
        },
        language: {
          zeroRecords: jal_str["zeroRecords"],
          emptyTable: jal_str["zeroRecords"],
          /*search: jal_str["search"]*/
          SearchPlaceholder: jal_str["search"],
          Search:  ""
        },
        columns: [
            {data: 'Number'},
            {data: 'Skolens'},
            {data: 'Klase'},
            {data: 'Datums'},
            {data: 'MacibuGads'},
            {data: 'Nosaukums'},
            {
                data: 'ApprovalStatus',
                render: (data, type, full) => {
                    if (data !== "5") {
                        return '<p class="noradit-no info-marker" title="' + jal_str["RemoveSMUInfo"] + '"></p>';
                    } else {
                        return '<p class="astiprinat-yes info-marker" title="' + jal_str["RemoveSMUInfo"] + '"></p>';
                    }
                }
            },
            {
                data: 'Titan',
                render: (data, type, full) => {
                  if (data !== "1") {
                      return '<p class="noradit-no" onclick="UpdateChecks(event,\'' + full.Kods + '\',this.parentNode)"></p>';
                  } else {
                      return '<p class="astiprinat-yes" onclick="UpdateChecks(event,\'' + full.Kods + '\',this.parentNode)"></p>';
                  }
                }
            },
            {
                data: 'Enudiena',
                render: (data,type,full) => {
                  if (data !== "1") {
                      return '<p class="noradit-no" onclick="UpdateChecks(event,\'' + full.Kods + '\',this.parentNode)"></p>';
                  } else {
                      return '<p class="astiprinat-yes" onclick="UpdateChecks(event,\'' + full.Kods + '\',this.parentNode)"></p>';
                  }
                }
            },

/*
            {
                data: 'Statuss',
                render: () => {
                    return "<a class='labot-btn' onclick='labotApsti(event)'>" + jal_str["Edit"] + "</a>";

                },
                className: "column-btn labotApsti"
            },
*/
            {
                data: 'CertStatus',
                render: (data,type,full) => {
                  switch (data){
                    case 0: return "<a class='labot-btn'>" + jal_str["Add"] + "</a>";                      
                    case 2: return "<a class='labot-btn active docreatecert' onclick='CreateCert(this.parentNode)'>" + jal_str["Add"] + "</a>";
                    case 1: return "<a class='labot-btn active doprintcert' onclick='PrintCert(this.parentNode)'>" + jal_str["Print"] + "</a>";
                  }

                },
                className: "column-btn pievienotBtn"
            },
            {
                data: 'CertStatus',
                visible: false,
            },

            {data: 'Kods'}


        ]
    });
   // $('<div class="table-search"><input type="text" placeholder="' + jal_str["Search"] + '" /></div>').insertBefore('#tableApstiprinatie');

    // initializate pamatskola table
    $('#pamatskola').DataTable({
        data: pamatskola,
        searching: true,
        info: false,
        select: false,
        order: [ [7, "asc"], [0, "asc"] ],
        bLengthChange: false,
        rowsGroup2: [7,1],
        columnDefs: [
        {
            orderable: false,
            targets: "no-sort"
        },
        
        {
        		'targets': [0,1,2,3,4,5,6],
        		'createdCell':  function (td, cellData, rowData, row, col) {
           			$(td).attr('cname', $('#pamatskola').find("thead th:nth-child(" + (col) + ")").html()); 
           	  }
        }  
        ],
        oLanguage: {
            oPaginate: {
                sPrevious: jal_str["prev"],
                sNext: jal_str["next"],
            },
            sEmptyTable: jal_str["zeroRecords"],
            sSearchPlaceholder: jal_str["search"],
            sSearch:  ""
        },
        language: {
          zeroRecords: jal_str["zeroRecords"],
          emptyTable: jal_str["zeroRecords"],
          SearchPlaceholder:  jal_str["search"],
          Search:  ""
        },
        columns: [
            {data: 'Number'},
            {data: 'Skolens'},
            {data: 'Klase'},
            {data: 'Datums' },
            {data: 'MacibuGads'},
            {data: 'Nosaukums'},
            {
                data: 'ApprovalStatus',
                render: (data, type, full) => {
                    if (data !== "5") {
                        return '<p class="noradit-no"></p>';
                    } else {
                        return '<p class="astiprinat-yes"></p>';
                    }
                }
            },/*,
            { data: 'Kods'
              visible: false,
            },*/
            { data: 'Kods',
              visible: false
            }

        ]
    });
    
    $(".pievienotBtn a").hover(function(){
      var tt = $("<div id='docTooltip'></div>");
      $(this).data("tooltip",tt);
      $(document.body).append(tt);
      $(tt).css({ top : $(this).offset().top + 50 + 'px' , left : $(this).offset().left + 'px' });
      $(tt).html(jal_str["CertificateToolTip"]).fadeIn();
    },function(){
      $($(this).data("tooltip")).fadeOut(function(){
        $(this).remove();
      });
    });
    
    // $( ".dt-buttons" ).prepend( "<p>Eksportēt sarakstu: </p>" );

    vidusskolaBtn.style.background = '#24bc4b';
    vidusskolaBtn.style.color = 'white';

    // set event to chanche tab in 'Apstiprinātie' table
    pamatskolaBtn.addEventListener('click', function () {
        chancheTab(pamatskola_wrapper, pamatskolaBtn, vidusskolaBtn, apstiprinatie_wrapper);
    });

    vidusskolaBtn.addEventListener('click', function () {
        chancheTab(apstiprinatie_wrapper, vidusskolaBtn, pamatskolaBtn, pamatskola_wrapper);
    });

    // main logic for chanche table in Apstiprinātie'
    function chancheTab(showWrapper, activeBtn, disActiveBtn, hideWrapper) {
        showWrapper.style.display = 'block';
        activeBtn.style.background = '#24bc4b';
        disActiveBtn.style.background = '#757575';
        hideWrapper.style.display = 'none';
    }

    // set events on button in table
    $('.dataTable').on('click', '.apstiprinatBtn', function () {
        if (confirm(jal_str["Msg_ApproveStudent"])) {
            let data = table.row(this.parentNode.parentNode.rowIndex - 1).data();
            data.Statuss = '1';
            if (data.rectype==2) {
              data.Statuss = '4';
            }            
            table.row(this.parentNode.parentNode.rowIndex - 1).data(data).draw(false);
            if (data.rectype==2) {
              getData(`/WebJALChangeEventEntryStat.hal?sernr=${data.SerNr}&status=${data.Statuss}`);
            } else {
              getData(`/WEBJALTeacherAccChangeStatus.hal?sernr=${data.SerNr}&status=${data.Statuss}`);        
            }

        }
    });

    $('.dataTable').on('click', '.noraditBtn', function () {
        if (confirm(jal_str["Msg_DeclineStudent"])) {
          let data = table.row(this.parentNode.parentNode.rowIndex - 1).data();
          data.Statuss = '2';
          table.row(this.parentNode.parentNode.rowIndex - 1).data(data).draw(false);

          if (data.rectype==2) {
            getData(`/WebJALChangeEventEntryStat.hal?sernr=${data.SerNr}&status=${data.Statuss}`);
        
          } else {
            getData(`/WEBJALTeacherAccChangeStatus.hal?sernr=${data.SerNr}&status=${data.Statuss}`);        
          }
        }
    });
/*
    $('.dataTable').on('click', '.labotBtn', function () {
        let data = table.row(this.parentNode.rowIndex - 1).data();

        data.Statuss = '1';
        table.row(this.parentNode.rowIndex - 1).data(data).draw(false);

        getData(`/WEBJALTeacherAccChangeStatus.hal?sernr=${data.SerNr}&status=${data.Statuss}`);
    });
*/
/*
    $('.dataTable').on('click', '.pievienotBtn', function () {
        let data = tableApstiprinatie.row(this.parentNode.rowIndex - 2).data();

        getData(`/WEBJALCreateNewTaskOne.hal?sernr=${data.SerNr}`);    
    });
*/

  
    let taskControl = new CountInConfirmBtn();

    $('.submitBtnAll').on('click', function () {
        openInNewTab2("/WebPrintLiqCertificate.hal?all=1");
    });

    if (techerInfo.cert_link.length>0){
      for (var j=0;j<techerInfo.cert_link.length;j++){
        var cert_link = techerInfo.cert_link[j];
        var nb = $('.submitBtnAll').first().clone();
        $(nb).insertAfter($('.submitBtnAll').last());
        $(nb).show().html(cert_link.name).click(function(){
          openInNewTab2(cert_link.link);
        });
      }
    }

    
    function PersonIDMatch(id){
      var res = false;
      
      var match1 = id.match(/^[0-9]{6}-[0-9]{5}$/);
      var match2 = id.match(/^32[0-9]{9}$/);
      
      res = (match1 || match2);
    
      return res;
    }
    
    function CreateCert(td){
      cell = tableApstiprinatie.cell( td ).index().column;
      row = tableApstiprinatie.cell( td ).index().row;
      let data = tableApstiprinatie.row(row).data();
    
      //open popup;
      
      var wrap = $("<div class='popup_wrap'></div>");
      var content = $("<div class='popup_cont'></div>");
      $(content).append("<div class='content_line'>" + data.Skolens + "</div>");
      $(content).append("<div class='content_line'>" + jal_str["PersonID"] + "<input type='text' class='personid'></div>");
      $(content).append("<div class='content_line submitline'><input type='button' class='spbutton submit' value='" + jal_str["Add"] + "'><input type='button' class='spbutton cancel' value='" + jal_str["Cancel"] + "'></div>");
      
      $(wrap).append(content);
      $(document.body).append(wrap);
      $(content).find(".submit").click(function(){
        if (PersonIDMatch($(wrap).find(".personid").val())){
          $.get("/WebCreateLiqCertificate.hal?student=" + data.Kods + "&personid=" + $(wrap).find(".personid").val(),function(){
            location.reload();
          });
        } else {
          alert(jal_str["PersonIDError"]);
        }
      });
      $(content).find(".cancel").click(function(){
        $(wrap).remove();
      });
      
    }
    function PrintCert(td){
      cell = tableApstiprinatie.cell( td ).index().column;
      row = tableApstiprinatie.cell( td ).index().row;
      let data = tableApstiprinatie.row(row).data();

      openInNewTab2("/WebPrintLiqCertificate.hal?student=" + data.Kods);
    
    }


    // function http get
    function getData(url, data) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status !== 200) {
                console.log('[GET] STATUS ' + xhr.status + ': ' + xhr.statusText);
            } else {
                console.log('RESPONSE: ' + xhr.responseText);
            }
        };

        xhr.open('GET', url, true);
        if (data) {
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }

    }
    
    function UpdateChecks(event,code,td){
    /*
      let index = event.target.parentNode.parentNode.rowIndex - 2;
      var info = tableApstiprinatie.page.info();
      index = info.page*info.length+index;
      let data = tableApstiprinatie.row(index).data();
      let cell = event.target.parentNode.cellIndex;
    */
      cell = tableApstiprinatie.cell( td ).index().column;
      row = tableApstiprinatie.cell( td ).index().row;
      let data = tableApstiprinatie.row(row).data();
      console.log(data);
      if (data.CertStatus==1){
        return;
      }
      let f = "Enudiena";
      let type = 1;
      if (cell==7) {//titan
        type = 2;
        f = "Titan";
      }
      let stat = parseInt(data[f]);
      if (stat==0){
        stat = 1;
        //event.target.parentNode.innerHTML = "<p class='astiprinat-yes' onclick='UpdateChecks(event)'></p>";
        //$(event.target.parentNode).addClass('checked');
      } else {
        stat = 0;
        //event.target.parentNode.innerHTML = "<p class='noradit-no' onclick='UpdateChecks(event)'></p>";
        //$(event.target.parentNode).addClass('checked');
      }
      data[f] = stat.toString();
      data.CertStatus = GetCertStat(data);
      tableApstiprinatie.row(row).data(data).draw(false);
      
      let link = "/WebChangeTitanStatus.hal?cu=" + data.Kods + "&stat=" + stat + "&type=" + type;
      $.get(link,function(){
      
      });
    }

    function labotApsti(event) {
        $(event.target).prop("onclick", null);

        let data = tableApstiprinatie.row(event.path[2].rowIndex - 2).data();

        if($(event.path[2].cells[10]).hasClass('checked') && $(event.path[2].cells[8]).hasClass('checked')) {
            $(event.target).off('click');

            return;
        }

        $(event.target).click(function (){
            let macibuStatus = null;
            let titanStatus = null;
            let enudienaStatus = null;

            if ($(event.path[2].cells[10]).hasClass('checked')) {
                macibuStatus = $(event.path[2].cells[10]).children().hasClass('astiprinat-yes') ? 1 : 0;
                // getData(`/${url}?sernr=${data.SerNr}&status=${macibuStatus}`);

            } else {
                event.path[2].cells[10].innerHTML = "";
            }

            if ($(event.path[2].cells[8]).hasClass('checked')) {
                titanStatus = $(event.path[2].cells[8]).children().hasClass('astiprinat-yes') ? 1 : 0;
                // getData(`/${url}?sernr=${data.SerNr}&status=${macibuStatus}`);
            } else {
                event.path[2].cells[8].innerHTML = "";
            }
            if ($(event.path[2].cells[8]).hasClass('checked')) {
                titanStatus = $(event.path[2].cells[8]).children().hasClass('astiprinat-yes') ? 1 : 0;
                // getData(`/${url}?sernr=${data.SerNr}&status=${macibuStatus}`);
            } else {
                event.path[2].cells[8].innerHTML = "";
            }

            $(event.target).text(jal_str["Edit"]);
            event.target.parentElement.style.background = 'white';
            event.target.style.color = '#d0d0d0';

            if($(event.path[2].cells[10]).hasClass('checked') && $(event.path[2].cells[8]).hasClass('checked')) {
                $(event.target).text(jal_str["Done"]);
            }

            $(event.target).click(function () {
                labotApsti(event);
            });


        });

        if (!$(event.path[2].cells[10]).hasClass('checked')) {
            $(event.target).text(jal_str["Save"]);
            event.target.parentElement.style.background = '#24bc4b';
            event.target.style.color = 'white';
            event.path[2].cells[10].innerHTML = "<p onclick='checkYes(event)' class='astiprinat-yes'></p><p onclick='checkNo(event)' class='noradit-no'></p>";
        }

        if (!$(event.path[2].cells[8]).hasClass('checked')) {
            $(event.target).text(jal_str["Save"]);
            event.target.parentElement.style.background = '#24bc4b';
            event.target.style.color = 'white';
            event.path[2].cells[8].innerHTML = "<p onclick='checkYes(event)' class='astiprinat-yes'></p><p onclick='checkNo(event)' class='noradit-no'></p>";

        }
    }

    function checkYes(event) {
        if (confirm(jal_str["Msg_ApproveStudent"])) {
            event.path[1].innerHTML = "<p class='astiprinat-yes'></p>";
            $(event.path[1]).addClass('checked');
            checkPievienot(event);
        }
    }

    function checkNo(event) {
        if (confirm(jal_str["Msg_ApproveStudent"])) {
            event.path[1].innerHTML = "<p class='noradit-no'></p>";
            $(event.path[1]).addClass('checked');
            checkPievienot(event);
        }
    }

    function checkPievienot(event) {
        if (event.path[2].cells[8].childNodes.length < 2 &&
            event.path[2].cells[10].childNodes.length < 2) {

            if ($(event.path[2].cells[6]).children().hasClass('checked') &&
                $(event.path[2].cells[8]).children().hasClass('checked') &&
                $(event.path[2].cells[10]).children().hasClass('checked')) {
                event.path[2].cells[12].childNodes[0].className = "activaite-btn";
                event.path[2].cells[12].childNodes[0].parentElement.style.background = '#24bc4b';
                event.path[2].cells[11].childNodes[0].parentElement.style.background = 'white';
                event.path[2].cells[11].childNodes[0].style.color = '#d0d0d0';

                $('.submitBtnAll').text(`IESNIEGT SERTIFIKĀTU SARAKSTU (${taskControl.getCount()})`);

                let data = tableApstiprinatie.row(event.path[2].cells[8].parentNode.rowIndex - 2).data();
                taskControl.setInArray(data.SerNr);
            } else {
                event.path[2].cells[12].childNodes[0].className = "labot-btn";
            }

        } else {
            event.path[2].cells[12].childNodes[0].className = "labot-btn";
        }
    }


    function CountInConfirmBtn() {
        this.count = 0;
        this.array = [];

        this.getCount = function () {
            return ++this.count;
        };

        this.getArray = function () {
            return this.array;
        };

        this.setInArray = function (item) {
            this.array.push({serNr: item})
        }
    }
}
