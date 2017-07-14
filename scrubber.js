var scrubber = function (opt) {



    //初始化状态
    scrubber.prototype.init = function () {
        this._position = {
            //拖动开始点
            start: {
                x: 0,
                y: 0
            },
            //拖动结束点
            end: {
                x: 0,
                y: 0
            }
        }
        //组件默认关闭
        this.disable()
    }

    //组件完成
    scrubber.prototype._create = function (cb) {
        var cbs = this.cbs['create']
        var _self = this
        cbs.forEach(function (cb) {
            cb.call(_self)
        })
    }


    //开启组件
    scrubber.prototype.enable = function () {
        this._isEnabled = !0
    }

    //关闭组件
    scrubber.prototype.disable = function () {
        this._isEnabled = !1
    }

    //组件绑定事件
    scrubber.prototype._setupEventListeners = function () {
        var _self = this
        //触发每帧渲染
        TweenMax.ticker.addEventListener("tick", this._tickHandler.bind(this))
        window.addEventListener("mousedown", this._pointerdownHandler.bind(this))
        window.addEventListener("mousemove", this._pointermoveHandler.bind(this))
        window.addEventListener("mouseup", this._pointerupHandler.bind(this))
        window.addEventListener("touchstart", this._pointerdownHandler.bind(this))
        window.addEventListener("touchmove", this._pointermoveHandler.bind(this))
        window.addEventListener("touchend", this._pointerupHandler.bind(this))
    }

    scrubber.prototype._pointerdownHandler = function (e) {
        this._isPointerdown = !0
        this._resetDots()
        this._position.start.x = e.clientX || e.touches[0].clientX
        this._position.start.y = e.clientY || e.touches[0].clientY
        this._position.end.x = e.clientX || e.touches[0].clientX
        this._position.end.y = e.clientY || e.touches[0].clientY
    }


    scrubber.prototype._pointermoveHandler = function (e) {
        e.preventDefault()
        if (!this._isPointerdown) {
            return;
        }
        this._position.end.x = e.clientX || e.touches && e.touches[0].clientX || 0
        this._position.end.y = e.clientY || e.touches && e.touches[0].clientY || 0
    }

    scrubber.prototype._pointerupHandler = function (e) {
        this._isPointerdown = !1
        this._hideDots()
        this._end(e)
    }


    scrubber.prototype._end = function (e) {
        var cbs = this.cbs['end']
        var _self = this
        cbs.forEach(function (cb) {
            cb.call(_self, e)
        })
    }
    scrubber.prototype._tickHandler = function () {
        this._tick()
    }


    scrubber.prototype._tick = function () {
        this._isEnabled && this._isPointerdown && this._update()
    }

    scrubber.prototype._update = function () {
        var disY = this._position.start.y - this._position.end.y
        var disX = this._position.start.x - this._position.end.x
        var dirY = disY < 0 ? 1 : -1
        var dirX = disX < 0 ? 1 : -1
        disY = Math.abs(disY)
        disX = Math.abs(disX)
        var dotInSightAmount = 0
        var _self = this
        this.cbs['update'].forEach(function (cb) {
            cb.call(_self, [disX, disY, dirX, dirY])
        })
        if (!(disY < 10)) {
            dotInSightAmount = Math.floor(disY / this.DISTANCE_BETWEEN_DOTS)
            dotInSightAmount = Math.min(dotInSightAmount, this.ui.dot.length)
            this._updateDots(dotInSightAmount, dirY)
        }
    }

    scrubber.prototype._updateDots = function (amount, dir) {
        var startX = this._position.start.x
        var startY = this._position.start.y
        var endX = this._position.end.x
        var endY = this._position.end.y
        var DISTANCE_BETWEEN_DOTS = this.DISTANCE_BETWEEN_DOTS
        var _self = this
        for (var dot; this._dotsArray.length > amount;) {
            dot = this._dotsArray.pop()
            TweenMax.to(dot, 0, {
                x: -100,
                y: 100,
                scale: 0,
                onUpdate: this._updateDot,
                onUpdateParams: ["{self}"]
            })

        }
        for (var dot; this._dotsArray.length < amount;) {
            dot = this._dots[this._dotsArray.length]
            dot && (
                this._dotsArray.push(dot),
                TweenMax.fromTo(dot, .1, {
                    scale: 0
                }, {
                    scale: 1,
                    overwrite: "all",
                    onUpdate: this._updateDot,
                    onUpdateParams: ["{self}"]
                })
            )
        }
        this._dotsArray.forEach(function (dot, idx) {
            var dotY = startY + idx * DISTANCE_BETWEEN_DOTS * dir
            var dotX = startX
            dot.x === dotX && dot.y === dotY || TweenMax.to(dot, 0, {
                x: dotX,
                y: dotY,
                onUpdate: _self._updateDot,
                onUpdateParams: ["{self}"]
            })
        })
        TweenMax.to(this._circle, 0, {
            x: startX,
            y: endY,
            onUpdate: this._updateDot,
            onUpdateParams: ["{self}"]
        })
        this._isCircleVisible || (this._isCircleVisible = !0,
            TweenMax.to(this._circle, .2, {
                scale: 1,
                overwrite: "all",
                ease: Power1.easeOut,
                onUpdate: this._updateDot,
                onUpdateParams: ["{self}"]
            }))
    }


    scrubber.prototype._hideDots = function () {
        var _self = this
        var delay = 0
        if (this._dotsArray) {
            var len = this._dotsArray.length
            this._dotsArray.forEach(function (dot, idx) {
                delay = .05 * (len - idx)
                TweenMax.to(dot, .3, {
                    scale: 0,
                    delay: delay,
                    onUpdate: _self._updateDot,
                    onUpdateParams: ["{self}", 'hide']
                })
            })
            this._isCircleVisible = !1
            t = .05 * Math.max(this._dotsArray.length - 5, 1)
            TweenMax.to(this._circle, .2, {
                scale: 0,
                ease: Power1.easeIn,
                onUpdate: this._updateDot,
                onUpdateParams: ["{self}"]
            })
        }
    }


    scrubber.prototype._updateDot = function (e, wtf) {
        try {

            var dot = e.target
            TweenMax.set(dot.el, {
                x: dot.x,
                y: dot.y,
                scale: dot.scale
            })
        } catch (error) {
            // console.log(e,wtf)
        }


    }



    scrubber.prototype._resetDots = function () {
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
    }


    function scrubber(opt) {
        var _self = this
        var hooks = ['create', 'begin', 'update', 'end']
        this.DISTANCE_BETWEEN_DOTS = opt.distance || 29
        this._options = opt //初始化参数

        this.el = this._options.el //根节点
        this.ui = this.ui || {}
        this._options.circle = this._options.circle || '.js-scrubber-circle'
        this._options.dot = this._options.dot || '.js-scrubber-dot'
        try {
            this.ui.circle = this.el.querySelector(this._options.circle)
            this.ui.dot = this.el.querySelectorAll(this._options.dot)
        } catch (error) {
            throw new Error('can not find mounts point')
            return
        }
        this._dots = []
        this.cbs = []
        //生命周期钩子
        hooks.forEach(function (hook) {
            var cbs = opt[hook]
            _self.cbs[hook] = []
            if (cbs) {
                if (Object.prototype.toString.call(cbs) === '[object Array]') {
                    cbs.forEach(function (cb) {
                        _self.cbs[hook].push(cb)
                    })
                } else {
                    var cb = cbs
                    _self.cbs[hook].push(cb)
                }
            }
        })
        Array.prototype.forEach.call(this.ui.dot, function (dot) {
            _self._dots.push({
                el: dot,
                x: -100,
                y: -100,
                scale: 0
            })
        })
        if (this._dots.length < 1) {
            console.warn('need at least one dot')
        }


        this._circle = {
            el: this.ui.circle,
            x: -100,
            y: -100,
            scale: 0
        }
        this._dots.forEach(function (dot) {
            TweenMax.to(dot, 0, {
                x: -100,
                y: -100,
                scale: 0,
                onUpdate: this._updateDot,
                onUpdateParams: ["{self}"]
            })
        })
        TweenMax.to(this._circle, 0, {
            x: -100,
            y: -100,
            scale: 0,
            onUpdate: this._updateDot,
            onUpdateParams: ["{self}"]
        })
        this.init()
        this._setupEventListeners()
        this._create()
    }

    return new scrubber(opt)

}


// if(module) {
//     module.exports = scrubber
// }