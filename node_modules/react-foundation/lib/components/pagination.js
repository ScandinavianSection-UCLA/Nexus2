'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaginationEllipsis = exports.PaginationNext = exports.PaginationPrevious = exports.PaginationItem = exports.Pagination = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Pagination component.
 * http://foundation.zurb.com/sites/docs/pagination.html
 *
 * @param {Object} props
 * @returns {Object}
 */
var Pagination = exports.Pagination = function Pagination(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'pagination', props.className, {
    'text-center': props.isCentered
  }, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(Pagination.propTypes));

  return _react2.default.createElement('ul', _extends({}, passProps, { className: className, role: 'navigation' }));
};

Pagination.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  isCentered: _propTypes2.default.bool
});

/**
 * Pagination item component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var PaginationItem = exports.PaginationItem = function PaginationItem(props) {
  var className = (0, _utils.createClassName)(props.className, {
    'current': props.isCurrent,
    'disabled': props.isDisabled
  }, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(PaginationItem.propTypes));

  return _react2.default.createElement('li', _extends({}, passProps, { className: className }));
};

PaginationItem.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  isCurrent: _propTypes2.default.bool,
  isDisabled: _propTypes2.default.bool
});

/**
 * Pagination previous wrapper-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var PaginationPrevious = exports.PaginationPrevious = function PaginationPrevious(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'pagination-previous', props.className, (0, _utils.generalClassNames)(props));

  return _react2.default.createElement(PaginationItem, _extends({}, props, { className: className }));
};

/**
 * Pagination next wrapper-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var PaginationNext = exports.PaginationNext = function PaginationNext(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'pagination-next', props.className, (0, _utils.generalClassNames)(props));

  return _react2.default.createElement(PaginationItem, _extends({}, props, { className: className }));
};

/**
 * Pagination ellipsis wrapper-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var PaginationEllipsis = exports.PaginationEllipsis = function PaginationEllipsis(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'ellipsis', props.className, (0, _utils.generalClassNames)(props));

  return _react2.default.createElement(PaginationItem, _extends({}, props, { className: className }));
};