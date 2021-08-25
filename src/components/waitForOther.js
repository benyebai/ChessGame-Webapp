import React from 'react';
import "./waitForOther.css";

class WaitForOther extends React.Component {

  render() {
    return(
        <div>
            <h1 className = "title">Waiting for opponent...</h1>
            <div className = "info">
                <h2>Send this link to your friends for them to join</h2>
                <h2>{window.location.href}</h2>
            </div>
        </div>
    );
  }
}


export default WaitForOther;
