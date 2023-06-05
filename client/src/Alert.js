import React from 'react';

function Alert() {

    fetch(`http://localhost:8000/alert?location=classB`)
    .then(res => res.json())
    .catch()
    .finally();

  return (
    <div className="App">
        <header className="App-header">
            <h1>Request Sent</h1>
        </header>
    </div>
  ); 
}

export default Alert;