'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _zenscroll = require('zenscroll');

var _zenscroll2 = _interopRequireDefault(_zenscroll);

var _func = require('./utils/func');

var _scroll = require('./utils/scroll');

var _hash = require('./utils/hash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConfig = {
  offset: 0,
  scrollDuration: 400,
  keepLastAnchorHash: false
};

var Manager = function Manager() {
  var _this = this;

  _classCallCheck(this, Manager);

  this.setContainer = function () {
    // if we have a containerId, find the scrolling container, else set it to window
    if (_this.config.containerId) {
      _this.config.container = document.getElementById(_this.config.containerId);
      _this.config.scroller = _zenscroll2.default.createScroller(_this.config.container, _this.config.scrollDuration, _this.config.offset);
    } else {
      _this.config.container = window;
      _this.config.scroller = _zenscroll2.default;
    }
  };

  this.addListeners = function () {
    _this.config.container.addEventListener('scroll', _this.scrollHandler, false);
    window.addEventListener('hashchange', _this.handleHashChange);
  };

  this.removeListeners = function () {
    _this.config.container.removeEventListener('scroll', _this.scrollHandler, false);
    window.removeEventListener('hashchange', _this.handleHashChange);
  };

  this.configure = function (config) {
    _this.config = _extends({}, defaultConfig, config);
  };

  this.goToTop = function () {
    if ((0, _scroll.getScrollTop)(_this.config.container) === 0) return;
    _this.config.scroller.toY(0, _this.config.scrollDuration);
  };

  this.addAnchor = function (id, component) {
    // if container is not set, set container
    if (!_this.config.container) {
      _this.setContainer();
    }
    // if this is the first anchor, set up listeners
    if (Object.keys(_this.anchors).length === 0) {
      _this.addListeners();
    }
    _this.forceHashUpdate();
    _this.anchors[id] = component;
  };

  this.removeAnchor = function (id) {
    delete _this.anchors[id];
    // if this is the last anchor, remove listeners
    if (Object.keys(_this.anchors).length === 0) {
      _this.removeListeners();
    }
  };

  this.handleScroll = function () {
    var _config = _this.config,
        offset = _config.offset,
        keepLastAnchorHash = _config.keepLastAnchorHash;

    var bestAnchorId = (0, _scroll.getBestAnchorGivenScrollLocation)(_this.anchors, offset, _this.config.container);

    if (bestAnchorId && (0, _hash.getHash)() !== bestAnchorId) {
      _this.forcedHash = true;
      (0, _hash.updateHash)(bestAnchorId, false);
    } else if (!bestAnchorId && !keepLastAnchorHash) {
      (0, _hash.removeHash)();
    }
  };

  this.handleHashChange = function (e) {
    if (_this.forcedHash) {
      _this.forcedHash = false;
    } else {
      _this.goToSection((0, _hash.getHash)());
    }
  };

  this.goToSection = function (id) {
    var container = _this.config.container;
    var element = _this.anchors[id];
    var viewHeight = container.innerHeight || container.clientHeight;
    var offset = _this.config.offset + viewHeight / 2 - (0, _scroll.getOffsetTopToBody)(container);
    if (element) {
      _this.config.scroller.center(element, _this.config.scrollDuration, offset);
    } else {
      // make sure that standard hash anchors don't break.
      // simply jump to them.
      element = document.getElementById(id);
      if (element) {
        _this.config.scroller.center(element, 0, _this.config.offset);
      }
    }
  };

  this.anchors = {};
  this.forcedHash = false;
  this.config = defaultConfig;

  this.scrollHandler = (0, _func.debounce)(this.handleScroll, 100);
  this.forceHashUpdate = (0, _func.debounce)(this.handleHashChange, 1);
};

exports.default = new Manager();