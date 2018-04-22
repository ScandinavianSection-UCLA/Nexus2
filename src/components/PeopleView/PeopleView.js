/**
 * Created by danielhuang on 2/6/18.
 */
import React, { Component } from 'react';
import RightBar from '../RightBar/RightBar'
import './PeopleView.css'

class PeopleView extends Component {

    constructor(){
        super();
        this.state = {
            PeopleObject:{},
            PeoplePath:''
        };
        this.clickHandler = this.clickHandler.bind(this);
    }

    // componentWillMount(){
    //     console.log('person view');
    // }

    clickHandler(id,name,type){
        this.props.addID(id,name,type);
    }

    render() {
        return (
            <div className="PeopleView grid-x">
                <div className="medium-11 cell">
                    <h3>{this.props.person['full_name']}</h3>
                    <h4>{this.props.person['birth_date']} to {this.props.person['death_date']}</h4>
                    <div>{this.props.person['intro_bio']}</div>
                </div>
                <RightBar view={'People'}
                          stories={this.props.person['stories']}
                          places={this.props.person['places']}
                          passID={this.clickHandler}
                > </RightBar>
            </div>
        );
    }
}

export default PeopleView;