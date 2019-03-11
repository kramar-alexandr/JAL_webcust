init(JSON.parse(pupil));

function init(pupil) {
    let correctionSMU = new CorrectionSMU(pupil.smu,pupil);
    correctionSMU.setEvent();
    correctionSMU.showSmuInfo(pupil.director);
}

function CorrectionSMU (smu,pupil) {
    this.smu = smu;
    this.pupil = pupil;

    this.setEvent = function () {
        $('.addEmp').click(function(){//nice naming of classes :)
            $('.addemp').css('display', 'flex');
            $('.addEmp').hide();
        });

        $('.addEmpCancel').click(function(){
            $('.addemp').hide();
            $('.addEmp').show();
        });

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
}
