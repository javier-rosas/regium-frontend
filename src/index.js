import React from 'react';
import App from './App.js';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import './components/styles/index.css';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)


