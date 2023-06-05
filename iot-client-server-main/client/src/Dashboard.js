import React from 'react';
import "./Dashboard.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  fetchRooms();
  fetchAlerts();
  function removeSpecificRoom(roomName) {
    const roomname = document.getElementById(roomName).value;
    fetch(`http://localhost:8000/removeroom?roomname=${roomname}`)
      .then(res => res.json())
      .catch()
      .finally();
    fetchRooms();
  }
  function fetchRooms() {
    fetch(`http://localhost:8000/getrooms`)
      .then(res => res.json())
      .then(json => displayRoomLocations(json.rooms))
      .catch()
      .finally();
  }
  function displayRoomLocations(arr) {
    document.getElementById("room-list-table").innerHTML = "<tbody><tr><th>Room&nbsp;&nbsp;</th><th>Floor</th></tr>";
    for (let i = 0; i < arr.length; i++) {
      document.getElementById("room-list-table").innerHTML += `<tr><td>${arr[i].name}&nbsp;&nbsp;</td><td>${arr[i].floor}</td><td><button><a href="/generateQRCode?name=${arr[i].name}&school=${arr[i].school}">QR Code</a></button></td></tr>`; //fetch('http://localhost:8000/removeroom?roomname=${arr[i].name}');
    }
    document.getElementById("room-list-table").innerHTML += "<tbody>";
  }

  function displayAlerts(arr) {
    document.getElementById("alert-list-table").innerHTML = "<tbody>";

    for (let i = 0; i < arr.length; i++) {
      document.getElementById("alert-list-table").innerHTML += `<tr><td>${new Date(parseInt(arr[i].time)).toLocaleTimeString()}&nbsp;</td><td>Alert from ${arr[i].name} at floor ${arr[i].floor}</td></tr>`;
    }
    document.getElementById("alert-list-table").innerHTML += "</tbody>";

  }

  function handleAddNewRoom() {
    const roomname = document.getElementById("roomname").value;
    const floornumber = document.getElementById("floornumber").value;
    fetch(`http://localhost:8000/addnewroom?roomname=${roomname}&floornumber=${floornumber}`)
      .then(res => res.json())
      .catch()
      .finally();
    fetchRooms();
  }

  function handleRemoveRoom() {
    const roomname = document.getElementById("roomname-remove").value;
    fetch(`http://localhost:8000/removeroom?roomname=${roomname}`)
      .then(res => res.json())
      .catch()
      .finally();
    fetchRooms();
  }


  function fetchAlerts() {
    fetch(`http://localhost:8000/getwarnings`)
      .then(res => res.json())
      .then(json => displayAlerts(json.alerts))
      .catch()
      .finally();
  }

  function clearAlerts() {
    fetch(`http://localhost:8000/clearalerts`)
      .then(res => res.json())
      .catch()
      .finally();
    fetchAlerts();
  }

  /*
  function seeRooms() {
    fetch(`http://localhost:8000/`)
      .then(res => res.json())
      .catch()
      .finally();
    fetchAlerts();
  }
  */

  // red green blue?
  return (
    <div className="App">
      <header className="App-header">
        <div id="nav-section">
          <div className="nav" >
            <h1>Guardnet Dashboard</h1>
          </div>
        </div>
        <div>
          <div id="warnings">
            <div class='some-page-wrapper'>
              <div class='row'>
                <div class='column'>
                  <div class='blue-column'>
                    <h2>Alerts</h2>
                    <button id="alert-button" onClick={fetchAlerts}>Fetch Alerts</button>
                    <button id="alert-clear-button" onClick={clearAlerts}>Clear Alerts</button>

                    <table id='alert-list-table'></table>
                  </div>
                </div>
                <div class='column'>
                  <div class='green-column'>
                    <h2>Locations</h2>
                    <NavLink id="qr-code-generator" to="/newRoom">Create QR Code for Room</NavLink><br></br>
                    <br />
                  </div>
                  <div id="rooms">

                    <label>Room Name</label>
                    <input id="roomname" type="text" placeholder="class A"></input>
                    <label>Floor Number</label>
                    <input id="floornumber" type="text" placeholder="1"></input>
                    <button id="room-add" onClick={handleAddNewRoom}>Add New Room</button>
                    <br />

                    <label>Room Name</label>
                    <input id="roomname-remove" type="text" placeholder="class A"></input>
                    <button id="room-add" onClick={handleRemoveRoom}>Remove Room</button>

                    <div id="room-list">
                      <table id="room-list-table">
                        <tbody>

                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </header>
    </div>
  );
}

export default Dashboard;
