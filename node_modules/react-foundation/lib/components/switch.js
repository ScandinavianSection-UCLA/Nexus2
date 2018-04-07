'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwitchInactive = exports.SwitchActive = exports.SwitchPaddle = exports.SwitchInput = exports.Switch = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _enums = require('../enums');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentId = 0;

/**
 * Switch component.
 * http://foundation.zurb.com/sites/docs/switch.html
 *
 * @param {Object} props
 * @returns {Object}
 */
var Switch = exports.Switch = function Switch(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'switch', props.className, props.size, (0, _utils.generalClassNames)(props));

  var switchId = props.id || 'switch' + currentId++;

  // TODO: Consider refactoring this, the rendering a little bit messy...

  return _react2.default.createElement(
    'div',
    _extends({}, (0, _utils.removeProps)(props, ['id']), { className: className }),
    _react2.default.createElement(SwitchInput, _extends({}, props.input, { id: switchId })),
    _react2.default.createElement(
      SwitchPaddle,
      _extends({}, props.paddle, { htmlFor: switchId }),
      props.active ? _react2.default.createElement(SwitchActive, props.active) : null,
      props.inactive ? _react2.default.createElement(SwitchInactive, props.inactive) : null
    )
  );
};

Switch.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  size: _propTypes2.default.oneOf((0, _utils.objectValues)(_enums.SwitchSizes)),
  id: _propTypes2.default.string
});

/**
 * Switch input sub-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var SwitchInput = exports.SwitchInput = function SwitchInput(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'switch-input', props.className, (0, _utils.generalClassNames)(props));

  return _react2.default.createElement('input', _extends({}, (0, _utils.removeProps)(props, ['type']), { className: className, type: props.type || _enums.SwitchInputTypes.CHECKBOX }));
};

SwitchInput.propTypes = _extends({
  type: _propTypes2.default.oneOf((0, _utils.objectValues)(_enums.SwitchInputTypes))
}, _utils.GeneralPropTypes);

/**
 * Switch paddle sub-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var SwitchPaddle = exports.SwitchPaddle = function SwitchPaddle(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'switch-paddle', props.className, (0, _utils.generalClassNames)(props));

  return _react2.default.createElement('label', _extends({}, props, { className: className }));
};

/**
 * Switch active sub-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var SwitchActive = exports.SwitchActive = function SwitchActive(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'switch-active', props.className, (0, _utils.generalClassNames)(props));

  return _react2.default.createElement(
    'span',
    _extends({}, props, { className: className, 'aria-hidden': 'true' }),
    props.text
  );
};

/**
 * Switch inactive sub-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var SwitchInactive = exports.SwitchInactive = function SwitchInactive(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'switch-inactive', props.className, (0, _utils.generalClassNames)(props));

  return _react2.default.createElement(
    'span',
    _extends({}, props, { className: className, 'aria-hidden': 'true' }),
    props.text
  );
};