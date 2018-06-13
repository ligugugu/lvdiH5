if( typeof console == "undefined" )
    console = {log:function(){  }};

var content = '分享';
var share = {
	'renren' : 'http://widget.renren.com/dialog/share?resourceUrl={url}&pic={pic}&title={title}&description={content}',
	'tencent' : 'http://share.v.t.qq.com/index.php?c=share&a=index&title={content}&url={url}&appkey=&site={url}&pic={pic}',
	'kaixin' : 'http://www.kaixin001.com/rest/records.php?content={content}&url={url}&starid=0&aid=0&style=11&pic={pic}',
	'douban' : 'http://shuo.douban.com/!service/share?image={pic}&href={url}&name={content}',
	'sina' : 'http://v.t.sina.com.cn/share/share.php?appkey=&url={url}&title={content}&source=&sourceUrl=&content=utf-8&pic={pic}'
};
var htmlSolution = false;

var Dialog = {
	zIndex:1200,
	init:function(){
		//Util.autoScroll();
		$('.dialogCloseBt,.close-btn').live( 'click', function(){
			Dialog.close();
		});
	},
		
	build:function( id, _html, _style, _class ){
		if( !$('#'+id).attr('id') ){
			$('body').append( '<div id="'+id+'" class="commonDialog '+_class+'" style="'+_style+'"></div>' );
		}
		$('#'+id).html( _html );
	},

	show:function( id, _width, _height, func ){
		Dialog.init();
		$('#'+id).show();
		this.showCover();

		if( !_width ) _width = 500;
		var _left = ($(window).width() - _width) / 2;
		var _top = this.fixTop( id );
		$('#'+id).css( 'top', _top );
		$('#'+id).css( 'left', _left );
		$('#'+id).css( 'position', 'absolute' );
		var zindex = $('#'+id).css( 'z-index');
		if( !zindex || zindex == 'auto' ) $('#'+id).css( 'z-index', this.zIndex );
		
		/*
		ImListener.add( 'autoScroll', function( res ){
			$('#'+id).css( 'top', Dialog.fixTop( id ) );
		}, {}, false);
		*/
		
		if( func ) func.call();
		
		this.zIndex++;
	},
	showCover:function(){
		if( !$('#dialogCover').attr('id') ){
			$('body').append( '<div id="dialogCover" style="position:absolute; background-color:#000000; filter:alpha(opacity=50);moz-opacity:0.5;opacity:0.5; top:0; left:0; width:100%; height:'+$(window).height()+'px; z-index:'+(this.zIndex-1)+'"></div>' );
		}
		$('#dialogCover').show();
	},

	close:function( func ){
		$('.commonDialog,.dialog').fadeOut( 100 );
		this.closeCover();
		if( func ) func.call();
	},
	closeCover:function(){
		$('#dialogCover').fadeOut( 100 );
	},

	fixTop:function( id ){
        var h = $(window).height();
        h = h < 780 ? 780 : h;
        var _top = ( h - $('#'+id).height() ) / 2 - 20;
//        _top += $(window).scrollTop();
		return _top;
	},
	
	dAlert:function( title, msg, sec, func ){
		title = title ? title : '发生错误!';
		padding = 'padding:80px 40px 0;';
		if( msg )
			padding = 'padding:70px 40px 0;';
		else
			msg = '';
		var html = '<div class="dialog_box2 pngpic"><div class="close_box"><a href="javascript:void(0)" class="alertCloseBt"><img src="'+DIR_PUBLIC+'images/pop/close_box.jpg" /></a></div><div style="'+padding+'"><div style="font-size:20px;color:#eee;padding:0 0 20px">'+title+'</div><div style="font-size:14px;color:#eee;line-height:20px;">'+msg+'</div></div></div>';
		this.build( 'alertDiv', html, '', '' );
		this.show( 'alertDiv', 564 );
		$('#alertDiv').css( 'z-index', 1000 );
		
		if( sec && func ){
			$('.alertCloseBt').click( func );
			setTimeout( func, sec * 1000 );
		}else if(sec){
			func = function(){ Dialog.close(); };
			$('.alertCloseBt').click( func );
			setTimeout( func, sec * 1000 );
		}else{
			$('.alertCloseBt').click( function(){ Dialog.close(); } );
		}
	}
};


var Util = {
    intval:function( n ){
        if( !n ) return 0;
        var s = ''; s += n;
        n = parseInt( s.replace(',','') );
        return n;
    },
    floatval:function( n ){
        if( !n ) return 0;
        var s = ''; s += n;
        n = parseFloat( s.replace(',','') );
        return n;
    },
    round:function( number, length, pad ){
        number = Util.floatval( number );
        length = Util.intval( length );
        length = length < 0 ? 0 : length;
        var tmp = 1;
        for( var i=0; i<length; i++ ) tmp *= 10;
        number = Util.floatval( Math.round( number * tmp ) / tmp );
        if( pad ){
            var s = ''; s += number;
            var n = s.indexOf('.');
            if( n != -1 && s.length-1-n < length  ){
                for( var i=0; i<length-(s.length-1-n); i++ ) number += '0';
            }
        }
        return number;
    },
    power:function(a,b){
        var ret = "1";
        for(var i = 0; i < b; i++){
            ret *= a;
        }
        return ret;
    },
    getFunction:function( str ){
        var tmp = str.split('_');
        var fun = tmp.shift();
        while( tmp.length ){
            fun += (tmp.shift()).replace(/(^|\s+)\w/g,function(s){
                return s.toUpperCase();
            });
        }
        return fun;
    },
    isMobile:function (){
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = false;
        for (var v = 0; v < Agents.length; v++) {
            if( userAgentInfo.indexOf(Agents[v]) != -1 ) { flag = true; break; }
        }
        return flag;
    },
    padZero:function( n, length ){
        if( !length ) return n;
        var ret = '';
        while( length ){
            length--;
            if( n < Math.pow(10, length) ){
                ret += '0';
            }else{
                ret += n;
                break;
            }
        }
        return ret;
    },
    formatMoney:function( num ){
        var stmp = "";
        stmp += num;
        var ms = stmp.replace(/[^\d\.]/g,"").replace(/(\.\d{2}).+$/,"$1").replace(/^0+([1-9])/,"$1").replace(/^0+$/,"0");
        var txt = ms.split(".");
        while(/\d{4}(,|$)/.test(txt[0]))
            txt[0] = txt[0].replace(/(\d)(\d{3}(,|$))/,"$1,$2");
        num = txt[0]+(txt.length>1?"."+txt[1]:"");

        return num;
    },
    mobileCheck:function(){
        return (/Android|iPhone|iPad|iPod|BlackBerry|UC|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera);
    },
    isIPhone:function(){
        return (/iPhone/i).test(navigator.userAgent || navigator.vendor || window.opera);
    },
    strToTime:function(str){
        var _arr = str.split(' ');
        var _day = _arr[0].split('-');
        _arr[1] = (_arr[1] == null) ? '0:0:0' :_arr[1];
        var _time = _arr[1].split(':');
        for (var i = _day.length - 1; i >= 0; i--) {
            _day[i] = isNaN(parseInt(_day[i])) ? 0 :parseInt(_day[i]);
        };
        for (var i = _time.length - 1; i >= 0; i--) {
            _time[i] = isNaN(parseInt(_time[i])) ? 0 :parseInt(_time[i]);
        };
        var _temp = new Date(_day[0],_day[1]-1,_day[2],_time[0],_time[1],_time[2]);
        return _temp.getTime() / 1000;
    },
    eof:''
};

function CheckRange(str, m, n){
	if(str.length<m || str.length>n) return false;
	return true;
}

function CheckLong(str, long){
	if(str.length<long) return false;
	return true;
}

function CheckMaxLength(str, long){
	if(str.length>long) return false;
	return true;
}

function wrong(name,message,div){
    div = div ? div : 'wrong_msg';
	//alert(message);
    $('#'+div).html(message);
	try{
		name.focus();
	}catch(message){
		return false;
	}
	return false;
}

function isEmpty(str){
	var re=/^[ ]+$/
	if(str==undefined || str=="" || re.test(str)) return false;
	return true;
}

function isChar(str){
	var re=/^\D+|\D+[ ]+$/
	if(!re.test(str))  return false;
	return true;
}

function isNumber(str){
	var re=/^\d+$/
	if(!re.test(str))  return false;
	return true;
}

function isEmail(str){
	var re=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
	if(!re.test(str))  return false;
	return true;
}

function isChecked( f ){
	return f.checked;
}

function isMobileNum( f ){
    if( !(/^1[3|4|5|7|8]\d{9}$/.test(f)) ) return false;
    return true;
}

function showLog( str ){
	if( typeof console != "undefined" )
		console.log( str );
}

function _t( code ){
//    console.log( code );
    if( typeof code == 'string' ){
        code.replace( ' ', '_' );
//        _hmt.push(['_trackPageview', '/'+code]);
//        ga('send', 'pageview', code);
    }else{
        var t = ['_trackEvent', code[0]];
        if( code[1] ) t.push( code[1] );
        if( code[2] ) t.push( code[2] );
//        _hmt.push(t);
//        ga('send', 'event', code[0], code[1], code[2]);
    }
}
$(function(){
    $('[track]').each(function(n,o){
        $(o).click(function(){
            var t = $(this).attr('track');
            if( t.indexOf( '[' ) != -1 ) eval( 't = '+t+';' );
            _t(t);
        });
    });
})
function loadjs(script_filename) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', script_filename);
    script.setAttribute('id', 'coolshell_script_id');

    script_id = document.getElementById('coolshell_script_id');
    if(script_id){
        document.getElementsByTagName('head')[0].removeChild(script_id);
    }
    document.getElementsByTagName('head')[0].appendChild(script);
}

//var script = 'http://coolshell.cn/asyncjs/alert.js';
//loadjs(script);