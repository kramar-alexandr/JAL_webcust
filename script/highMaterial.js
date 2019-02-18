let xhr = new XMLHttpRequest();
xhr.open('GET', `/WebGetAllConf.hal`, true);
xhr.send();
xhr.onload = function () {
    if (xhr.status !== 200) {
        console.log('[GET] STATUS ' + xhr.status + ': ' + xhr.statusText);
    } else {
        let confs = JSON.parse(xhr.responseText.replace(/\r?\n/g, ""))[0];

        for (let doc of confs.docs ) {
            console.log('doc ', doc.nameConf);
            if(doc.nameConf === '1-9 klašu materiāli') {
                createConf(doc);
            }
        }
    }
};

function createConf(conf) {
    for (let doc of conf.docs) {
        if (doc.nameConf) {
            let mainContainer = createConfContainer(doc);

            if (doc.docs[0]) {
                for ( let docum of doc.docs ) {
                    if (docum.nameConf) {
                        let subDiv = createConfContainer(docum, mainContainer);

                        if(docum.docs) {
                            createBtnContainer(docum, subDiv);
                        }
                    } else if (docum.nameDoc){
                        // iterate btn
                        createBtnContainer(docum, mainContainer);
                    }
                }
            }

            $(mainContainer).appendTo('.profile');
        } else {
            let mainContainer = createConfContainer(doc);
            if (doc.nameDoc) {
                createBtnContainer(doc, mainContainer);
            }

            $(mainContainer).appendTo('.profile');
        }
    }
}

function createBtnContainer(docum, div) {
    let container = document.createElement('div');
    container.setAttribute('class', 'conf-btn-box');

    if (docum.docs) {
        for (let btn of docum.docs) {
            let button = createBtn(btn);

            $(button).appendTo(container);
        }

        $(container).appendTo(div);
    } else {
        let button = createBtn(docum);
        $(button).appendTo(div);
    }
}

function createBtn(btn) {
    let button = document.createElement('a');

    button.setAttribute('class', 'spbutton');
    button.textContent = btn.nameDoc;

    if (btn.serNr) {
        $(button).click(function(){
            $(button).attr("href", `/WebDownloadDocs.hal?code=${btn.serNr}`);
            $(button).attr("download");
        })
    }
    if (btn.link) {
        $(button).attr("href", btn.link);
        $(button).attr("target", "_blank");
    }

    return button;
}

function createConfContainer(doc, subDiv) {
    let div = document.createElement('div');
    let header = document.createElement('h3');

    div.setAttribute('class', 'conf conf-border');
    header.setAttribute('class', 'open');
    header.textContent = doc.nameConf;
    $(header).appendTo(div);

    $(header).click(function () {
        $(this).toggleClass('open close');
        $(this).find('.sub-conf').toggleClass('show-flex');
    });

    if (subDiv) {
        div.setAttribute('class', 'sub-conf');
        $(div).appendTo(subDiv);
    }
    // console.log('createConfContainer ', div);

    return div;
}

// $('.header-one').click(function () {
//     $('.icons-set').toggleClass('show-flex');
//     $('.header-one').toggleClass('open close')
// });
// $('.header-two').click(function () {
//     $('.conf-one').toggleClass('show-flex');
//     $('.header-two').toggleClass('open close')
// });
// $('.header-three').click(function () {
//     $('.conf-two').toggleClass('show-flex');
//     $('.header-three').toggleClass('open close')
// });
// $('.header-four').click(function () {
//     $('.conference-tree-box').toggleClass('show-import');
//     $('.header-four').toggleClass('open close')
// });
// $('.header-five').click(function () {
//     $('.icons-set').toggleClass('show-flex');
//     $('.header-five').toggleClass('open close')
// });
// $('.header-six').click(function () {
//     $('.conf-one').toggleClass('show-flex');
//     $('.header-six').toggleClass('open close')
// });
// $('.header-seven').click(function () {
//     $('.conf-two').toggleClass('show-import');
//     $('.header-seven').toggleClass('open close')
// });
// $('.header-eight').click(function () {
//     $('.conference-tree-box').toggleClass('show-import');
//     $('.header-eight').toggleClass('open close')
// });
// $('.header-nine').click(function () {
//     $('.conference-tree-box').toggleClass('show-import');
//     $('.header-nine').toggleClass('open close')
// });
// $('.header-ten').click(function () {
//     $('.conference-tree-box').toggleClass('show-import');
//     $('.header-ten').toggleClass('open close')
// });
// $('.confName').click(function () {
//     $(this).toggleClass('open close')
//     $(this).parent().find('.hide-btn').toggleClass('show-flex');
// });



