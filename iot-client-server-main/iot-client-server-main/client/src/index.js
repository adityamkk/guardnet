import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './Login';
import Dashboard from './Dashboard';
import NewRoom from './NewRoom';
import Register from './Register';
import GenerateQRCode from './generateqrcode';

import {Routes, BrowserRouter, Route} from "react-router-dom";

import reportWebVitals from './reportWebVitals'; 

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={ <App /> }/>
        <Route path="/Login" element={ <Login /> }/>
        <Route path="/Dashboard" element={ <Dashboard /> }/> 
        <Route path="/NewRoom" element={ <NewRoom /> }/> 
        <Route path="/Register" element={ <Register /> }/> 
        <Route path="/generateQRCode" element={ <GenerateQRCode /> }/> 

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
