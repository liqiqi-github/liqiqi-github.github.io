/**
 * ���js�Ƿ���سɹ�
 * ͨ���ж�js�еķ���
 */
$(function() {
    var message = __check_js_function();
    $("#checkJs").html(message);

})
function __check_js_function() {
    var message = '';
    try {
        if (typeof (eval(showTime))=="function") {
        }

    } catch (e) {
        message += "        main.120724.js  load fail;�뽫���������ȫ����Խ��������β���ȡ����";
    }
    try {
        if (typeof (eval(show_login))=="function") {
        }

    } catch (e) {
        message += "        jjlogin.js load fail;�뽫���������ȫ����Խ��������β���ȡ����";
    }
    var url = window.location.href;
    var str = /onebook|onebook_vip/;
    var loginStr = /login\.php/;
    if (str.test(url)&&!loginStr.test(url)) {
        try {
            if (typeof (eval(reply_submit))=="function") {
            }

        } catch (e) {
            message += "      onebook.120711.js load fail;�뽫���������ȫ����Խ��������β���ȡ����";
        }
    }
    return message;
}




