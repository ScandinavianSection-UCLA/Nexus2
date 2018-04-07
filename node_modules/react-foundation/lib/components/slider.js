'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SliderFill = exports.SliderHandle = exports.TwoHandleSlider = exports.Slider = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO: Add support for changing the values.

/**
 * Slider component.
 * http://foundation.zurb.com/sites/docs/slider.html
 */
var Slider = exports.Slider = function (_Component) {
  _inherits(Slider, _Component);

  function Slider() {
    _classCallCheck(this, Slider);

    var _this = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this));

    _this.state = { value: 0 };
    return _this;
  }

  _createClass(Slider, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setState({ value: this.props.initialStart || 0 });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          handleProps = _props.handle,
          fillProps = _props.fill;


      return _react2.default.createElement(
        'div',
        _extends({}, this.props, { className: classNameFromProps(this.props) }),
        _react2.default.createElement(SliderHandle, handleProps),
        _react2.default.createElement(SliderFill, fillProps)
      );
    }
  }]);

  return Slider;
}(_react.Component);

/**
 * Two-handle slider component.
 * http://foundation.zurb.com/sites/docs/slider.html#two-handles
 */


var TwoHandleSlider = exports.TwoHandleSlider = function (_Component2) {
  _inherits(TwoHandleSlider, _Component2);

  function TwoHandleSlider() {
    _classCallCheck(this, TwoHandleSlider);

    var _this2 = _possibleConstructorReturn(this, (TwoHandleSlider.__proto__ || Object.getPrototypeOf(TwoHandleSlider)).call(this));

    _this2.state = { minValue: 0, maxValue: 100 };
    return _this2;
  }

  _createClass(TwoHandleSlider, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setState({
        minValue: this.props.initialStart || 0,
        maxValue: this.props.initialEnd || 100
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          minHandleProps = _props2.minHandle,
          maxHandleProps = _props2.maxHandle,
          fillProps = _props2.fill;


      return _react2.default.createElement(
        'div',
        _extends({}, this.props, { className: classNameFromProps(this.props) }),
        _react2.default.createElement(SliderHandle, minHandleProps),
        _react2.default.createElement(SliderHandle, maxHandleProps),
        _react2.default.createElement(SliderFill, fillProps)
      );
    }
  }]);

  return TwoHandleSlider;
}(_react.Component);

/**
 * Slider handle sub-component.
 *
 * @param {Object} props
 * @returns {XML}
 */


var SliderHandle = exports.SliderHandle = function SliderHandle(props) {
  return _react2.default.createElement(
    'span',
    null,
    _react2.default.createElement('span', _extends({}, props, { role: 'slider' })),
    _react2.default.createElement('input', { type: 'hidden' })
  );
};

/**
 * Slider fill sub-component.
 *
 * @param {Object} props
 * @returns {XML}
 */
var SliderFill = exports.SliderFill = function SliderFill(props) {
  return _react2.default.createElement('span', { className: props.className || 'slider-fill' });
};

/**
 * Creates the slider class name from the given properties.
 * This method allows us to share code between the `Slider` and `TwoHandleSlider` components.
 *
 * @param {Object} props
 * @returns {string}
 */
function classNameFromProps(props) {
  return (0, _classnames2.default)(props.className || 'slider', {
    'vertical': props.isVertical,
    'disabled': props.isDisabled
  });
}