function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

(function () {

    "use strict";

    var Audios = {};
    window.AudioMgr = {
        available: false,
        init: function () {
            // not need 'init' but 'load'
            console.log('# audioMgr inited');
        },
        /**
         * load one audio
         * @param setting  {String}		//{name: name, src: src, ...}
         * @param callback {Function}
         */
        loadOne: function (setting, callback) {
            if (!this.available) return;
            var name = setting.name, src = setting.src;
            if (Audios[name]) {
                console.log("There has been an audio named '" + name + "'!");
                return;
            }
            //document.write("loadOne " + name + "<br/>");
            var auido = new Audio();
            if (setting.autoplay) auido.autoplay = 'autoplay';
            if (setting.loop) auido.loop = 'loop';
            auido.timeout = setting.timeout || 10000;
            auido.callback = callback;
            auido.playHandle = setting.playHandle;

            //auido.preload = 'none';

            //auido.addEventListener("play", function () {
            //    if( auido.hasPlayed ) return false;
            //    if( setting.playHandle ) setting.playHandle.call( auido );
            //    auido.hasPlayed = true;
            //});
            //auido.addEventListener("pause", function () {
            //    this.play();
            //});
            //auido.addEventListener("canplay", function () {
            //	document.write("canplay " + name + "<br/>");
            //});
            auido.addEventListener("canplaythrough", function () {
                //document.write("canplaythrough " + name + "<br/>");
                if (!this.callback) return;
                this.callback();
                delete this.timeout;
                delete this.callback;
                AudioMgr.play( name );
            });
            auido.addEventListener("pause", function () {
                if (this.onPause) this.onPause();
            });
            auido.src = src;
            auido.load();
            Audios[name] = auido;

            setTimeout(function() {
                if (auido.timeout && auido.callback) {
                    auido.callback();
                    delete auido.timeout;
                    delete auido.callback;
                }
            }, auido.timeout);
        },
        /**
         * load audios
         * @param list     {Array}		//[{name: name, src: src, ...}, ...]
         * @param callback {Function}
         */
        load: function (list, callback) {
            if (!this.available) return;
            var _counter = list.length;

            var r = navigator.userAgent.match(/iPhone OS ([0-9]{1,})_/);
            if (navigator.userAgent.search("MicroMessenger") != -1 && window.wx && typeof wx.ready == "function" && r && r[1] != "") {
                if (parseInt(r[1]) < 8) {
                    // serial loading by using WeChat API
                    var __onload = function() {
                        if (--_counter < 0)
                            callback();
                        else
                            wx.ready(function() {
                                AudioMgr.loadOne(list[list.length-1-_counter], __onload);
                            });
                    };
                    __onload();
                } else {
                    // parallel loading by using WeChat API
                    var __onload = function() {
                        if (!--_counter) callback();
                    }
                    wx.ready(function() {
                        for (var i = 0; i < list.length; ++i) {
                            AudioMgr.loadOne(list[i], __onload);
                        }
                    });
                }
            } else {
                // parallel loading
                var __onload = function() {
                    if (!--_counter) callback();
                }
                for (var i = 0; i < list.length; ++i) {
                    AudioMgr.loadOne(list[i], __onload);
                }
            }
        },
        get: function(name){
            if (!this.available || !Audios[name]) return null;
            var audio = Audios[name];
            return audio;
        },
        /**
         * play an audio
         * @param name       {String}
         * @param onComplete {Function}
         */
        play: function (name) {
            if (!this.available || !Audios[name]) return;
            var audio = Audios[name];
            // audio.play();

            var si = setInterval( function(){
                if( audio.playHandle && audio.currentTime>0.01 ){
                    audio.playHandle.call( audio );
                    clearInterval( si );
                }
            }, 50 );
        },
        /**
         * pause playing an audio
         * @param name {String}
         */
        pause: function (name) {
            if (!this.available || !Audios[name]) return;
            var audio = Audios[name];
            audio.pause();
        },
        /**
         * stop playing an audio
         * @param name {String}
         */
        stop: function (name) {
            if (!this.available || !Audios[name]) return;
            var audio = Audios[name];
            audio.pause();
            audio.currentTime = 0;
        },
        /**
         * replay an audio from beginning
         * @param name {String}
         */
        replay: function (name) {
            if (!this.available || !Audios[name]) return;
            var audio = Audios[name];
            audio.currentTime = 0;
            AudioMgr.play(name);
        },
        /**
         * replay an audio from time setted
         * @param name {String} seconds
         */
        playFrom: function (name, time) {
            if (!this.available || !Audios[name]) return;
            var audio = Audios[name];
            audio.currentTime = time;
            //document.write("audio.currentTime " + audio.currentTime + "<br/>");
            audio.play();
        }
    };

    if (window.Audio) AudioMgr.available = true;
})();

var site;
var Data = {
    defaultVid : 'index',
    navChange : function( vid ){
        site.getView(site.currentViewId).removeView(function(){
            var view = site.getView(vid);
            if( !view ) view = site.getView(Data.defaultVid+'Page');
            view.addView();
        });
    },
    loadTotalPercent:100,
    loaderNum:10,

    city:[
        {city:'西安',start:'07月06日',end:'07月10日'},
        {city:'上海',start:'07月22日',end:'07月24日'},
        {city:'太原',start:'07月22日',end:'07月24日'},
        {city:'南京',start:'07月29日',end:'07月31日'},
        {city:'济南',start:'08月05日',end:'08月07日'},
        {city:'无锡',start:'08月05日',end:'08月07日'},
        {city:'北京',start:'08月19日',end:'08月21日'},
        {city:'宁波',start:'08月19日',end:'08月21日'},
        {city:'温州',start:'08月26日',end:'08月28日'},
        {city:'福州',start:'09月02日',end:'09月04日'},
        {city:'大连',start:'09月02日',end:'09月04日'},
        {city:'郑州',start:'09月15日',end:'09月17日'},
        // {city:'厦门',start:'09月15日',end:'09月17日'},
        {city:'武汉',start:'09月23日',end:'09月25日'},
        {city:'广州',start:'09月23日',end:'09月25日'},
        {city:'长沙',start:'10月05日',end:'10月07日'},
        {city:'昆明',start:'10月14日',end:'10月16日'},
        {city:'苏州',start:'10月14日',end:'10月16日'},
        {city:'杭州',start:'10月21日',end:'10月23日'},
        {city:'成都',start:'10月28日',end:'10月30日'},
        {city:'常州',start:'11月18日',end:'11月20日'},
        {city:'石家庄',start:'11月25日',end:'11月27日'},
        {city:'徐州',start:'12月02日',end:'12月04日'},
        {city:'南宁',start:'12月02日',end:'12月04日'},
        {city:'扬州',start:'12月09日',end:'12月11日'},
        {city:'贵阳',start:'12月09日',end:'12月11日'},
        {city:'合肥',start:'12月16日',end:'12月18日'},
        {city:'厦门',start:'12月16日',end:'12月18日'}
    ],

    showCover:function(){
        if( !$('#pop_cover').attr('id') ){
            $('body').append( '<div id="pop_cover" style="position:absolute;left:0;top:0;z-index:99;background-color:#000;opacity:0.7;width:100%;height:100%;"></div>' );
        }
        $('#pop_cover').show();
    },

    countTotalO:880,
    countTotal:880,
    changeTimes:2,
    question:9,
    right:0,
    qIdx:0,
    code:'',
    end:''
};

var Classes = {
    getInstance : function( cls ){
        var args = [];
        var _self = new cls( args[1] );
        _self.self = _self;
        if( _self.init ) _self.init();
        return _self;
    },
    extends : function( cls, parent ){
        console.log('==========',cls.name, 'extends', parent.name );
        if( parent instanceof Function ){
            var _super = new parent;
            this.copy( cls.prototype, _super );
            cls.prototype.super = _super;
            parent.call( cls );
        }else{
            this.copy( cls.prototype, parent );
            cls.prototype.super = parent;
        }
    },
    copy : function( tar, src ){
        for( var i in src ){
            tar[i] = src[i];
        }
    }
};
var CONST = {
    VIEW_TYPE_PAGE : 'Page'
};

function Base(){
    this.version = '1.0';
    this.init = function(){
        console.log('--------Base inited');
    }
}
function Site(){
    this._views = [];
    this.preload = [];
    this.init = function(){
        console.log('--------Site inited');
        var self = this;
//        $(window).resize( this.resize );
//        this.resize();

        window.addEventListener("hashchange", function(e){
            Data.navChange( location.hash.substr(1)+'Page' );
        });
    };
    this.launch = function(){
        var _site = this;
        var preload = [];
        for( var i=0; i<this._views.length; i++ ){
            if( this._views[i].autoLoad )
                preload = preload.concat( this._views[i].preload );
        }

        this.showLoading();

        //preload = shuffle( preload );
        var idx = 0;
        var isLoaded = false;
        var loadedNum = 0;
        var handle = function(){
            loadedNum++;
            var _this = this;
            var percent = Math.floor( loadedNum / preload.length * Data.loadTotalPercent );
            //console.log( percent );
            vid = Data.defaultVid;
            if( location.hash ) {
                var vid = location.hash.replace('#', '');
                if (!site.getView(vid + 'Page'))
                    vid = Data.defaultVid;
            }

            _site.onLoadingHandle( site.getView(vid+'Page'), percent );
            if( percent >= Data.loadTotalPercent ){
                if( isLoaded ) return;
                isLoaded = true;

                _site.launchComplete( site.getView(vid+'Page') );
            }else{
                setTimeout( function(){ loadImg(_this.id); }, 1 );
            }
        };
        var loaders = [];
        var loadImg = function(i){
            var pic = preload[idx];
            if(!pic ) return;
            loaders[i] = new Image();
            loaders[i].id = i;
            loaders[i].onload = handle;
            loaders[i].src = BASE_URL + pic;
            idx++;
        };
        for( var i=0; i<Data.loaderNum; i++ ) loadImg(i);
    };
    this.registerView = function( viewId, viewClass ){
        var view = Classes.getInstance( viewClass );
        view.setViewId( viewId );
        // if( view.autoLoad )
        //     view.init();
        this._views.push( view );
    };
    this.getView = function( viewId ){
        var view = null;
        for( var i=0; i<this._views.length; i++ ){
            if( this._views[i].viewId == viewId ){
                view = this._views[i];
            }
        }
        return view;
    };
    this.resize = function(){
    };
    this.resetPage = function(){
    };
    this.showLoading = function(){
        $('#loading').show();
    };
    this.endLoading = function(){
        $('#loading').fadeOut( 100 );
        $('#wrap').show();
        $('#top').show();
    };
    this.loading = function( viewId ){

        //this.showLoading();

        //preload = shuffle( preload );
        var _site = this;
        var view = this.getView( viewId );

        var idx = 0;
        var isLoaded = false;
        var loadedNum = 0;
        var handle = function(){
            var _this = this;
            loadedNum++;
            var percent = Math.floor( loadedNum / view.preload.length * Data.loadTotalPercent );
            //console.log( percent );
            _site.onLoadingHandle( view, percent );
            if( percent >= Data.loadTotalPercent ){
                if( isLoaded ) return;
                isLoaded = true;
                _site.onLoadedHandle( view );
            }else{
                if( loadedNum%Data.loaderNum == 0 ){
                    setTimeout( function(){ loadImg(_this.id); }, 1 );
                }
            }
        };
        var loaders = [];
        var loadImg = function(i){
            var pic = view.preload[idx];
            if(!pic ) return;
            loaders[i] = new Image();
            loaders[i].id = i;
            loaders[i].onload = handle;
            loaders[i].src = BASE_URL + pic;
            idx++;
        }
        for( var i=0; i<Data.loaderNum; i++ ) loadImg(i);
    };
    this.onLoadingHandle = function( view, percent ){
        $('#percentBar').css( 'width', (percent/Data.loadTotalPercent*100) + '%' );

        view.loadedPercent = percent;
        if( view.onLoadingHandle ) view.onLoadingHandle();
    };
    this.launchComplete = function( view ){
        for( var i=0; i<this._views.length; i++ ){
            if( this._views[i].self.autoLoad ){
                this._views[i].self.loaded = true;
                continue;
            }
        }
        this.onLoadedHandle( view );
    };
    this.onLoadedHandle = function( view ){
        this.endLoading();
        view.self.loaded = true;
        view.self.addView();
    }
}
Classes.extends( Site, Base );

function View(){
    this.viewId = '';
    this._this = null;
    this.dom = null;
    this.viewType = 'VIEW';
    this.preload = [];
    this.autoLoad = false;
    this.loaded = false;
    this.animationTime = 1;
    this.init = function(self){
        this.self = self;
        //console.log( 'View Inited' );
    };
    this.setViewId = function(id){
        this.viewId = id;
        this.dom = $('#'+this.viewId);
    };
    this.onLoadedHandle = function(){
        console.log( 'view.onLoadedHandle' );
        this.self.addView();
    };
    this.addView = function(){
        console.log( 'addView', this.name, this.self.viewId, this.self.loaded );
        // if( !this.self.loaded ) site.loading( this.self.viewId );
        // else{
            site.currentViewId = this.self.viewId;
            this.onAddView();
            var _self = this;
            this.self.dom.fadeIn( this.animationTime, function(){
                _self.self.onAddViewComplete();
            } );
        // }
    };
    this.onAddView = function(){

    };
    this.onAddViewComplete = function(){
    };
    this.removeView = function(func){
        var _self = this;
        this.dom.fadeOut( this.animationTime/3, function(){
            if( func ) func.call();
            _self.onRemoveViewComplete();
        } );
        this.onRemoveView();
        $('footer').fadeOut( this.animationTime );
    };
    this.onRemoveView = function(){

    };
    this.onRemoveViewComplete = function(){

    };
}
Classes.extends( View, Base );

function Page(){
    this.name = 'Page';
    this.viewType = CONST.VIEW_TYPE_PAGE;
    this.init = function(self){
        this.self = self;
        this.super.init(self);
        //console.log( this.name+' Inited', this.viewId, this.dom );
    };
    this.test = function(){
        console.log( 'test' );
    };
}
Classes.extends( Page, View );

function Index(){
    this.name = 'Index';
    this.preload = [
        'images/bg.png', 'images/logo.png','images/blank.gif','images/detail.png','images/detail_f.png',
        'images/bt_start.png','images/bt_detail.png','images/bt_drive.png','images/bt_dealer.png',
        'images/title.png', 'images/spot.png','images/logo.png','images/bt_d_detail.png','images/music.png',
        'images/detail_title.png'
    ];
    this.autoLoad = true;

    this.init = function(){
        this.super.init(this);
        var _self = this;

        $('#bt_detail, #bt_sm_detail').click( function(){
            $('#detail').show();
        } );

        $('#close_detail').click(function(){
            $('#detail').hide();
        });

        $('#bt_drive').click( function(){
            location.hash = 'submit';
        } );

        $('#bt_dealer').click( function(){
            $('#award').show();
        } );

        $('#close_award').click(function(){
            $('#award').hide();
        });

        $('#bt_start').click( function(){
            location.hash = 'game';
        } );

        $('.dropdown').click(function(e){
            _self.buildDropdown( this.id );
            var e = event || window.event || arguments.callee.caller.arguments[0];
            e.stopPropagation();
            e.preventDefault();
        });
        $('.fa').click(function(e){
            _self.buildDropdown( $(this).attr('ref') );
            var e = event || window.event || arguments.callee.caller.arguments[0];
            e.stopPropagation();
            e.preventDefault();
        });

        var checkForm = function(){
            $('#form p').html( '' );
            var post = {};
            post.city = $('#city').data('key');
            post.date = $('#date').data('key');
            post.name = $('#name').val();
            post.gender = $('#gender').data('key');
            post.mobile = $('#mobile').val();

            var empty = {city:'请选择城市', date:'请选择日期', name:'请填写您姓名', gender:'请选择性别', mobile:'请输入您的手机号'};

            var error = false;
            var message = '';
            for( var i in post ){
                if( !isEmpty( post[i] ) ){
                    error = true;
                    message = empty[i];
                    break;
                }
            }

            if( !error && !isMobileNum( post.mobile ) ){
                error = true;
                message = '号码输入有误';
            }
            if( error ){
                $('#form p').html( message );
                return false;
            }
            return post;
        };

        $('#bt_submit').click(function() {
            var post = checkForm();
            if( !post ) return false;

            for( var i in post ){
                $('.'+i+'Confirm').html( post[i] );
            }
            $('#confirm').show();
        });

        $('#bt_confirm').click(function(){
            var post = checkForm();
            if( !post ) return false;

            $.post( '/interface.php?act=roadshow', post, function(res){
                $('#form').hide();
                $('#confirm').hide();
                $('#d_title').hide();
                var feedback = res.data ? $('#success') : $('#fail');
                feedback.show();
                if( res.errno ){
                    alert(res.errmsg);
                    return false;
                }
            }, 'json' );
        });

        $('#bt_cancel').click(function(){
            $('#confirm').hide();
        });

        AudioMgr.load([{name:'bgMusic', playHandle:function(){
            $('#music').show();
            self.played = true;
        }, loop:true, src:''}], function(){});

        $('#wrap').bind('touchstart', function(){
            AudioMgr.play( 'bgMusic' );
            $('#wrap').unbind( 'touchstart' );
        });


        $('#music').click(function(){
            if( self.played ){
                $('#music').attr('src', 'images/music_off.png');
                AudioMgr.pause( 'bgMusic' );
            }else{
                $('#music').attr('src', 'images/music.png');
                AudioMgr.play( 'bgMusic' );
            }
            self.played = !self.played;
        });

        console.log( this.name + ' Inited', this.viewId );
    };

    this.cityDrop = function(){
        var ret = [];
        var cur = $('#city').data('key');
        for( i in Data.city ){
            var end = Data.city[i].start;
            end = Util.strToTime( '2016-'+end.replace('月','-').replace('日','') ) * 1000 - 3600*24*1*1000;
            var date = new Date();
            if( date.getTime() > end ) continue;

            var d = {};
            var end = Data.city[i].end.substr( 3 );
            d[Data.city[i].city] = Data.city[i].city + '（'+Data.city[i].start+'-'+end+'）';
            ret.push( d );
        }
        return ret;
    };
    this.cityChange = function(){
        $('#date').data( 'key', '' );
        $('#date').val( '' );
    };
    this.dateDrop = function(){
        var ret = [];
        var cur = $('#city').data('key');
        var idx = 0;
        for( var i=0; i<Data.city.length; i++ ){
            if( Data.city[i].city == cur ){
                idx = i;
                break;
            }
        }

        var start = Data.city[idx].start;
        var end = Data.city[idx].end;
        var begin = Util.strToTime( '2016-'+start.replace('月','-').replace('日','') ) * 1000;
        var finish = Util.strToTime( '2016-'+end.replace('月','-').replace('日','') ) * 1000;
        var day = 3600 * 24 * 1000;

        var date = new Date();
        do{
            date.setTime( begin );
            begin += day;
            var val = {};
            var tmp = (date.getMonth()+1) + '月' + (date.getDate()) + '日';
            val[tmp] = tmp;
            ret.push( val );
        }while( begin <= finish );

        return ret;
    };
    this.genderDrop = function(){
        return [{'男':'男'}, {'女':'女'}];
    };
    this.buildDropdown = function( id ){
        var _self = this;
        var max = 5;
        var html = '';
        var container = $('#dropContainer');
        if( !container.attr('id') ){
            $('body').append( '<div id="dropContainer" style="position:absolute; background-color:#fff; top:0; left:0; overflow:auto; width:100%; z-index:1000; border:1px solid #333; border-radius:0 0 4px 4px;"></div>' );
            container = $('#dropContainer');
        }
        container.show();

        var input = $('#'+id);
        var offset = $(input).parent().offset();
        container.css( {top:offset.top+input.parent().outerHeight(), left:offset.left+5, width:input.parent().width()-10} );

        var data = this[id+'Drop'].call( this );
        for( var i=0; i<data.length; i++ ){
            for( k in data[i] ){
                html += '<li'+(i==data.length-1?' class="last"':'')+' data-key="'+k+'">'+data[i][k]+'</li>';
            }
        }
        container.html('<ul>'+html+'</ul>' );
        container.css( 'height', $('#dropContainer li').outerHeight() * Math.min( data.length, max ) );

        $('#dropContainer li').click(function(e){
            input.data( 'key', $(this).data('key') );
            input.val( $(this).html() );
            container.hide();
            if( _self[id+'Change'] ){
                _self[id+'Change'].call( this );
            }
        });
    };

    $('#submit').click(function(){
        $('#dropContainer').hide();
    });

    this.addView = function(){
        // this.onAddView();
        // var _self = this;
        // this.dom.fadeIn( this.animationTime, function(){
        //     _self.onAddViewComplete();
        // } );

        var self = this;

        $('#bts').show();
        $('#bt_sm_detail').hide();
        this.super.addView();

        Data.voiceOff = false;
    };
    this.onAddViewComplete = function(){
    };
    this.stop = function(){
    };
    this.onRemoveView = function(){
        $('#bts').hide();
        this.stop();
        this.super.onRemoveView();
    };
    this.onRemoveViewComplete = function(){

    };
}
Classes.extends( Index, Page );


function Submit(){
    this.name = 'Submit';
    this.preload = [
        'images/d_top.png','images/d_title.png','images/fa.png','images/bt_submit.png',
        'images/f1.png','images/f2.png','images/f3.png','images/f4.png','images/f5.png'
    ];
    this.autoLoad = false;

    this.init = function(){
        this.super.init(this);
        console.log( this.name + ' Inited', this.viewId );
    };
    this.addView = function(){
        var self = this;

        $('#bt_sm_detail').show();

        this.super.addView();
    };
    this.onAddViewComplete = function(){
    };
    this.stop = function(){
    };
    this.onRemoveView = function(){
        $('#dropContainer').hide();
        this.stop();
        this.super.onRemoveView();
    };
    this.onRemoveViewComplete = function(){
        //site.getView('gamePage').addView();
    };
}
Classes.extends( Submit, Page );


function Offline(){
    this.name = 'Offline';
    this.preload = [
        'images/offline.png','images/offline1.png','images/offline2.png'
    ];
    this.autoLoad = true;

    this.init = function(){
        this.super.init(this);
        console.log( this.name + ' Inited', this.viewId );
    };
    this.addView = function(){
        var self = this;

        $('#bt_sm_detail').show();

        this.super.addView();
    };
    this.onAddViewComplete = function(){
    };
    this.stop = function(){
    };
    this.onRemoveView = function(){
        this.stop();
        this.super.onRemoveView();
    };
    this.onRemoveViewComplete = function(){
        //site.getView('gamePage').addView();
    };
}
Classes.extends( Offline, Page );


function Game(){
    this.name = 'Game';
    this.preload = [
        'images/g_success.png','images/g_fail.png','images/bt_g_drive.png','images/bt_retry.png',
        'images/g_timer.png','images/g_right.png','images/g_tip.png','images/g_t_t.png','images/g_t_3.png',
        'images/game.png','images/bt_confirm.png','images/bt_cancel.png','images/f_fail.png','images/f_success.png',
        'images/qr.png'
    ];
    this.started = false;
    this.autoLoad = true;
    this.countInt = 0;
    this.seconds = 30;
    this.second = this.seconds;
    this.times = 3;
    this.collected = 0;
    this.bgHeight = 827;
    this.position = [
        {top:55},
        {top:52},
        {top:358},
        {top:570},
        {top:255},
        {top:365},
        {top:152},
        {top:316},
        {top:201},
        {top:608},
        {top:644}
    ];
    this.startInt = 0;

    this.init = function(){
        this.super.init(this);
        var self = this;

        $('#game_cover,#result').on( 'touchmove', function(){
            return false;
        } );

        var counting = function(){
            if( self.times<=0 ){
                self.gameStart();
                return;
            }else self.startInt=setTimeout( counting, 1000 );
            $('#g_t_c').attr( 'src', 'images/g_t_'+self.times+'.png' );
            self.times--;
        };
        this.closeTip = function(){
            if( self.times < 3 ) return;
            $('#game_tip').hide();
            $('#counting').show();
            counting();
        };
        $('#game_tip').click( this.closeTip );

        $('#bt_retry').click(function(){
            self.reset();
            $('.icon').show();
            $('.dscb').hide();
            self.closeInt = setTimeout( self.closeTip, 5000 );
        });

        $('#game').bind('touchstart',function(e){
            //所选图片碎片的下标以及鼠标相对该碎片的位置
            var cell_mouse_x = e.originalEvent.touches[0].clientX - $('#game').offset().left;
            var cell_mouse_y = e.originalEvent.touches[0].clientY - $('#game').offset().top;
            $('.arrows').hide();

            $(document).bind('touchmove',function(e2){
                var tx = e2.originalEvent.touches[0].clientX - cell_mouse_x;
                var ty = e2.originalEvent.touches[0].clientY - cell_mouse_y;

                if( tx<=0 && tx>=-($('#game').width()-$('body').width())*2 ){
                    $('#game').css({'left':tx + 'px'});
                }
                if( ty<=0 && ty>=-($('#game').height()-$('body').height()) ) {
                    $('#game').css({'top': ty + 'px'});
                }
            }).bind('touchend',function(e3){
                //被交换的碎片下标
                $(document).unbind('touchmove').unbind('touchend');
            });
            var e = event || window.event || arguments.callee.caller.arguments[0];
            e.preventDefault();
        });

        console.log( this.name + ' Inited', this.viewId );
    };
    this.timer = function(){
        var self = site.getView('gamePage');
        $('#g_timer span').html( 'Time: 00:'+(self.second<10?'0'+self.second:self.second) );
        self.second--;
        if( self.second < 0 ){
            clearInterval( this.countInt );
            self.gameOver();
        }

    };
    //提交成绩
    $('#bt_g_drive').click( function(){
        var useTime = 30 - self.second-1;
        console.log(useTime );
    });
    this.gameStart = function(){
        this.started = true;
        $('#counting').hide();
        $('#game_cover').hide();
        if( !$('#p0').attr('id') ){
            var rate = 44/57;
            for( var i=0; i<4; i++ ){
                $('#game').append( '<img class="gps" id="p'+i+'" src="images/blank.gif" />' );
                $('#game').append( '<img class="flags" id="f'+i+'" src="images/flag.png" />' );
                var top = this.position[i].top / this.bgHeight * $('#game_bg').height();
                $('#p'+i).css('top', top+'px');

                var p = $('#p'+i).position();
                $('#f'+i).css('left', p.left+$('#p'+i).width()/3+'px');
                $('#f'+i).css('top', p.top-$('body').width()*0.07/rate/2+'px');
                $('#dscb'+i).css('left', p.left+$('#p0').width()/3+'px');
                $('#dscb'+i).css('top', top+'px');
                $('.ship').css('left', p.left+$('#p'+i).width()/3-210+'px');
            }
            $('.gps').on('touchend', this.collect);
        }

        $('.arrows').show();
        var opt = {delay:1, repeat:3, repeatDelay:0.5, yoyo:true, onComplete:function(){this.target.fadeOut();} };
        // TweenMax.to('#a_r', 0.5, $.extend( {x:15}, opt ) );
        // TweenMax.to('#a_l', 0.5, $.extend( {x:-15}, opt ) );
        // TweenMax.to('#a_b', 0.5, $.extend( {y:15}, opt ) );

        this.countInt = setInterval( this.timer, 1000 );
        this.timer();
    };
    this.collect = function(){
        var self = site.getView('gamePage');
        var idx = $('.gps').index(this);
        if( self.position[idx].collected ) return;
        self.position[idx].collected = true;
        self.collected++;
        // $('.flags').eq(idx).show();
        $('.icon'+idx).hide();
        $('#dscb'+idx).show();
        $('#g_right span').html( self.collected+'/4' );
        if( self.collected == 4 ){
            self.gameOver( true );
        }
    };
    this.gameOver = function( success ){
        $('#game').css({top:0,left:'-50%'});
        if( success ){
            $('#g_success').show();
            $('#bt_g_drive').show();

        }else{
            $('#g_fail').show();
            $('#bt_g_drive').hide();
        }
        $('#result').show();
        clearInterval( this.countInt );
        this.started = false;
    };
    this.reset = function(){
        this.times = 3;
        this.second = this.seconds;
        this.started = false;
        this.collected = 0;
        for( var i=0; i<11; i++ ){
            this.position[i].collected = false;
        }
        $('#g_timer span').html( 'Time: 00:'+this.seconds );
        $('#g_right span').html( '0/4' );
        $('#game_cover').show();
        $('#game_tip').show();
        $('#result').hide();
        $('.flags').hide();
        $('.res').hide();
    };
    this.addView = function(){
        var self = this;
        self.reset();

        $('#logo').hide();
        $('.arrows').hide();
        $('#game_tip').show();
        $('#counting').hide();
        $('#bt_sm_detail').hide();

        this.closeInt = setTimeout( this.closeTip, 5000 );

        this.super.addView();
    };
    this.onAddViewComplete = function(){
    };
    this.stop = function(){
    };
    this.onRemoveView = function(){
        clearTimeout( this.startInt );
        clearTimeout( this.closeInt );
        clearInterval( this.countInt );
        $('#logo').show();
        $('#game_tip').hide();
        $('#counting').show();

        this.stop();
        this.super.onRemoveView();
    };
    this.onRemoveViewComplete = function(){
        //site.getView('gamePage').addView();
    };
}
Classes.extends( Game, Page );

$(function(){
    site = Classes.getInstance( Site );

    site.registerView( 'indexPage', Index );
    site.registerView( 'gamePage', Game );
    site.registerView( 'submitPage', Submit );
    site.registerView( 'offlinePage', Offline );
    // site.registerView( 'commentsPage', Comments );

    if( Util.mobileCheck() ) site.launch();
    else{
        $('body').append( '<img id="pc" src="images/pc.jpg" />' );
        $('#orientLayer').hide();
        $('#loading').hide();
    }

});
