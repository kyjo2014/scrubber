var expect = chai.expect
var config = {
  el: document.querySelector('.scrubber'),
  circle: '',
  dot: '',
  distance: 29,
  create: function (e) {},
  begin: function (e) {},
  update: function () {},
  end: function (e) {}
}

window.console.warn = function (msg) {
  window.console._warnMsg = msg
}
describe('scrubber.js test', function () {
  it('need mount point', function () {
    try {
      new scrubber({})
    } catch (error) {
      console.log(error)
    }

    expect(errMsg).to.eql('Error: can not find mounts point')
  })

  it('dot amount should > 0', function () {
    config.dot = '.null'
    var a = new scrubber(config)
    expect(window.console._warnMsg).to.eql('need at least one dot')
  })

  it('dot should has default val', function () {
    config.dot = undefined
    var a = new scrubber(config)
    expect(a._options.dot).to.eql('.js-scrubber-dot')
  })
  describe('#update', function () {
    before(function (done) {
      window._update = null
      window.test1 = true
      config.update = function (e) {
        window._update = e
        if(window.test1) {
           done()
           window.test1 = false
        }
        
      }
      var a = new scrubber(config)
      a.enable()
      var eventDown = document.createEvent('HTMLEvents')
      eventDown.initEvent("mousedown", true, true)
      eventDown.clientX = 100
      eventDown.clientY = 100
      document.body.dispatchEvent(eventDown)
      var event = document.createEvent('HTMLEvents')
      event.initEvent("mousemove", false, true)
      document.body.dispatchEvent(event)
      document.body.dispatchEvent(eventDown)
    })
    it('slide should log update', function () {
      expect(window._update).to.not.null
    })

  })

});