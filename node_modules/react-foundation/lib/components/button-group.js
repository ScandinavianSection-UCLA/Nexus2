'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ButtonGroup = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _enums = require('../enums');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Button group component.
 * http://foundation.zurb.com/sites/docs/button-group.html
 *
 * @param {Object} props
 * @returns {Object}
 */
var ButtonGroup = exports.ButtonGroup = function ButtonGroup(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'button-group', props.className, props.color, props.size, {
    'expanded': props.isExpanded,
    'stacked-for-small': props.stackFor === _enums.Breakpoints.SMALL,
    'stacked-for-medium': props.stackFor === _enums.Breakpoints.MEDIUM,
    'stacked-for-large': props.stackFor === _enums.Breakpoints.LARGE,
    'stacked': props.isStacked
  }, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(ButtonGroup.propTypes));

  return _react2.default.createElement('div', _extends({}, passProps, { className: className }));
};

ButtonGroup.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  color: _propTypes2.default.oneOf((0, _utils.objectValues)(_enums.ButtonGroupColors)),
  size: _propTypes2.default.oneOf((0, _utils.objectValues)(_enums.ButtonGroupSizes)),
  stackFor: _propTypes2.default.oneOf((0, _utils.objectValues)(_enums.Breakpoints)),
  isExpanded: _propTypes2.default.bool,
  isStacked: _propTypes2.default.bool
});