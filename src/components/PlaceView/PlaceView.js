/**
 * Created by danielhuang on 2/7/18.
 */
import React, { Component } from 'react';
import './PlaceView.css'

class PlaceView extends Component {

    constructor(){
        super();
        this.state = {
            PlaceObject:{},
            PlacePath:''
        };
        this.renderPeople = this.renderPeople.bind(this);
        this.renderStory = this.renderStory.bind(this);
        this.renderPS = this.renderPS.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(id,name,type){
        this.props.addID(id,name,type);
    }

    renderPeople() {
        return <div className="people">
            <h3>Associated People</h3>
            <ul>
                {this.props.place.people.map((person, i) => {
                    return <li className="associated-items" onClick={
                        (e)=>{e.preventDefault(); this.clickHandler(person['person_id'],person['full_name'],'People')}
                    } key={i}>{person.full_name}</li>
                })}
            </ul>
        </div>
    }
    renderStory(type){
        var mentionOrCollected = '';
        var indexOfMentioned = type.indexOf('Mentioned');
        if(indexOfMentioned !== -1){
            mentionOrCollected = 'Mentioned';
        } else {
            mentionOrCollected = 'Collected';
        }
        var storyList = this.props.place[type];

        if(typeof this.props.place[type][0] === 'array'){
            storyList = this.props.place[type][0];
        } else {
            storyList = this.props.place[type];
        }
        return <div className={type}>
            <h3>Stories {mentionOrCollected} Here</h3>
            <ul>
                {storyList.map((story,i)=>{
                    return <li key={i} className="associated-items" onClick={
                        (e)=>{e.preventDefault(); this.clickHandler(story['story_id'],story['full_name'],'Stories')}
                    }>{story.full_name}</li>
                })}
            </ul>
        </div>;
    }

    renderPS(){
        if('people' in this.props.place && 'storiesCollected' in this.props.place && 'storiesMentioned' in this.props.place){
            return <div>
                {this.renderPeople()}
                {this.renderStory('storiesMentioned')}
                {this.renderStory('storiesCollected')}
            </div>
        } else if ('people' in this.props.place && 'storiesCollected' in this.props.place){
            return <div>
                {this.renderPeople()}
                {this.renderStory('storiesCollected')}
            </div>
        } else if ('people' in this.props.place && 'storiesMentioned' in this.props.place){
            return <div>
                {this.renderPeople()}
                {this.renderStory('storiesMentioned')}
            </div>
        } else if('storiesCollected' in this.props.place && 'storiesMentioned' in this.props.place){
            return <div>
                {this.renderStory('storiesMentioned')}
                {this.renderStory('storiesCollected')}
            </div>
        } else if('people' in this.props.place){
            return <div>
                {this.renderPeople()}
            </div>
        } else if('storiesCollected' in this.props.place){
            return <div>
                {this.renderStory('storiesCollected')}
            </div>
        } else if('storiesMentioned' in this.props.place){
            return <div>
                {this.renderStory('storiesMentioned')}
            </div>
        }
    }

    render() {
        return (
            <div className="PlaceView grid-x">
                <div className="tab-header cell">
                    <img style={{marginTop:'-1.7%'}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAUbSURBVHhe7ZpbiFVlGIYnDyRJUYkRpIGUBxoipbpI6KRXQXSXeSVCUFMXXUZhhddiFxEdLjoQHcS0gogKtANhdNAONxbZRRAESilaWRY00/P+/+u/3WucvffsvU57Zj3wsfb3v9//HWZmr732WjPS0NDQ0NBQPOPj48uw+7HXsK+x37B/bXqttVexMWyZtw03ExMTcxhmI/YpNo7fE4qFfdhG3DlON1zQ/HrsuzhS/5DjILbOaesPPS+g4Wdj+/lBziexc12mntDgIuxL99wG62I/tgW7GVuJLbStJOQWjls4HuB41rcLy59hi1yuXtDYYux795pgTejEt9yhXSF2BbZDG50mwZLeEosdWg/oS3/2n8cWW7B2iMO1Dps27L8e+zFma6FaWH3eDjTzjHtLsLaHw0UO6RvyXIztjVlbsPaUQ6qFRta7pwRrH3CY55CBIdd850zgi1sdUg30oc/5to86fP3JXuiQ3CCvTrBtbwf8gxyqu06gAV2oJPB10ur7Pd8N0uuc0HZixN1guXwovs99BPB3WCoMaux0uQD+J5bKhcJXYOm3oddwpeXCoMZyFXLZ03XL/+5A0fvcQwB/v6XCodZXLhvAv9dSeVD0FdcP4D9iqSvELsV2Y7/b3iTFKstdIf7RWDWC/7Kl8qDoN64fwL/JUkeI0/BHvS3B2jFsicM6Qtw6bzvNAUvlkR0Cv6dLXeJ2e8sk0HY5rCPErfCWAP6vlsqDov+4fgB/oaWOEPeHt0wC7YTDOkLc+d4SwD9lqTwo+qfrB9SUpY4Ql8cP4AJvCagXS+VB0exV2dWWOkKcTnhnBW2nwzpC3DXeEsA/ZKk8KPq+6wfwxyx1hNBVxB6Lu1qwdhTr9SSY/Qh+z1J5UFQ3LxL4PZ3ABLH6JNiFnWDrcex1Xvc0vCC27USK/7Cl8qDoWtcP4OuccJ7lwqCO7iCdjFUj+DdYLg/q6pvgz7GFxJ2WC4Oad7lWwD1U842Q4o/HNiL4eywVhmq4XAB/u6Xyofio+wjgi8K+ECm3CrhcAPcqy9VADx/HViI09LSl3FFulwngf2SpOmhig/sJ4J/CLrOcG8qp3C4TUG3L1UEfOhn+EFuK4D9hOTeU0+kDrlmPx2Y0sjl0ZWjuLw6XWh4Y5XLOM9lsuXpoZh4N/hT7iuBvszww5NrutAHXyu2ucy7QVPby9CQ28LmAHEuUy2kD+D1ddpcKfenp0C+xxQj+C5b7hhwvOl1ANbB6PiSlsTH3GcD/j8Nqy9OG/Wuc40zusVw/aE7nguyDkr2Wp432Ok0AXw9C6vXez0KTd8R2W7B2u+We0R5vT/STpxLoNXt1qMfm8y13RbHek8D/0HL9odnrsLZrdnjIclcUG7dEnKuwR26FQM8vxfYj+LpfcLnlKVGMYxPKZXl4oG9dvemOTwL/DctTQkz2nqHuGOV2VVkqDPNAnKEFa7dZnoQ0hyWUw/LwQf/6WPw2jhLB17/NLHBIQmto2TvNevo01yHDCUPciGVvYjxmOcHy1qhGtAfWWh5uGOR5zxXA1z2DUcvSR7VmOYD/nOXhh2H0j05HPFsA/wsOc2V+ncA/zGHgf7CqFQzVdjdXsPagzG6Cterv9BQBg73jGQP4f8vsBvDfdvjMg+GWMqM+16fiODE9PyEaShjwbg87CWkOm7kw5zkM+m4cuYXWHDLz0Z85lp4Q67XWLM8OGHiT59cPYJOXZxcM/pbM7uyD4S+R2W1oaGgomZGR/wFqvDpfAU6CwwAAAABJRU5ErkJggg==" alt="location icon"/>
                    <h1 style={{fontWeight:'bold',display:'inline-block'}}>{this.props.place.name}</h1>
                </div>
                <div className="medium-8 cell">
                    <div className="cell">
                        <h3 className="medium-3 cell">Visited During</h3>
                    </div>
                    <img src={require('./Screen Shot 2018-02-26 at 5.46.54 PM.png')} alt="map"/>
                </div>
                <div className="medium-4 cell">
                    {this.renderPS()}
                </div>
            </div>
        );
    }
}

export default PlaceView;