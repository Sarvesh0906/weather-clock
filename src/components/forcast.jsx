import React, { useState, useEffect, useCallback } from "react";
import apiKeys from "../api/apiKeys";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiFog, WiStrongWind } from "react-icons/wi";
import "../css/forecast.css";

function Forecast({ icon, weather: weatherProp }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});

  const search = useCallback(async (city) => {
    if (!city) return; // Don't search if the city is empty

    try {
      const response = await fetch(
        `${apiKeys.base}weather?q=${city}&units=metric&APPID=${apiKeys.key}`
      );
      const data = await response.json();
      if (data.cod === "404") {
        // Handle city not found
        setError({ message: "City not found", query: city });
        setWeather({});
      } else {
        setWeather(data);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError({ message: "An error occurred", query: city });
      setWeather({});
    }
  }, []);

  const getIcon = (main) => {
    switch (main) {
      case "Clear":
        return <WiDaySunny />;
      case "Clouds":
        return <WiCloudy />;
      case "Rain":
        return <WiRain />;
      case "Snow":
        return <WiSnow />;
      case "Fog":
      case "Mist":
        return <WiFog />;
      case "Wind":
        return <WiStrongWind />;
      default:
        return <WiDaySunny />;
    }
  };

  useEffect(() => {
    search("Delhi");
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault(); 
    search(query); 
  };

  return (
    <div className="forecast">
      <div className="forecast-icon">
        {getIcon(icon)}
      </div>

      <div className="today-weather">
        <h3>{weatherProp}</h3>
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              alt="Search"
              onClick={handleSearch}
            />
          </div>
        </form>
        <ul>
          {typeof weather.main !== "undefined" ? (
            <div>
              <li className="cityHead">
                <p>
                  {weather.name}, {weather.sys?.country}
                </p>
                <span className="icon">
                  {weather.weather && weather.weather[0] ? getIcon(weather.weather[0].main) : null}
                </span>
              </li>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main?.temp)}° C ({weather.weather[0]?.main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(weather.main?.humidity)} %
                </span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">
                  {Math.round(weather.visibility / 1000)} km
                </span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(weather.wind?.speed)} Km/h
                </span>
              </li>
            </div>
          ) : (
            <li>
              {error.query} {error.message}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Forecast;