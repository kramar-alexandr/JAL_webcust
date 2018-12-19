init(JSON.parse(pupil));

function init(pupil) {
    console.log('pupil.smu ', pupil.smu);
    let correctionSMU = new CorrectionSMU(pupil.smu);
    correctionSMU.setEvent();
    correctionSMU.showSmuInfo();
}

function CorrectionSMU (smu) {
    this.smu = smu;

    this.setEvent = function () {
        $('.addEmp').click(function(){
            $('.addemp').show();
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


        $('#confirmParentInfo').click(function(){
            postData("/WebChangeCompParent.hal", $('#formaTree').serialize());
        });

    };
    
    this.showSmuInfo = function () {
        if (this.smu != 'false') {
            $('#removeemp').show();
            $('.correction-smu-info').show();
        } else {
            $('#removeemp').hide();
            $('.correction-smu-info').hide();
        }

    };

    function postData(url, data) {
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function() {
                alert("Pieņemtas izmaiņas!");
            }
        });
    }
}
