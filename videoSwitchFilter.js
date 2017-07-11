videoSwitchFilter.prototype.init = function () {
    // this._videoWidth = 1280,
    // this._videoHeight = 720,
    this._canvasWidth = 1280
    this._canvasHeight = 720
}


videoSwitchFilter.prototype.render = function (isSwitch) {
    isSwitch
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
    this._canvasTemp = document.createElement('canvas')
}