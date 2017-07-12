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
    this.isReverse = !0
}

videoSwitchFilter.prototype.pause = function () {
    this._isPause = !0
}

videoSwitchFilter.prototype.resume = function () {
    this._isPause = !1
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
    this._maskIdx = 0
    this._canvasTemp = document.createElement('canvas')
    this._canvasTemp.width = this._canvasWidth
    this._canvasTemp.height = this._canvasHeight


    if (isUrl(this.el)) {
        try {
            this.el = document.querySelector(this.el)
        } catch (error) {
            throw new Error('未找到挂载点')
        }
    }

    this
        .resource
        .map(function (resource) {
            if (isUrl(resource)) {
                var loader = new fileLoader(resource)
                return loader.loadVideo(_self._storehandle)
            }
        })


    this.canvas = {
        el: this.el,
        ctx: this.el.getContext('2d')
    }
}


videoSwitchFilter.prototype._storehandle = function () {
    var len = this.resource.length
    this._loadedResource = this._loadedResource || 0
    this._loadedResource++
        if (len == this._loadedResource) {
            this._cbs['loaded']()
        }
}


videoSwitchFilter.prototype.render = function (isSwitch) {
    var cavctx = this.canvas.ctx
    var cavTempctx = this._canvasTemp.getContext('2d')
    var col = 0
    var row = 0
    if (col > 5) {
        row++
        col = 1
    }

    //测试用的
    if (row > 15) {
        row = 1
    }


    if (isSwitch) {
        col++
    }
    cavTempctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight)
    cavTempctx.globalCompositeOperation = "source-over"
    cavTempctx.drawImage(this.resource[this._videoIdx + 1], 0, 0, this._canvasWidth, this._canvasHeight)
    cavTempctx.globalCompositeOperation = "destination-in"
    cavTempctx.drawImage(this.mask,
        this._maskWidth * col,
        this._maskHeight * row,
        this._maskWidth,
        this._maskHeight,
        0,
        0,
        this._canvasWidth,
        this._canvasHeight
    )
    cavctx.drawImage(this.resource[this._videoIdx], 0, 0, this._canvasWidth, this._canvasHeight)
    cavctx.drawImage(this._canvasTemp, 0, 0, this._canvasWidth, this._canvasHeight)

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