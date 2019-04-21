let smuInfo = '<div id="smuCard" class="info-smu">\n' +
    '    <div class="smu-name">\n' +
    '        <a class="open-info-smu"><h2 class=\'title\'>1.Junior Achievment Latvia</h2></a>\n' +
    '            <p class="leader"></p>' +
    '            <pclass="members"></p>' +
    '    </div>\n' +
    '    <div class="documents">\n' +
    '        <p>SMU reģistrācijas statuss</p>\n' +
    '        <div class="docs">\n' +
    '            <div class="docs-card">\n' +
    '                <img class="posted" src="../img/doc-grey.png" alt="">\n' +
    '                <p>Iesūtīts dokuments</p>\n' +
    '            </div>\n' +
    '            <div class="docs-card">\n' +
    '                <img class="submitTeacher" src="../img/doc-grey.png" alt="">\n' +
    '                <p>Skolotājs apstiprinājis</p>\n' +
    '            </div>\n' +
    '            <div class="docs-card">\n' +
    '                <img class="submitJAL" src="../img/doc-grey.png" alt="">\n' +
    '                <p>JA Latvija apstiprinājis</p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <p>Aktivitāte:</p>\n' +
    '        <div class="activitate">\n' +
    '            <div class="docs-card">\n' +
    '                <img src="../img/yes.png" alt="">\n' +
    '                <p>Cits Bazārs ziema</p>\n' +
    '            </div>\n' +
    '            <div class="docs-card">\n' +
    '                <img src="../img/mail.png" alt="">\n' +
    '                <p>Cits Bazārs reģionos </p>\n' +
    '            </div>\n' +
    '            <div class="docs-card">\n' +
    '                <img src="../img/space.png" alt="">\n' +
    '                <p>Cits Bazārs pavasarī</p>\n' +
    '            </div>\n' +
    '            <div class="docs-card">\n' +
    '                <img src="../img/no.png" alt="">\n' +
    '                <p>Jauno uzņēmēju dienas</p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="smu-button">\n' +
    '        <button class="spbutton show-info-btn">ATVĒRT PIETEIKUMU</button>\n' +
    '        <button class="spbutton reg-succes">REĢ.APLIECĪBA</button>\n' +
    '    </div>\n' +
    '</div>\n' +
    '</div>';


let companyTempInfo = '<div class="company-detail">\n' +
    '    <div class="company-info">\n' +
    '        <p class="register-number">Reģistrācijas Nr:</p>\n' +
    '        <p class="education">Izglītības pakāpe: vidusskola</p>\n' +
    '        <p class="type-company">Darbības veids/nozare. Darbības veids/nozare</p>\n' +
    '        <p class="target-type">Mērkauditorija</p>\n' +
    '    </div>\n' +
    '    <div class="service-price">\n' +
    '        <div class="company-header">\n' +
    '            <h2>Preces/pakalpojuma cenas veidošanās: </h2>\n' +
    '            <p>*Vienai saražotai vienī</p>\n' +
    '        </div>\n' +
    '        <div class="table-salary">\n' +
    '            <table id="company-table">\n' +
    '                <tr>\n' +
    '                    <th colspan="2">Darba alga UZ VIENU SARAŽOTO VIENĪBU</th>\n' +
    '                    <th colspan="2">Materiāli un izejvielas</th>\n' +
    '                    <th>Pašizmaksa 1+2</th>\n' +
    '                    <th>Cena Cena 3+UZCENOJUMI</th>\n' +
    '                </tr>\n' +
    '                <tr>\n' +
    '                    <th>Darbinieks</th>\n' +
    '                    <th>Alga (eur)</th>\n' +
    '                    <th>Materiali</th>\n' +
    '                    <th>EUR</th>\n' +
    '                    <th></th>\n' +
    '                    <th></th>\n' +
    '                </tr>\n' +
    '                <tr>\n' +
    '                    <td class="memberOne">Ralfs Rogoļovs</td>\n' +
    '                    <td class="algaOne"></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                </tr>\n' +
    '                <tr>\n' +
    '                    <td class="memberTwo">Berglunds snabbköp</td>\n' +
    '                    <td class="algaOne"></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                </tr>\n' +
    '                <tr>\n' +
    '                    <td class="memberThree">Berglunds snabbköp</td>\n' +
    '                    <td class="algaOne"></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                </tr>\n' +
    '                <tr>\n' +
    '                    <td class="memberFour">Berglunds snabbköp</td>\n' +
    '                    <td class="algaOne"></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                </tr>\n' +
    '                <tr>\n' +
    '                    <td class="memberFive">Berglunds snabbköp</td>\n' +
    '                    <td class="algaOne"></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                    <td></td>\n' +
    '                </tr>\n' +
    '                <tfoot>\n' +
    '                <tr>\n' +
    '                    <td>KOPĀ:</td>\n' +
    '                    <td></td>\n' +
    '                    <td>KOPĀ:</td>\n' +
    '                    <td></td>\n' +
    '                </tr>\n' +
    '                </tfoot>\n' +
    '            </table>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <h2>SMU Dalībniek:</h2><p class="company-smu"></p>\n' +
    '    <div class="proceeds-info">\n' +
    '        <div class="company-header">\n' +
    '            <h2>Plānotie ieņēmumi no SMU darbības:</h2>\n' +
    '        </div>\n' +
    '        <table id="table-service">\n' +
    '            <tr>\n' +
    '                <th></th>\n' +
    '                <th>Pašizmaksa EUR par vienību</th>\n' +
    '                <th>Produkta cena EUR par vienību</th>\n' +
    '                <th>Plānotās  pārdotās  vienības skaits</th>\n' +
    '                <th>Ražosanas  izmaksas (1x3) EUR</th>\n' +
    '                <th>Ienākumi  no plānotā (2x3) EUR</th>\n' +
    '                <th>Peļņa (5-4) EUR</th>\n' +
    '            </tr>\n' +
    '            <tr>\n' +
    '                <td class="">Reģionālais pasākums “Cits bazārs”</td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '            </tr>\n' +
    '            <tr>\n' +
    '                <td class="">Valsts līmeņa pasākums “Cits bazārs” ziema</td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '            </tr>\n' +
    '            <tr>\n' +
    '                <td class="memberTree">Valsts līmeņa pasākums “Cits bazārs” pavasaris</td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '            </tr>\n' +
    '            <tr>\n' +
    '                <td class="">Latvijas jauno uzņēmēju dienas</td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '            </tr>\n' +
    '            <tr>\n' +
    '                <td class="">Cita pasākumi, tirgošanās vietas</td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '            </tr>\n' +
    '            <tfoot>\n' +
    '            <tr>\n' +
    '                <td>KOPĀ:</td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '                <td></td>\n' +
    '            </tr>\n' +
    '            </tfoot>\n' +
    '        </table>\n' +
    '    </div>\n' +
    '    <div class="button-tab">\n' +
    '        <button id="confirmBtn" class="spbutton">APSTIPRINĀT</button>\n' +
    '        <button id="rejectBtn" class="spbutton">NORAIDĪT</button>\n' +
    '        <button class="spbutton">DRUKĀT PIETEIKUMU</button>\n' +
    '    </div>\n' +
    '</div>';

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
            smuNode.find('.show-info-btn').click(function () {
                if ($(this).html()==jal_str["CloseApplication"]){
                  $(this).html(jal_str["OpenApplication"]);                
                } else {
                  $(this).html(jal_str["CloseApplication"]);
                }
                $(this).parent().parent().parent().find('.company-detail').toggleClass('show');
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
            if (+smu.klass > 9) {
                companyInfo.find('.education').append('vidusskola');
            } else {
                companyInfo.find('.education').append('pamatskola');
            }

            companyInfo.find('.type-company').append(smu.companyType);
            companyInfo.find('.target-type').append(smu.targetAudit);
            companyInfo.find('#confirmBtn').click(function () {
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
            });

            companyInfo.find('#rejectBtn').click(function () {
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
            var t = new FinDataTable($(smuNode),smu,true);
            var t = new FinPlanDataTable($(smuNode),smu,true);

        }

    }

    $('.smu-profile').pagination({
        dataSource: dataSource,
        prevText: 'IEPRIEKŠĒJĀ',
        nextText: 'NĀKAMĀ',
        callback: function (data, pagination) {
            $('#smu-wrapper').html(data);
        }
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
