var body = document.body;
//小于ie8不给看了
if (typeof ie6 === 'boolean') body.innerHTML = '<div class="E">您的浏览器版本太低，无法正常浏览此网站</div>';

//选择器
function qS(s) {
    return body.querySelector(s)
}
function qSa(s) {
    return body.querySelectorAll(s)
}

// 网页可视区域的宽高
var windowHeight = document.documentElement.clientHeight,
    windowWidth,
    resize = [],//窗口大小改变时需要执行的函数们
    load = [],//页面加载完成后执行 ( 不重要的资源这时候可以开始加载了 )

    /*
     * 动画
     * 使用方法:
     * new animate({
     * 		start:起始值,
     end:结束值,
     time:速度默认为400ms
     * },function(value){
     * 		elem.style[自定义] = value;
     * });
     */
    animate = function (option, fn, callback) {
        var x = 0,
            t = 0,//当前时间
            b = option.start,//开始值
            c = option.end - option.start,//差值 , 差值 = 结束值 - 开始值
            d = option.time || 400,//总耗时
            zhen = 1000 / 60;//一帧的时间 , 大概是16.67ms
        easing = option.easing ? this.easing[option.easing] || this.easing.easeOutQuart : this.easing.easeOutQuart,
            _this = this;
        function show() {
            fn(easing(x, t += zhen, b, c, d));
            if (t >= d) {
                fn(easing(x, d, b, c, d));
                callback && callback();
            } else {
                requestAnimationFrame(show);
            }
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (fn) {
                _this.setTimeout = setTimeout(fn, 16);
            };
        requestAnimationFrame(show);
    };

//动画效果
animate.prototype.easing = {
    easeOutQuart: function (x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    }
};

/*
 * 动画队列
 */
var Quene = function (elem, fn, time) {

    //创建队列
    elem._Quene = elem._Quene || [];

    //加入队列
    elem._Quene.push({
        fn: fn,
        time: time || 0
    });

    //执行队列里的函数
    if (elem._QueneIsRunning)return;
    elem._QueneIsRunning = true;
    this.dequeue(elem);
};

//移出队列
Quene.prototype.dequeue = function (elem) {
    var _Quene = elem._Quene.shift(),
        _this = this;

    //执行函数
    _Quene.fn();
    setTimeout(function () {
        if (elem._Quene.length > 0)
            _this.dequeue(elem);
        else
            elem._QueneIsRunning = false;
    }, _Quene.time);
};

/*
 * ajax
 * 使用方法:
 * new ajax('GET',url,'username=haha&password=hehe',callback)
 */
var ajax = function (type, url, data, callback, formdata) {
    var xhr = this.xhr;
    //设置一些参数 : method & url & 异步
    xhr.open(type, url, true);
    //post需要设置这个东西，但是formdata的post不能设置这个东西
    if (type === 'POST' && !formdata) xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //发起请求 & 如果是post的话将data写到send里面 ( 和get一样的写法 )
    xhr.send(data);
    //响应时会自动调用onreadystatechange
    xhr.onreadystatechange = function () {
        //xhr.readyState : 0,1,2,3,4
        //xhr.status : 100,200,300,400,500
        if (xhr.readyState == 4 && xhr.status == 200) {
            //返回的字符串
            callback && callback(xhr.responseText);
        }
    }
};
//创建xhr对象
ajax.prototype.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

//判断是否支持某CSS3属性
function supportCss3(style) {
    var prefix = ['webkit', 'Moz', 'ms', 'o'],
        i,
        htmlStyle = document.documentElement.style,
        _toHumb = function (string) {
            return string.replace(/-(\w)/g, function ($0, $1) {
                return $1.toUpperCase();
            });
        },
        humpString = [_toHumb(style)];

    for (i in prefix)humpString[i + 1] = _toHumb(prefix[i] + '-' + style);
    for (i in humpString)if (humpString[i] in htmlStyle)return true;
    return false;
}
/*
 * forEach的兼容
 */
if (!Array.prototype.forEach)
    Array.prototype.forEach = function (fn) {
        var _len = this.length, _i = 0;
        for (; _i < _len; _i++)
            fn.call(this, this[_i], _i);
    }

//获取某节点渲染出来的css值
function getStyle(obj, styleName) {
    return obj.currentStyle ? obj.currentStyle[styleName] : document.defaultView.getComputedStyle(obj)[styleName]
}

/*
 * 导航栏动画
 * 为了兼容IE9、IE8
 * CSS3属性 transition:top .4s;
 */
var supportTransition = !!supportCss3('transition');
if (!supportTransition)
    [].forEach.call(qS('#nav').querySelectorAll('div'), function (item) {
        ~function (item) {
            item.className = item.className.replace(/css3/, '');
            var _a = item._drop = item.querySelector('.nav-drop');
            item._top = parseInt(getStyle(_a, 'top'));
            item.onmouseenter = function () {
                var that = this;

                //队列动画版
                this.animate = new Quene(this, function () {
                    new animate({
                        start: that._top,
                        end: 0
                    }, function (value) {
                        _a.style.top = value + 'px';
                    });
                }, 400);
            };

            item.onmouseleave = function () {
                var that = this;

                //队列动画版
                this.animate = new Quene(this, function () {
                    new animate({
                        start: 0,
                        end: that._top
                    }, function (value) {
                        _a.style.top = value + 'px';
                    });
                }, 400);
            };
        }(item)
    })

/*
 * 新闻的时间
 */
;-function () {
    var m = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    ;[].forEach.call(qSa('.time'), function (item) {
        //火狐浏览器对2016-09-13 16:42:25 这样的格式要把-替换成/
        var time = new Date(item.id.replace(/-/g, '/')),
            day = time.getDate()
        item.title = time.toLocaleString()
        item.querySelector('div').innerHTML = day < 10 ? '0' + day : day//火狐不支持innerText
        item.querySelector('span').innerHTML = m[time.getMonth()]
    });
}()

/*
 * 使用PIE.htc使低版本浏览器兼容某些css3，将这个延迟到页面加载完后执行
 */
if (window.PIE) {
    load.push(function () {
        var _a = qSa('.box-shadow')
        _b = qSa('.border-radius')

        //_a等 , 是对象 , 不是数组 , 所以不能直接用forEach
        ;[].forEach.call(_a, function (item) {
            PIE.attach(item)
        })
        ;[].forEach.call(_b, function (item) {
            PIE.attach(item)
        })

        //IE8下微软雅黑时常失灵
        body.style.fontFamily = '微软雅黑'
    })
}


/*
 * 获取页面被卷进去的高度
 */
function getScrollTop() {
    var _b = body,
        _st = _b.scrollTop,
        _y

    if (!_st)
        if (document.documentElement.scrollTop) {
            _b = document.documentElement
            _st = _b.scrollTop
        } else {
            _st = window.pageYOffset
            _b = false
        }
    _y = !!_b
    return [_b, _st, _y]
}

/*
 * 窗口大小改变时、页面载入完成时
 */
window.onresize = function () {
    resize.forEach(function (item) {
        item()
    })
}
window.onload = function () {
    load.forEach(function (item) {
        item()
    })
}

/**
 * 搜索
 */
;-function () {
    var keyword = qS('#keyword');
    var send = qS('#search');
    if (send)
        send.onclick = function () {
            location.href = 'http://ht.zgpie.com/ZgPortal/search/searchlist?keyword=' + keyword.value;
        }
}()

function showNav() {
    var nav = qS('#nav')

    function hideNav(e) {
        if (e.target.id === 'nav-btn')return
        nav.style.display = 'none'
        document.body.removeEventListener('click', hideNav)
    }

    if (nav.style.display === 'block' || nav.clientWidth) {
        nav.style.display = 'none'
    } else {
        nav.style.display = 'block'
        document.body.addEventListener('click', hideNav)
    }
}