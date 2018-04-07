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

var _reactSwipeable = require('react-swipeable');

var _reactSwipeable2 = _interopRequireDefault(_reactSwipeable);

var _ = require('..');

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TocItem = function (_PureComponent) {
  _inherits(TocItem, _PureComponent);

  function TocItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TocItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TocItem.__proto__ || Object.getPrototypeOf(TocItem)).call.apply(_ref, [this].concat(args))), _this), _this.setLocation = function () {
      _this.props.setLocation(_this.props.href);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TocItem, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          label = _props.label,
          styles = _props.styles;

      return _react2.default.createElement(
        'button',
        { onClick: this.setLocation, style: styles },
        label
      );
    }
  }]);

  return TocItem;
}(_react.PureComponent);

TocItem.propTypes = {
  label: _propTypes2.default.string,
  href: _propTypes2.default.string,
  setLocation: _propTypes2.default.func,
  styles: _propTypes2.default.object
};

var ReactReader = function (_PureComponent2) {
  _inherits(ReactReader, _PureComponent2);

  function ReactReader(props) {
    _classCallCheck(this, ReactReader);

    var _this2 = _possibleConstructorReturn(this, (ReactReader.__proto__ || Object.getPrototypeOf(ReactReader)).call(this, props));

    _this2.toggleToc = function () {
      _this2.setState({
        expanedToc: !_this2.state.expanedToc
      });
    };

    _this2.next = function () {
      _this2.refs.reader.nextPage();
    };

    _this2.prev = function () {
      _this2.refs.reader.prevPage();
    };

    _this2.onTocChange = function (toc) {
      var tocChanged = _this2.props.tocChanged;

      _this2.setState({
        toc: toc
      }, function () {
        return tocChanged && tocChanged(toc);
      });
    };

    _this2.setLocation = function (loc) {
      var locationChanged = _this2.props.locationChanged;

      _this2.setState({
        expanedToc: false
      }, function () {
        return locationChanged && locationChanged(loc);
      });
    };

    _this2.state = {
      expanedToc: false,
      toc: false
    };
    return _this2;
  }

  _createClass(ReactReader, [{
    key: 'renderToc',
    value: function renderToc() {
      var _this3 = this;

      var _state = this.state,
          toc = _state.toc,
          expanedToc = _state.expanedToc;
      var styles = this.props.styles;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { style: styles.tocArea },
          _react2.default.createElement(
            'div',
            { style: styles.toc },
            toc.map(function (item, i) {
              return _react2.default.createElement(TocItem, _extends({ key: item.href }, item, { setLocation: _this3.setLocation, styles: styles.tocAreaButton }));
            })
          )
        ),
        expanedToc && _react2.default.createElement('div', { style: styles.tocBackground, onClick: this.toggleToc })
      );
    }
  }, {
    key: 'renderTocToggle',
    value: function renderTocToggle() {
      var expanedToc = this.state.expanedToc;
      var styles = this.props.styles;

      return _react2.default.createElement(
        'button',
        { style: Object.assign({}, styles.tocButton, expanedToc ? styles.tocButtonExpaned : {}), onClick: this.toggleToc },
        _react2.default.createElement('span', { style: Object.assign({}, styles.tocButtonBar, styles.tocButtonBarTop) }),
        _react2.default.createElement('span', { style: Object.assign({}, styles.tocButtonBar, styles.tocButtonBottom) })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          url = _props2.url,
          title = _props2.title,
          showToc = _props2.showToc,
          loadingView = _props2.loadingView,
          epubOptions = _props2.epubOptions,
          styles = _props2.styles,
          getRendition = _props2.getRendition,
          locationChanged = _props2.locationChanged,
          location = _props2.location,
          swipeable = _props2.swipeable;
      var _state2 = this.state,
          toc = _state2.toc,
          expanedToc = _state2.expanedToc;

      return _react2.default.createElement(
        'div',
        { style: styles.container },
        _react2.default.createElement(
          'div',
          { style: Object.assign({}, styles.readerArea, expanedToc ? styles.containerExpaned : {}) },
          showToc && this.renderTocToggle(),
          _react2.default.createElement(
            'div',
            { style: styles.titleArea },
            title
          ),
          _react2.default.createElement(
            _reactSwipeable2.default,
            {
              onSwipedRight: this.prev,
              onSwipedLeft: this.next,
              trackMouse: true
            },
            _react2.default.createElement(
              'div',
              { style: styles.reader },
              _react2.default.createElement(_.EpubView, {
                ref: 'reader',
                url: url,
                location: location,
                loadingView: loadingView,
                tocChanged: this.onTocChange,
                locationChanged: locationChanged,
                epubOptions: epubOptions,
                getRendition: getRendition
              }),
              swipeable && _react2.default.createElement('div', { style: styles.swipeWrapper })
            )
          ),
          _react2.default.createElement(
            'button',
            { style: Object.assign({}, styles.arrow, styles.prev), onClick: this.prev },
            '\u2039'
          ),
          _react2.default.createElement(
            'button',
            { style: Object.assign({}, styles.arrow, styles.next), onClick: this.next },
            '\u203A'
          )
        ),
        showToc && toc && this.renderToc()
      );
    }
  }]);

  return ReactReader;
}(_react.PureComponent);

ReactReader.defaultProps = {
  loadingView: _react2.default.createElement(
    'div',
    { style: _style2.default.loadingView },
    'Loading\u2026'
  ),
  locationChanged: null,
  tocChanged: null,
  showToc: true,
  styles: _style2.default
};

ReactReader.propTypes = {
  title: _propTypes2.default.string,
  loadingView: _propTypes2.default.element,
  url: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.instanceOf(ArrayBuffer)]),
  showToc: _propTypes2.default.bool,
  location: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  locationChanged: _propTypes2.default.func,
  tocChanged: _propTypes2.default.func,
  styles: _propTypes2.default.object,
  epubOptions: _propTypes2.default.object,
  getRendition: _propTypes2.default.func,
  swipeable: _propTypes2.default.bool
};

exports.default = ReactReader;