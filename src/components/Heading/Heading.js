/**
 * Created by danielhuang on 1/28/18.
 */
import React, { Component } from 'react';
import './Heading.css'

class Heading extends Component {

    constructor(){
        super();
        this.state = {
            storyPath:'',
            menuActive:false,
            menuList:[]
        };
        this.menuToggle = this.menuToggle.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    componentWillMount(){
        this.setState(()=>{
           var MenuList = [
               {name:'Preface',url:'',submenu:[]},
               {name:'Acknowledgements',url:'',submenu:[]},
               {name:'1. Introduction',url:'/Book/Chap_1.epub',submenu:[]},
               {name:'2. The Rise of Folklore Scholarship',url:'/Book/Chap_2.epub',submenu:[]},
               {name: "3. Evald Tang Kristensen's Life and Work",url:'/Book/Chap_3.epub',submenu:[]},
               {name:'4. Folklore Genres',url:'/Book/Chap_4.epub',submenu:[]},
               {name:'5. Mapping Folklore',url:'/Book/Chap_5.epub',submenu:[]},
               {name:'6. Repertoire and the Individual',url:'/Book/Chap_6.epub',submenu:[]},
               {name:"7. 'Bitte Jens' Kristensen: Cobbled Together",url:'/Book/Chap_7.epub',submenu:[]},
               {name:'8. Kristen Marie Pedersdatter: Between Farms and Smallholding',url:'/Book/Chap_8.epub',submenu:[]},
               {name:'9. Jens Peter Peterson: Day Laborer and Turner',url:'/Book/Chap_9.epub',submenu:[]},
               {name:'10. Ane Margrete Jensdatter: Old Age and Rural Poverty',url:'/Book/Chap_10.epub',submenu:[]},
               {name:'11. Peder Johansen: Miller, Fiddler, Bachelor Storyteller',url:'/Book/Chap_11.epub',submenu:[]},
               {name:'Additional Information',url:'',submenu:[]},
               {name:'About',url:'',submenu:''},
           ];
           return {menuList:MenuList};
        });
    }

    menuToggle(){
        this.setState((prevState)=>{
           return {menuActive:!prevState.menuActive}
        });
    }

    handleMenuClick(menuItem){
        var menuObject = {
            name:menuItem.name,
            url:menuItem.url
        };
        this.props.sendData(menuObject);
        this.menuToggle();
    }

    render() {
        return (
            <div className="Heading grid-x grid-padding-x">
                <div className="large-3 cell">
                    <div className="grid-x grid-margin-x">
                        <img src={require('./assets/DENM0001.png')} className="flag medium-3 medium-offset-1 cell" alt="Danish Flag"/>
                        <h5 className="danish-folklore medium-2 cell">Danish Folklore</h5>
                        <h6 className="etk medium-6 cell">The Evald Tang <br/> Kristensen Collection</h6>
                    </div>
                </div>
                <div className="medium-offset-7 large-offset-8 Hamburger-Menu medium-1 cell" onClick={this.menuToggle}>
                    <img src="https://png.icons8.com/wired/64/ffffff/book.png"
                         style={{height:"2.9em", paddingTop:"7px", paddingLeft:"10px"}}
                         alt="book"/>
                </div>
                <div className={`Menu ${this.state.menuActive ? 'active' : ''}`}>
                    <div className="solid">
                        <div className="Hamburger-Menu" onClick={this.menuToggle}>
                            <img src="https://png.icons8.com/wired/50/ffffff/literature.png" style={{height:"2.9em", paddingTop:"5px"}} alt="open book"/>
                        </div>
                        <ul className="list">
                            {this.state.menuList.map((menuItem,i)=>{
                                return <li key={i} className="menu-item" onClick={(e)=>{e.preventDefault();this.handleMenuClick(menuItem)}}>{menuItem.name}</li>
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Heading;