fileLoader.prototype.loadImage = function (callback) {
    var img = new Image()
    img.src = this._url
    img.onload = function () {
        callback()
    }
}


fileLoader.prototype.loadVideo = function (callback) {
    var video = document.createElement('video')
    video.src = this._url
    video.onload = function () {
        callback()
    }
}



function fileLoader(opt) {
    this._url = opt.url
}
















videoSwitchFilter.prototype.init = function () {
    // this._videoWidth = 1280,
    // this._videoHeight = 720,
    this._canvasWidth = 1280
    this._canvasHeight = 720
    this._maskIdx = 0
    this._canvasTemp = document.createElement('canvas')
    this._canvasTemp.width = this._canvasWidth
    this._canvasTemp.height = this._canvasHeight
    this.canvas = {
        el: this.el,
        ctx: this.el.getContext('2d')
    }
}


videoSwitchFilter.prototype.render = function (isSwitch) {
    if (isSwitch) {

    }
}




function videoSwitchFilter(opt) {
    if (!(this instanceof videoSwitchFilter)) {
        console.error('should use new to create Obj')
        return new videoSwitchFilter(opt)
    }
    this._options = opt
    this.el = this._options.el
    this.resource = this._options.resource
    this.mask = (typeof this._options.mask == 'string')
    this._maskWidth = this._options.masksize.width
    this._maskHeight = this._options.masksize.height
    this._cb = this._options.onUpdate
}