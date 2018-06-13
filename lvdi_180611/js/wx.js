(function () {
    var Api = {};
    Api.ready = function(callback) {
        Api._ready ? callback() : wx.ready(callback);
    };
    wx.ready(function() {
        Api._ready = true;
    });
    Api.init = function(_config) {
        var config = {
            debug: false,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ]
        };
        $.extend(config, _config||{});
        $.ajax({
            url: "https://china.smart.com/wx/wxjs.php",
            type: "GET",
            dataType: 'jsonp',
            jsonp: 'imCallback',
            jsonpCallback: 'jsonp1',
            data: {url: location.href.replace( location.hash, '' ), imCallback: "jsonp1"},	// 暂时解决zepto jsonp问题
            timeout: 5000,
            success: function(json) {
                console.log(json);
                config.appId = json.appId;
                config.timestamp = json.timestamp;
                config.nonceStr = json.nonceStr;
                config.signature = json.signature;
                config.rawString = json.rawString;
                wx.config(config);
            }
        });
    };
    Api.share = function(data, reverse) {
        Api.ready(function() {
            wx.onMenuShareTimeline(data);
            if (reverse) data = $.extend({}, data, {title: data.desc, desc: data.title});
            wx.onMenuShareAppMessage(data);
            wx.onMenuShareQQ(data);
            wx.onMenuShareWeibo(data);
        });
    };
    Api.shareTimeline = function(data) {
        Api.ready(function() {
            wx.onMenuShareTimeline(data);
        });
    };
    Api.shareAppMessage = function(data, reverse) {
        if (reverse) data = $.extend({}, data, {title: data.desc, desc: data.title});
        Api.ready(function() {
            wx.onMenuShareAppMessage(data);
        });
    };
    Api.shareQQ = function(data) {
        Api.ready(function() {
            wx.onMenuShareQQ(data);
        });
    };
    Api.shareWeibo = function(data) {
        Api.ready(function() {
            wx.onMenuShareWeibo(data);
        });
    };

    window.WeixinApi = Api;
})();