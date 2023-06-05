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

function Register() {
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
      const school = document.getElementById("school").value;

      fetch(`http://localhost:8000/newaccount?username=${username}&password=${password}&school=${school}`)
      .then(res => res.json())
      .then(json => NavigateSuccessfulLogin(json))
      .catch()
      .finally();
    }

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

            <div id="toHome">
              <NavLink to="/"> Home </NavLink>

            </div>

          </div>
          <div className="nav">

          </div>
        </div>
        <div id="body-section">

          <div id="Login">
            <h1>Register</h1>
            {/*<img src="GuardNet Logo1.png" className="t-image imgaestyle1"></img>*/}
            <form>
              <label><b>Username</b></label>
              <input  id="username" className="input" type="text" placeholder="Enter Username" name="uname" required onChange={handleChange}></input>
              <br></br>
              <label ><b>Password</b></label>
              <input  id="password" className="input" type="password" placeholder="Enter Password" name="psw" onChange={handleChange} required></input>
              <br></br>
              <label ><b>School</b></label>
              <input  id="school" className="input" type="text" placeholder="Enter School Name" name="sch" onChange={handleChange} required></input>
              <br></br>
              <button type="submit" onClick={handleSubmit}>Create Account</button>
            </form>
          </div>
        </div>
      </header>

    </div>


  );
}

export default Register;