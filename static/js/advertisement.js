/* 
 * ��վ����js ���� �������ļ���(��������ʱ��û�в���)
 */
var index = 0;//ÿ��ͼƬ���±�
var appshow = 0;
var appshowchannelid = {11901: 12, 11902: 13, 11903: 14};
$(function() {
    var urlList = window.location.href;
    if (/\/ys\/|\/yq\/|\/yc\/|\/noyq\//.test(urlList)) {
        /**
         * �ķ�վ�ֲ�ͼƬ�ļ��� ͬ��Net_Guanli_WapAdvertisement::SHOW_TYPE_INDEX
         */
        appshow = 6;
    } else if (/children/.test(urlList)) {
        //�ж�һ���Ƕ�ͯ��ѧ��ҳ�� ���Ƕ�ͯ��ѧС��վ��
        if (/&channelid=/.test(urlList)) {
            //����С��վ��
            var channelidArr = urlList.split("&channelid=");
            appshow = appshowchannelid[channelidArr[1]];
        } else {
            appshow = 8;
        }
    } else {
        /**
         * ����ҳ�ֲ�ͼƬ�ļ��� ͬ��Net_Guanli_WapAdvertisement::SHOW_TYPE_FENZHAN
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
//ʵ���ֲ�ͼƬ�ĸ���
function autoPlay() {
    if ($("#imgyuan").length>0) {
        var listlen = $('#imgchangediv').find("img").length-1;
        if (index>listlen) {
            index = 0;
        }
        changeImg(index++);
    }
}
//��ӦԲȦ��ͼƬͬ��
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

