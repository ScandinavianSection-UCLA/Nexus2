'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Breakpoints enumerable.
 *
 * @type {{SMALL: string, MEDIUM: string, LARGE: string, XLARGE: string, XXLARGE: string}}
 */
var Breakpoints = exports.Breakpoints = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  XLARGE: 'xlarge',
  XXLARGE: 'xxlarge'
};

/**
 * Badge color enumerable.
 *
 * @type {Object}
 */
var BadgeColors = exports.BadgeColors = {
  INFO: 'info',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  ALERT: 'alert'
};

/**
 * Button color enumerable.
 *
 * @type {Object}
 */
var ButtonColors = exports.ButtonColors = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  ALERT: 'alert',
  WARNING: 'warning'
};

/**
 * Button group color enumerable.
 *
 * @type {Object}
 */
var ButtonGroupColors = exports.ButtonGroupColors = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  ALERT: 'alert',
  WARNING: 'warning'
};

/**
 * Callout color enumerable.
 *
 * @type {Object}
 */
var CalloutColors = exports.CalloutColors = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  ALERT: 'alert'
};

/**
 * Label color enumerable.
 *
 * @type {Object}
 */
var LabelColors = exports.LabelColors = {
  INFO: 'info',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  ALERT: 'alert'
};

/**
 * Progress colors enumerable.
 *
 * @type {Object}
 */
var ProgressColors = exports.ProgressColors = {
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  ALERT: 'alert'
};

/**
 * Color meta-enumerable.
 * This is exposed to the consumer, while the sub-sets are only used internally.
 *
 * @type {Object}
 */
var Colors = exports.Colors = _extends({}, BadgeColors, ButtonColors, ButtonGroupColors, CalloutColors, LabelColors, ProgressColors);

/**
 * Callout size enumerable.
 *
 * @type {Object}
 */
var CalloutSizes = exports.CalloutSizes = {
  SMALL: 'small',
  LARGE: 'large'
};

/**
 * Button size enumerable.
 *
 * @type {Object}
 */
var ButtonSizes = exports.ButtonSizes = {
  TINY: 'tiny',
  SMALL: 'small',
  LARGE: 'large'
};

/**
 * Button group size enumerable.
 *
 * @type {Object}
 */
var ButtonGroupSizes = exports.ButtonGroupSizes = {
  TINY: 'tiny',
  SMALL: 'small',
  LARGE: 'large'
};

/**
 * Switch size enumerable.
 *
 * @type {Object}
 */
var SwitchSizes = exports.SwitchSizes = {
  TINY: 'tiny',
  SMALL: 'small',
  LARGE: 'large'
};

/**
 * Size meta-enumerable.
 * This is exposed to the consumer, while the sub-sets are only used internally.
 *
 * @type {Object}
 */
var Sizes = exports.Sizes = _extends({}, ButtonSizes, ButtonGroupSizes, CalloutSizes, SwitchSizes);

/**
 * Horizontal alignment enumerable.
 *
 * @type {Object}
 */
var HorizontalAlignments = exports.HorizontalAlignments = {
  CENTER: 'center',
  RIGHT: 'right',
  JUSTIFY: 'justify',
  SPACED: 'spaced'
};

/**
 * Vertical alignment enumerable.
 *
 * @type {Object}
 */
var VerticalAlignments = exports.VerticalAlignments = {
  TOP: 'top',
  MIDDLE: 'middle',
  BOTTOM: 'bottom',
  STRETCH: 'stretch'
};

/**
 * Menu alignment enumerable.
 *
 * @type {{RIGHT: string, CENTER: string}}
 */
var MenuAlignments = exports.MenuAlignments = {
  RIGHT: 'right',
  CENTER: 'center'
};

/**
 * Alignments meta-enumerable.
 * This is exposed to the consumer, while the sub-sets are only used internally.
 *
 * @type {Object}
 */
var Alignments = exports.Alignments = _extends({}, HorizontalAlignments, VerticalAlignments, MenuAlignments);

/**
 * Float types enumerable.
 *
 * @type {{LEFT: string, CENTER: string, RIGHT: string}}
 */
var FloatTypes = exports.FloatTypes = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right'
};

/**
 * Switch type enumerable.
 *
 * @type {Object}
 */
var SwitchInputTypes = exports.SwitchInputTypes = {
  CHECKBOX: 'checkbox',
  RADIO: 'radio'
};

/**
 * Input type meta-enumerable.
 * This is exposed to the consumer, while the sub-sets are only used internally.
 *
 * @type {Object}
 */
var InputTypes = exports.InputTypes = _extends({}, SwitchInputTypes);

/**
 * Gutter type enumerable.
 *
 * @type {Object}
 */
var GutterTypes = exports.GutterTypes = {
  MARGIN: 'margin',
  PADDING: 'padding'
};

/**
 * Extended breakpoints enumerable (includes 'ALL' option, which is useful when breakpoint is not defined).
 *
 * @type {{SMALL: string, MEDIUM: string, LARGE: string, XLARGE: string, XXLARGE: string, ALL: string}}
 */
var ExtendedBreakpoints = exports.ExtendedBreakpoints = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  XLARGE: 'xlarge',
  XXLARGE: 'xxlarge',
  ALL: 'all'
};

/**
 * Space control enumerable.
 *
 * @type {Object}
 */
var SpaceControls = exports.SpaceControls = {
  AUTO: 'auto',
  GROW: 'grow',
  SHRINK: 'shrink'
};