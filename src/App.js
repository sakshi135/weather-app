import "./App.css";
import React, { useState, useEffect } from "react";
import FxItem from "./FxItem";
import fetchExchangeRates from "./service.js";
import GoogleMap from "./GoogleMap.js";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState([{}]);
  const [weatherForecast, setWeatherForecast] = useState([{}]);
  const [display, setdisplay] = useState(false);

  const [lat, setLat] = useState();
  const [long, setLong] = useState();

  const [rates, setRates] = React.useState(null);
  const [ratesBase, setRatesBase] = React.useState("");

  useEffect(() => {
    let componentIsMounted = true;

    const getFxData = () => {
      fetchExchangeRates()
        .then((data) => {
          console.log("fx data:", data);
          if (componentIsMounted) {
            setRates(data.rates);
            setRatesBase(data.base);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    // load initially
    getLocation();
    getFxData();

    const fetchInterval = setInterval(getFxData, 1000 * 60);

    return () => {
      clearInterval(fetchInterval);
      componentIsMounted = false;
    };
  }, []);
  //end of useEffect
  const getWeather = (event) => {
    if (event.key === "Enter") {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=24736b20dc42ab404b85e28218f4c732`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);
          setWeatherData(data);
          setdisplay(true);
        });
    }
  };

  const getWeatherForecast = () => {
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=current,minutely,hourly,alerts&appid=24736b20dc42ab404b85e28218f4c732`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(" Forecast data", data);
        setWeatherForecast(data);
      });
  };

  console.log("weather", weatherData);
  console.log("weather Forecast", weatherForecast);

  const dateBuilder = (d) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    let hours = d.getHours();
    let minutes = d.getMinutes();

    return (
      <>
        {day} {date} {month} {year}
        <p>
          {hours}:{minutes}
        </p>
      </>
    );
  };

  return (
    <div className="App">
      <h1 style={{ fontSize: "45px" }}> Get to know your City</h1>

      <input
        className="input"
        placeholder="Enter your City..."
        onChange={(e) => setCity(e.target.value)}
        value={city}
        onKeyPress={getWeather}
      />
      <div className="content">
        <div className="weather">
          {weatherData.main && (
            <div>
              <div className="date">
                <h1>{dateBuilder(new Date())}</h1>
              </div>
              <h2>{weatherData.name}</h2>
              <img
                src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
              />

              <h3>
                {Math.round(weatherData.main.temp)}°C{" "}
                {weatherData.weather[0].main}
              </h3>
            </div>
          )}
          {display && (
            <button
              className="buttonNext"
              style={{ backgroundColor: "#00ffff" }}
              onClick={getWeatherForecast}
            >
              Next days forecast
            </button>
          )}
          {weatherForecast.daily &&
            weatherForecast.daily.slice(0, 3).map((d) => (
              <div className="forecast">
                <img
                  style={{ marginRight: "120px" }}
                  src={`http://openweathermap.org/img/w/${d.weather[0].icon}.png`}
                  alt={d.weather[0].main}
                />
                <div>
                  <h4>
                    {" "}
                    {d.temp.max} / {d.temp.min}°C
                  </h4>
                </div>
              </div>
            ))}
        </div>
        <div className="mapAndCurrency">
          {display && <GoogleMap lat={lat} long={long} city={city} />}
          {display && (
            <div className="CurrencyPrice">
              <h2>Currency</h2>

              <h2>Price</h2>
            </div>
          )}
          {rates && display
            ? Object.keys(rates).map(
                (key) =>
                  (key.includes("EUR") || key.includes("USD")) && (
                    <FxItem
                      key={key}
                      fxSymbol={key}
                      fxRate={rates[key]}
                      ratesBase={ratesBase}
                    />
                  )
              )
            : []}
        </div>
      </div>
    </div>
  );
}

export default App;
