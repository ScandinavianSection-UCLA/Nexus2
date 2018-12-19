import React, {Component} from "react";
import PropTypes from "prop-types";

class Navigation extends Component {
    handleDropdownChange({target}) {
        let selectedItem;
        if (this.props.list.tango) {
            selectedItem = this.props.list.list.find((item) =>
                item === target.value);
        } else {
            selectedItem = this.props.list.list.find((item) =>
                item[this.props.list.displayKey] === target.value);
        }
        this.props.handleMenuSelect(selectedItem, this.props.list.tango);
    }

    optionsRender() {
        if (this.props.list.tango) {
            return this.props.list.list.map((item, i) => (
                <option
                    key={i}
                    value={item}>
                    {item}
                </option>
            ));
        } else {
            return this.props.list.list.map((item, i) => (
                <option
                    key={i}
                    value={item[this.props.list.displayKey]}>
                    {item[this.props.list.displayKey]}
                </option>
            ));
        }
    }

    render() {
        return (
            <form className="NavigationDropdownMenu">
                <select
                    value={this.props.list.selectValue}
                    onChange={this.handleDropdownChange.bind(this)}>
                    {this.optionsRender()}
                </select>
            </form>
        );
    }
}

Navigation.propTypes = {
    "handleMenuSelect": PropTypes.func.isRequired,
    "list": PropTypes.shape({
        "displayKey": PropTypes.any,
        "list": PropTypes.any,
        "selectValue": PropTypes.any,
        "tango": PropTypes.any,
    }).isRequired,
};

export default Navigation;
