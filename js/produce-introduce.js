$(function(){
    // tab切换
    var index,
        $dessertBth = $('#dessert-loadMore'),
        $breadBth = $('#bread-loadMore'),
        $cakeBth = $('#cake-loadMore'),
        $desserTab = $('#dessert'),
        $breadTab = $('#bread'),
        $cakeTab = $('#cake'),
        typeval = $('#type').val();
    $('#tabBtn ul li').on('click',function(){
        index = $(this).index();
        $type = this.id;
        $(this).addClass('active').siblings().removeClass('active');
        $('#tabCon .tabConList').eq(index).show().siblings().hide();
    });
    //console.log($breadTab.attr('id'));
    //加载更多
    $dessertBth.on('click',function(){
        typeval = $desserTab.attr('id');
        $.getJSON('../data/dessert.json',typeval,function(data){
            //$this.attr('disabled','true');
            console.log(data);
            // $.each(data,function(i,value){
            //     $('.newsList').append(
            //         '<li class="clearfix"><div class="newsImg fl"><img src="'+data[i].src+'" alt=""></div><div class="newsCon fr"><article><div class="art-title"><a href="'+data[i].href+'">'+data[i].title+'</a></div><time>活动时间 ：'+data[i].title+'</time><div class="short-state">'+data[i].state+'</div><div class="look-more"><a href="'+data[i].href+'">点击进入&gt;</a></div></article></div></li>'
            //     );
            // });
        });
    });
})
