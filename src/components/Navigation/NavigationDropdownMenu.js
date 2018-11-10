import React, {Component} from 'react';
import PropTypes from "prop-types";

class Navigation extends Component {
    handleDropdownChange(e) {
        this.setState({selectValue: e.target.value});
        var selectedItem = {};
        if (this.props.list['tango']) {
            this.props.list['list'].forEach((item) => {
                if (item === e.target.value) {
                    selectedItem = item;
                }
            });
        } else {
            this.props.list['list'].forEach((item) => {
                if (item[this.props.list['displayKey']] === e.target.value) {
                    selectedItem = item;
                }
            });
        }
        this.props.handleMenuSelect(selectedItem, this.props.list['tango']);
    }

    optionsRender() {
        if (this.props.list['tango']) {
            console.log(this.props.list['list']);
            return this.props.list['list'].map((item, i) => {
                return <option key={i} value={item}>{item}</option>
            })
        } else {
            // console.log(this.props.list['list'], this.props.list['displayKey']);
            return this.props.list['list'].map((item, i) => {
                return <option key={i} value={item[this.props.list['displayKey']]}>{item[this.props.list['displayKey']]}</option>
            })
        }
    }

    render() {
        return (
            <form className="NavigationDropdownMenu">
                <select value={this.props.list['selectValue']} onChange={this.handleDropdownChange.bind(this)}>
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
}

export default Navigation;
