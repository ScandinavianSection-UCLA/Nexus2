'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Inline = exports.Block = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Div component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var Block = exports.Block = function Block(props) {
  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(Block.propTypes));

  return _react2.default.createElement('div', _extends({}, passProps, { className: (0, _utils.createClassName)(props.className, (0, _utils.generalClassNames)(props)) }));
};

Block.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes);

/**
 * Span component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var Inline = exports.Inline = function Inline(props) {
  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(Inline.propTypes));

  return _react2.default.createElement('span', _extends({}, passProps, { className: (0, _utils.createClassName)(props.className, (0, _utils.generalClassNames)(props)) }));
};

Inline.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes);