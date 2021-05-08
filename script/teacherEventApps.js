
$.get("/WebgetTeacherInfo.hal",function(data){
  let teacherInfo = JSON.parse(data);
  
  let num = 1;
  let table = $('#event_app').DataTable({
      data: teacherInfo.regional_applications,
      searching: false,
      info: false,
      orderable: false,
      bLengthChange: false,
      order: [[ 8, "asc" ]],
      oLanguage: {
        oPaginate: {
          sPrevious: jal_str["prev"],
          sNext: jal_str["next"],
        },
        sEmptyTable: jal_str["zeroRecords"],
        sSearch: jal_str["search"]
      },
      columns: [
        {data: 'name', width: '35%',},
        {
            data: 'datums',
            ordering: true
        },
        {
            data: 'status',
            render: (data) => {
                if (data === 1) {
                    return "Apstiprināts";

                } else if (data === 2) {
                    return "Noraidīts";
                }
                return "Jauns";
            }
        },
        {
          data: 'applink',
          render: (data) => {
            return "<a id='labotBtn' class='labot-btn' href='" + data + "' target='_blank'>Pieteikums</a>";
          }
        },
        {
          data: 'shoplink',
          render: (data) => {
              return "<a id='labotBtn' class='labot-btn' href='" + data + "' target='_blank'>Veikals</a>";
          }
        },
        {
          data: 'status',
          render: (data,type,row) => {
              if (data==0) {
                return "<a id='labotBtn' class='labot-btn' onclick='SetApplicationStatus(\"" + row.serNr + "\",1)'>" + jal_str["Approve"] + "</a>";
              } else {
                return "";
              }
          }
        },
        {
          data: 'status',
          render: (data,type,row) => {
            if (data==0) {
              return "<a id='labotBtn' class='labot-btn' onclick='SetApplicationStatus(\"" + row.serNr + "\",2)'>" + jal_str["Decline"] + "</a>";
            } else {
              return "";
            }
          }
        },
        {
          data: 'serNr',
          visible: false,
        },
        {
          data: 'status',
          visible: false,
        }

      ]
  });

});

function SetApplicationStatus(app,stat) {
  $.get("/WebJALChangeEventEntryStat2.hal?sernr=" + app + "&status=" + stat,function(){
    location.reload();
  });
}