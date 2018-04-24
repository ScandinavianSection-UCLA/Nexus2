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
        console.log(this.props.person);
        return (
            <div className="PeopleView grid-y">
                <div className="tab-header cell medium-1">
                    <img style={{marginTop:'-1.7%', marginRight:'1%'}} src="https://png.icons8.com/windows/64/000000/contacts.png" alt="person icon"/>
                    <h2 style={{fontWeight:'bold',display:'inline-block'}}>{this.props.person['full_name']}</h2>
                </div>
                <div className="cell medium-11">
                    <div className="grid-x" style={{'height':'100%'}}>
                        <div className="medium-7 cell">
                            <div className="grid-y" style={{'height':'100%'}}>
                                <div className="cell medium-5">
                                    <div className="grid-x informant-bio-container">
                                        <img src={require(`../RightBar/informant_images/${[90,123,150,235,241].includes(this.props.person['person_id'])? String(this.props.person['person_id']) + '.jpg' : 'noprofile.png'}`)}
                                             className="cell medium-4"/>
                                        <div className="cell medium-8 details">
                                            <div className="detail-item"><b>Born</b> {this.props.person['birth_date']}</div>
                                            <div className="detail-item"><b>Died</b> {this.props.person['death_date']}</div>
                                            <div className="detail-item"><b>ID#</b> {String(this.props.person['person_id'])}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="cell medium-7 wrapper person">
                                    <div className="person-bio">
                                        {this.props.person['intro_bio']}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="medium-4 cell">

                        </div>
                        <RightBar view={'People'}
                                  stories={this.props.person['stories']}
                                  places={this.props.person['places']}
                                  passID={this.clickHandler}
                        > </RightBar>
                    </div>
                </div>
            </div>
        );
    }
}

export default PeopleView;