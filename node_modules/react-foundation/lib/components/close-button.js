'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloseButton = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Close button component.
 * http://foundation.zurb.com/sites/docs/close-button.html
 *
 * @param {Object} props
 * @returns {Object}
 */
var CloseButton = exports.CloseButton = function CloseButton(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'close-button', props.className, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(CloseButton.propTypes));

  return _react2.default.createElement('button', _extends({}, passProps, { className: className }));
};

CloseButton.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes);