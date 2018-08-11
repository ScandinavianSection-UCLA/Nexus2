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

    clickHandler(id,name,type){
        this.props.addID(id,name,type);

    }

    render() {
        var items=[this.props.person];
        console.log('items',items);
        var person_job='';
        var multiple_jobs=[];
        var newItem = [
            {
                "ID": 1,
                "occupation": "pensioner(f)/aftægtskone",
                "": ""
            },
            {
                "ID": 2,
                "occupation": "pensioner(m)/aftægtsmand",
                "": ""
            },
            {
                "ID": 3,
                "occupation": "poverty assistance recipient/almisselem",
                "": ""
            },
            {
                "ID": 4,
                "occupation": "county council member/amtsrådsmedlem",
                "": ""
            },
            {
                "ID": 5,
                "occupation": "Anders Højbjærgs kone", //find english for this one, not in list
                "": ""
            },
            {
                "ID": 6,
                "occupation": "railway foreman/bane formand",
                "": ""
            },
            {
                "ID": 7,
                "occupation": "pedlar/bissekræmmer",
                "": ""
            },
            {
                "ID": 8,
                "occupation": "C. A. Kondrups kone",
                "": ""
            },
            {
                "ID": 9,
                "occupation": "theologian/Cand. Theol.",
                "": ""
            },
            {
                "ID": 10,
                "occupation": "clog maker/træskomand",
                "": ""
            },
            {
                "ID": 11,
                "occupation": "veterinarian/dyrlæge",
                "": ""
            },
            {
                "ID": 12,
                "occupation": "widow/enke",
                "": ""
            },
            {
                "ID": 13,
                "occupation": "fader var lærer", //no translation
                "": ""
            },
            {
                "ID": 14,
                "occupation": "fattighuslem", //no translation
                "": ""
            },
            {
                "ID": 15,
                "occupation": "pauper/fattiglem",
                "": ""
            },
            {
                "ID": 16,
                "occupation": "wheel repairer/felbereder",
                "": ""
            },
            {
                "ID": 17,
                "occupation": "field worker/markarbejder",
                "": ""
            },
            {
                "ID": 18,
                "occupation": "fisherman/fisker",
                "": ""
            },
            {
                "ID": 19,
                "occupation": "forhen. Ridedreng",
                "": ""
            },
            {
                "ID": 20,
                "occupation": "school principal/forstander",
                "": ""
            },
            {
                "ID": 21,
                "occupation": "lady/fru",
                "": ""
            },
            {
                "ID": 22,
                "occupation": "farmer/gaardmand",
                "": ""
            },
            {
                "ID": 23,
                "occupation": "farm owner/gårdejer",
                "": ""
            },
            {
                "ID": 24,
                "occupation": "farmer/gårdmand",
                "": ""
            },
            {
                "ID": 25,
                "occupation": "old farmowner/gårdmand (forhenværende gårdejer)",
                "": ""
            },
            {
                "ID": 26,
                "occupation": "farmer's daughter/gårdmandsdatter",
                "": ""
            },
            {
                "ID": 27,
                "occupation": "farmer's wife/gårdmandskone",
                "": ""
            },
            {
                "ID": 28,
                "occupation": "farmer's son/gårdmandssøn",
                "": ""
            },
            {
                "ID": 29,
                "occupation": "guddum fattiggård",
                "": ""
            },
            {
                "ID": 30,
                "occupation": "housewife",
                "": ""
            },
            {
                "ID": 31,
                "occupation": "house owner/husejer",
                "": ""
            },
            {
                "ID": 32,
                "occupation": "house wife/huskone",
                "": ""
            },
            {
                "ID": 33,
                "occupation": "small holder (cotter)/husmand",
                "": ""
            },
            {
                "ID": 34,
                "occupation": "Husmand og signetstikker", //no translation
                "": ""
            },
            {
                "ID": 35,
                "occupation": "husmandsdatter", //cotter's daughter?
                "": ""
            },
            {
                "ID": 36,
                "occupation": "house wife/husmoder",
                "": ""
            },
            {
                "ID": 37,
                "occupation": "house wife/hustru",
                "": ""
            },
            {
                "ID": 38,
                "occupation": "pensioner/indsidder",
                "": ""
            },
            {
                "ID": 39,
                "occupation": "Iver Bundgård Skades hustru",
                "": ""
            },
            {
                "ID": 40,
                "occupation": "J.P. Larsens hustru",
                "": ""
            },
            {
                "ID": 41,
                "occupation": "simgle woman/jomfru",
                "": ""
            },
            {
                "ID": 42,
                "occupation": "midwife/jordemoder",
                "": ""
            },
            {
                "ID": 43,
                "occupation": "journeyman miller/møllersvend",
                "": ""
            },
            {
                "ID": 44,
                "occupation": "church employee/kirkestilling ved Slagelse",
                "": ""
            },
            {
                "ID": 45,
                "occupation": "gypsy/kjæltringsfolket",
                "": ""
            },
            {
                "ID": 46,
                "occupation": "folk healer (male)/klog mand",
                "": ""
            },
            {
                "ID": 47,
                "occupation": "folk healer (male)/klogmand",
                "": ""
            },
            {
                "ID": 48,
                "occupation": "grocer/købmand",
                "": ""
            },
            {
                "ID": 49,
                "occupation": "grocer's wife/købmands kone",
                "": ""
            },
            {
                "ID": 50,
                "occupation": "wife/kone",
                "": ""
            },
            {
                "ID": 51,
                "occupation": "broom maker/kostebinder",
                "": ""
            },
            {
                "ID": 52,
                "occupation": "teacher/lærer",
                "": ""
            },
            {
                "ID": 53,
                "occupation": "retired teacher/lærer (pens)",
                "": ""
            },
            {
                "ID": 54,
                "occupation": "teacher/lærer",
                "": "mange år biskolelærer ved Sunds 4 biskoler"
            },
            {
                "ID": 55,
                "occupation": "teachers wife/lærers kone",
                "": ""
            },
            {
                "ID": 56,
                "occupation": "Lars Jensens kone",
                "": ""
            },
            {
                "ID": 57,
                "occupation": "lady/madam",
                "": ""
            },
            {
                "ID": 58,
                "occupation": "dairy worker/mejerist",
                "": ""
            },
            {
                "ID": 59,
                "occupation": "miller/møller",
                "": ""
            },
            {
                "ID": 60,
                "occupation": "Niels Pedersens kone",
                "": ""
            },
            {
                "ID": 61,
                "occupation": "par gamle mænd",
                "": ""
            },
            {
                "ID": 62,
                "occupation": "pastor/pastor",
                "": ""
            },
            {
                "ID": 63,
                "occupation": "Pensioner/indsidder",//there are like 3 different translations, i chose this one
                "": ""
            },
            {
                "ID": 64,
                "occupation": "rag pedlar/pjaltekræmmer",
                "": ""
            },
            {
                "ID": 65,
                "occupation": "minister/præst",
                "": ""
            },
            {
                "ID": 66,
                "occupation": "horse boy/ridedreng",
                "": ""
            },
            {
                "ID": 67,
                "occupation": "stall hand/røgter",
                "": ""
            },
            {
                "ID": 68,
                "occupation": "forest ranger/skovfoged",
                "": ""
            },
            {
                "ID": 69,
                "occupation": "tailor/skrædder",
                "": ""
            },
            {
                "ID": 70,
                "occupation": "small holder/husmand",
                "": ""
            },
            {
                "ID": 71,
                "occupation": "smith/smed",
                "": ""
            },
            {
                "ID": 72,
                "occupation": "Smed og et par andre mænd",
                "": ""
            },
            {
                "ID": 73,
                "occupation": "cabinet maker/snedker",
                "": ""
            },
            {
                "ID": 74,
                "occupation": "bailiff/sognefoged",
                "": ""
            },
            {
                "ID": 75,
                "occupation": "søn ejede Rask Mølle",
                "": ""
            },
            {
                "ID": 76,
                "occupation": "folk musician/spillemand (omvandrende)",
                "": ""
            },
            {
                "ID": 77,
                "occupation": "station foreman/stationsforstander",
                "": ""
            },
            {
                "ID": 78,
                "occupation": "Sygpige",
                "": ""
            },
            {
                "ID": 79,
                "occupation": "carpenter/tømrer",
                "": ""
            },
            {
                "ID": 80,
                "occupation": "clog maker/træskomand",
                "": ""
            },
            {
                "ID": 81,
                "occupation": "drejer/turner",
                "": ""
            },
            {
                "ID": 82,
                "occupation": "cooperative leader/uddeler",
                "": ""
            },
            {
                "ID": 83,
                "occupation": "wheatbread woman/hvedebrødskone",
                "": ""
            },
            {
                "ID": 84,
                "occupation": "ungkarl", //bachelor?
                "": ""
            },
            {
                "ID": 85,
                "occupation": "gartner/gartner",
                "": ""
            },
            {
                "ID": 86,
                "occupation": "shoemaker/skomager",
                "": ""
            }
        ]; //json of occupations and occupation IDs


        items.forEach(function(item) {
            if(item.occupations !=null) {
                if (Array.isArray(item.occupations.occupation)){
                    item.occupations.occupation.forEach(function(occupation){
                        newItem.forEach(function(new_item){
                            if (new_item.ID === occupation.occupation_id){
                                occupation.occupation_name = new_item.occupation
                            }
                        });

                    });
                    for(var i=0; i<items[0].occupations.occupation.length;i++){
                        var job=items[0].occupations.occupation[i].occupation_name;
                        multiple_jobs.push(job);
                    }
                multiple_jobs.toString();
                    person_job=multiple_jobs;
                    console.log("multiple jobs array",multiple_jobs)


                }

                    else {
                        newItem.forEach(function (new_item) {
                            if (new_item.ID === item.occupations.occupation.occupation_id) {
                                item.occupations.occupation.occupation_name = new_item.occupation
                            }
                            person_job = items[0].occupations.occupation.occupation_name;
                        });

                        console.log('person_job_else', items[0].occupations.occupation.occupation_name);
                    }
            }
            else {

                    person_job = "No Occupation";
                }
        });

        console.log('items',items);
        return (
            <div className="PeopleView grid-y">
                <div className="tab-header cell medium-1">
                    <img style={{marginTop:'-1.7%', marginRight:'1%'}} src="https://png.icons8.com/windows/64/000000/contacts.png" alt="person icon"/>
                    <h2 style={{fontWeight:'bold',display:'inline-block'}}>{this.props.person['full_name']}</h2>
                </div>
                <div className="cell medium 11">
                    <div className="grid-x" >
                        <div className="medium-7 cell">
                            <div className="grid-y info-wrap">
                                <div className="cell medium-5">
                                    <div className="grid-x informant-bio-container">
                                        <img src={require(`../RightBar/informant_images/${[90,123,150,235,241].includes(this.props.person['person_id'])? String(this.props.person['person_id']) + '.jpg' : 'noprofile.png'}`)}
                                             className="cell medium-4"/>
                                        <div className="cell medium-8 details">
                                            <div className="detail-item"><b>Born</b> {this.props.person['birth_date']}</div>
                                            <div className="detail-item"><b>Died</b> {this.props.person['death_date']}</div>
                                            <div className="detail-item"><b>ID#</b> {String(this.props.person['person_id'])}</div>
                                            <div className="detail-item"><b>Occupation (Eng/Dansk):</b> {String(person_job)}</div>
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