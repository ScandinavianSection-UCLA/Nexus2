'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Badge = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _enums = require('../enums');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Badge component.
 * http://foundation.zurb.com/sites/docs/badge.html
 *
 * @param {Object} props
 * @returns {Object}
 */
var Badge = exports.Badge = function Badge(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'badge', props.className, props.color, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(Badge.propTypes));

  return _react2.default.createElement('span', _extends({}, passProps, { className: className }));
};

Badge.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  color: _propTypes2.default.oneOf((0, _utils.objectValues)(_enums.BadgeColors))
});