import React from 'react';
import logo from './logo.svg';
import './App.css';
import PhotosList from "./pages/PhotosList/PhotosList";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PhotosList/>
      </header>
    </div>
  );
}

export default App;
