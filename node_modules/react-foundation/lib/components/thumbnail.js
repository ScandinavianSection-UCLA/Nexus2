'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThumbnailLink = exports.Thumbnail = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Thumbnail component.
 * http://foundation.zurb.com/sites/docs/switch.html
 *
 * @param {Object} props
 * @returns {Object}
 */
var Thumbnail = exports.Thumbnail = function Thumbnail(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'thumbnail', props.className, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(Thumbnail.propTypes));

  return _react2.default.createElement('img', _extends({}, passProps, { className: className }));
};

Thumbnail.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes);

/**
 * Thumbnail link component.
 * http://foundation.zurb.com/sites/docs/switch.html
 *
 * @param {Object} props
 * @returns {Object}
 */
var ThumbnailLink = exports.ThumbnailLink = function ThumbnailLink(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'thumbnail', props.className, (0, _utils.generalClassNames)(props));

  // TODO: Consider improving how properties are set for both the link and image.

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(ThumbnailLink.propTypes));

  return _react2.default.createElement(
    'a',
    { className: className },
    _react2.default.createElement('img', passProps)
  );
};

ThumbnailLink.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes);