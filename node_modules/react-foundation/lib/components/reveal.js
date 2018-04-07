'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Reveal = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Reveal component.
 * http://foundation.zurb.com/sites/docs/reveal.html
 *
 * @param {Object} props
 * @returns {Object}
 */

var Reveal = exports.Reveal = function Reveal(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'reveal', props.className, {
    'tiny': props.isTiny,
    'small': props.isSmall,
    'large': props.isLarge,
    'full': props.isFullscreen
  }, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(Reveal.propTypes));

  return _react2.default.createElement('div', _extends({}, passProps, { className: className, 'data-reveal': true }));
};

Reveal.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  isTiny: _propTypes2.default.bool,
  isSmall: _propTypes2.default.bool,
  isLarge: _propTypes2.default.bool,
  isFullscreen: _propTypes2.default.bool
});