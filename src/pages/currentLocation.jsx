import React, { useState, useEffect } from "react";
import apiKeys from "../api/apiKeys";
import { format } from "date-fns";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiFog, WiStrongWind } from "react-icons/wi";
import Forecast from "../components/forcast";
import useLiveClock from "../components/liveClock";
import loader from "../assets/images/WeatherIcons.gif";
import "../css/currentLocation.css";

const dateBuilder = (d) => {
  return format(d, "eeee, dd MMMM yyyy");
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState({
    city: undefined,
    country: undefined,
    temperatureC: undefined,
    main: undefined,
    icon: "CLEAR_DAY",
  });
  const [loading, setLoading] = useState(true);

  const currentTime = useLiveClock();

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
    const getPosition = (options) => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    const getWeather = async (lat, lon) => {
      try {
        const response = await fetch(
          `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
        );
        const data = await response.json();
        setWeatherData({
          city: data.name,
          country: data.sys?.country,
          temperatureC: Math.round(data.main?.temp),
          main: data.weather[0]?.main,
          icon: data.weather[0]?.main,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Failed to fetch weather data. Using default location.");
        getWeather(28.67, 77.22); // Fallback to default location
      }
    };

    if (navigator.geolocation) {
      getPosition()
        .then((position) => {
          getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real-time weather."
          );
          getWeather(28.67, 77.22); // Fallback to default location
        });
    } else {
      alert("Geolocation not available");
      getWeather(28.67, 77.22); // Fallback to default location
    }
  }, []);

  if (loading) {
    return (
      <>
        <img
          src={loader}
          alt="Loading..."
          className="loader"
          style={{ width: "50%", WebkitUserDrag: "none" }}
        />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location will be displayed on the App <br /> & used for
          calculating Real-time weather.
        </h3>
      </>
    );
  }

  return (
    <>
      <div className="city">
        <div className="title">
          <h2>{weatherData.city}</h2>
          <h3>{weatherData.country}</h3>
        </div>

        <div className="mb-icon">
          {getIcon(weatherData.icon)}
          <p>{weatherData.main}</p>
        </div>

        <div className="date-time">
          <div className="dmy">
            <div className="current-time">
              {format(currentTime, "HH:mm:ss")}
            </div>

            <div className="current-date">{dateBuilder(currentTime)}</div>
          </div>

          <div className="temperature">
            <p>
              {weatherData.temperatureC}°<span>C</span>
            </p>
          </div>
        </div>
      </div>

      <Forecast icon={weatherData.icon} weather={weatherData.main} />
    </>
  );
};

export default Weather;