'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _index = require('epubjs/lib/index');

var _index2 = _interopRequireDefault(_index);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

global.ePub = _index2.default; // Fix for v3 branch of epub.js -> needs ePub to by a global var

var EpubView = function (_Component) {
  _inherits(EpubView, _Component);

  function EpubView(props) {
    _classCallCheck(this, EpubView);

    var _this = _possibleConstructorReturn(this, (EpubView.__proto__ || Object.getPrototypeOf(EpubView)).call(this, props));

    _this.onLocationChange = function (loc) {
      var _this$props = _this.props,
          location = _this$props.location,
          locationChanged = _this$props.locationChanged;

      var newLocation = loc && loc.start;
      if (location !== newLocation) {
        _this.location = newLocation;
        locationChanged && locationChanged(newLocation);
      }
    };

    _this.handleKeyPress = function (_ref) {
      var key = _ref.key;

      key && key === 'ArrowRight' && _this.nextPage();
      key && key === 'ArrowLeft' && _this.prevPage();
    };

    _this.state = {
      isLoaded: false,
      toc: []
    };
    _this.location = props.location;
    _this.book = _this.rendition = _this.prevPage = _this.nextPage = null;
    return _this;
  }

  _createClass(EpubView, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          url = _props.url,
          tocChanged = _props.tocChanged;
      // use empty options to avoid ArrayBuffer urls being treated as options in epub.js

      var epubOptions = {};
      this.book = new _index2.default(url, epubOptions);
      this.book.loaded.navigation.then(function (_ref2) {
        var toc = _ref2.toc;

        _this2.setState({
          isLoaded: true,
          toc: toc
        }, function () {
          tocChanged && tocChanged(toc);
          _this2.initReader();
        });
      });
      document.addEventListener('keydown', this.handleKeyPress, false);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.book = this.rendition = this.prevPage = this.nextPage = null;
      document.removeEventListener('keydown', this.handleKeyPress, false);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !this.state.isLoaded || nextProps.location !== this.props.location;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.location !== this.props.location && this.location !== this.props.location) {
        this.rendition.display(this.props.location);
      }
    }
  }, {
    key: 'initReader',
    value: function initReader() {
      var _this3 = this;

      var viewer = this.refs.viewer;
      var toc = this.state.toc;
      var _props2 = this.props,
          location = _props2.location,
          epubOptions = _props2.epubOptions,
          getRendition = _props2.getRendition;

      this.rendition = this.book.renderTo(viewer, _extends({
        contained: true,
        width: '100%',
        height: '100%'
      }, epubOptions));
      this.rendition.display(typeof location === 'string' || typeof location === 'number' ? location : toc[0].href);

      this.prevPage = function () {
        _this3.rendition.prev();
      };
      this.nextPage = function () {
        _this3.rendition.next();
      };
      this.rendition.on('locationChanged', this.onLocationChange);
      getRendition && getRendition(this.rendition);
    }
  }, {
    key: 'renderBook',
    value: function renderBook() {
      var styles = this.props.styles;

      return _react2.default.createElement('div', { ref: 'viewer', style: styles.view });
    }
  }, {
    key: 'render',
    value: function render() {
      var isLoaded = this.state.isLoaded;
      var _props3 = this.props,
          loadingView = _props3.loadingView,
          styles = _props3.styles;

      return _react2.default.createElement(
        'div',
        { style: styles.viewHolder },
        isLoaded && this.renderBook() || loadingView
      );
    }
  }]);

  return EpubView;
}(_react.Component);

EpubView.defaultProps = {
  loadingView: null,
  locationChanged: null,
  tocChanged: null,
  styles: _style2.default,
  epubOptions: {}
};

EpubView.propTypes = {
  url: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.instanceOf(ArrayBuffer)]),
  loadingView: _propTypes2.default.element,
  location: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  locationChanged: _propTypes2.default.func,
  tocChanged: _propTypes2.default.func,
  styles: _propTypes2.default.object,
  epubOptions: _propTypes2.default.object,
  getRendition: _propTypes2.default.func
};

exports.default = EpubView;