import React, { useState } from 'react';
import CurrentLocation from './pages/currentLocation';
import Stopwatch from './pages/stopwatch';
import './App.css';

function App() {
  const [activeComponent, setActiveComponent] = useState('Weather'); 

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Weather':
        return <CurrentLocation />;
      case 'Stopwatch':
        return <Stopwatch />;
      default:
        return <CurrentLocation />;
    }
  };

  return (
    <>
      <div className="content">
        {/* MAIN */}
        <div className="container">
          {renderComponent()}
        </div>

        {/* NAVBAR */}
        <div className="navbar">
          <div className="nav-items">
            <button
              className={`btn ${activeComponent === 'Weather' ? 'active' : ''}`}
              onClick={() => setActiveComponent('Weather')}
            >
              Weather
            </button>
            <button
              className={`btn ${activeComponent === 'Stopwatch' ? 'active' : ''}`}
              onClick={() => setActiveComponent('Stopwatch')}
            >
              Stopwatch
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer-info">
        Developed by{" "}
        <a
          target="_blank"
          href="https://github.com/Sarvesh0906"
          rel="noreferrer"
        >
          Sarvesh Chaurasia
        </a>{" "}
        | Powered by{" "}
        <a
          target="_blank"
          href="https://openweathermap.org/"
          rel="noreferrer"
        >
          Open Weather API
        </a>
      </div>
    </>
  );
}

export default App;