//https://hackernoon.com/how-to-build-a-qr-code-generator-in-react
import React from 'react';
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

function NewRoom() {
  const [url, setUrl] = useState("");

  const downloadQRCode = (e) => {
    e.preventDefault();
    setUrl("");
  };

  const qrCodeEncoder = (e) => {
    setUrl(`http://localhost:8000/alert?roomname=${e.target.value}&school=`);
  };

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={url}
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
        <div className="input__group">
          <form onSubmit={downloadQRCode}>
            <label>Enter Room Name</label>
            <input
              type="text"
              onChange={qrCodeEncoder}
              placeholder="classA"
            />
            <button type="submit" disabled={!url}>
              Download QR code
            </button>
          </form>
        </div>
      </header>
    </div>
  );
};

export default NewRoom;