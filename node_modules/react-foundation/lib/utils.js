'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FlexboxPropTypes = exports.GeneralPropTypes = undefined;
exports.createClassName = createClassName;
exports.generalClassNames = generalClassNames;
exports.objectKeys = objectKeys;
exports.objectValues = objectValues;
exports.removeProps = removeProps;
exports.isDefined = isDefined;
exports.addBreakpoint = addBreakpoint;
exports.setDirection = setDirection;
exports.flexboxClassNames = flexboxClassNames;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _enums = require('./enums');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Property types for general properties.
 *
 * @returns {Object}
 */
var GeneralPropTypes = exports.GeneralPropTypes = {
  showFor: _propTypes2.default.oneOf([_enums.Breakpoints.MEDIUM, _enums.Breakpoints.LARGE]),
  showOnlyFor: _propTypes2.default.oneOf(objectValues(_enums.Breakpoints)),
  hideFor: _propTypes2.default.oneOf([_enums.Breakpoints.MEDIUM, _enums.Breakpoints.LARGE]),
  hideOnlyFor: _propTypes2.default.oneOf(objectValues(_enums.Breakpoints)),
  isHidden: _propTypes2.default.bool,
  isInvisible: _propTypes2.default.bool,
  showForLandscape: _propTypes2.default.bool,
  showForPortrait: _propTypes2.default.bool,
  showForSr: _propTypes2.default.bool,
  showOnFocus: _propTypes2.default.bool,
  isClearfix: _propTypes2.default.bool,
  float: _propTypes2.default.oneOf(objectValues(_enums.FloatTypes))
};

/**
 * Creates class names from the given arguments.
 *
 * @param {*} args
 * @returns {string}
 */
function createClassName() {
  return _classnames2.default.apply(undefined, arguments);
}

/**
 * Parses the general class names from the given properties.
 *
 * @param {Object} props
 * @returns {Object}
 */
function generalClassNames(props) {
  return {
    'show-for-medium': props.showFor === _enums.Breakpoints.MEDIUM,
    'show-for-large': props.showFor === _enums.Breakpoints.LARGE,
    'show-for-small-only': props.showOnlyFor === _enums.Breakpoints.SMALL,
    'show-for-medium-only': props.showOnlyFor === _enums.Breakpoints.MEDIUM,
    'show-for-large-only': props.showOnlyFor === _enums.Breakpoints.LARGE,
    'hide-for-medium': props.hideFor === _enums.Breakpoints.MEDIUM,
    'hide-for-large': props.hideFor === _enums.Breakpoints.LARGE,
    'hide-for-small-only': props.hideOnlyFor === _enums.Breakpoints.SMALL,
    'hide-for-medium-only': props.hideOnlyFor === _enums.Breakpoints.MEDIUM,
    'hide-for-large-only': props.hideOnlyFor === _enums.Breakpoints.LARGE,
    'hide': props.isHidden,
    'invisible': props.isInvisible,
    'show-for-landscape': props.showForLandscape,
    'show-for-portrait': props.showForPortrait,
    'show-for-sr': props.showForSr,
    'show-on-focus': props.showOnFocus,
    'clearfix': props.isClearfix,
    'float-left': props.float === _enums.FloatTypes.LEFT,
    'float-center': props.float === _enums.FloatTypes.CENTER,
    'float-right': props.float === _enums.FloatTypes.RIGHT
  };
}

/**
 * Returns the keys for the given object.
 * This method is used for getting the keys for prop types.
 *
 * @param {Object} object
 * @returns {Array}
 */
function objectKeys(object) {
  return Object.keys(object);
}

/**
 * Returns the values for the given object.
 * This method is used for getting the values for enumerables.
 *
 * @param {Object} object
 * @returns {Array}
 */
function objectValues(object) {
  var values = [];

  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      values.push(object[property]);
    }
  }

  return values;
}

/**
 * Removes properties from the given object.
 * This method is used for removing valid attributes from component props prior to rendering.
 *
 * @param {Object} object
 * @param {Array} remove
 * @returns {Object}
 */
function removeProps(object, remove) {
  var result = {};

  for (var property in object) {
    if (object.hasOwnProperty(property) && remove.indexOf(property) === -1) {
      result[property] = object[property];
    }
  }

  return result;
}

/**
 * Returns whether or not the given value is defined.
 *
 * @param {*} value
 * @returns {boolean}
 */
function isDefined(value) {
  return typeof value !== 'undefined';
}

/**
 * Adds a breakpoint to a class if breakpoint is specified.
 *
 * @param {String} prop
 * @param {String} size
 * @returns {string}
 */
function addBreakpoint(prop, size) {
  return size === 'all' ? prop : size + '-' + prop;
}

/**
 * Sets direction for grid and gutters (horizontal or vertical).
 *
 * @param {boolean} isVertical
 * @param {String} gutters
 * @returns {string}
 */
function setDirection(isVertical) {
  var gutters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (gutters) {
    return isVertical === true ? 'grid-' + gutters + '-y' : 'grid-' + gutters + '-x';
  } else {
    return isVertical === true ? 'grid-y' : 'grid-x';
  }
}

// Flexbox Utilities

/**
 * Property types for flexbox utilities.
 *
 * @returns {Object}
 */
var FlexboxPropTypes = exports.FlexboxPropTypes = {
  alignX: _propTypes2.default.oneOf(objectValues(_enums.HorizontalAlignments)),
  alignY: _propTypes2.default.oneOf(objectValues(_enums.VerticalAlignments)),
  selfAlignX: _propTypes2.default.oneOf(objectValues(_enums.HorizontalAlignments)),
  selfAlignY: _propTypes2.default.oneOf(objectValues(_enums.VerticalAlignments)),
  centerAlign: _propTypes2.default.bool,
  flexContainer: _propTypes2.default.bool,
  flexDirRow: _propTypes2.default.oneOf(objectValues(_enums.ExtendedBreakpoints)),
  flexDirRowRev: _propTypes2.default.oneOf(objectValues(_enums.ExtendedBreakpoints)),
  flexDirCol: _propTypes2.default.oneOf(objectValues(_enums.ExtendedBreakpoints)),
  flexDirColRev: _propTypes2.default.oneOf(objectValues(_enums.ExtendedBreakpoints)),
  flexChild: _propTypes2.default.oneOf(objectValues(_enums.SpaceControls)),
  flexOrder: _propTypes2.default.number,
  flexOrderSmall: _propTypes2.default.number,
  flexOrderMedium: _propTypes2.default.number,
  flexOrderLarge: _propTypes2.default.number
};

/**
 * Parses the flexbox class names from the given properties.
 *
 * @param {Object} props
 * @returns {Object}
 */
function flexboxClassNames(props) {
  var flexClassNames = {
    'flex-container': props.flexContainer,
    'align-center-middle': props.centerAlign
  };

  if (isDefined(props.alignX)) flexClassNames['align-' + props.alignX] = true;
  if (isDefined(props.alignY)) flexClassNames['align-' + props.alignY] = true;
  if (isDefined(props.flexDirRow)) flexClassNames[addBreakpoint('flex-dir-row', props.flexDirRow)] = true;
  if (isDefined(props.flexDirRowRev)) flexClassNames[addBreakpoint('flex-dir-row-reverse', props.flexDirRowRev)] = true;
  if (isDefined(props.flexDirCol)) flexClassNames[addBreakpoint('flex-dir-column', props.flexDirCol)] = true;
  if (isDefined(props.flexDirColRev)) flexClassNames[addBreakpoint('flex-dir-column-reverse', props.flexDirColRev)] = true;
  if (isDefined(props.flexChild)) flexClassNames['flex-child-' + props.flexChild] = true;
  if (isDefined(props.flexOrder)) flexClassNames['order-' + props.flexOrder] = true;
  if (isDefined(props.flexOrderSmall)) flexClassNames['small-order-' + props.flexOrder] = true;
  if (isDefined(props.flexOrderMedium)) flexClassNames['medium-order-' + props.flexOrder] = true;
  if (isDefined(props.flexOrderLarge)) flexClassNames['large-order-' + props.flexOrder] = true;

  return flexClassNames;
}