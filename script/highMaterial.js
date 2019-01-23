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
    $('.icons-set').toggleClass('show-flex');
    $('.header-five').toggleClass('open close')
});
$('.header-six').click(function () {
    $('.conf-one').toggleClass('show-flex');
    $('.header-six').toggleClass('open close')
});
$('.header-seven').click(function () {
    $('.conf-two').toggleClass('show-import');
    $('.header-seven').toggleClass('open close')
});
$('.header-eight').click(function () {
    $('.conference-tree-box').toggleClass('show-import');
    $('.header-eight').toggleClass('open close')
});
$('.header-nine').click(function () {
    $('.conference-tree-box').toggleClass('show-import');
    $('.header-nine').toggleClass('open close')
});
$('.header-ten').click(function () {
    $('.conference-tree-box').toggleClass('show-import');
    $('.header-ten').toggleClass('open close')
});
$('.confName').click(function () {
    $(this).toggleClass('open close')
    $(this).parent().find('.hide-btn').toggleClass('show-flex');
});



