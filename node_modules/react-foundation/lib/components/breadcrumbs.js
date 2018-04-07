'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BreadcrumbItem = exports.Breadcrumbs = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Breadcrumbs component.
 * http://foundation.zurb.com/sites/docs/breadcrumbs.html
 *
 * @param {Object} props
 * @returns {Object}
 */
var Breadcrumbs = exports.Breadcrumbs = function Breadcrumbs(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'breadcrumbs', props.className, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(Breadcrumbs.propTypes));

  return _react2.default.createElement('ul', _extends({}, passProps, { className: className }));
};

Breadcrumbs.propTypes = _extends({}, _utils.GeneralPropTypes);

/**
 * Breadcrumb item component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var BreadcrumbItem = exports.BreadcrumbItem = function BreadcrumbItem(props) {
  var className = (0, _utils.createClassName)(props.className, {
    'disabled': props.isDisabled
  }, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(BreadcrumbItem.propTypes));

  return _react2.default.createElement('li', _extends({}, passProps, { className: className }));
};

BreadcrumbItem.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  isDisabled: _propTypes2.default.bool
});