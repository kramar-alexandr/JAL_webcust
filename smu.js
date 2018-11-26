let smuData = {
    title: 'Junior Achievement Latvija',
    leader: 'Jānis Krievāns',
    members: 'Inga Bolmane, Linda Volāne, Jānis Bukšs',
    submittedDocs: {
        posted: false,
        submitTeacher: true,
        submitJAL: false
    }
};

let arrayOfSMU = [];

for (let i = 0; i < 100; i++) {
    arrayOfSMU.push(smuData);
}

for (let smu of arrayOfSMU) {
    console.log('smu ', smu);

    let smuNode = $('#smuCard').clone();WebShowEntry

    if (smuNode) {
        console.log('no0000000000 ', );
        smuNode.find('.title').text(smu.title);
        smuNode.find('.leader').text(smu.leader);
        smuNode.find('.members').text(smu.members);

        if (smu.submittedDocs.posted) {
            smuNode.find('.posted').attr('src','../img/docs.png')
        } else if (smu.submittedDocs.submitTeacher) {
            smuNode.find('.submitTeacher, .posted').attr('src','../img/docs.png');
        } else {
            smuNode.find('.submitTeacher, .posted, .submitJAL').attr('src','../img/docs.png')
        }

        smuNode.appendTo( '.smu-profile' );
        console.log('1 ', );
    }

}


