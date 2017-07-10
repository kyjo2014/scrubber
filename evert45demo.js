function(e, t, i) {
    var s = i(9)
      , n = i(16)
      , o = i(32)
      , a = s.Module.extend({
        //小点之间距离px
        DISTANCE_BETWEEN_DOTS: 29,
        //初始化组件的参数
        initialize: function() {
            //lodash的bindAll方法用于对对象中所有方法统一绑定this为某个对象，这里是绑定到对象本身，因为后面有addEvent
            _.bindAll(this, "_tickHandler", "_pointerdownHandler", "_pointermoveHandler", "_pointerupHandler"),
            //初始化组件的参数
            this._position = {
                //屏幕开始点击的位置
                start: {
                    x: 0,
                    y: 0
                },
                //当前鼠标移动到的位置
                end: {
                    x: 0,
                    y: 0
                }
            },
            //禁止组件的行为，避免mousemove直接触发对点位置的更新 
            this.disable()
        },
        //新建组件
        create: function(e) {
            //保存option
            this._options = e,
            //组件的父节点
            this.el = this._options.el,
            //这个不用管
            this._audioModule = new o,
            this.ui = this.ui || {},
            //跟随鼠标的大点
            this.ui.circle = this.el.querySelector(".js-scrubber-circle"),
            //小点的个数，用户自定义
            this.ui.dot = this.el.querySelectorAll(".js-scrubber-dot"),
            //保存小点的引用
            this._dots = [];
            for (var t = 0, i = this.ui.dot.length; t < i; t++)
                //对小点的扩展，增加小点位置和缩放,避免每次计算位置都要重新读取dom元素的属性
                this._dots.push({
                    el: this.ui.dot[t],
                    x: -100,
                    y: -100,
                    scale: 0
                });
            //对大点进行扩展
            this._circle = {
                el: this.ui.circle,
                x: -100,
                y: -100,
                scale: 0
            };
            //为每个小点都初始化css位置，保证css位置和对象中的位置是一致的
            //没法保证组件加载时候小点位置是设想中的位置
            for (var t = 0, i = this._dots.length; t < i; t++)
                dot = this._dots[t],
                TweenMax.to(dot, 0, {
                    x: -100,
                    y: -100,
                    scale: 0,
                    onUpdate: this._updateDot,
                    onUpdateParams: ["{self}"]
                });
            //同样初始化大点
            TweenMax.to(this._circle, 0, {
                x: -100,
                y: -100,
                scale: 0,
                onUpdate: this._updateDot,
                onUpdateParams: ["{self}"]
            }),
            //绑定事件监听器
            this._setupEventListeners()
        },
        //开启组件
        enable: function() {
            this._isEnabled = !0
        },
        //关闭组件
        disable: function() {
            this._isEnabled = !1
        },
        //绑定事件监听函数
        _setupEventListeners: function() {
            //使用TweenMax的ticker，直接监听分发的tick事件，就不用把更新函数插入到每个动画的onUpdate中
            //ticker就相当于实现requestAnimationFrame的回调函数时刻监听页面变化
            TweenMax.ticker.addEventListener("tick", this._tickHandler),
            window.addEventListener("mousedown", this._pointerdownHandler),
            window.addEventListener("mousemove", this._pointermoveHandler),
            window.addEventListener("mouseup", this._pointerupHandler),
            window.addEventListener("touchstart", this._pointerdownHandler),
            window.addEventListener("touchmove", this._pointermoveHandler),
            window.addEventListener("touchend", this._pointerupHandler)
        },
        //重置小点的位置
        _resetDots: function() {
            //_dotsArray是在可视区域里的小点
            if (this._dotsArray)
                for (var e, t = 0, i = this._dotsArray.length; t < i; t++)
                    e = this._dotsArray[t],
                    TweenMax.to(e, 0, {
                        x: -100,
                        y: -100,
                        scale: 0,
                        onUpdate: this._updateDot,
                        onUpdateParams: ["{self}"]
                    });
            //清空可视区域中的点
            this._dotsArray = []
        },
        _updateDots: function(e, t) {
            for (var i, s, n; this._dotsArray.length > e; )
                i = this._dotsArray.pop(),
                TweenMax.to(i, 0, {
                    x: -100,
                    y: -100,
                    scale: 0,
                    onUpdate: this._updateDot,
                    //传入updateDot函数的第一个参数是这个补间动画实例本身
                    onUpdateParams: ["{self}"]
                });
            for (; this._dotsArray.length < e; )
                i = this._dots[this._dotsArray.length],
                i && (this._dotsArray.push(i),
                TweenMax.fromTo(i, .1, {
                    scale: 0
                }, {
                    scale: 1,
                    overwrite: "all",
                    onUpdate: this._updateDot,
                    onUpdateParams: ["{self}"]
                }));
            for (var o = 0, a = this._dotsArray.length; o < a; o++)
                i = this._dotsArray[o],
                s = this._position.start.x,
                n = this._position.start.y + o * this.DISTANCE_BETWEEN_DOTS * t,
                i.x === s && i.y === n || TweenMax.to(i, 0, {
                    x: s,
                    y: n,
                    onUpdate: this._updateDot,
                    onUpdateParams: ["{self}"]
                });
            s = this._position.start.x,
            n = this._position.end.y,
            TweenMax.to(this._circle, 0, {
                x: s,
                y: n,
                onUpdate: this._updateDot,
                onUpdateParams: ["{self}"]
            }),
            this._isCircleVisible || (this._isCircleVisible = !0,
            TweenMax.to(this._circle, .2, {
                scale: 1,
                overwrite: "all",
                ease: Power1.easeOut,
                onUpdate: this._updateDot,
                onUpdateParams: ["{self}"]
            }))
        },
        //隐藏所有的点
        _hideDots: function() {
            if (this._dotsArray) {
                for (var e, t, i = this._dotsArray.length - 1; i >= 0; i--)
                    e = this._dotsArray[i],
                    t = .05 * i,
                    TweenMax.to(e, .3, {
                        scale: 0,
                        delay: t,
                        onUpdate: this._updateDot,
                        onUpdateParams: ["{self}"]
                    });
                this._isCircleVisible = !1,
                t = .05 * Math.max(this._dotsArray.length - 5, 1),
                TweenMax.to(this._circle, .2, {
                    scale: 0,
                    ease: Power1.easeIn,
                    onUpdate: this._updateDot,
                    onUpdateParams: ["{self}"]
                })
            }
        },
        //生命周期:更新
        _update: function() {
            var e = this._position.start.y - this._position.end.y
              , t = Math.abs(e);
            if (!(t < 10)) {
                this._audioModule.beginSound();
                var i = e < 0 ? 1 : -1
                  , s = Math.floor(t / this.DISTANCE_BETWEEN_DOTS);
                s = Math.min(s, this.ui.dot.length),
                this._updateDots(s, i)
            }
        },
        //更新点的位置
        _updateDot: function(e) {
            var t = e.target;
            TweenMax.set(t.el, {
                x: t.x,
                y: t.y,
                scale: t.scale
            })
        },
        //判断是否触发组件的更新状态
        _tick: function() {
            this._isEnabled && this._isPointerdown && this._update()
        },
        //对tick进行简单的包裹一层
        _tickHandler: function() {
            this._tick()
        },
        //鼠标/触屏点击的时候统一的回调函数
        _pointerdownHandler: function(e) {
            //因为事件一般全部绑定到window上，所以要对事件委托进行处理
            this._isButtonWithClass(e.target, ["button-menu", "button-timeline", "button-video"]) || n.getState().isMenuVisible || n.getState().isVideoVisible || (this._isPointerdown = !0,
            this._resetDots(),
            this._position.start.x = e.clientX || e.touches[0].clientX,
            this._position.start.y = e.clientY || e.touches[0].clientY,
            this._position.end.x = e.clientX || e.touches[0].clientX,
            this._position.end.y = e.clientY || e.touches[0].clientY)
        },
        _pointermoveHandler: function(e) {
            if (!n.getState().isMenuVisible && !n.getState().isVideoVisible) {
                if (!this._isPointerdown)
                    return;
                document.querySelector(".region-main").classList.add("is-dragging"),
                this._position.end.x = e.clientX || e.touches && e.touches[0].clientX || 0,
                this._position.end.y = e.clientY || e.touches && e.touches[0].clientY || 0
            }
        },
        _pointerupHandler: function(e) {
            n.getState().isMenuVisible || n.getState().isVideoVisible || (document.querySelector(".region-main").classList.remove("is-dragging"),
            this._audioModule.endSound(),
            this._isPointerdown = !1,
            this._hideDots())
        },
        //用于判断事件触发是否是组件内部元素
        _isButtonWithClass: function(e, t) {
            for (var i, s = t.length; e.parentNode; )
                for (e = e.parentNode,
                i = 0; i < s; i++)
                    if (e.classList && e.classList.contains(t[i]))
                        return e;
            return null
        }
    });
    e.exports = new a
}