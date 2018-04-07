/**
 * Created by danielhuang on 2/28/18.
 */
import React, { Component } from 'react';
import {ReactReader} from 'react-reader'
// import './BookView.css'

class BookView extends Component {

    constructor(){
        super();
        this.state = {
            PlaceObject:{},
            PlacePath:''
        };
    }


    render() {
        return (
            <div className="BookView" style={{position: 'relative', height: '85vh'}}>
                <ReactReader
                    url={this.props.url}
                    title={this.props.name}
                    location={'epubcfi(/6/2[cover]!/6)'}
                    locationChanged={(epubcifi) => console.log(epubcifi)}
                />
            </div>
        );
    }
}

export default BookView;