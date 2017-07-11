function(e, t, i) {
    var s = i(45)
      , n = i(9)
      , o = i(14)
      , a = i(28)
      , r = i(51)
      , h = i(43)
      , l = i(52)
      , c = i(11)
      , u = i(53)
      , d = i(16)
      , p = i(19)
      , m = i(23);
    i(25);
    e.exports = n.Component.extend({
        initialize: function(e) {
            _.bindAll(this, "_tickHandler"),
            this._isWide = c.isMediaQueryActive("narrow") || c.isMediaQueryActive("regular") || c.isMediaQueryActive("wide"),
            this._blur = 4,
            this._tweenObj = {
                alpha: 0,
                colorOverlayAlpha: .37,
                colorOverlayGreen: 38
            },
            this._videoWidth = 1280,
            this._videoHeight = 720,
            this._canvasWidth = 1280,
            this._canvasHeight = 720,
            this._fileLoader = new a,
            this._foreground = e.foreground
        },
        onInitialized: function() {
            this._canvasBackground = this.el || document.createElement("canvas"),
            this._canvasBackground.width = this._canvasWidth,
            this._canvasBackground.height = this._canvasHeight,
            this._ctxBackground = this._canvasBackground.getContext("2d"),
            this._canvasBackgroundTemp = document.createElement("canvas"),
            this._canvasBackgroundTemp.width = this._canvasWidth,
            this._canvasBackgroundTemp.height = this._canvasHeight,
            this._ctxBackgroundTemp = this._canvasBackgroundTemp.getContext("2d"),
            this._canvasBlur = document.createElement("canvas"),
            this._canvasBlur.width = this._canvasWidth / this._blur,
            this._canvasBlur.height = this._canvasHeight / this._blur,
            this._ctxBlur = this._canvasBlur.getContext("2d"),
            this._canvasBlurTemp = document.createElement("canvas"),
            this._canvasBlurTemp.width = this._canvasWidth / this._blur,
            this._canvasBlurTemp.height = this._canvasHeight / this._blur,
            this._ctxBlurTemp = this._canvasBlurTemp.getContext("2d"),
            this._canvasForeground = this._foreground || document.createElement("canvas"),
            this._canvasForeground.width = this._canvasWidth,
            this._canvasForeground.height = this._canvasHeight,
            this._ctxForeground = this._canvasForeground.getContext("2d"),
            //创造mask
            this._mask = new h({
                devicePixelRatio: 1,
                scale: 8,
                el: this._canvasBackgroundTemp,
                autoRender: !1,
                //mask0是后面视频首次出现时的白色过场,
                images: [this._fileLoader.getFile("videomask-0"), this._fileLoader.getFile("videomask-1")],
                frames: this._getFrames()
            }),
            this._maskPreloader = new h({
                devicePixelRatio: 1,
                scale: 8,
                el: this._canvasBackground,
                autoRender: !1,
                images: [this._fileLoader.getFile("videomask-0"), this._fileLoader.getFile("videomask-1")],
                frames: this._getFrames()
            }),
            this._createLayers(),
            this._setupEventListeners(),
            this._resize()
        },
        //一开始加载的时候显示
        show: function() {
            TweenMax.fromTo(this._maskPreloader, 50, {
                frame: 0
            }, {
                frame: 100,
                //对每一帧进行计算取代基于秒的
                useFrames: !0,
                roundProps: "frame",
                ease: Power0.easeNone
            }),
            TweenMax.to(this._tweenObj, 1, {
                colorOverlayAlpha: .2,
                colorOverlayGreen: 0,
                delay: 5,
                ease: Power0.easeNone
            })
        },
        _setupEventListeners: function() {
            this.listenTo(d, "update", this._storeHandler),
            TweenMax.ticker.addEventListener("tick", this._tickHandler),
            this.listenTo(o, "resize", this._resizeHandler),
            this.listenTo(o, "resize:complete", this._resizeHandler)
        },
        _createLayers: function() {
            this._layers = [];
            for (var e, t = 0, i = p.models.length; t < i; t++)
                e = new g({
                    model: p.at(t)
                }),
                this._layers.push(e)
        },
        _createTimeline: function() {
            for (var e, t, i = 100, s = -Math.max(.75 * o.viewportHeight(), i), n = 0, a = this._layers.length; n < a; n++)
                e = p.at(n).get("instance"),
                t = this._layers[n],
                t.setFrameStart(s),
                s += e.getHeight(),
                m.timeline.add(new TweenMax.fromTo(this._mask,i,{
                    frame: 0
                },{
                    frame: 100,
                    roundProps: "frame",
                    ease: Power0.easeNone
                }), s),
                t.setFrameEnd(s + i)
        },
        _resize: function() {
            if (this._canRenderForeground = c.isMediaQueryActive("narrow") || c.isMediaQueryActive("regular") || c.isMediaQueryActive("wide"),
            this._size = r.getSize(o.viewportWidth(), o.viewportHeight(), this._canvasWidth, this._canvasHeight),
            this._canvasBackground.style.top = this._size.y + "px",
            this._canvasBackground.style.left = this._size.x + "px",
            this._canvasBackground.style.width = this._size.width + "px",
            this._canvasBackground.style.height = this._size.height + "px",
            this._shade = this._ctxBackground.createLinearGradient(0, 0, this._canvasWidth, 0),
            this._shade.addColorStop(.6, "rgba(0,0,0,0)"),
            this._shade.addColorStop(1, "rgba(0,0,0,0.5)"),
            this._canRenderForeground) {
                this._canvasForeground.style.top = this._size.y + "px",
                this._canvasForeground.style.left = this._size.x + "px",
                this._canvasForeground.style.width = this._size.width + "px",
                this._canvasForeground.style.height = this._size.height + "px";
                var e = 1 / this._canvasHeight * (5 + -this._size.y)
                  , t = 1 / this._canvasHeight * (60 + -this._size.y);
                this._gradient = this._ctxForeground.createLinearGradient(0, 0, 0, this._canvasHeight),
                this._gradient.addColorStop(0, "rgba(0,0,0,1)"),
                this._gradient.addColorStop(e, "rgba(0,0,0,1)"),
                this._gradient.addColorStop(t, "rgba(0,0,0,0)"),
                this._gradient.addColorStop(1 - t, "rgba(0,0,0,0)"),
                this._gradient.addColorStop(1 - e, "rgba(0,0,0,1)"),
                this._gradient.addColorStop(1, "rgba(0,0,0,1)")
            }
            this._createTimeline()
        },
        _tick: function() {
            this._i = this._i || 0,
            this._i % 2 === 0 && this._draw(),
            this._i++,
            this._i >= 10 && (this._i = 0)
        },
        //重点:背景的canvas的绘图全在这个函数
        _draw: function() {
            for (var e = [], t = 0, i = this._layers.length; t < i; t++)
                this._layers[t].isVisible() && e.push(this._layers[t]);
            if (0 !== e.length) {
                //这里的ifelse用来判断是否正在进行两个视频的切换，从而应用转场
                if (this._ctxBackground.globalCompositeOperation = "source-over",
                e.length > 1)
                    for (var s = e.length - 1; s >= 0; s--)
                        s === e.length - 1 ? (this._ctxBackgroundTemp.clearRect(0, 0, this._canvasWidth, this._canvasHeight),
                        this._ctxBackgroundTemp.globalCompositeOperation = "source-over",
                        this._ctxBackgroundTemp.drawImage(e[s].get(), 0, 0, this._canvasWidth, this._canvasHeight),
                        this._ctxBackgroundTemp.globalCompositeOperation = "destination-in",
                        this._mask.render()) : (this._ctxBackground.drawImage(e[s].get(), 0, 0, this._canvasWidth, this._canvasHeight),
                        this._ctxBackground.drawImage(this._canvasBackgroundTemp, 0, 0));
                else
                    e[0].get() && this._ctxBackground.drawImage(e[0].get(), 0, 0, this._canvasWidth, this._canvasHeight);
                this._tweenObj.colorOverlayAlpha > 0 && (this._ctxBackground.globalCompositeOperation = "source-over",
                this._ctxBackground.fillStyle = "rgba(0, " + Math.round(this._tweenObj.colorOverlayGreen) + ", 0, " + this._tweenObj.colorOverlayAlpha + ")",
                this._ctxBackground.fillRect(0, 0, this._canvasWidth, this._canvasHeight)),
                this._ctxBackground.globalCompositeOperation = "source-over",
                this._ctxBackground.fillStyle = this._shade,
                this._ctxBackground.fillRect(0, 0, this._canvasWidth, this._canvasHeight),
                this._maskPreloader.frame() < 100 && (this._ctxBackground.globalCompositeOperation = "destination-in",
                this._maskPreloader.render()),
                this._ctxBackground.globalCompositeOperation = "source-over",
                this._ctxBlur.clearRect(0, 0, this._canvasBlur.width, this._canvasBlur.height),
                this._ctxBlur.globalAlpha = this._tweenObj.alpha,
                this._ctxBlur.drawImage(this._canvasBlurTemp, 0, 0),
                this._ctxBlur.fillStyle = "rgba(0, 0, 0, 0.5)",
                this._ctxBlur.fillRect(0, 0, this._canvasWidth, this._canvasHeight),
                this._ctxBackground.drawImage(this._canvasBlur, 0, 0, this._canvasWidth, this._canvasHeight),
                this._ctxForeground.clearRect(0, 0, this._canvasWidth, this._canvasHeight),
                this._ctxForeground.globalCompositeOperation = "source-over",
                this._ctxForeground.fillStyle = this._gradient,
                this._ctxForeground.fillRect(0, 0, this._canvasWidth, this._canvasHeight),
                this._ctxForeground.globalCompositeOperation = "source-in",
                this._ctxForeground.drawImage(this._canvasBackground, 0, 0)
            }
        },
        _doUnblur: function() {
            this._isBlurred && (this._isBlurred = !1,
            this._didBlur ? TweenMax.to(this._tweenObj, .5, {
                alpha: 0,
                ease: Power0.easeNone
            }) : TweenMax.to(this._tweenObj, .5, {
                alpha: 0,
                ease: Power0.easeNone
            }))
        },
        _doBlur: function() {
            if (!this._isBlurred) {
                this._isBlurred = !0;
                var e = c.isMediaQueryActive("narrow") || c.isMediaQueryActive("regular") || c.isMediaQueryActive("wide")
                  , t = e ? 2 : 4;
                this._ctxBlurTemp.drawImage(this._canvasBackground, 0, 0, this._canvasWidth, this._canvasHeight, 0, 0, this._canvasWidth / this._blur, this._canvasHeight / this._blur),
                this._didBlur = u.blurCanvas(this._canvasBlurTemp, 0, 0, this._canvasBlurTemp.width, this._canvasBlurTemp.height, t, 2),
                this._didBlur ? TweenMax.to(this._tweenObj, .5, {
                    alpha: 1,
                    ease: Power0.easeNone
                }) : (this._canvasBlur.width = this._canvasWidth,
                this._canvasBlur.height = this._canvasHeight,
                this._canvasBlurTemp.width = this._canvasWidth,
                this._canvasBlurTemp.height = this._canvasHeight,
                this._ctxBlurTemp.drawImage(this._canvasBackground, 0, 0),
                TweenMax.to(this._tweenObj, .5, {
                    alpha: 1,
                    ease: Power0.easeNone
                }))
            }
        },
        _resizeHandler: function() {
            this._resize()
        },
        _tickHandler: function() {
            this._tick()
        },
        _storeHandler: function(e) {
            e.isMenuVisible ? this._doBlur() : this._doUnblur()
        },
        _getFrames: function() {
            return [[1, 1, 3, 3, 0, 0, 0], [6, 1, 160, 90, 0, 0, 0], [168, 1, 160, 90, 0, 0, 0], [330, 1, 160, 90, 0, 0, 0], [492, 1, 160, 90, 0, 0, 0], [654, 1, 160, 90, 0, 0, 0], [1, 93, 160, 90, 0, 0, 0], [163, 93, 160, 90, 0, 0, 0], [325, 93, 160, 90, 0, 0, 0], [487, 93, 160, 90, 0, 0, 0], [649, 93, 160, 90, 0, 0, 0], [811, 93, 160, 90, 0, 0, 0], [1, 185, 160, 90, 0, 0, 0], [163, 185, 160, 90, 0, 0, 0], [325, 185, 160, 90, 0, 0, 0], [487, 185, 160, 90, 0, 0, 0], [649, 185, 160, 90, 0, 0, 0], [811, 185, 160, 90, 0, 0, 0], [1, 277, 160, 90, 0, 0, 0], [163, 277, 160, 90, 0, 0, 0], [325, 277, 160, 90, 0, 0, 0], [487, 277, 160, 90, 0, 0, 0], [649, 277, 160, 90, 0, 0, 0], [811, 277, 160, 90, 0, 0, 0], [1, 369, 160, 90, 0, 0, 0], [163, 369, 160, 90, 0, 0, 0], [325, 369, 160, 90, 0, 0, 0], [487, 369, 160, 90, 0, 0, 0], [649, 369, 160, 90, 0, 0, 0], [811, 369, 160, 90, 0, 0, 0], [1, 461, 160, 90, 0, 0, 0], [163, 461, 160, 90, 0, 0, 0], [325, 461, 160, 90, 0, 0, 0], [487, 461, 160, 90, 0, 0, 0], [649, 461, 160, 90, 0, 0, 0], [811, 461, 160, 90, 0, 0, 0], [1, 553, 160, 90, 0, 0, 0], [163, 553, 160, 90, 0, 0, 0], [325, 553, 160, 90, 0, 0, 0], [487, 553, 160, 90, 0, 0, 0], [649, 553, 160, 90, 0, 0, 0], [811, 553, 160, 90, 0, 0, 0], [1, 645, 160, 90, 0, 0, 0], [163, 645, 160, 90, 0, 0, 0], [325, 645, 160, 90, 0, 0, 0], [487, 645, 160, 90, 0, 0, 0], [649, 645, 160, 90, 0, 0, 0], [811, 645, 160, 90, 0, 0, 0], [1, 737, 160, 90, 0, 0, 0], [163, 737, 160, 90, 0, 0, 0], [325, 737, 160, 90, 0, 0, 0], [487, 737, 160, 90, 0, 0, 0], [649, 737, 160, 90, 0, 0, 0], [811, 737, 160, 90, 0, 0, 0], [1, 829, 160, 90, 0, 0, 0], [163, 829, 160, 90, 0, 0, 0], [325, 829, 160, 90, 0, 0, 0], [487, 829, 160, 90, 0, 0, 0], [649, 829, 160, 90, 0, 0, 0], [811, 829, 160, 90, 0, 0, 0], [1, 921, 160, 90, 0, 0, 0], [163, 921, 160, 90, 0, 0, 0], [325, 921, 160, 90, 0, 0, 0], [487, 921, 160, 90, 0, 0, 0], [649, 921, 160, 90, 0, 0, 0], [811, 921, 160, 90, 0, 0, 0], [1, 1013, 160, 90, 0, 0, 0], [163, 1013, 160, 90, 0, 0, 0], [325, 1013, 160, 90, 0, 0, 0], [487, 1013, 160, 90, 0, 0, 0], [649, 1013, 160, 90, 0, 0, 0], [811, 1013, 160, 90, 0, 0, 0], [1, 1105, 160, 90, 0, 0, 0], [163, 1105, 160, 90, 0, 0, 0], [325, 1105, 160, 90, 0, 0, 0], [487, 1105, 160, 90, 0, 0, 0], [649, 1105, 160, 90, 0, 0, 0], [811, 1105, 160, 90, 0, 0, 0], [1, 1197, 160, 90, 0, 0, 0], [163, 1197, 160, 90, 0, 0, 0], [325, 1197, 160, 90, 0, 0, 0], [487, 1197, 160, 90, 0, 0, 0], [649, 1197, 160, 90, 0, 0, 0], [811, 1197, 160, 90, 0, 0, 0], [1, 1289, 160, 90, 0, 0, 0], [163, 1289, 160, 90, 0, 0, 0], [325, 1289, 160, 90, 0, 0, 0], [487, 1289, 160, 90, 0, 0, 0], [649, 1289, 160, 90, 0, 0, 0], [811, 1289, 160, 90, 0, 0, 0], [1, 1381, 160, 90, 0, 0, 0], [163, 1381, 160, 90, 0, 0, 0], [325, 1381, 160, 90, 0, 0, 0], [487, 1381, 160, 90, 0, 0, 0], [649, 1381, 160, 90, 0, 0, 0], [811, 1381, 160, 90, 0, 0, 0], [1, 1473, 160, 90, 0, 0, 0], [163, 1473, 160, 90, 0, 0, 0], [325, 1473, 160, 90, 0, 0, 0], [487, 1473, 160, 90, 0, 0, 0], [649, 1473, 160, 90, 0, 0, 0]]
        }
    });
    var g = n.Module.extend({
        initialize: function(e) {
            _.bindAll(this, "_playPromiseCatchHandler"),
            this._isWide = c.isMediaQueryActive("narrow") || c.isMediaQueryActive("regular") || c.isMediaQueryActive("wide"),
            this.model = e.model,
            this._fileLoader = new a,
            this._source = Settings.cdnURL + this.model.get("video")
        },
        isVisible: function() {
            var e = m.timeline.time() >= this._frameStart && m.timeline.time() < this._frameEnd;
            return e ? this._obtainVideo() : this._recycleVideo(),
            e
        },
        setFrameStart: function(e) {
            return this._frameStart = e,
            this._frameStart
        },
        getFrameStart: function() {
            return this._frameStart || 0
        },
        setFrameEnd: function(e) {
            return this._frameEnd = e,
            this._frameEnd
        },
        getFrameEnd: function() {
            return this._frameEnd || 0
        },
        get: function() {
            var e = Settings.agent.isMobile ? this._fileLoader.getFile(this.model.get("video_mobile_poster")) : this._fileLoader.getFile(this.model.get("video_poster"));
            return this._video && this._video.currentTime > .01 ? this._video || e : e
        },
        _obtainVideo: function() {
            this._isVideoActive || (this._isVideoActive = !0,
            this._videoModule = v.obtain(),
            this._video = this._videoModule.get(),
            this.model.get("video") && (this._video.src = this._source,
            this._playPromise = this._video.play(),
            this._playPromise && this._playPromise.catch(this._playPromiseCatchHandler)))
        },
        _recycleVideo: function() {
            this._isVideoActive && (this._isVideoActive = !1,
            this._video.pause(),
            this._video.src = "",
            this._video = null,
            v.recycle(this._videoModule))
        },
        _playPromiseCatchHandler: function(e) {}
    })
      , f = n.Module.extend({
        initialize: function(e) {
            this._video = document.createElement("video"),
            this._video.playsinline = !0,
            this._video.muted = !0,
            this._video.autoplay = !0,
            this._video.crossOrigin = "anonymous",
            this._video.volume = 0,
            (Settings.agent.isMobile || Settings.agent.isTablet) && (/iPhone|iPod|iPad/.test(navigator.platform) ? s(this._video, {
                iPad: !0
            }) : console.warn("iphone-inline-video not used on emulated devices"))
        },
        get: function() {
            return this._video
        }
    })
      , v = new l(4,f,{})
}