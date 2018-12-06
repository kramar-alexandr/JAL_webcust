$('.addEmp').click(function(){
    $('.addemp').show();
    $('.addEmp').hide();
});

$('.addEmpCancel').click(function(){
    $('.addemp').hide();
    $('.addEmp').show();
});

$('#confirmMainInfo').click(function(){
    postData("/WebChangeCompEmp.hal", $('#forma').serialize())
});

$('#confirmSmuInfo').click(function(){
    postData("/WebChangeProfile.hal", $('#formaTwo').serialize())
});

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
