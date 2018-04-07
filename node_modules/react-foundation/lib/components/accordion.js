'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AccordionTitle = exports.AccordionContent = exports.AccordionItem = exports.Accordion = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Accordion component.
 * http://foundation.zurb.com/sites/docs/accordion.html
 *
 * @param {Object} props
 * @returns {Object}
 */
var Accordion = exports.Accordion = function Accordion(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'accordion', props.className, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(Accordion.propTypes));

  return _react2.default.createElement(
    'ul',
    _extends({}, passProps, { className: className }),
    props.children || []
  );
};

Accordion.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  children: _propTypes2.default.any
});

/**
 * Accordion item component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var AccordionItem = exports.AccordionItem = function AccordionItem(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'accordion-item', props.className, {
    'is-active': props.isActive
  }, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(AccordionItem.propTypes));

  return _react2.default.createElement('li', _extends({}, passProps, { className: className }));
};

AccordionItem.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  isActive: _propTypes2.default.bool
});

/**
 * Accordion panel container component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var AccordionContent = exports.AccordionContent = function AccordionContent(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'accordion-content', props.className, {
    'is-active': props.isActive
  }, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(AccordionContent.propTypes));

  return _react2.default.createElement('div', _extends({}, passProps, { className: className }));
};

AccordionContent.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  isActive: _propTypes2.default.bool
});

/**
 * Accordion panel title component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var AccordionTitle = exports.AccordionTitle = function AccordionTitle(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'accordion-title', props.className, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(AccordionContent.propTypes));

  return _react2.default.createElement('a', _extends({}, passProps, { className: className }));
};

AccordionTitle.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes);