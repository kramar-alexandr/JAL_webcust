let xhr = new XMLHttpRequest();
xhr.open('GET', `/WebGetMaterials.hal`, true);
xhr.send();
xhr.onload = function () {
    if (xhr.status !== 200) {
        console.log('[GET] STATUS ' + xhr.status + ': ' + xhr.statusText);
    } else {
        let confs = JSON.parse(xhr.responseText);
        console.log(' ', confs);
        for (let conf of confs ) {

            if (conf.nameConf === '1-9 Klassu materiali') {
                let div = document.createElement('div');
                div.setAttribute('class', 'conf');
                let hide = document.createElement('div');
                hide.setAttribute('class', 'hide-btn');
                let header = document.createElement('h3');
                header.setAttribute('class', 'confName open');
                header.textContent = conf.nameConf;
                $(header).appendTo(div);

                for ( let doc of conf.docs ) {
                    let button = document.createElement('a');
                    button.setAttribute('class', 'spbutton');
                    button.textContent = doc.nameDoc;
                    $(button).appendTo(hide);
                }
                $(hide).appendTo(div);
                $(div).appendTo('.conference-tree-box');
                $('.confName').click(function () {
                    $(this).toggleClass('open close');
                    $(this).parent().find('.hide-btn').toggleClass('show-flex');
                });
            }

            if (conf.nameConf === 'vebinari un citi materiali') {
                let div = document.createElement('div');
                div.setAttribute('class', 'conf');

                for ( let doc of conf.docs ) {
                    let button = document.createElement('a');
                    button.setAttribute('class', 'spbutton');
                    button.textContent = doc.nameDoc;
                    $(button).appendTo(div);
                }

                $(div).appendTo('.conference-four-box');
            }

            if (conf.nameConf === 'darbibai nepieciesamie dokumenti') {
                let div = document.createElement('div');
                div.setAttribute('class', 'conf');

                for ( let doc of conf.docs ) {
                    let button = document.createElement('a');
                    button.setAttribute('class', 'spbutton');
                    button.textContent = doc.nameDoc;
                    $(button).appendTo(div);
                }

                $(div).appendTo('.conf-one');
            }
        }

    }
};

$('.header-one').click(function () {
    $('.icons-set').toggleClass('show-flex');
    $('.header-one').toggleClass('open close')
});
$('.header-two').click(function () {
    $('.conf-one').toggleClass('show-flex');
    $('.header-two').toggleClass('open close')
});
$('.header-three').click(function () {
    $('.conf-two').toggleClass('show-flex');
    $('.header-three').toggleClass('open close')
});
$('.header-four').click(function () {
    $('.conference-tree-box').toggleClass('show-import');
    $('.header-four').toggleClass('open close')
});
$('.header-five').click(function () {
    $('.conference-four-box').toggleClass('show-flex');
    $('.header-five').toggleClass('open close')
});

