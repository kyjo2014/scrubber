fileLoader.prototype.loadImage = function (callback) {
    var img = new Image()
    img.src = this._url
    img.onload = function () {
        callback()
    }
    return img
}


fileLoader.prototype.loadVideo = function (callback) {
    var video = document.createElement('video')
    video.src = this._url
    video.onload = function () {
        callback()
    }
    return video
}



function fileLoader(opt) {
    this._url = opt.url
}




function isUrl(url) {
    return typeof url == 'string'
}


















videoSwitchFilter.prototype.reverse = function () {
    this.isReverse = !this.isReverse
}

videoSwitchFilter.prototype.pause = function () {
    this._isPause = !0
}

videoSwitchFilter.prototype.resume = function () {
    this._isPause = !1
}



videoSwitchFilter.prototype.next = function () {
    if (this._videoIdx < this.resource.length - 1 && !this._isAnimate) {
        this._isAnimate = true
        this._tempVideoIdx = this._videoIdx + 1
        this._maskIdx = 0
        if (this.isReverse)
            this.reverse()
        this._isSwitching = !0
    } else {
        console.error('at video end')
    }
}

videoSwitchFilter.prototype.prev = function () {

    if (this._videoIdx > 0 && !this._isAnimate) {
        this._isAnimate = true
        this._maskIdx = 101
        this._tempVideoIdx = this._videoIdx - 1

        cavVideo.play()
        tempVideo.play()
        if (!this.isReverse)
            this.reverse()
        this._isSwitching = !0
    } else {
        console.error(' at video start')
    }
}






videoSwitchFilter.prototype.shortMove = function () {
    var _self = this
    this.resume()
    requestAnimationFrame(function () {
        _self.pause()
    })
}






videoSwitchFilter.prototype.init = function () {
    // this._videoWidth = 1280,
    // this._videoHeight = 720,
    var _self = this

    this._canvasWidth = 1280
    this._canvasHeight = 720
    this._videoIdx = 0
    this._tempVideoIdx = 0
    this._maskIdx = 0
    this._canvasTemp = document.createElement('canvas')
    this._canvasTemp.width = this._canvasWidth
    this._canvasTemp.height = this._canvasHeight
    this._isSwitching = !1

    if (isUrl(this.el)) {
        try {
            this.el = document.querySelector(this.el)
        } catch (error) {
            throw new Error('未找到挂载点')
        }
    }


    for (var i = 0; i < this.resource.length; i++) {
        if (isUrl(this.resource[i])) {
            var loader = new fileLoader({
                url: this.resource[i]
            })
            this.resource[i] = loader.loadVideo(_self._storehandle)
        }
    }
    if (typeof this.mask == 'string') {
        var loader = new fileLoader({
            url: this.mask
        })
        this.mask = loader.loadImage(_self._storehandle)
    }
    this.canvas = {
        el: this.el,
        ctx: this.el.getContext('2d')
    }
}


videoSwitchFilter.prototype._storehandle = function () {
    // var len = this.resource.length
    // this._loadedResource = this._loadedResource || 0
    // this._loadedResource++
    //     if (len == this._loadedResource) {
    //         this._cbs['loaded']()
    //     }
}


videoSwitchFilter.prototype.render = function () {
    var cavctx = this.canvas.ctx
    var tempctx = this._canvasTemp.getContext('2d')
    var resource = this.resource
    var cavVideo = this.resource[this._videoIdx]
    var tempVideo = this.resource[this._tempVideoIdx]
    var mask = this.mask
    var cavWidth = this._canvasWidth
    var cavHeight = this._canvasHeight
    var maskwidth = this._maskWidth
    var maskheight = this._maskHeight
    var mask = document.createElement('img')
    mask.src = './img/videomask-0.png'

    if (this._isSwitching) {
        tempctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight)
        tempctx.drawImage(tempVideo, 0, 0, this._canvasWidth, this._canvasHeight)
        if (!this.isReverse) {
            tempctx.globalCompositeOperation = "destination-in"
        } else {
            tempctx.globalCompositeOperation = "destination-out"
        }

        tempctx.drawImage(mask, 162 * this._maskIdx % 6, 92 * Math.floor(this._maskIdx / 6), maskwidth, maskheight, 0, 0, cavWidth, cavHeight)
        console.log(this._maskIdx, this._maskIdx % 6, Math.floor(this._maskIdx / 6))
        tempctx.globalCompositeOperation = "source-over"
        cavctx.globalCompositeOperation = 'source-over'
        cavctx.drawImage(cavVideo, 0, 0, cavWidth, cavHeight)
        cavctx.drawImage(this._canvasTemp, 0, 0, cavWidth, cavHeight)

        if (!this._isPause) {
            if (!this.isReverse)
                this._maskIdx++
                else
                    this._maskIdx--

        }
        if (this._maskIdx == 101 && !this.isReverse) {
            this._isSwitching = !1
            this._maskIdx = 0
            this._videoIdx = this._tempVideoIdx
            this._isAnimate = false
        }
        if (this._maskIdx == 0 && this.isReverse) {
            this._isSwitching = !1
            this._maskIdx = 0
            this._videoIdx = this._tempVideoIdx
            this._isAnimate = false
        }



    } else {
        cavctx.drawImage(cavVideo, 0, 0, cavWidth, cavHeight)
    }
}


videoSwitchFilter.prototype._setUplistener = function () {
    requestAnimationFrame(this._tickhandler)
}


videoSwitchFilter.prototype._tickhandler = function () {
    //  &&this.render()
}





function videoSwitchFilter(opt) {
    if (!(this instanceof videoSwitchFilter)) {
        console.error('should use new to create Obj')
        return new videoSwitchFilter(opt)
    }
    this._options = opt
    this.el = this._options.el
    this.resource = this._options.resource
    this.mask = this._options.mask
    this._maskWidth = this._options.masksize.width
    this._maskHeight = this._options.masksize.height
    this._cb = this._options.onUpdate
}