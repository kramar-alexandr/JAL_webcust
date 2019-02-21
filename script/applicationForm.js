let emps = getData(`/WebGetEmployers.hal?code=${JSON.parse(pupil).smuCode}`);

console.log('emps ', emps);

function getData(url) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();

    if (xhr.status != 200) {
        console.log( '[GET] STATUS ' + xhr.status + ': ' + xhr.statusText );
    } else {
        return JSON.parse(xhr.responseText);
    }
}

// let emps = [{"code": "37103962", "name": "KristiДЃns PotaЕЎovs"}, {"code":"37102995","name":"Sindija KubliЕ†a"}];

console.log('emps ', emps);

let applicationData = JSON.parse(localStorage.getItem('applicationData'));
let applicationForm = applicationData ? new Questionnaire(applicationData, emps) : new Questionnaire(false, emps);
applicationForm.showAdditionalBox();

function Questionnaire(applicationData, emps) {
    this.employeeTemplate = '<div class="emp">\n' +
        '    <span class="empName"></span>\n' +
        '    <div class="btn-group">\n' +
        '        <button class="dark-grey yes"></button>\n' +
        '        <button class="dark-grey no"></button>\n' +
        '    </div>\n' +
        '</div>';
    this.questionnaireTemplate = '<div class="main-additional">\n' +
        '    <div class="additional-box smu-border">\n' +
        '        <button class="btn-cancel spbutton light-grey light-grey">Atpakal</button>\n' +
        '        <p class="additionla-p"></p>\n' +
        '    </div>\n' +
        '\n' +
        '    <div class="smu-box smu-border">\n' +
        '    <h2>Pieteikums SMU pasākumam</h2>' +
        '<div class="info-box">\n' +
        '    <div class="tech-info-main">\n' +
        '        <p class="school"></p>\n' +
        '        <p class="smu-nosakum"></p>\n' +
        '        <p class="product-info"></p>\n' +
        '        <p class="product-type"></p>\n' +
        '        <p class="social-link"></p>\n' +
        '        <p class="teacher"></p>\n' +
        '    </div>\n' +
        '    <p class="info-addit">* Informācija ģenerējas no SMU iesūtītā Biznesa idejas pieteikuma, ' +
        '   šo iespējams mainīt SMU profilā.</p>\n' +
        '</div>\n' +
        '    </div>\n' +
        '    <div class="employee-box smu-border">\n' +
        '        <h2>Pieteikums SMU pasākumam</h2>\n' +
        '        <p>SMU dalībnieki:</p>\n' +
        '    <div class="info-box">\n' +
        '    <div class="dalibnieki">\n' +
        '    </div>\n' +
        '    <p class="info-addit small-addit">* Tikai SMU pasākumam pieteiktie dalībnieki varēs pārstāvēt Tavu SMU pasākuma dienā.</p>\n' +
        '    </div>\n' +
        '       <div>\n' +
        '           <div data-title="JA Latvia izvērtēs iesūtītos foto, izvērtējot SMU dalībai pasākumā. Tikai no pasākuma ' +
        'dalībniekiem tiks izvērtēti tie, kas piedalīsies soc. tīklu konkursā. Soc. tīklu finālistu bildes tiks publicētas JA ' +
        'Latvia facebook kontā." class="info-apllication">i' +
        // '               <img src="img/information.png">' +
        '       </div>\n' +
        '           <p class="border qustOne">Vai ar šo bildi esi gatavs piedalīties Sociālo tīklu konkursā?</p>\n' +
        '        </div>\n' +
        '        <div class="social-question">\n' +
        '            <button class="spbutton light-grey buttonYes" type="button">Jā</button>\n' +
        '            <button type="button" class="spbutton light-grey buttonNo">Nē</button>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '\n' +
        '    <div class="materil-box smu-border">\n' +
        '        <h2>SMU motivācija dalībai pasākumā</h2>\n' +
        '        <p class="border qustTwo">Plānotie mārketinga materiāli:</p>\n' +
        '    <div class="info-box">\n' +
        '      <div class="materil-btn">\n' +
        '        <button class="spbutton light-grey btnOne" type="button">a. Bukleti</button>\n' +
        '        <button class="spbutton light-grey btnTwo" type="button">b. Vizītkartes</button>\n' +
        '        <button class="spbutton light-grey btnThree" type="button">c. Aktivitātes stenda tuvumā</button>\n' +
        '        <button class="spbutton light-grey btnFour" type="button">d. Baneris</button>\n' +
        '    </div>\n' +
        '    <p class="info-addit small-addit">* Jautājums ar izvēles variantiem – jāizvēlas 1 vai vairāki no atbilžu variantiem</p>\n' +
        '    </div>\n' +
        '    </div>\n' +
        '    <div class="stand-box smu-border">\n' +
        '        <p class="qustThree">Lūdzu norādiet, kas būs nepieciešams Jūsu SMU stenda vietā:</p>\n' +
        '    <div class="info-box">\n' +
        '    <div class="stand-btn">\n' +
        '        <button class="spbutton light-grey standBtnOne" type="button">a. Izmantosim JA Latvija piedāvāto stenda galdu;</button>\n' +
        '        <button class="spbutton light-grey standBtnTwo" type="button">b. Izmantosim JA Latvija piedāvāto 1 krēslu;</button>\n' +
        '               <div data-title="Ja vedīsiet savu stendu, tad ir obligāti jāaugšupielādē stenda foto ar izmēriem, ' +
        '           jo JA Latvia stenda elementi' +
        '           ir jāsaskaņo ar Domina Shopping administrāciju." class="info-apllication">i' +
        '       </div>\n' +
        '        <button class="spbutton light-grey standBtnThree" type="button">c. Vedīsim savu stendu 1x1m lielumā.</button>\n' +
        '    </div>\n' +
        '    <p class="info-addit small-addit">* Jautājums ar izvēles variantiem – jāizvēlas 1 vai vairāki no atbilžu variantiem</p>\n' +
        '    </div>\n' +
        '        <p>Stendos nav pieejama elektrība, lūdzu meklēt alternatīvas. Ja elektrība \n' +
        '        ir nepieciešama produktam, lūdzu norādīt iemeslu:</p>\n' +
        '        <div> <span>Atbilde:</span><input class="standInput" type="text"></div>\n' +
        '    </div>\n' +
        '    <div class="confirm-box smu-border">\n' +
        '        <p class="qustFour">Vai kāds SMU dalībnieks piedalīsies "Business Pitch"? (1 dalībnieks no SMU)</p>\n' +
        '        <div>\n' +
        '        <button class="spbutton light-grey standBtnYes" type="button">Jā</button>\n' +
        '        <button class="spbutton light-grey standBtnNo" type="button">Nē</button>\n' +
        '        </div>\n' +
        '        <p>SMU pirms dalības pasākumā nepieciešams iepazīties \n' +
        '           ar CITS BAZĀRS dalības noteikumiem!</p>\n' +
        '    <div class="confrm border">\n' +
        '        <span class="empName">Ar šo apliecinu, ka SMU komanda ir iepazinusies ar\n' +
        'CITS BAZĀRS dalības noteikumiem un apņemas tos ievērot!</span>\n' +
        '        <div class="btn-group">\n' +
        '        <button class="dark-grey yes standBtnVerifYes" type="button"></button>\n' +
        '        <button class="dark-grey no standBtnVerifNo" type="button"></button>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    </div>\n' +
        '<button class="spbutton confirmBtm" type="button">iesniegt</button>\n' +
        '</div>';
    this.applicationData = JSON.parse(localStorage.getItem(getEventCodeUrl())) || {
        employee: emps,
        socialNetworkCompetition: {
            yes: false,
            no: false
        },
        marketingMaterials: {
            booklet: false,
            businessCards: false,
            activitiesStand: false,
            banner: false
        },
        partTwo: false,
        stand: {
            a: false,
            b: false,
            c: false
        },
        electReason: false,
        businessPitch: {
            yes: false,
            no: false
        },
        terms: {
            yes: false,
            no: false
        }
    };


    this.showAdditionalBox = function () {
        let additionalMainBox = getTemplate(this.questionnaireTemplate);
        additionalMainBox.appendTo('.addit-main-box');

        if (this.applicationData.employee) {
            appendEmployee(this.applicationData.employee, this.employeeTemplate);
        }

        setPupilInfo();

        initialData(this.applicationData);

        if (this.applicationData.partTwo) {
            showPartTwo();
        } else {
            showPartOne();
        }

        setEvents(this.applicationData);
    };

    function initialData(data) {
        if (data.socialNetworkCompetition.yes) $('.buttonYes').addClass('green');
        if (data.socialNetworkCompetition.no) $('.buttonNo').addClass('green');
        if (data.marketingMaterials.booklet) $('.btnOne').addClass('green');
        if (data.marketingMaterials.businessCards) $('.btnTwo').addClass('green');
        if (data.marketingMaterials.activitiesStand) $('.btnThree').addClass('green');
        if (data.marketingMaterials.banner) $('.btnFour').addClass('green');
        if (data.stand.a) {
            $('.standBtnOne').addClass('green');
            $('.standBtnThree').addClass('nohover');
        }
        if (data.stand.b) {
            $('.standBtnTwo').addClass('green');
            $('.standBtnThree').addClass('nohover');
        }
        if (data.stand.c) {
            $('.standBtnThree').addClass('green');
            $('.standBtnOne').addClass('nohover');
            $('.standBtnTwo').addClass('nohover');
        }
        if (data.electReason) $('.standInput').val(data.electReason);
        if (data.businessPitch.yes) $('.standBtnYes').addClass('green');
        if (data.businessPitch.no) $('.standBtnNo').addClass('green');
        if (data.terms.yes) $('.standBtnVerifYes').addClass('green');
        if (data.terms.no) $('.standBtnVerifNo').addClass('green');
    }

    function setPupilInfo() {
        let info = JSON.parse(pupil);

        $('.school').text(`Izglītības iestāde: ${info.school}`);
        $('.smu-nosakum').text(`SMU nosaukums: ${info.smu}`);
        $('.product-info').text(`Produkta apraksts: ${info.prodInfo}`);
        $('.product-type').text(`Produkta nozare: ${info.prodType}`);
        $('.social-link').text(`SMU sociālie tīkli: ${info.social}`);
        $('.teacher').text(`SMU skolotājs/konsultants: ${info.teacher}`);
    }

    function createTemplate(temp) {
        // let template = document.createElement('div');
        // template.innerHTML = temp.trim();
        return temp;
    }

    function getTemplate(temp) {
        return $(createTemplate(temp)).clone();
    }

    function appendEmployee(emps, temp) {
        if (!emps.length) {
            let employeeBox = getTemplate(temp);
            employeeBox.find('.btn-group').remove();
            employeeBox.find('.empName').text('Nav darbinieku');
            employeeBox.appendTo('.dalibnieki');
        }
        for (let emp of emps) {
            let employeeBox = getTemplate(temp);

            employeeBox.find('.empName').text(emp.name);

            if (emp.status) {
                employeeBox.find('.yes').addClass('green');
            } else {
                employeeBox.find('.no').addClass('red');
            }

            employeeBox.appendTo('.dalibnieki');
        }
    }

    function setEventsEmployee(applicationData) {
        let emps = $('.dalibnieki .emp');

        for (let i = 0; i < emps.length; i++) {
            $(emps[i]).find('.yes').click(function () {
                $(this).toggleClass('green');

                if ($(emps[i]).find('.no').hasClass('red')) {
                    $(emps[i]).find('.no').toggleClass('red');
                    applicationData.employee[i].status = true;
                } else {
                    applicationData.employee[i].status = true;
                }

            });
            $(emps[i]).find('.no').click(function () {
                $(this).toggleClass('red');

                if ($(emps[i]).find('.yes').hasClass('green')) {
                    $(emps[i]).find('.yes').toggleClass('green');
                    applicationData.employee[i].status = false;
                } else {
                    applicationData.employee[i].status = false;
                }
            })
        }
    }

    function showPartOne() {
        $('.stand-box').hide();
        $('.confirm-box').hide();
        $('.employee-box').show();
        $('.materil-box').show();
        $('.confirmBtm').removeClass('finalBtn');
        $('.btn-cancel').removeClass('backPartOne').click(function () {
            document.location = '/events';
        });
        $('.additionla-p').text('Lūdzam rūpīgi iepazīties ar paskaidrojošo informāciju un aizpildīt anketu uzmanīgi, pārbaudot, vai norādītie dati ir pareizi. Ja kaut kas nav saprotams, tad lūdzam konsultēties ar savu skolotāju/konsultantu!\n' +
            ' UZMANĪBU! Nekorekti aizpildīti lauki var būt par iemeslu atteikumam vai laicīgai informācijas nesaņemšanai! Dalībnieku skaits "CITS BAZĀRS" - minimums 2 dalībnieki, maksimums 5 dalībnieki vienā SMU! \n ' +
            'Pasākums tiek īstenots LIAA projekta "Inovācijas motivācijas programma" ietvaros, ko līdzfinansē Eiropas Reģionālās attīstības fonds un Eiropas Savienība.');
    }

    function showPartTwo() {
        $('.stand-box').show();
        $('.confirm-box').show();
        $('.employee-box').hide();
        $('.materil-box').hide();
        $('.confirmBtm').addClass('finalBtn');
        $('.btn-cancel').addClass('backPartOne');
        $('.additionla-p').text('Stenda izmēri: 1,02m augstumā, 53,5 dziļumā un 1,03m platumā. Stendi būs novietoti atsevišķi viens no otra.\n' +
            'Aicinām sava SMU vides reklāmu izvietot stenda priekšpusē. Stenda noformēšanai Nedrīkst izmantot materiālus, kas bojā stendu! SMU komandai ir OBLIGĀTI jāiepazīstas ar pasākuma noteikumiem un tie jāievēro visa pasākuma laikā!');
    }

    function setEventsSocialNetworkCompetition(applicationData) {
        $('.social-question .buttonYes').click(function () {
            if ($('.social-question .buttonNo').hasClass('green')) {
                $('.social-question .buttonNo').toggleClass('green');
                applicationData.socialNetworkCompetition.no = !applicationData.socialNetworkCompetition.no;
            }
            $('.social-question .buttonYes').toggleClass('green');
            applicationData.socialNetworkCompetition.yes = !applicationData.socialNetworkCompetition.yes;

        });
        $('.social-question .buttonNo').click(function () {
            if ($('.social-question .buttonYes').hasClass('green')) {
                $('.social-question .buttonYes').toggleClass('green');
                applicationData.socialNetworkCompetition.yes = !applicationData.socialNetworkCompetition.yes;
            }
            $('.social-question .buttonNo').toggleClass('green');
            applicationData.socialNetworkCompetition.no = !applicationData.socialNetworkCompetition.no;
        })
    }

    function setEventsMotivation(applicationData) {
        $('.btnOne').click(function () {
            $('.btnOne').toggleClass('green ');
            applicationData.marketingMaterials.booklet = !!$('.btnOne').hasClass('green');
        });
        $('.btnTwo').click(function () {
            $('.btnTwo').toggleClass('green ');
            applicationData.marketingMaterials.businessCards = !!$('.btnTwo').hasClass('green');
        });
        $('.btnThree').click(function () {
            $('.btnThree').toggleClass('green ');
            applicationData.marketingMaterials.activitiesStand = !!$('.btnThree').hasClass('green');

        });
        $('.btnFour').click(function () {
            $('.btnFour').toggleClass('green ');
            applicationData.marketingMaterials.banner = !!$('.btnFour').hasClass('green');
        });
    }

    function setEventsConfirmBtm(applicationData) {
        $('.btn-cancel').addClass('backPartOne').click(function () {
            if ($('.btn-cancel').hasClass('backPartOne')) {
                showPartOne();
            }
        });

        if (!$('.btn-cancel').hasClass('backPartOne')) {
            $('.btn-cancel').click(function () {

            })
        }

        $('.confirmBtm').click(function () {
            if ($('.confirmBtm').hasClass('finalBtn')) {
                if (checkFieldsPartTwo(applicationData)) {
                    applicationData.electReason = $('.standInput').val();
                    localStorage.setItem(getEventCodeUrl(), JSON.stringify(applicationData));

                    $.ajax({
                        type: "POST",
                        url: `WebCreateEventsAnswer.hal?code=${getEventCodeUrl()}`,
                        data: localStorage.getItem(getEventCodeUrl()),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                            if (confirm("Izveidota pieteikuma veidlapa")) {
                                localStorage.removeItem(getEventCodeUrl());
                                document.location = '/events';
                            }

                        },
                        failure: function (err) {
                            console.log(err);
                        }
                    });

                    return;
                }
            }

            if (checkFieldsPartOne(applicationData)) {
                if (!applicationData.partTwo) applicationData.partTwo = true;
                localStorage.setItem(getEventCodeUrl(), JSON.stringify(applicationData));
                showPartTwo();
            }

        });
    }

    function checkFieldsPartOne(applicationData) {
        let result = true;
        if (!applicationData.socialNetworkCompetition.yes && !applicationData.socialNetworkCompetition.no) {
            $('.qustOne').addClass('notChecked');
            result = false;
        } else {
            $('.qustOne').removeClass('notChecked');
        }

        if (!applicationData.marketingMaterials.booklet && !applicationData.marketingMaterials.businessCards &&
            !applicationData.marketingMaterials.activitiesStand && !applicationData.marketingMaterials.banner) {
            $('.qustTwo').addClass('notChecked');
            result = false;
        } else {
            $('.qustTwo').removeClass('notChecked');
        }

        return result;
    }

    function checkFieldsPartTwo(applicationData) {
        let result = true;
        if (!applicationData.stand.a && !applicationData.stand.b && !applicationData.stand.c) {
            $('.qustThree').addClass('notChecked');
            result = false;
        } else {
            $('.qustThree').removeClass('notChecked');
        }

        if (!applicationData.businessPitch.yes && !applicationData.businessPitch.no) {
            $('.qustFour').addClass('notChecked');
            result = false;
        } else {
            $('.qustFour').removeClass('notChecked');
        }

        if (!applicationData.terms.yes && !applicationData.terms.no) {
            $('.confrm').addClass('notChecked');
            result = false;
        } else {
            $('.confrm').removeClass('notChecked');
        }

        return result;
    }

    function setEventsStandBox(applicationData) {
        $('.standBtnOne').click(function () {
            $('.standBtnOne').toggleClass('green ');
            $('.standBtnThree').toggleClass('nohover');
            applicationData.stand.a = !applicationData.stand.a;
        });
        $('.standBtnTwo').click(function () {
            $('.standBtnTwo').toggleClass('green ');
            $('.standBtnThree').toggleClass('nohover');
            applicationData.stand.b = !applicationData.stand.b;
        });
        $('.standBtnThree').click(function () {
            $('.standBtnThree').toggleClass('green ');
            $('.standBtnOne').toggleClass('nohover');
            $('.standBtnTwo').toggleClass('nohover');
            applicationData.stand.c = !applicationData.stand.c;
        });
    }

    function setEventsConfirmBox(applicationData) {
        $('.standBtnYes').click(function () {
            if ($('.standBtnNo').hasClass('green')) {
                $('.standBtnNo').toggleClass('green');
                applicationData.businessPitch.no = !applicationData.businessPitch.no;
            }
            $('.standBtnYes').toggleClass('green');
            applicationData.businessPitch.yes = !applicationData.businessPitch.yes;
        });

        $('.standBtnNo').click(function () {
            if ($('.standBtnYes').hasClass('green')) {
                $('.standBtnYes').toggleClass('green');
                applicationData.businessPitch.yes = !applicationData.businessPitch.yes;
            }
            $('.standBtnNo').toggleClass('green');
            applicationData.businessPitch.no = !applicationData.businessPitch.no;
        });

        $('.standBtnVerifYes').click(function () {
            if ($('.standBtnVerifNo').hasClass('red')) {
                $('.standBtnVerifNo').toggleClass('red');
                applicationData.terms.no = !applicationData.terms.no;
            }
            $('.standBtnVerifYes').toggleClass('green');
            applicationData.terms.yes = !applicationData.terms.yes;
        });

        $('.standBtnVerifNo').click(function () {
            if ($('.standBtnVerifYes').hasClass('green')) {
                $('.standBtnVerifYes').toggleClass('green');
                applicationData.terms.yes = !applicationData.terms.yes;
            }
            $('.standBtnVerifNo').toggleClass('red');
            applicationData.terms.no = !applicationData.terms.no;
        });
    }

    function getEventCodeUrl() {
        let tmp = [];
        let tmp2 = [];
        let code = null;

        let get = location.search;

        if (get != '') {
            tmp = (get.substr(1)).split('&');

            for (let i = 0; i < tmp.length; i++) {
                tmp2 = tmp[i].split('=');
                code = tmp2[1];

                return code;
            }
        }
    }

    function setEvents(applicationData) {
        setEventsEmployee(applicationData);
        setEventsSocialNetworkCompetition(applicationData);
        setEventsMotivation(applicationData);
        setEventsConfirmBtm(applicationData);
        setEventsStandBox(applicationData);
        setEventsConfirmBox(applicationData);
    }
}
