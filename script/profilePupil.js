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
        $('.full-name').text(`Vārds, Uzvārds: ${this.pupil.fullName}`);
        $('.school').text(`Skola: ${this.pupil.school}`);
        $('.email').text(`E-pasts: ${this.pupil.email}`);
        $('.teacher').text(`Izvēlētais skolotājs, SMU konsultants: ${this.pupil.teacher}`);

        if (this.pupil.parent) {
            $('.pupil-parent').show();
            $('.parent-full-name').text(`Vārds, Uzvārds: ${this.pupil.parent.fullName}`);
            $('.parent-email').text(`E-pasts: ${this.pupil.parent.email}`);
        }

        if (pupil.smu) {
            $('.pupil-smu-name').text(`Skolēnu mācību uzņēmums: ${this.pupil.smu}`);
        } else {
            $('.pupil-smu-name').text('Skolēnu mācību uzņēmums: Nav reģistrēts');
        }
    };

    this.checkVerified = function() {
        if (!this.pupil.verified.personal) {
            $('.tabs').hide();
            $('.confirmation').css('display', 'flex');
            this.setEventConfirmButton();
        } else if (!this.pupil.verified.parents && !this.pupil.verified.teacher) {
            $('.tabs').hide();
            $('.status').show();
            $('.status-header').text('Gaidām Tava profila apstiprinājumu no vecāka/aizbildņa un skolotāja.');
        } else if (!this.pupil.verified.parents) {
            $('.status-header').text('Gaidām Tava profila apstiprinājumu no vecāka/aizbildņa.');
            $('.tabs').hide();
            $('.status-info').text('Skolotājs profilu ir apstiprinājis');
            $('.status').show();
        } else if (!this.pupil.verified.teacher) {
            $('.tabs').hide();
            $('.status-header').text('Gaidām Tava profila apstiprinājumu no skolotāja.');
            $('.status-info').text('Vecāks / aizbildnis profilu ir apstiprinājis');
            $('.status').show();
        } else if (!pupil.smu) {
            $('.tabs').show();
            $('.status-header').text('Apsveicam!');
            $('.status-info').text('Tavs skolēna profils ir reģistrēts!');
            $('.status').show();
        } else {
            $('.status-header').text('');
            $('.status-info').text('');
            $('.status').hide();
        }
    };

    this.checkVerifiedHighSchool = function() {
        if (!this.pupil.verified.personal) {
            $('.tabs').hide();
            $('.confirmation').css('display', 'flex');
            this.setEventConfirmButton();
        } else if (!this.pupil.verified.teacher) {
            $('.tabs').hide();
            $('.status').show();
            $('.status-header').text('Gaidām Tava profila apstiprinājumu no skolotāja.');
        } else if (!pupil.smu) {
            $('.tabs').show();
            $('.status-header').text('Apsveicam!');
            $('.status-info').text('Tavs skolēna profils ir reģistrēts!');
            $('.status').show();
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
