import React, { Component } from "react"; //imports React
//import components
import "./signup.css";
import left from "./left";
import right from "./right";

class App extends Component {
    render() {
        return (
            <div className='signup'>
                <left />
                <right />
            </div>
        )
    }
}

export default App;