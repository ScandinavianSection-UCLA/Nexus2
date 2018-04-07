'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Icon = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Icon component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var Icon = exports.Icon = function Icon(props) {
  var className = (0, _utils.createClassName)(props.prefix, props.prefix ? props.prefix + '-' + props.name : props.name, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(Icon.propTypes));

  return _react2.default.createElement('i', _extends({}, passProps, { className: className }));
};

Icon.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  name: _propTypes2.default.string.isRequired,
  prefix: _propTypes2.default.string
});