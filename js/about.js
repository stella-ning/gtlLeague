$(function(){
    // tab切换
    var index;
    $('#tabBtn ul li').on('click',function(){
        index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('#tabCon .tabConList').eq(index).show().siblings().hide();
    });
})
