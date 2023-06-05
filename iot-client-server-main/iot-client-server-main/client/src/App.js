import {NavLink} from "react-router-dom";
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <div id="nav-section">
        <div className="nav" >
            
        </div>
        <div className="nav">
           
        </div>
        <div className="nav">
            
        </div>
        <div className="nav">

      
          <NavLink to="/Login"> Log In </NavLink>

       

        </div>
        <div className="nav">
           
        </div>
    </div>
    <div id="body-section">
        <h1>GUARDNET</h1>
    </div>
    <div id="description-section">
        <h2>Produced for the Westwood Tech Starters Club</h2>
    </div>
      </header>
        </div>
  );
}

export default App;
