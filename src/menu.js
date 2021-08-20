import React from 'react';
import './App.css';
import "./menu.css";

class Menu extends React.Component {
    constructor(props){
        super(props);

        this.generateRoom = this.generateRoom.bind(this);
    }

    generateRoom(){
        let randomId = parseInt(Math.random() * 100000000);

        window.location.assign("/game/" + randomId.toString());
        
    }

    render() {
        return(
            <div>
                <h1 className = "centered">penius</h1>
                <button onClick = {this.generateRoom} className = "button"/>
            </div>
        );
    }
}


export default Menu;
