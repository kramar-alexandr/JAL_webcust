if (pupil) {
    init(JSON.parse(pupil));
}

function init(pupil) {
    let pupilController = new PupilVerifiedController(pupil);
    pupilController.setPupilInfo();
}

function PupilVerifiedController(pupil) {
    this.pupil = pupil;

    this.setPupilInfo = function () {
        this.setMainInfo(this.pupil);
        if (!this.pupil.hightSchool) {
            this.checkVerified(this.pupil);
        } else {
            this.checkVerifiedHighSchool(this.pupil);
        }
    };

    this.setMainInfo = function () {
        if (this.pupil.verified.teacher==2){
          $(".smu_profile_info").css("display","block");
        }
        $('.full-name-val').text(`${this.pupil.fullName}`);
        $('.school-val').text(`${this.pupil.school}`);
        $('.email-val').text(`${this.pupil.email}`);
        $('.teacher-val').text(`${this.pupil.teacher}`);
        $('#student_name_approve-val').html(this.pupil.fullName);
        let tstr = this.pupil.school;
        if (tstr.substr(-5)=="skola"){
          tstr+="s";
        }
        $('#student_school_approve-val').html(tstr);

        if (this.pupil.parent) {
            $('.pupil-parent').show();
            $('.parent-full-name-val').text(this.pupil.parent.fullName);
            $('.parent-email-val').text(this.pupil.parent.email);
        }

        if (pupil.smu) {
            $('.pupil-smu-name-val').text(` ${this.pupil.smu}`);
        } else {
            $('.pupil-smu-name-val').text('Nav reģistrēts');
        }
    };

    this.checkVerified = function() {
        $(".main-tab li:nth-child(4)").css("display","none");
        if (this.pupil.forceupdate=="1"){
          window.location.href = "/atjauno-informaciju";
        }
        if (!this.pupil.verified.personal) {
            $('.tabs').hide();
            $('.confirmation').find('.confirmation-info-pupil').text(`Turpinot reģistrāciju, es, ${this.pupil.fullName}, ${this.pupil.school} skolēns, apliecinu:`);
            $('.confirmation').css('display', 'flex');
            this.setEventConfirmButton();
        } else if (!this.pupil.verified.parents && !this.pupil.verified.teacher) {
            $('.tabs').hide();
            $('.status').show();
            $('.status-header').text('Gaidām Tava profila apstiprinājumu no vecāka/aizbildņa un skolotāja.');
        } else if (!this.pupil.verified.parents) {
            $('.tabs').hide();
            $('.status').show();
            $('.status-header').text('Gaidām Tava profila apstiprinājumu no vecāka/aizbildņa.');
            $('.status-info').text('Skolotājs profilu ir apstiprinājis');
        } else if (this.pupil.verified.teacher==0) {
            $('.tabs').hide();
            $('.status').show();
            $('.status-header').text('Gaidām Tava profila apstiprinājumu no skolotāja.');
            $('.status-info').text('Vecāks / aizbildnis profilu ir apstiprinājis');
        } else if (this.pupil.verified.teacher==2) {
            $('.tabs').hide();
            $('.status').show();
            $('.pupil-smu').hide();
        } else if (!pupil.smu) {
            $('.tabs').show();
            $('.status').show();
            $('.status-header').text('Apsveicam!');
            $('.status-info').text('Tavs skolēna profils ir reģistrēts!');
            if (pupil.ApprovalStatus=="3" || pupil.ApprovalStatus=="5"){
              $(".main-tab li:nth-child(4)").css("display","block");
            }          
            $('.sec_section').show();
            if (pupil.employerrequests.length>0) {
              $('.new_smu_section,.teacher_request_section').hide();
              $(".smu_request_name").html(pupil.employerrequests[0].smuname);
              $(".approve_smurequest").click(function(){
                $.get("/WebSetEmpApplication.hal?stat=1",function(){$('.sec_section').hide()});              
              });
              $(".decline_smurequest").click(function(){
                $.get("/WebSetEmpApplication.hal?stat=2",function(){$('.sec_section').hide()});
              });
            } else {
              $('.employer_section,.teacher_request_section').hide();
            }
        } else {
            $('.status-header').text('');
            $('.status-info').text('');
            $('.status').hide();
            if (pupil.ApprovalStatus=="3" || pupil.ApprovalStatus=="5"){
              $(".main-tab li:nth-child(4)").css("display","block");
            }          
            
            if (pupil.sentforapproval=="1"){
              
            }
        }
    };

    this.checkVerifiedHighSchool = function() {
        $(".main-tab li:nth-child(4)").css("display","none");
        if (this.pupil.forceupdate=="1"){
          window.location.href = "/atjauno-informaciju";
        }
        if (!this.pupil.verified.personal) {
            $('.tabs').hide();
            $('.confirmation').css('display', 'flex');
            this.setEventConfirmButton();
        } else if (this.pupil.verified.teacher==0) {
            $('.tabs').hide();
            $('.status').show();
            $('.status-header').text('Gaidām Tava profila apstiprinājumu no skolotāja.');
        } else if (this.pupil.verified.teacher==2) {
            $('.tabs').hide();
            $('.status').show();
            $('.pupil-smu').hide();
        } else if (!pupil.smu) {
            $('.tabs').show();
            $('.status-header').text('Apsveicam!');
            $('.status-info').text('Tavs skolēna profils ir reģistrēts!');
            $('.status').show();
            $('.sec_section').show();
            if (pupil.employerrequests.length>0) {
              $('.new_smu_section,.teacher_request_section').hide();
              $(".smu_request_name").html(pupil.employerrequests[0].smuname);
              $(".approve_smurequest").click(function(){
                $.get("/WebSetEmpApplication.hal?stat=1",function(){$('.sec_section').hide()});              
              });
              $(".decline_smurequest").click(function(){
                $.get("/WebSetEmpApplication.hal?stat=2",function(){$('.sec_section').hide()});
              });
            } else {
              $('.employer_section,.teacher_request_section').hide();
            }
        } else {
            if (pupil.ApprovalStatus=="3" || pupil.ApprovalStatus=="5"){
              $(".main-tab li:nth-child(4)").css("display","block");
            }
        }
    };

    this.setEventConfirmButton = function() {
        let self = this;

        $('.confirnBtn').click(function () {

            let xhr = new XMLHttpRequest();
            xhr.onload = function(){
                if (xhr.status !== 200) {
                    console.log( '[GET] STATUS ' + xhr.status + ': ' + xhr.statusText );
                } else {
                    console.log( 'RESPONSE: ' + xhr.responseText );
                    self.pupil.verified.personal = true;

                    if (!self.pupil.hightSchool) {
                        self.checkVerified(self.pupil);
                    } else {
                        self.checkVerifiedHighSchool(self.pupil);
                    }
                    $('.confirmation').hide();
                    $('.status').show();
                }
            };

            xhr.open('GET',`/WebJALConfirmPupilRegistration.hal`,true);
            xhr.send();
        });
    };
}
