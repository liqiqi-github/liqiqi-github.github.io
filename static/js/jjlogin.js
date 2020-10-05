/**
 * 晋江登入处理js
 *  
 * 
 */
Array.prototype.indexOf = function(obj, start) {
    for (var i = (start||0), j = this.length; i<j; i++) {
        if (this[i]==obj) {
            return i;
        }
    }
    return-1;
}


function getUrlHttp() {
//    var host = window.location.protocol;
    var host = location.href;
    if (host.indexOf("https://")>=0) {
        var urlhttp = "https";
    } else {
        var urlhttp = "http";
    }
    return urlhttp;
}
function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i<len; i++) {
        c = str.charCodeAt(i);
        if ((c>=0x0001)&&(c<=0x007F)) {
            out += str.charAt(i);
        } else if (c>0x07FF) {
            out += String.fromCharCode(0xE0|((c>>12)&0x0F));
            out += String.fromCharCode(0x80|((c>>6)&0x3F));
            out += String.fromCharCode(0x80|((c>>0)&0x3F));
        } else {
            out += String.fromCharCode(0xC0|((c>>6)&0x1F));
            out += String.fromCharCode(0x80|((c>>0)&0x3F));
        }
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i<len) {
        c = str.charCodeAt(i++);
        switch (c>>4)
        {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += str.charAt(i-1);
                break;
            case 12:
            case 13:
                // 110x xxxx    10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c&0x1F)<<6)|(char2&0x3F));
                break;
            case 14:
                // 1110 xxxx   10xx xxxx   10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c&0x0F)<<12)|
                        ((char2&0x3F)<<6)|
                        ((char3&0x3F)<<0));
                break;
        }
    }

    return out;
}
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
function encode64(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i<len) {
        c1 = str.charCodeAt(i++)&0xff;
        if (i==len)
        {
            out += base64EncodeChars.charAt(c1>>2);
            out += base64EncodeChars.charAt((c1&0x3)<<4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i==len)
        {
            out += base64EncodeChars.charAt(c1>>2);
            out += base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));
            out += base64EncodeChars.charAt((c2&0xF)<<2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1>>2);
        out += base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));
        out += base64EncodeChars.charAt(((c2&0xF)<<2)|((c3&0xC0)>>6));
        out += base64EncodeChars.charAt(c3&0x3F);
    }
    return out;
}

function decode64(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i<len) {
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++)&0xff];
        } while (i<len&&c1==-1);
        if (c1==-1)
            break;
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++)&0xff];
        } while (i<len&&c2==-1);
        if (c2==-1)
            break;
        out += String.fromCharCode((c1<<2)|((c2&0x30)>>4));
        do {
            c3 = str.charCodeAt(i++)&0xff;
            if (c3==61)
                return out;
            c3 = base64DecodeChars[c3];
        } while (i<len&&c3==-1);
        if (c3==-1)
            break;
        out += String.fromCharCode(((c2&0XF)<<4)|((c3&0x3C)>>2));
        do {
            c4 = str.charCodeAt(i++)&0xff;
            if (c4==61)
                return out;
            c4 = base64DecodeChars[c4];
        } while (i<len&&c4==-1);
        if (c4==-1)
            break;
        out += String.fromCharCode(((c3&0x03)<<6)|c4);
    }
    return out;
}
//input base64 encode
function strdecode(str) {
    return utf8to16(decode64(str));
}
function getCookie(name) {
    var cookies = '';
    var dc = document.cookie;
    var prefix = name+"=";
    var begin = dc.indexOf("; "+prefix);
    if (begin==-1) {
        begin = dc.indexOf(prefix);
        if (begin!=0)
            cookies = null;
    } else {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end==-1) {
        end = dc.length;
    }
    if (cookies!=null) {
        cookies = unescape(dc.substring(begin+prefix.length, end));
    }
    if (cookies==null&&name!='token'&&name!='managertoken') {
        var tokenKey = ['readerid', 'ubuntu', 'ptid', 'email', 'authorid', 'cookietime', 'islocaluser', 'authorname', 'newwindow', 'showname', 'examineright', 'logintype', 'certification']; //xwb
        var managerKey = ['managerid', 'managertoken', 'moderatorName', 'isAdmin', 'managername', 'loginSource'];
        if (tokenKey.indexOf(name)>-1) {
            var token = getCookie('token');
            var index = tokenKey.indexOf(name);
            if (token!=null) {
                token = strdecode(token);
                token = token.split('|');
                return token[index];
            }
        } else if (managerKey.indexOf(name)>-1) {
            var token = getCookie('managertoken');
            var index = managerKey.indexOf(name);
            if (token!=null) {
                token = strdecode(token);
                token = token.split('|');
                return token[index];
            }
        }
        return null;
    }
    return cookies;
}




// COOKIE控制的几个函数
function setCookie(name, value, expires, path, domain, secure) {
    document.cookie = name+"="+escape(value)+
            ((expires) ? "; expires="+expires.toGMTString() : "")+
            ((path) ? "; path="+path : "")+
            ((domain) ? "; domain="+domain : "")+
            ((secure) ? "; secure" : "");
}

if (typeof JSON=='undefined') {
    document.write('<script src="http://static.jjwxc.net/scripts/lib/json3.min.js"><\/script>');
}
var jjCookie = {
    everkey: 'JJEVER',
    sesskey: 'JJSESS',
    cookies: {},
    get: function(key, ever, domain) {
        if (typeof ever=='undefined') {
            ever = false
        }
        var allcookies = this.getAllCookies(ever);
        if (typeof allcookies[key]=='undefined') {
            var value = getCookie(key)
            if (value!=null) {
                if (typeof domain=='undefined') {
                    domain = '';
                }
                if (value!=null) {
                    this.set(key, value, ever, domain);
                    return value;
                }
            }
        }
        return allcookies[key];
    },
    set: function(key, value, ever, domain) {
        if (typeof ever=='undefined') {
            ever = false
        }
        if (typeof domain=='undefined'||domain=='') {
            domain = window.location.hostname
            var domainArr = domain.split('.');
            domainArr = domainArr.slice(domainArr.length-2, domainArr.length)
            domain = '.'+(domainArr.join('.'))
        }
        var cookiekey = this.getCookieKey(ever);
        this.getAllCookies(ever);
        this.cookies[cookiekey][key] = value
        var cookievalue = JSON.stringify(this.cookies[cookiekey]);
        if (ever) {
            var expire = new Date();
            expire.setTime(expire.getTime()+365*86400*1000);//永久cookie设置成一年过期
        } else {
            var expire = 0;
        }
        setCookie(cookiekey, cookievalue, expire, '/', domain);
        var expire = new Date();
        expire.setTime(0)
        setCookie(key, '', expire, '/', domain);
    },
    getAllCookies: function(ever) {
        var cookiekey = this.getCookieKey(ever);
        if (typeof this.cookies[cookiekey]=='undefined') {
            var cookievalue = getCookie(cookiekey);
            if (cookievalue!=null) {
                this.cookies[cookiekey] = $.parseJSON(cookievalue);
            } else {
                this.cookies[cookiekey] = {};
            }
        }
        return  this.cookies[cookiekey];
    },
    getCookieKey: function(ever) {
        return ever ? this.everkey : this.sesskey;
    }
};


$(function() {
    $('#sdo_login').click(show_sdo_login_block);
    $('#jj_login').click(show_login);
//	$('#sdo_login2').click(show_sdo_login_block);
});
var captchabaseurl = "http://my.jjwxc.net/include/checkImage.php?random=";
//更新登入验证码
function getauthnum() {
    $('#login_auth_num img').attr('src', captchabaseurl+Math.random())
    $('#login_auth_num input').val('');
}
function showauthnum() {
    $('#login_info_remove #login_auth_num').show();
    $('#login_auth_num').show();
    $('#login_submit_tr').attr('rowspan', 3)//login.php页面，登入按钮排版适应
    if ($('#login_auth_num img').attr('src')=='') {
        getauthnum();
    }
}
//检查是否需要登入验证码
var needauth = false;
function checkneedauthnum() {
    if (needauth==true) {//如果已经被判断过需要验证码了就直接显示验证码
        showauthnum()
    } else if (jjCookie.get('login_need_authnum')) {//如果cookie有输错验证码的记录，显示验证码
        needauth = true;
        showauthnum();
    } else {
        var loginname = $.trim($('#loginname').val());
        if (loginname=='笔名/邮箱/手机号') {//如果还没填用户名就统一成空
            loginname = '';
        }
        var time = new Date();
        var urlhttp = getUrlHttp();
        $.ajax({
            'url': urlhttp+'://my.jjwxc.net/login.php?action=checkneedauthnum&r='+Math.random(),
            'data': {'username': loginname},
            'success': function(data) {
                var time = new Date();
                var datastr = ''
                $.each(data, function(k, v) {
                    datastr += ';'+k+'='+v
                })
                if (data.isneed) {
                    needauth = true;
                    showauthnum()
                }
            },
            'dataType': 'jsonp',
            'async': false
        })
    }
}
$(function() {
    $('#loginbycode').live("click", function() {
        var html = "<div align=center><iframe width=250 height=300 frameborder=0 scrolling=no src='//my.jjwxc.net/backend/login/jjreader/login.php'></iframe></div>";
        $("#codelogininput").html(html);
        $("#logininput").hide();
        $("#codelogininput").show();
        $(this).css("color", "#27a751");
        $(this).css("border-bottom", "#27a751 solid 2px");
        $("#loginbyaccount").css("color", "#90a38d");
        $("#loginbyaccount").css("border-bottom", "#90a38d solid 2px");
    })
    $('#loginbyaccount').live("click", function() {
        $("#codelogininput").hide();
        $("#logininput").show();
        $(this).css("color", "#27a751");
        $(this).css("border-bottom", "#27a751 solid 2px");
        $("#loginbycode").css("color", "#90a38d");
        $("#loginbycode").css("border-bottom", "#90a38d solid 2px");

    })
});
//统一登入界面
function show_login() {
//删除原有的页面
    $('#login_info_remove').remove();
    $('#login_info_for_jj_remove').remove();
    if ($('#mylogin').length>0) {
        $('#mylogin').val('no');
    }
    var html = '';
    //todo排版
    html += '<style>#login_info_remove *{color:#27a751; font-family: \'微软雅黑\',Arial, Helvetica, sans-serif;}#login_info_remove li{list-style:none;}#login_form_ajax{margin-left:90px; font-weight:bold;}#login_form_ajax .hint{font-family:\'宋体\';font-size:12px;color:#A7A7A7;margin-left:60px;margin-top:3px;font-weight:normal} #login_form_ajax label{display:inline-block;width:3em;text-align:right; font-size:18px; }#login_form_ajax input{border:#999 solid 1px; background:url(http://static.jjwxc.net/images/login//input_gb.jpg);vertical-align:middle;height:22px;width:150px;font-size:13px;color:black}#login_form_ajax .input_after{color:#009900;font-size:13px;}#login_form_ajax .alert{color:red}#logincaptchaimg *{display:inline-block;vertical-align:middle} </style>';
    html += '<div style="border:#668c5b 1px solid;">';
    html += '<div id="login_info_remove">';
    html += '<a onclick="$.unblockUI();return false;" style="font-size: 12px; text-decoration: none; float:right; height: 20px;color: black;width:40px;" href="#">关闭</a>';
    html += '<div style="margin-top:5px"><form id="login_form"  name="form1"><ul>';
    html += '<li style="width:175px;line-height:36px;  font-weight:bold; font-size:20px;float:left;text-align:center;margin-left:50px;border-bottom:#27a751 solid 2px;cursor:pointer" id="loginbyaccount">账号登入</li><li style="width:175px;line-height:36px;  font-weight:bold; font-size:20px;text-align:center;float:left;border-bottom:#90a38d solid 2px;color:#90a38d;cursor:pointer" id="loginbycode">扫码登入</li>';
    html += '<div id="codelogininput" style="display:none"></div>';
    html += '<div id="logininput"><li style="padding-top:60px">';
    html += '<div id="login_form_ajax">';
    html += '<p><label>账号</label> <input name="loginname" tabindex="1" type="text" id="loginname"  maxlength="50" value="笔名/邮箱/手机号" onfocus="if (this.value==\'笔名/邮箱/手机号\') {this.value=\'\';this.style.color=\'black\'};" onblur="checkneedauthnum();if(this.value==\'\'){this.value=\'笔名/邮箱/手机号\';this.style.color=\'#A7A7A7\'}" />';
    html += '&nbsp;&nbsp;<a href="https://my.jjwxc.net/register/usersecurity.php"><span class="input_after">点此注册</span></a></p>';
    html += '<p class="hint">支持笔名/邮箱/手机号登入</p>';
    html += '<p style="margin-top:10px;"><label>密码</label> <input tabindex="2" name="loginpassword" type="password" id="loginpassword"  maxlength="32" />&nbsp;&nbsp;<a href = "http://www.jjwxc.net/register/forgot.html"><span class="input_after">找回密码</span></a></p>';
    html += '<div id="login_auth_num" style="display:none"><p style="margin-top:10px;"><label>验证码</label> <input tabindex="3" name="auth_num" type="input" id="auth_num"  maxlength="32"/></p>';
    html += '<p style="margin-top:10px;"><label></label> <img src=""><span class="input_after" title="点击重新获取验证码" id="getauthnum" onclick="getauthnum()" style="padding-left:1em;">换一个</span></p><p><label></label><span class="alert"></span></p></div>';
    html += '</div></li>';
    html += '<li style="margin-left:150px; font-size:14px;">';
    html += '<input style="vertical-align:middle;" name="cookietime" type="checkbox" id="cookietime" value="1" title=\"选此将在本机保存你的登入信息，请不要在公共电脑使用\"/>保持登入一个月';
    html += '</li><li  style="width:100%; text-align:center;margin-top:20px;font-size:16px; ">';
    html += '<input type="submit" onkeydown="enter()" onclick="jj_login();return false;" value="登 入" style="height:25px;width:80px;color:initial" />';
    html += '</li></div></ul></form></div>';
    html += '<div style=" margin-left:20px;width:430px;margin-top:20px"><div style="float:left;padding-top:10px;"><hr style=" width:140px; border:#90a38d solid 1px;"></div><div style="float:left; margin-left:10px; padding-top:5px;"><span style="font-size:18px; font-weight:bold;">其他账号登入</span></div><div style="float:left; margin-left:10px; padding-top:10px;"><hr style=" width:140px; border:#90a38d solid 1px;"></div></div>';
    html += '<div class="pk" style=" margin-left:20px;width:430px;margin-top:20px"><ul>';
    html += '<li class="ott" style="float:left;list-style:none;text-align:left; margin-left:20px; margin-top:10px;">            <span style="padding-top:10px;"><a href="#" onclick="accountBinding();return false"><img src="http://static.jjwxc.net/images/login/qqlogin_new.png?ver=20190423" width="50" border="0" /></a></span>\n\
            <span style="margin-left:16px;padding-top:10px;"><a href="#" onclick="accountBinding();return false"><img src="http://static.jjwxc.net/images/login/sinaweibo_new.png?ver=20190423" width="50" border="0" /></a></span>\n\
            <span style=" margin-left:16px;padding-top:10px;"><a href="#" onclick="accountBinding();return false"><img src="http://static.jjwxc.net/images/login/weixin_new.png?ver=20190423" width="50" border="0" /></a></span><span style=" margin-left:16px;padding-top:10px;"><a href="#" onclick="accountBinding();return false"><img src="http://static.jjwxc.net/images/login/zhifubao_new.png?ver=20190423" width="50" border="0" /></a></span><span style=" margin-left:16px;padding-top:10px;"><a href="#" onclick="accountBinding();return false"><img src="http://static.jjwxc.net/images/login/cmpay_login_new.png?ver=20190423" width="50" border="0" /></a></span><span style=" margin-left:16px;padding-top:10px;"><a href="#" onclick="accountBinding();return false"><img src="http://static.jjwxc.net/images/login/login_snda_btn_new.png?ver=20190423" width="50" border="0" /></a></span></li>';

    html += '<li class="opp" onclick="login_text_info();return false;" style="list-style:none;text-align:left; margin-left:20px; margin-top:0px;font-size:16px; color:#999; float:left; width:300px; padding-top:10px;cursor:pointer; font-family: \'微软雅黑\',Arial, Helvetica, sans-serif;">不知道自己应该用哪种方式登陆？</li>';
    html += '</ul></div></div><div style="clear:both"></div></div>';
    //$('body').prepend(html);
    $.blockUI(html, {
        'width': '450px',
        'padding': '5px',
        'border': '0px',
        'cursor': 'text',
        'top': '30%',
        'left': '40%',
        'text-align': 'left',
        'background': 'white'
    });
    checkneedauthnum();
    return false;
}
//检查是否已登入
function is_login() {
    console.log('is_login jjlogin.js');
    if (getCookie('readerid')==null) {
        show_login();
        window.scroll(0, 0);
        return false;
    } else {
        return true;
    }
}

//第三方登入提示框
function accountBinding() {
//删除原有的页面
    $('#login_info_remove').remove();
    $('#login_info_for_jj_remove').remove();
    var html = '';
    html += '<div  id="login_info_remove" style="background:white;width:480px; height:340px; border:#668c5b 1px solid; font-family:\'微软雅黑,宋体\',Arial, Helvetica, sans-serif;">';
    html += '<a onclick="$.unblockUI();return false;" style="font-size: 12px; text-decoration: none; left: 460px; height: 20px; position: absolute; color: black;width:40px;" href="#">关闭</a>';
    html += '<div style="text-align:center;font-size:14px;color:green;margin-top:20px"><b>温馨提示</b><div style="margin-top:15px;text-align:left;margin-left:23px">&nbsp;&nbsp;&nbsp;&nbsp;\n\
    1.如果您已经有晋江本地账户,请先【返回本地登入】，登入本地账户以后，在【我的晋江】中的绑定账户一栏，点击所需绑定的站外账户对应图标进行绑定。<br>&nbsp;&nbsp;&nbsp;&nbsp;\n\
    2.如果您已经绑定过晋江本地账户，或者暂未拥有晋江本地账户，可直接使用第三方登入入口直接登入。<br>&nbsp;&nbsp;&nbsp;&nbsp;\n\
    3、由于微博的安全政策限制，通过微博登录的用户可能需要用手机微博进行扫码验证，请您知悉。</div>\n\
    </div><div><br><a onclick="show_login()" style="cursor:pointer;font-size:13px;margin-left:15px;"><<返回本地登入</a></div>';
    html += '<div style=" margin-left:20px;width:430px;margin-top:20px"><div style="float:left;padding-top:10px;"><hr style=" width:150px; border:#90a38d solid 1px;"></div>\n\
            <div style="float:left; margin-left:10px; padding-top:5px;"><span style="color:#27a751; font-size:18px; font-weight:bold; font-family: \'微软雅黑\',Arial, Helvetica, sans-serif;">其他账号登入\n\</span></div>\n\
            <div style="float:left; margin-left:10px; padding-top:10px;"><hr style=" width:145px; border:#90a38d solid 1px;"></div>\n\</div>';
    html += '<div class="pk" style=" margin-left:20px;width:430px;margin-top:20px"><ul>';
    html += '<li class="ott" style="float:left;list-style:none;text-align:left; margin-left:20px; margin-top:10px;">            <span style="padding-top:10px;"><a href="http://my.jjwxc.net/backend/login/tencent/login.php" target="_self"><img src="http://static.jjwxc.net/images/login/qqlogin_new.png?ver=20190423" width="50" border="0" /></a></span>\n\
            <span style="margin-left:16px;padding-top:10px;"><a href="http://my.jjwxc.net/backend/login/sinaweibo/login.php" target="_self"><img src="http://static.jjwxc.net/images/login/sinaweibo_new.png?ver=20190423" width="50" border="0" /></a></span>\n\
            <span style=" margin-left:16px;padding-top:10px;"><a href="http://my.jjwxc.net/backend/login/weixin/login.php" target="_self"><img src="http://static.jjwxc.net/images/login/weixin_new.png?ver=20190423" width="50" border="0" /></a></span><span style=" margin-left:16px;padding-top:10px;"><a href="http://my.jjwxc.net/backend/login/alipay/alipay_auth_authorize.php" target="_self"><img src="http://static.jjwxc.net/images/login/zhifubao_new.png?ver=20190423" width="50" border="0" /></a></span><span style=" margin-left:16px;padding-top:10px;"><a href="http://my.jjwxc.net/backend/login/cmpay/login.php" target="_self"><img src="http://static.jjwxc.net/images/login/cmpay_login_new.png?ver=20190423" width="50" border="0" /></a></span><span style=" margin-left:16px;padding-top:10px;"><a href="#" onclick="show_sdo_login_block();return false;" ><img src="http://static.jjwxc.net/images/login/login_snda_btn_new.png?ver=20190423" width="50" border="0" /></a></span></li>';
    html += '<li class="opp" onclick="login_text_info();return false;" style="list-style:none;text-align:left; margin-left:20px; margin-top:0px;font-size:16px; color:#999; float:left; width:300px; padding-top:10px;cursor:pointer; font-family: \'微软雅黑\',Arial, Helvetica, sans-serif;">不知道自己应该用哪种方式登陆？</li>';
    html += '</ul></div>';
    $.blockUI(html, {
        'width': '484px',
        'height': '350px',
        'padding': '5px',
        'border': '0px',
        'cursor': 'text',
        'top': '30%',
        'left': '40%',
        'text-align': 'left',
        'background': 'white'
    });
    return false;
}



//关闭登入信息页
function login_close() {
    jjCookie.set('clicktype', '');
    $.unblockUI();
    $('#login_info_remove').remove();
    $('#login_info_for_jj_remove').remove();
    $('#login_text_info').remove();
}

//键盘回车键事件
function enter() {
    if (event.keyCode==13) {
        jj_login();
    }
}
// 首页导航点击找回账号弹窗
function login_text_info() {
    login_close();
    var html = '<div id="login_text_info">';
    html += '<div class="blockUI" style="z-index: 1001; cursor: wait; border: medium none; margin: 0pt; padding: 0pt; width: 100%; height: 100%; top: 0pt; left: 0pt; position: fixed; background-color: rgb(0, 0, 0); opacity: 0.2;   filter : Alpha(opacity=30) ;"></div>';
    html += '<div style=" position: absolute; left:50%; margin : 100px 0 0 -205px; width:410px;height:260px; z-index:5001;" >';
    html += '<div style="background: #78B053; width: 400px; height :25px; padding: 0 0 0 10px; line-height:25px; color:#FFFFFF; font-size:13px;"><b style="float:left;">温馨提示</b> <a href="#" style="float:right; font-size:12px; margin: 0 10px 0 0; text-decoration: none; color:#FFFFFF;" onclick="login_close();return false;">关闭</a></div>';
    html += '<div style = "background: url(http://static.jjwxc.net/images/b.png) repeat scroll 0 0 transparent; height:328px;width:5px; float:left;"> </div>';
    html += '<div style = "background: url(http://static.jjwxc.net/images/b.png) repeat scroll 0 0 transparent; height:328px;width:5px; float:right;"> </div>';
    html += '<div style=" width:370px;  padding:20px 15px;  float:right; background:#fff; font-size:14px; color:#666666;line-height:14px;" >';
    html += '<p >不知道自己应该选择哪种登入方式？请用以下方式判断一下吧~</p></br>';
    html += '  <ol style="padding:0 25px; margin:0; font-size:12px;">';
    html += '<li style="list-style-type: decimal;">如果您是作者，必然可以使用笔名方式登入，我们也推荐您使用该方式登入。</li> </br>';
    html += '<li style="list-style-type: decimal;">如果您以前使用邮箱作为登入账号，则可能是晋江方式、盛大通行证方式、QQ或者支付宝方式等，可分别尝试一下再确定。</li></br>';
    html += '<li style="list-style-type: decimal;">如果您以前使用的是手机号作为登入账号，则可能是晋江方式或者盛大通行证方式等，可分别尝试一下再确定。</li></br>';
    html += '<li style="list-style-type: decimal;">如果您以前使用的是一串英文数字字母或符号“.”的组合，而它又非您的笔名，则是盛大通行证方式。 如：ceshi001、xiaohongmao、aa123456.pt、139xxxx8888.sdo等。</li>';
    html += '<li style="list-style-type: decimal;">其他第三方登入方式，比如QQ等，您可以到相应位置尝试。</li>';
    html += '</ol>';
    html += '<div style="height:30px ;width: 350px; float:left; margin-top: 20px; line-height:25px; font-size:14px;">';
    html += '<a href="#" style=" width: 80px;  float:right;  border: 1px solid #666666; text-decoration: none; color:#666666; text-align:center;" onclick="login_close();return false;" >确 定</a> ';
    html += '</div></div>';
    html += '<div style = "background: url(http://static.jjwxc.net/images/b.png) repeat scroll 0 0 transparent; height:10px;width:410px; float:left;"></div>';
    html += '</div></div>';
    $('body').prepend(html);
    return false;
}

//lj 找回密码弹出界面 
function getpwdtop() {
    $('#login_info_remove').remove();
    $('#login_info_for_jj_remove').remove();
    var html = '<div id="login_info_remove">';
    // html +='<div class="blockUI" style="z-index: 1001; cursor: wait; border: medium none; margin: 0pt; padding: 0pt; width: 100%; height: 100%; top: 0pt; left: 0pt; position: fixed; background-color: rgb(0, 0, 0); opacity: 0.2;  filter : Alpha(opacity=20) ;"></div>';
    //html +='<div style=" position: absolute; left:50%; margin : 100px 0 0 -205px; width:410px;height:260px; z-index:5001;" >';
    html += '<div style="background: #78B053; width: 400px; height :25px; padding: 0 0 0 10px; line-height:25px; color:#FFFFFF ; font-size:13px;"><b style="float:left;">密码找回</b> <a href="#" style="float:right; font-size:12px; margin: 0 10px 0 0; text-decoration: none; color:#FFFFFF ;" onclick="login_close();return false;" >关闭</a></div>';
    html += '<div style = "background: url(http://static.jjwxc.net/images/b.png) repeat scroll 0 0 transparent; height:280px;width:5px; float:left;"> </div>';
    html += '<div style = "background: url(http://static.jjwxc.net/images/b.png) repeat scroll 0 0 transparent; height:280px;width:5px; float:right;"> </div>';
    html += '<div style=" width:370px;height:260px;  padding:10px 15px;  float:right; background:#fff;" >';
    html += '<p style="color:#009900; margin:5px 20px 20px 20px; font-size:12px;">晋江密码找回</p>';
    html += '<ul style=" font-size:14px; text-align: center; list-style-type:none; ">';
    html += '<li style="margin:0 20px ; padding: 0 0 20px 0;border-bottom:1px dashed #E1E1E1;"> <a href="http://www.jjwxc.net/register/forgot.html" style=" text-decoration: none;  " target="_blank"><b>使用绑定邮箱或绑定手机号码方式重置密码</b></a><br /></li>';
    html += '</ul>';
    html += '<p style="color:#009900; margin: 10px 20px 10px 20px; font-size:12px;"> 外站密码找回</p>';
    html += '<ul style=" font-size:14px; text-align: center; list-style-type:none; ">';
    html += '<li style="margin:0 20px ; padding: 0 0 20px 0;border-bottom:1px dashed #E1E1E1;  "><div style="height:21px; width:210px; margin: 0 auto ;line-height:21px;  font-size:14px;  ">关联或使用外站账号的密码请到相应外站找回</div></li>';
    html += '</ul></div>';
    html += '<div style = "background: url(http://static.jjwxc.net/images/b.png) repeat scroll 0 0 transparent; height:10px;width:410px; float:left;"> </div>';
    // html +='</div></div>';
    // $('body').prepend(html);
    $.blockUI(html, {
        'width': '410px',
        'height': '260px',
        'padding': '0px',
        'border': '0px',
        'cursor': 'text',
        'top': '30%',
        'left': '45%'
    });
    return false;
}

// 登入ajax
function  jj_login() {
    var urlhttp = getUrlHttp();
    if ($("#mylogin").val()=='yes') {
        var loginname = encodeURI($('#my_loginname').val());
        var loginpasswords = $('#my_loginpassword').val();
        var loginpassword = encodeURIComponent(loginpasswords);
    } else {
        var logindev = ''; //防止ajax登入和页面上的登入框冲突
        if ($('#login_info_remove').length>0) {
            var logindev = '#login_info_remove ';
        }
        var loginname = encodeURI($(logindev+'#loginname').val());
        var loginpasswords = $(logindev+'#loginpassword').val();
        var loginpassword = encodeURIComponent(loginpasswords);
        var Ekey = $('#Ekey').val();
        var Challenge = $('#Challenge').val();
        var auth_num = $(logindev+'#auth_num').val();
    }
    checkneedauthnum();
    if (needauth&&auth_num=='') {
        showauthnum();
        $('#login_auth_num .alert').text('请输入验证码');
        return false;
    }
    if ($('#mylogin').length>0) {
        $('#mylogin').val('yes');
    }
    var randid = Math.random();
    if ($('#cookietime').attr('checked')=='checked') {
        var cookietime = $('#cookietime').val();
    } else {
        var cookietime = 0;
    }
    var client_date = new Date();
    var client_time = Math.floor(client_date.getTime()/1000);
    $('#login_info_for_jj_remove').remove();
    $.blockUI('<img src="http://static.jjwxc.net/images/loading.gif">  <strong>请稍候...</strong>');
    if (loginname==''||loginname==encodeURI('笔名/邮箱/手机号')) {
        $.blockUI('<br><div align="center" style="cursor:text;line-height:13px;"><b>请您输入账号后再登入，如果您还没有晋江账号，可以<a href="https://my.jjwxc.net/register/usersecurity.php" target="_blank"><span style="color:blue">点此注册</span></a>或使用网站现在支持的其他账号进行登入。</b><br><br><div align="center"><input type="button" id="yesbuy"  style="text-align:center" value="确 定" onClick="$.unblockUI();show_login();"/></div>', {
            height: '100px'
        });
        if (show_channel_info()=='shop') {
            $('#login_box').show();
            $('#login_auth').hide();
        }
    } else if (loginpassword=='') {
        $.blockUI('<br><div align="center" style="cursor:text;line-height:13px;"><b>请您输入密码后再登入，如果您还没有晋江账号，可以<a href="https://my.jjwxc.net/register/usersecurity.php" target="_blank"><span style="color:blue">点此注册</span></a>或使用网站现在支持的其他账号进行登入。</b><br><br><div align="center"><input type="button" id="yesbuy"  style="text-align:center" value="确 定" onClick="$.unblockUI();show_login();"/></div>', {
            height: '100px'
        });
        if (show_channel_info()=='shop') {
            $('#login_box').show();
            $('#login_auth').hide();
        }
    } else {
        var pwdObj = pwdEncryption(loginpasswords);
        $.getJSON(urlhttp+"://my.jjwxc.net/login.php?action=login&login_mode=ajax&loginname="+loginname+"&pwdtype="+pwdObj.pwdtype+"&loginpassword="+pwdObj.pwd+"&Ekey="+Ekey+"&Challenge="+Challenge+"&auth_num="+auth_num+"&cookietime="+cookietime+"&client_time="+client_time+"&jsonp=?", function(data) {
            if (data.state==1) {
                $.unblockUI();
                var loginsid = data.sid;
                var token = data.token;
                if (show_channel_info()=='shop') {
//商城登入
                    if (getCookie('issdo')=='yes') {
                        var logoutUrl = 'http://cas.sdo.com/cas/logout?url=http://www.jjwxc.cn/logout/';
                    } else {
                        var logoutUrl = 'http://www.jjwxc.cn/logout/';
                    }
                    $('#loginTd').css('height', '26px');
                    $('#login_auth').hide();
                    var now = new Date();
                    now.setTime(now.getTime()+365*86400*1000);
                    setCookie('sid', loginsid, now, '/', '.jjwxc.cn');
                    setCookie('readerid', data.readerId, now, '/', '.jjwxc.cn');
                    $('#t_user_jiong').html('<FONT color=#72A1E4>&nbsp;&nbsp;<a href="/myuser/index/action/dingdan">我的囧囧</a>&nbsp;&nbsp;<a href="'+logoutUrl+'">退出</a></font>').show();
                    $('#login_menu').html('<a href="/myuser/index/action/zancunkuan"><font color="#FF0000">我的余额</font></a>｜<a href="/myuser/index/action/dingdan"><font color="#FF0000">订单管理</font></a>｜<a href="/shoppingcar/index"><font color="#FF0000">看购物车</font></a>｜<a href="/myuser/index/action/savepass">修改密码</a>｜<a href="'+logoutUrl+'">退出登入</a>');
                    $('#userinfo').load(urlhttp+'://www.jjwxc.cn/userinfo/index/readerid/'+data.readerId+'/bookshopusername/'+data.bbsnicknameAndsign);
                    var suffix = '<div style="margin-top:10px;"><a href="/myuser/index/action/shoucang">查看购物车详情</a></div>';
                    $.getJSON("/for_index_shopping/index", {
                        "readerid": data.readerId,
                        "r": Math.random()
                    }, function(data) {
                        var str = '';
                        var html_suffix = suffix;
                        if (data.status==0) {
                            str = data.msg;
                            html_suffix = '';
                        } else if (data.status==1) {
                            var str = '';
                            var all = data.all;
                            var backgroundcolor = new Array('#D9E1F7', '#FFFFFF');
                            if (typeof all!='undefined'&&all.length>0) {
                                for (i = 0; i<all.length; i++) {
                                    var no = i+1;
                                    var divBackgroundcolor = backgroundcolor[no%2];
                                    str += '<div style="background-color:'+divBackgroundcolor+'">'+no+'.<a href="book.php?id='+all[i]['bookid']+'" target="_blank">'+all[i]['bookname']+'</a>&nbsp;<img src="/picture/images/delete.gif" style="width:13px; height:13px; cursor: pointer;"  onclick="deleteColl('+all[i]['bookid']+'); return false;" alt="点击删除" /><hr />';
                                }
                                $('#shopping_detail').html(str);
                                $('#shopping_detail').prepend('购物车中有<font color="red">'+all.length+'</font>件商品<br/><button onclick="window.location=\'\/index.php\/shoppingcar\'">修改</button>&nbsp;<button onclick="window.location=\'\/index.php\/shoppingcar\'">去结账</button><br /><br />');
                            } else {
                                $('#shopping_detail').html('<br/>购物车中有<font color="red">0</font>件商品');
                            }
                        }
                    });
                } else if (show_channel_info()=='jjqj') {
//晋江奇境游戏登入
                    var now = new Date();
                    now.setTime(now.getTime()+365*86400*1000);
                    setCookie('sid', loginsid, now, '/', '.jjqj.net');
                    setCookie('readerid', data.readerId, now, '/', '.jjqj.net');
                    setCookie('ubuntu', data.sid, now, '/', '.jjqj.net');
                    var reurl = window.location.href;
                    location.href = reurl;
                } else if (show_channel_info()=='yrt') {
                    var url = 'http://my.jjwxc.net/yrt/jump.php';
                    window.location.href = url
                } else if (show_channel_info()=='caifu') {
                    location.href = 'http://my.jjwxc.net/pay/tenpay_shortcut.php';
                    //                    window.location.href=urlCaifu
                } else if (show_channel_info()=='zfb') {
                    location.href = 'http://my.jjwxc.net/pay/yeepay_zfb.php';
                } else if (show_channel_info()=='jjgame'||show_channel_info()=='main'||show_channel_info()=='bbs') {
//主站和游戏页登入
// 添加功能:判断用户的密码是否输入弱密码;
//有弹窗提示时，这个提示不开启。
                    var clicktype = jjCookie.get('clicktype');
                    jjCookie.set('clicktype', '')
                    if (data.isBindMobile==1) {
                        var message_html = '<div style="width:16px;height:16px; position:absolute;;right: 6px;top: 6px;"><input type="image" src="http://s9-static.jjwxc.net/images/x_alt_32x32.png" value="" onclick="$.unblockUI();" style="height:16px;width:16px"></div><div style="width:340px;height:120px"><div style="margin: 0 auto"><h3><font color="red">为保护您的账号安全，请进行手机绑定</font></h3></div><div style="margin-top:20px;height:65px;text-align:center;"><p><a href="http://my.jjwxc.net/register/mobilebinding.php">【实名认证】</a><span onclick="$.unblockUI()" target="_self" style="cursor:pointer;color: #666;">【暂不实名】</span></p> </div><div style="height:33px;width:80px;margin-top:0px;margin-left:251px;"> <img alt="晋江文学城Logo" src="http://static.jjwxc.net/images/logo/logo_safe.gif"></div> </div>';
                        $.blockUI(message_html, {background: '#EEFAEE', left: '45%', width: '340px'});
                    } else if (data.notemessage) {
//修改用户信息后的提醒;优先级比  弱密码高  比 newwindow 高
                        var message_html = '<div style="width:16px;height:16px; position:absolute;;right: 6px;top: 6px;"><input type="image" src="http://s9-static.jjwxc.net/images/x_alt_32x32.png" value="" onclick="$.unblockUI();" style="height:16px;width:16px"></div><div style="width:340px;height:175px"><div style="margin: 0 auto"><h3><font color="red">晋江账号安全信息变动提醒</font></h3></div><div style="margin-top:10px;height:125px;text-align:left"><p>&nbsp;&nbsp;&nbsp;&nbsp;'+'亲爱的用户您好，系统检测到:'+data.notemessage+',请确认知晓，如有异常请尽快修改登入密码或联系客服寻求帮助。更多账号安全信息变更记录请点击【我的晋江】→<a href="http://my.jjwxc.net/backend/logininfo.php">【安全信息】</a>查看 。'+'</p> </div><div style="height:33px;width:80px;margin-top:0px;margin-left:251px;"> <img alt="晋江文学城Logo" src="http://static.jjwxc.net/images/logo/logo_safe.gif"></div> </div>';
                        $.blockUI(message_html, {background: '#EEFAEE', left: '45%', width: '340px'});
                        //12秒 消失 
                        setTimeout(function() {
                            $.unblockUI()
                        }, 12000);
                    } else if (clicktype=='weakpassword'&&getCookie('newwindow')!=1) {
                        $.blockUI('您的密码安全级别较低...<p/>&nbsp;<p/><a href="http://my.jjwxc.net/backend/userinfo.php">点我修改</a><p/>&nbsp;<p/><span onclick="$.unblockUI()" target="_self">暂不修改</span>');
                        setTimeout(function() {
                            $.unblockUI()
                        }, 4000);
                    } else {
                        $.unblockUI();
                    }
                    checkLogin();
                    //添加书签和收藏功能，相应函数在onebook.091221.js上
                    if (clicktype=='favorite_2'||clicktype=='favorite_3') {
                        $('#'+clicktype).click();
                    } else if (clicktype=='favorite_1') {
                        favorite_novel('favorite_1');
                    } else if (clicktype=='yrt'||clicktype=='yrt_jump') {
//易瑞特活动
                        if (getCookie('readerid')!='null'&&getCookie('readerid')!='') {
                            $.blockUI('<img src="http://static.jjwxc.net/images/loading.gif">  <strong>登入成功，页面跳转中,请稍候...</strong>');
                            var url = 'http://my.jjwxc.net/yrt/jump.php';
                            window.location.href = url
                        }
                    } else {
                        if (clicktype!=null&&clicktype!='') {
                            var rel = clicktype.split('|');
                            var type = rel[0];
                            var novelid = rel[1];
                            var chapterid = rel[2];
                            //vip阅读
                            if (type=='vip') {
                                var url = "http://my.jjwxc.net/onebook_vip.php?novelid="+novelid+"&chapterid="+chapterid;
                                window.location.href = url;
                            } else if (type=='pay') {
//充值页面自动跳转
                                location.href = rel[1];
                            }
                        }
                    }
                }
//站内短信弹窗提示
                if (getCookie('newwindow')==1&&!data.notemessage) {
                    $.getJSON(urlhttp+'://s8-static.jjwxc.net/getmessage.php?readerid='+data.readerId+'&action=newwindow&r='+Math.random(), function(info) {
                        newWindowSms(info);
                    });
                }
                $.getJSON(urlhttp+'://www.jjwxc.cn/passport/index?sid='+loginsid+'&token='+token+'&nicknameAndsign='+data.bbsnicknameAndsign+'&jsonp=?'); //向新商城发送sid
                $.getJSON(urlhttp+'://www.jjqj.net/index/passport?sid='+loginsid+'&jsonp=?'); //向游戏站发送cookie
                var url = window.location.href;
                var sendurl = '';
                if (url.indexOf('.jjwxc.net')>=0) {
                    sendurl = "bbs.jjwxc.net";
                } else if (url.indexOf('.jjwxc.com')>=0) {
                    sendurl = "bbs.jjwxc.com";
                }
                $.getJSON(urlhttp+'://'+sendurl+'/passport.php?bbstoken='+data.bbstoken+'&token='+token+'&bbsnicknameAndsign='+data.bbsnicknameAndsign+'&jsonp=?'); //向论坛站发送cookie
                if (show_channel_info()=='bbs') {
                    checkLogin();
                }
                if (show_channel_info()=='shop') {
                    $("#t_user_info").html('<img src="http://static.jjwxc.net/images/loading.gif">  <strong>请稍候...</strong>')
                    setTimeout(function() {
                        checkLogin();
                    }, 2000);
                }
            } else if (data.state==-1) {
                var j = 1;
                var rand = 0;
                for (i = 1; i<=4; i++) {
                    rand += parseInt(Math.random()*(6-1+1)+1)*j;
                    j *= 10
                }
                $.blockUI('<div align="center"><div style="float:right"><img src="http://static.jjwxc.net/images/close.gif" width="12" height="12" style="cursor:pointer" onClick="$.unblockUI()"/></div><b>您的账号绑定了盛大密宝，请输入密宝密码再提交</b><br><br>密宝密码 <input name="Ekey_login" class="input" id="Ekey_login" size="10" maxlength="8" />&nbsp;<input name="Challenge_login" type="hidden" id="Challenge_login" value=\"'+rand+'\" /> 挑战码'+rand+'<br><br><span id="Ekey_message" style="color: red"></span><br><br><input type="button" value="登 入" onClick="snda_pwder()"/>&nbsp;&nbsp;&nbsp;</div>', {
                    width: '330px',
                    height: '130px',
                    cursor: 'default'
                });
            } else if (data.state==10) {
                var imgSrc = captchabaseurl+randid;
                var html = '<div align="center"  id="login_info_remove" ><div style="float:right"><img src="http://static.jjwxc.net/images/close.gif" width="12" height="12" style="cursor:pointer" onClick="$.unblockUI()"/></div><b>请正确输入验证码再登入</b><input type="hidden" name="loginname" id="loginname" value="'+data.loginname+'"><input type="hidden" name="loginpassword" id="loginpassword" value="'+data.loginpassword+'"><div id="login_auth_num" style="margin:10px">验证码 <input name="auth_num" class="input" id="auth_num" size="10" maxlength="8" />  <img src=\"'+imgSrc+'\"><span class="input_after" title="点击重新获取验证码" id="getauthnum" onclick="getauthnum()" style="padding-left:1em;">换一个</span></div><input type="button" value="登 入" onClick="jj_login()"/></div>'
                $.blockUI(html, {
                    width: '330px',
                    height: '130px',
                    cursor: 'default'
                });
            } else if (data.state==-2) {
                $.blockUI('<div style="line-height:13px"><div style="height:0px;position:absolute;left:346px;top:12px"><img src="http://static.jjwxc.net/images/close.gif" width="12" height="12" style="cursor:pointer" onClick="$.unblockUI()"/></div><div>'+data.message+'</div><div style="text-align:center;margin-top:10px"><input type="button" value="确 定" onClick="show_login()"/></div><div style="position:relative;left:250px;top:-20px;height:0px"><img src="http://static.jjwxc.net/images/logo/logo_safeinfo.gif"></div></div>', {
                    width: '330px',
                    cursor: 'text',
                    'text-align': 'left',
                    'background': '#eefaee'

                });
            } else if (data.state==-3) {
                var html = data.message
                $.blockUI(html, {
                    width: '330px',
                    height: 'inherit',
                    cursor: 'default'
                });
            } else {
                $.blockUI('<div align="center"><b>登入失败！</b><br />本登入框目前仅支持晋江邮箱或笔名登入。如果使用<span style="font-weight: bold; color: red;">盛大通行证</span>登入，<span style="border-bottom: 1px dashed #999" id="sdo_login2" onclick="show_sdo_login_block()">请点击这里</span><br><a href="http://www.jjwxc.net/register/forgot.html"  style="border-bottom: 1px dashed #999">点击找回密码</a></div><div align="center"><input type="button" id="yesbuy" value="确 定" onClick="$.unblockUI()"/></div>', {
                    height: '100px',
                    'text-align': 'left',
                    'background': '#eefaee'
                });
                if (show_channel_info()=='shop') {
                    $('#login_box').show();
                    $('#login_auth').hide();
                }
            }
        })
    }
    return false;
}

function newWindowSms(data) {
    var dataLength = data.length;
    var html = '';
    html += '<div style="font-size:12px;width:560px;height:300px;text-align:left;border:1px solid #009900;">';
    html += '<a onclick="$.unblockUI();return false;" style="font-size: 12px; text-decoration: none;left: 565px;top:5px;height: 20px; position: absolute; color: black;width:40px;" href="#">关闭</a>';
    html += '<div style="width:560px;height:300px;overflow:auto;overflow-x:hidden">';
    $.each(data, function(i, info) {
        html += '	<div style="width:auto;height:auto;margin-top:5px;border-bottom:2px solid gray">';
        html += info.smsbody;
        html += '	<div style="text-align:center">'+(i+1)+'/'+dataLength+'</div>';
        html += '	</div>';
    })
    html += '<div style="text-align:center;font-size:14px;width:560px;height:18px;line-height:18px;margin-top:5px;color:red">以上站内短信内容可在【我的晋江】→【站内短信】中查阅</div>';
    html += '</div>';
    $(function() {
        $.blockUI(html, {
            width: '560px',
            height: '300px',
            left: '35%',
            align: 'left',
            top: '30%',
            cursor: 'text'
        });
    })
}
//弹出盛大验证
function show_sdo_login_block() {
    $('#login_info_remove').remove();
    var url = window.location.href;
    var rurl = 'http://my.jjwxc.net/login.sdo.php?rurl='+url;
    rurl = encodeURIComponent(rurl);
    jjCookie.set('returnUrl', url, false, '.jjwxc.net');
    $.blockUI('<iframe src="http://login.sdo.com/sdo/iframe/?returnURL='+rurl+'&curURL='+rurl+'&appId=910&areaId=1&geteway=true\" width=\"490\" height=\"490\"scrolling=no frameborder=0></iframe>\n\
               <img src=\'http://static.jjwxc.net/images/login/close.gif\' id="close_sdo_login" style="position:absolute;top:9px;right:26px;cursor:pointer" />',
            {
                padding: '0px',
                width: '500px',
                border: '0px',
                top: '28%',
                left: '42%',
                background: 'transparent'
            });
    $('#close_sdo_login').click($.unblockUI); //也可以
    return false;
}

//获取当前登入的分站信息,主站函数主要处理各个分站登入成功后的操作
function show_channel_info() {
    var url = window.location.href;
    if (url.indexOf('jjgame')>=0) {
//游戏频道
        return 'jjgame';
    } else if (url.indexOf('bbs')>=0) {
        return 'bbs';
    } else if (url.indexOf('jjqj.net')>=0) {
        return 'jjqj';
    } else if (url.indexOf('jjwxc.cn')>=0) {
//商城
        return 'shop';
    } else if (url.indexOf('9year')>=0) {
//易瑞特9year表示9周年
        return 'yrt';
    } else if (url.indexOf('caifu')>=0) {
        return 'caifu';
    } else if (url.indexOf('zfb')>=0) {
        return 'zfb';
    } else {
        return 'main';
    }
}
var pwdEncryption = function(str) {
    var k;
    $.ajax({
        url: '/login.php?action=setPwdKey&r='+Math.random(),
        async: false,
        success: function(data) {
            k = data;
        }
    });
    var s = "", b, b1, b2, b3, pwdtype = "";
    if (k) {
        pwdtype = "encryption";
        var strLen = k.length;
        var a = k.split("");
        for (var i = 0; i<str.length; i++) {
            b = str.charCodeAt(i);
            b1 = b%strLen;
            b = (b-b1)/strLen;
            b2 = b%strLen;
            b = (b-b2)/strLen;
            b3 = b%strLen;
            s += a[b3]+a[b2]+a[b1];
        }
    } else {
        s = str;
    }
    return {"pwdtype": pwdtype, "pwd": s};
}

