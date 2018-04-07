'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TitleBarTitle = exports.MenuIcon = exports.TitleBar = exports.ResponsiveNavigation = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _topBar = require('./top-bar');

var _utils = require('../utils');

var _ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

var _ExecutionEnvironment2 = _interopRequireDefault(_ExecutionEnvironment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Default pixel value when title bar is displayed and top bar is hidden.
var DEFAULT_BREAKPOINT = 640;

/**
 * Responsive navigation component.
 * http://foundation.zurb.com/sites/docs/responsive-navigation.html
 */

var ResponsiveNavigation = exports.ResponsiveNavigation = function (_Component) {
  _inherits(ResponsiveNavigation, _Component);

  function ResponsiveNavigation() {
    _classCallCheck(this, ResponsiveNavigation);

    var _this = _possibleConstructorReturn(this, (ResponsiveNavigation.__proto__ || Object.getPrototypeOf(ResponsiveNavigation)).call(this));

    _this.state = {
      isTitleBarVisible: true,
      isTopBarVisible: false
    };

    _this.update = _this.update.bind(_this);
    _this.toggle = _this.toggle.bind(_this);
    return _this;
  }

  _createClass(ResponsiveNavigation, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.update();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (_ExecutionEnvironment2.default.canUseDOM) {
        window.addEventListener('resize', this.update);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (_ExecutionEnvironment2.default.canUseDOM) {
        window.removeEventListener('resize', this.update);
      }
    }

    /**
     * Updates the state of this component.
     * While this might seem like a sub-optimal solution, it is actually the only solution.
     * Using 'hide' and 'show' -classes won't work because they set display with `!important`.
     */

  }, {
    key: 'update',
    value: function update() {
      var breakpoint = this.props.breakpoint;


      if (_ExecutionEnvironment2.default.canUseDOM) {
        this.setState({
          isTitleBarVisible: window.innerWidth < breakpoint,
          isTopBarVisible: window.innerWidth >= breakpoint
        });
      }
    }

    /**
     * Called when the menu icon is clicked.
     */

  }, {
    key: 'toggle',
    value: function toggle() {
      this.setState({
        isTopBarVisible: !this.state.isTopBarVisible
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          isTitleBarVisible = _state.isTitleBarVisible,
          isTopBarVisible = _state.isTopBarVisible;
      var _props = this.props,
          _props$titleBar = _props.titleBar,
          titleBarProps = _props$titleBar === undefined ? {} : _props$titleBar,
          _props$menuIcon = _props.menuIcon,
          menuIconProps = _props$menuIcon === undefined ? {} : _props$menuIcon,
          _props$titleBarTitle = _props.titleBarTitle,
          titleBarTitleProps = _props$titleBarTitle === undefined ? {} : _props$titleBarTitle,
          _props$topBar = _props.topBar,
          topBarProps = _props$topBar === undefined ? {} : _props$topBar,
          children = _props.children;


      return _react2.default.createElement(
        'div',
        (0, _utils.removeProps)(this.props, ['breakpoint']),
        _react2.default.createElement(
          TitleBar,
          _extends({}, titleBarProps, { isHidden: !isTitleBarVisible }),
          _react2.default.createElement(MenuIcon, _extends({}, menuIconProps, { onClick: this.toggle })),
          _react2.default.createElement(TitleBarTitle, titleBarTitleProps)
        ),
        _react2.default.createElement(
          _topBar.TopBar,
          _extends({}, topBarProps, { isHidden: !isTopBarVisible }),
          children
        )
      );
    }
  }]);

  return ResponsiveNavigation;
}(_react.Component);

ResponsiveNavigation.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes, {
  breakpoint: _propTypes2.default.number.isRequired
});

ResponsiveNavigation.defaultProps = {
  breakpoint: DEFAULT_BREAKPOINT
};

/**
 * Title bar sub-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var TitleBar = exports.TitleBar = function TitleBar(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'title-bar', props.className, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(TitleBar.propTypes));

  return _react2.default.createElement('div', _extends({}, passProps, { className: className }));
};

TitleBar.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes);

/**
 * Title bar menu icon sub-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var MenuIcon = exports.MenuIcon = function MenuIcon(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'menu-icon', props.className, (0, _utils.generalClassNames)(props));
  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(MenuIcon.propTypes));

  return _react2.default.createElement('button', _extends({}, passProps, { className: className, type: 'button' }));
};

MenuIcon.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes);

/**
 * Title bar title sub-component.
 *
 * @param {Object} props
 * @returns {Object}
 */
var TitleBarTitle = exports.TitleBarTitle = function TitleBarTitle(props) {
  var className = (0, _utils.createClassName)(props.noDefaultClassName ? null : 'title-bar-title', props.className, (0, _utils.generalClassNames)(props));

  var passProps = (0, _utils.removeProps)(props, (0, _utils.objectKeys)(TitleBarTitle.propTypes));
  return _react2.default.createElement('div', _extends({}, passProps, { className: className }));
};

TitleBarTitle.propTypes = _extends({}, _utils.GeneralPropTypes, _utils.FlexboxPropTypes);