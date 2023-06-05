import React from 'react';
import "./Login.css"
import {NavLink} from "react-router-dom";
import {useNavigate} from "react-router-dom";
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://admin:<techstartersproject>@main.3jalufq.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   var dbo = client.db("main");
//   try {
//     dbo.createCollection("users", function (err, res) {
//       console.log("Users collection created!");
//     });
//   } catch {
//     console.log("Users collection already exists!");
//   }
//   client.close();
// });

function Login() {
  const navigate = useNavigate();

    const NavigateSuccessfulLogin = function(json) {
      console.log(json.loginStatus);
      if(json.loginStatus === 1) {
        console.log("Condition fired");
        navigate("/Dashboard");
      } else {
        alert("Login Failed!");
      }
    }

    const handleChange = function() {
      
    }

    const handleSubmit = function(event) {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      fetch(`http://localhost:8000/verifylogin?username=${username}&password=${password}`)
      .then(res => res.json())
      .then(json => NavigateSuccessfulLogin(json))
      .catch()
      .finally();
    }

  return (
    <div className="App">
      <header className="App-header">
        <div id="nav-section">
          <div className="nav">

            <div id="toHome">
              <div class="btn-opt"><NavLink to="/"> Home </NavLink></div>
              <div class="btn-opt"><NavLink to="/Register"> Register </NavLink></div>
            </div>

          </div>
        </div>
        <div id="body-section">

          <div id="Login">
            <h1>Login</h1>
            {/*<img src="GuardNet Logo1.png" className="t-image imgaestyle1"></img>*/}
            <form>
              <label><b>Username</b></label>
              <input id="username" className="input" type="text" placeholder="Enter Username" name="uname" required onChange={handleChange}></input>
              <br></br>
              <label ><b>Password</b></label>
              <input id="password" className="input" type="password" placeholder="Enter Password" name="psw" onChange={handleChange} required></input>
              <br></br>
              <button type="submit" onClick={handleSubmit}>Login</button>
            </form>
          </div>
        </div>
      </header>

    </div>


  );
}

export default Login;