/* 
 * 网站广告的js 弹窗 对联广告的加载(对联的暂时还没有部署)
 */
var index = 0;//每张图片的下标
var appshow = 0;
var appshowchannelid = {11901: 12, 11902: 13, 11903: 14};
$(function() {
    var urlList = window.location.href;
    if (/\/ys\/|\/yq\/|\/yc\/|\/noyq\//.test(urlList)) {
        /**
         * 四分站轮播图片的加载 同：Net_Guanli_WapAdvertisement::SHOW_TYPE_INDEX
         */
        appshow = 6;
    } else if (/children/.test(urlList)) {
        //判断一下是儿童文学首页的 还是儿童文学小分站的
        if (/&channelid=/.test(urlList)) {
            //三个小分站的
            var channelidArr = urlList.split("&channelid=");
            appshow = appshowchannelid[channelidArr[1]];
        } else {
            appshow = 8;
        }
    } else {
        /**
         * 总首页轮播图片的加载 同：Net_Guanli_WapAdvertisement::SHOW_TYPE_FENZHAN
         */
        appshow = 5;
    }
    $.get('../broadcastindex.php', {appshow: appshow}, function(json) {
        $("#imgchangedivstr").html(json);
    })
    var start = setInterval(autoPlay, 3000);
    $("#imgchangediv").live("mouseover", function() {
        clearInterval(start);
    })
    $("#imgchangediv").live("mouseout", function() {
        start = setInterval(autoPlay, 3000);
    })
})
//实现轮播图片的更换
function autoPlay() {
    if ($("#imgyuan").length>0) {
        var listlen = $('#imgchangediv').find("img").length-1;
        if (index>listlen) {
            index = 0;
        }
        changeImg(index++);
    }
}
//对应圆圈和图片同步
function changeImg(index) {
    var list = $('#imgchangediv').find("img");
    var listfont = $('#imgyuan').find("font");
    for (var i = 0; i<list.length; i++) {
        list[i].style.display = 'none';
        listfont[i].style.backgroundColor = 'white';
    }
    list[index].style.display = 'block';
    listfont[index].style.backgroundColor = '#69aaec';
}

