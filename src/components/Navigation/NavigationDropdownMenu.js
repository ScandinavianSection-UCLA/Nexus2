import React, {Component} from "react";
import PropTypes from "prop-types";

class Navigation extends Component {
    handleDropdownChange(event) {
        this.setState({"selectValue": event.target.value});
        var selectedItem = {};
        if (this.props.list.tango) {
            this.props.list.list.forEach((item) => {
                if (item === event.target.value) {
                    selectedItem = item;
                }
            });
        } else {
            this.props.list.list.forEach((item) => {
                if (item[this.props.list.displayKey] === event.target.value) {
                    selectedItem = item;
                }
            });
        }
        this.props.handleMenuSelect(selectedItem, this.props.list.tango);
    }

    optionsRender() {
        if (this.props.list.tango) {
            return this.props.list.list.map((item, i) => {
                return <option key={i} value={item}>{item}</option>;
            });
        } else {
            return this.props.list.list.map((item, i) => {
                return <option key={i} value={item[this.props.list.displayKey]}>{item[this.props.list.displayKey]}</option>;
            });
        }
    }

    render() {
        return (
            <form className="NavigationDropdownMenu">
                <select value={this.props.list.selectValue} onChange={this.handleDropdownChange.bind(this)}>
                    {this.optionsRender.bind(this)()}
                </select>
            </form>
        );
    }
}

Navigation.propTypes = {
    "list": PropTypes.shape({
        "displayKey": PropTypes.any,
        "list": PropTypes.any,
        "tango": PropTypes.any,
        "selectValue": PropTypes.any,
    }).isRequired,
    "handleMenuSelect": PropTypes.func.isRequired,
};

export default Navigation;
