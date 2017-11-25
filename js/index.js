/*
 * 页面滚动到相应位置 , section块华丽登场
 */
;!function indexScroll() {
    resize.push(indexScroll)
    //所有需要华丽登场的元素
    var elems = qSa('.section'),
        _offsetTop = [],
        scrollTop = getScrollTop()[1] + windowHeight,
        i = len = 0,
        isRest = false

    ;[].forEach.call(elems, function (item, index) {
        _offsetTop[index] = item.offsetTop
        len++
        if (scrollTop < _offsetTop[index]) {
            elems[index].style.opacity = 0//这里将页面上的section都隐藏掉了
        }
    })

    _offsetTop[elems.length] = body.scrollHeight + 1//加一个scrollTop无论如何也到不了的高度

    //监听页面滚动事件
    window.onscroll = function () {
        //函数节流:如果用了平滑滚动插件 , 滚动滑轮一次40ms的延时会执行两次onscroll , 30ms则会执行3次 , 所以选40ms
        clearTimeout(isRest)
        isRest = setTimeout(function () {
            _onscroll()
        }, 40)
    }

    //滚动时需要做的事情
    function _onscroll() {
        scrollTop = getScrollTop()[1] + windowHeight
        for (i = 0; i < len; i++) {
            ~function (i) {
                //if(i===2)console.log(scrollTop+'|'+_offsetTop[i])
                if (scrollTop >= _offsetTop[i] && windowHeight < _offsetTop[i]) {
                    var _className = elems[i].className
                    if (/slideInDown/.test(_className))return
                    elems[i].className = _className + ' slideInDown'
                    elems[i].style.opacity = 1
                } else if (scrollTop < _offsetTop[i] && windowHeight < _offsetTop[i]) {
                    elems[i].className = elems[i].className.replace(/ slideInDown/, '')
                    elems[i].style.opacity = 0
                }
            }(i)
        }
    }
}()

;!function () {
    window.scrollTo = function (id) {
        var elem = qS('#' + id)
        new animate({
            start: document.body.scrollTop,
            end: elem.offsetTop,
        }, function (value) {
            document.body.scrollTop = value - 10
        })
    }
}()