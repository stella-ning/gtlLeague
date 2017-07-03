//首页
$(function(){
    //轮播图
    var swiper = new Swiper('#banner', {
        pagination: '#banner .pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: 2500,
        loop:true
    });
    $('.swiper-button-prev').on('click',function(e){
        e.preventDefault()
        swiper.swipePrev()
    });
    $('.swiper-button-next').on('click',function(e){
        e.preventDefault()
        swiper.swipeNext()
    });

    //产品切换

    $('#produceShow .produceTab li').on('click',function(){

        $(this).addClass('hover').siblings().removeClass('hover').children('.tabConList').hide();
        $(this).children('.tabConList').show();
    })

    //手机端导航
    $('#openNav').on('click',function(){
        $('#nav').toggle(500);
    });
    $('#nav li').on('click',function(){
        $(this).parent('#nav').hide(500);
    });
})
