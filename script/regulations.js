// let confs = [{
//     nameConf: 'Citi',
//     docs: [
//         {nameDoc: 'TIEŠSAISTES BIZNESA SIMULĀCIJAS SPĒLES TITAN NOLIKUMS', serNr:''},
//     ]},
//     {
//         nameConf: 'finansu pratiba',
//         docs: [
//             {nameDoc: 'TIEŠSAISTES BIZNESA SIMULĀCIJAS SPĒLES TITAN NOLIKUMS', serNr:''},
//             {nameDoc: 'TIEŠSAISTES BIZNESA SIMULĀCIJAS SPĒLES TITAN NOLIKUMS', serNr:''},
//         ]
//     },
//     {
//         nameConf: 'Karjera',
//         docs: [
//             {nameDoc: 'TIEŠSAISTES BIZNESA SIMULĀCIJAS SPĒLES TITAN NOLIKUMS', serNr:''},
//             {nameDoc: 'TIEŠSAISTES BIZNESA SIMULĀCIJAS SPĒLES TITAN NOLIKUMS', serNr:''},
//         ]
//     },
//     {
//         nameConf: 'Iznemejbardiba',
//         docs: [
//             {nameDoc: 'TIEŠSAISTES BIZNESA SIMULĀCIJAS SPĒLES TITAN NOLIKUMS', serNr:''},
//             {nameDoc: 'TIEŠSAISTES BIZNESA SIMULĀCIJAS SPĒLES TITAN NOLIKUMS', serNr:''},
//             {nameDoc: 'TIEŠSAISTES BIZNESA SIMULĀCIJAS SPĒLES TITAN NOLIKUMS', serNr:''},
//             {nameDoc: 'TIEŠSAISTES BIZNESA SIMULĀCIJAS SPĒLES TITAN NOLIKUMS', serNr:''},
//             {nameDoc: 'TIEŠSAISTES BIZNESA SIMULĀCIJAS SPĒLES TITAN NOLIKUMS', serNr:''},
//             {nameDoc: 'TIEŠSAISTES BIZNESA SIMULĀCIJAS SPĒLES TITAN NOLIKUMS', serNr:''},
//             {nameDoc: 'TIEŠSAISTES BIZNESA SIMULĀCIJAS SPĒLES TITAN NOLIKUMS', serNr:''},
//             {nameDoc: 'TIEŠSAISTES BIZNESA SIMULĀCIJAS SPĒLES TITAN NOLIKUMS', serNr:''},
//             {nameDoc: 'TIEŠSAISTES BIZNESA SIMULĀCIJAS SPĒLES TITAN NOLIKUMS', serNr:''}
//         ]
//     }];

let xhr = new XMLHttpRequest();
xhr.open('GET', `/WebGetNolicune.hal`, true);
xhr.send();

xhr.onload = function () {
    if (xhr.status !== 200) {
        console.log('[GET] STATUS ' + xhr.status + ': ' + xhr.statusText);
    } else {
        let confs = JSON.parse(xhr.responseText);
        for (let conf of confs ) {

            if (conf.nameConf === 'finansu pratiba') {
                let div = document.createElement('div');
                div.setAttribute('class', 'conf');
                let header = document.createElement('h3');
                header.textContent = conf.nameConf;
                $(header).appendTo(div);

                for ( let doc of conf.docs ) {
                    let button = document.createElement('a');
                    button.setAttribute('class', 'spbutton');
                    button.textContent = doc.nameDoc;
                    $(button).appendTo(div);
                }

                $(div).appendTo('.right');
            }

            if (conf.nameConf === 'Karjera') {
                let div = document.createElement('div');
                div.setAttribute('class', 'conf');
                let header = document.createElement('h3');
                header.textContent = conf.nameConf;
                $(header).appendTo(div);

                for ( let doc of conf.docs ) {
                    let button = document.createElement('a');
                    button.setAttribute('class', 'spbutton');
                    button.textContent = doc.nameDoc;
                    $(button).appendTo(div);
                }

                $(div).appendTo('.right');


            }

            if (conf.nameConf === 'Citi') {
                let div = document.createElement('div');
                div.setAttribute('class', 'conf');
                let header = document.createElement('h3');
                header.textContent = conf.nameConf;
                $(header).appendTo(div);

                for ( let doc of conf.docs ) {
                    console.log('doc ', doc);
                    let button = document.createElement('a');
                    button.setAttribute('class', 'spbutton');
                    button.textContent = doc.nameDoc;
                    $(button).appendTo(div);
                }

                $(div).appendTo('.right');
            }

            if (conf.nameConf === 'Iznemejbardiba') {
                let div = document.createElement('div');
                div.setAttribute('class', 'conf');
                let header = document.createElement('h3');
                header.textContent = conf.nameConf;
                $(header).appendTo(div);

                for ( let doc of conf.docs ) {
                    let button = document.createElement('a');
                    button.setAttribute('class', 'spbutton');
                    button.textContent = doc.nameDoc;
                    $(button).appendTo(div);
                }

                $(div).appendTo('.left');
            }
        }

    }
};

