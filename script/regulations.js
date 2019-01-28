let xhr = new XMLHttpRequest();
xhr.open('GET', `/WebGetNolicune.hal`, true);
xhr.send();

xhr.onload = function () {
    if (xhr.status !== 200) {
        console.log('[GET] STATUS ' + xhr.status + ': ' + xhr.statusText);
    } else {
        let confs = JSON.parse(xhr.responseText);
        for (let conf of confs ) {
            if (conf.nameConf === 'Iznemejbardiba') {
                createConference(conf, 'left');
            } else {
                createConference(conf, 'right');
            }
        }
    }
};

function createConference(conf, container) {
    let div = document.createElement('div');
    div.setAttribute('class', 'conf');
    let header = document.createElement('h3');
    header.textContent = conf.nameConf;
    $(header).appendTo(div);


    for ( let doc of conf.docs ) {
        let button = document.createElement('a');
        button.setAttribute('class', 'spbutton');
        button.textContent = doc.nameDoc;
        if (doc.serNr) {
            $(button).click(function(){
                $(button).attr("href", `/WebDownloadDocs.hal?code=${doc.serNr}`);
                $(button).attr("download");
                // downloadFile(doc.serNr);
            })
        }
        if (doc.link) {
            $(button).attr("href", doc.link);
            $(button).attr("target", "_blank");
        }
        $(button).appendTo(div);
    }

    $(div).appendTo(`.${container}`);
}
