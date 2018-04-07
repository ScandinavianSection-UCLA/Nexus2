'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NativeProgress = exports.ProgressMeterText = exports.ProgressMeterWithText = exports.ProgressMeter = exports.Progress = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _enums = require('../enums');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Progress component.
 * http://foundation.zurb.com/sites/docs/progress-bar.html
 *
 * @param {Object} props
 * @returns {Object}
 */
var Progress = exports.Progress = function Progress(props) {
  var _props$meter = props.meter,
      meterProps = _props$meter === undefined ? {} : _props$meter;


  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'progress', props.className, props.color, (0, _utils.generalClassNames)(props));

  if (props.value) {
    meterProps.style = meterProps.style || {};
    meterProps.style.width = props.value + '%';
  }

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(Progress.propTypes));

  return _react2.default.createElement(
    'div',
    _extends({}, passProps, {
      className: className,
      role: 'progressbar',
      'aria-valuemin': props.min,
      'aria-valuemax': props.max,
      'aria-valuenow': props.value,
      'aria-valuetext': props.valueText }),
    meterProps.text ? _react2.default.createElement(ProgressMeterWithText, meterProps) : _react2.default.createElement(ProgressMeter, meterProps)
  );
};

Progress.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  min: _propTypes2.default.number,
  max: _propTypes2.default.number,
  value: _propTypes2.default.number,
  color: _propTypes2.default.oneOf((0, _utils.objectValues)(_enums.ProgressColors))
});

/**
 * Progress meter sub-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var ProgressMeter = exports.ProgressMeter = function ProgressMeter(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'progress-meter', props.className, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(ProgressMeter.propTypes));

  return _react2.default.createElement('div', _extends({}, passProps, { className: className }));
};

ProgressMeter.propTypes = _extends({}, _utils.GeneralPropTypes);

/**
 * Progress meter with text sub-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var ProgressMeterWithText = exports.ProgressMeterWithText = function ProgressMeterWithText(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'progress-meter', props.className, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(ProgressMeterWithText.propTypes));

  return _react2.default.createElement(
    'span',
    _extends({}, passProps, { className: className }),
    _react2.default.createElement(
      ProgressMeterText,
      null,
      props.text
    )
  );
};

ProgressMeterWithText.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  text: _propTypes2.default.string.isRequired
});

/**
 * Progress meter text sub-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var ProgressMeterText = exports.ProgressMeterText = function ProgressMeterText(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'progress-meter-text', props.className, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(ProgressMeterText.propTypes));

  return _react2.default.createElement('p', _extends({}, passProps, { className: className }));
};

ProgressMeterText.propTypes = _extends({}, _utils.GeneralPropTypes);

/**
 * Native progress component.
 * http://foundation.zurb.com/sites/docs/progress-bar.html#native-progress
 *
 * @returns {Object}
 */
var NativeProgress = exports.NativeProgress = function NativeProgress(props) {
  var className = (0, _utils.createClassName)(props.className, props.color, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(NativeProgress.propTypes));

  return _react2.default.createElement('progress', _extends({}, passProps, { max: props.max, value: props.value, className: className }));
};

NativeProgress.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  max: _propTypes2.default.number,
  value: _propTypes2.default.number,
  color: _propTypes2.default.oneOf((0, _utils.objectValues)(_enums.ProgressColors))
});

// TODO: Consider adding support for native meter.