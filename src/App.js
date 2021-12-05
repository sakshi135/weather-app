import "./App.css";
import React, { useState, useEffect } from "react";
import FxItem from "./FxItem";
import fetchExchangeRates from "./service.js";
import GoogleMap from "./GoogleMap.js";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState([{}]);
  const [weatherForecast, setWeatherForecast] = useState([{}]);

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
        navigator.geolocation.getCurrentPosition(getCoordinates);
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

  const getWeather = (event) => {
    if (event.key === "Enter") {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=24736b20dc42ab404b85e28218f4c732`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);
          setWeatherData(data);
        });
    }
  };

  const getWeatherForecast = () => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=24736b20dc42ab404b85e28218f4c732`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(" Forecast data", data);
        setWeatherForecast(data);
      });
  };

  console.log("weather", weatherData);
  console.log("weather Forecast", weatherForecast);
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const getCoordinates = (position) => {
    console.log(position);
    setLat(position.coords.latitude);
    setLong(position.coords.longitude);
  };

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
      <h1> google maps integration</h1>

      <input
        className="input"
        placeholder="Enter City..."
        onChange={(e) => setCity(e.target.value)}
        value={city}
        onKeyPress={getWeather}
      />

      {city && <GoogleMap lat={lat} long={long} city={city} />}
      {weatherData.main && (
        <div>
          <div className="date">{dateBuilder(new Date())}</div>
          <p>{weatherData.name}</p>
          <p>{Math.round(weatherData.main.temp)}°F</p>
          <p>{weatherData.weather[0].main}</p>
        </div>
      )}
      <button onClick={getWeatherForecast}>next days forecast</button>
      {weatherForecast.list && (
        <div>
          <p>{Math.round(weatherForecast.list[11].main.temp)}°F</p>
          <p>{weatherForecast.list[11].weather[0].main}</p>
          <p>{Math.round(weatherForecast.list[19].main.temp)}°F</p>
          <p>{weatherForecast.list[19].weather[0].main}</p>
          <p>{Math.round(weatherForecast.list[27].main.temp)}°F</p>
          <p>{weatherForecast.list[27].weather[0].main}</p>
        </div>
      )}
      {rates && city
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
  );
}

export default App;
