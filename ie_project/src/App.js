import React from 'react';
import './App.css';

import {Routing} from './Routes'
import {BrowserRouter as Router} from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Router>
            <Routing/>
        </Router>
    </div>
);

}

export default App;
