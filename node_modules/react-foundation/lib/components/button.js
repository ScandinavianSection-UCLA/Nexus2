'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Link = exports.Button = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _enums = require('../enums');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Button property types.
 *
 * @type {Object}
 */
var ButtonPropTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  color: _propTypes2.default.oneOf((0, _utils.objectValues)(_enums.ButtonColors)),
  size: _propTypes2.default.oneOf((0, _utils.objectValues)(_enums.ButtonSizes)),
  isHollow: _propTypes2.default.bool,
  isClear: _propTypes2.default.bool,
  isExpanded: _propTypes2.default.bool,
  isDisabled: _propTypes2.default.bool,
  isDropdown: _propTypes2.default.bool
});

/**
 * Button component.
 * http://foundation.zurb.com/sites/docs/button.html
 *
 * @param {Object} props
 * @returns {Object}
 */
var Button = exports.Button = function Button(props) {
  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(Button.propTypes));

  return _react2.default.createElement('button', _extends({}, passProps, { className: createButtonClassName(props) }));
};

Button.propTypes = ButtonPropTypes;

/**
 * Link button component.
 * http://foundation.zurb.com/sites/docs/button.html#basics
 *
 * @param {Object} props
 * @returns {Object}
 */
var Link = exports.Link = function Link(props) {
  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(Button.propTypes));

  return _react2.default.createElement('a', _extends({}, passProps, { className: createButtonClassName(props) }));
};

Link.propTypes = ButtonPropTypes;

/**
 * Creates button class name from the given properties.
 *
 * @param {Object} props
 * @returns {string}
 */
function createButtonClassName(props) {
  return (0, _utils.createClassName)(props.noDefaultClassName ? null : 'button', props.className, props.size, props.color, {
    'hollow': props.isHollow,
    'clear': props.isClear,
    'expanded': props.isExpanded,
    'disabled': props.isDisabled,
    'dropdown': props.isDropdown,
    'arrow-only': props.isArrowOnly
  }, (0, _utils.generalClassNames)(props));
}