/**
 * Created by danielhuang on 2/25/18.
 */
import React, { Component } from 'react';

class Navigation extends Component {

    constructor(){
        super();
        // this.state = {
        //     selectValue:this.props.list['selectValue'],
        //     displayKey:this.props.list['displayKey'],
        //     isTango:this.props.list['tango'],
        //     ontology:this.props.list['ontology'],
        //     list:this.props.list['list']
        // }
    }

    handleDropdownChange(e){
        this.setState({selectValue:e.target.value});
        var selectedItem = {};
        if(this.props.list['tango']){
            this.props.list['list'].forEach((item)=>{
                if(item === e.target.value){
                    selectedItem = item;
                }
            });
        } else {
            this.props.list['list'].forEach((item)=>{
                if(item[this.props.list['displayKey']] === e.target.value){
                    selectedItem = item;
                }
            });
        }
        this.props.handleMenuSelect(selectedItem, this.props.list['tango']);
    }

    optionsRender(){
        if(this.props.list['tango']){
            console.log(this.props.list['list']);
            return this.props.list['list'].map((item,i)=>{
                return <option key={i} value={item}>{item}</option>
            })
        } else {
            console.log(this.props.list['list'], this.props.list['displayKey']);
            return this.props.list['list'].map((item,i)=>{
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

export default Navigation;