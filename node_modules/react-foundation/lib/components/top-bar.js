'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TopBarRight = exports.TopBarLeft = exports.TopBarTitle = exports.TopBar = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Top bar component.
 * http://foundation.zurb.com/sites/docs/top-bar.html
 *
 * @param {Object} props
 * @returns {Object}
 */
var TopBar = exports.TopBar = function TopBar(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'top-bar', props.className, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(TopBar.propTypes));

  return _react2.default.createElement('div', _extends({}, passProps, { className: className }));
};

TopBar.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes);

/**
 * Top bar title sub-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var TopBarTitle = exports.TopBarTitle = function TopBarTitle(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'top-bar-title', props.className, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(TopBarTitle.propTypes));

  return _react2.default.createElement('div', _extends({}, passProps, { className: className }));
};

TopBarTitle.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes);

/**
 * Top bar left sub-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var TopBarLeft = exports.TopBarLeft = function TopBarLeft(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'top-bar-left', props.className, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(TopBarLeft.propTypes));

  return _react2.default.createElement('div', _extends({}, passProps, { className: className }));
};

TopBarLeft.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes);

/**
 * Top bar right sub-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var TopBarRight = exports.TopBarRight = function TopBarRight(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'top-bar-right', props.className, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(TopBarRight.propTypes));

  return _react2.default.createElement('div', _extends({}, passProps, { className: className }));
};

TopBarRight.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes);