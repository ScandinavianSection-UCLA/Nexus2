'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabPanel = exports.TabsContent = exports.TabItem = exports.Tabs = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Tabs component.
 * http://foundation.zurb.com/sites/docs/tabs.html
 *
 * @param {Object} props
 * @returns {Object}
 */
var Tabs = exports.Tabs = function Tabs(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'tabs', props.className, {
    'vertical': props.isVertical
  }, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(Tabs.propTypes));

  return _react2.default.createElement('ul', _extends({}, passProps, { className: className }));
};

Tabs.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  isVertical: _propTypes2.default.bool
});

/**
 * Tab item component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var TabItem = exports.TabItem = function TabItem(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'tabs-title', props.className, {
    'is-active': props.isActive
  }, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(TabItem.propTypes));

  return _react2.default.createElement('li', _extends({}, passProps, { className: className }));
};

TabItem.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  isActive: _propTypes2.default.bool
});

/**
 * Tab panel container component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var TabsContent = exports.TabsContent = function TabsContent(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'tabs-content', props.className, {
    'vertical': props.isVertical
  }, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(TabsContent.propTypes));

  return _react2.default.createElement('div', _extends({}, passProps, { className: className }));
};

TabsContent.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  isActive: _propTypes2.default.bool,
  isVertical: _propTypes2.default.bool
});

/**
 * Tab panel item component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var TabPanel = exports.TabPanel = function TabPanel(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'tabs-panel', props.className, {
    'is-active': props.isActive
  }, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(TabPanel.propTypes));

  return _react2.default.createElement('div', _extends({}, passProps, { className: className }));
};

TabPanel.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  isActive: _propTypes2.default.bool
});