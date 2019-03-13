let xhr = new XMLHttpRequest();
xhr.open('GET', `/WebGetAllConf.hal`, true);
xhr.send();
xhr.onload = function () {
    if (xhr.status !== 200) {
        console.log('[GET] STATUS ' + xhr.status + ': ' + xhr.statusText);
    } else {
        let confs = JSON.parse(xhr.responseText.replace(/\r?\n/g, ""))[0];
        console.log('confs ', confs);
        for (let doc of confs.docs ) {
            if(doc.nameConf == '1.-9. klašu materiāli') {
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

    button.setAttribute('class', 'spbutton conf-btn');
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
        $(this).parent().find('.conf-btn').toggleClass('show-flex');
        $(this).parent().find('.sub-conf').toggleClass('show-flex');

    });

    $('.sub-conf').find('h3').click(function () {
        $(this).parent().find('.conf-btn').toggleClass('show-flex');
    });

    if (subDiv) {
        div.setAttribute('class', 'sub-conf');
        $(div).appendTo(subDiv);
    }

    return div;
}
