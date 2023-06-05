//https://hackernoon.com/how-to-build-a-qr-code-generator-in-react
import React from 'react';
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
const queryString = require('query-string');


function GenerateQRCode(props) {
 
  const [url, setUrl] = useState("");

  const downloadQRCode = (e) => {
    e.preventDefault();
    setUrl("");
  };


  const search = useLocation().search;
  const name = new URLSearchParams(search).get('name');
  const school = new URLSearchParams(search).get('school');

  const qrcode = (
    
    <QRCodeCanvas
      id="qrCode"
      value={`http://localhost:8000/alert?roomname=${name}&school=${school}`}
      size={300}
      bgColor={"#ffffff"}
      level={"H"}
    />
  );
  return (
    <div className="App">
      <header className="App-header">
      <NavLink id="back-to-dashboard" to="/Dashboard">Back to Dashboard</NavLink>
      <br />
        <div>{qrcode}</div>
      </header>
    </div>
  );
};

export default GenerateQRCode;