const Forecast = ({ key, weatherForecast }) => {
  return (
    <div>
      <p>{Math.round(weatherForecast.list[key].main.temp)}°F</p>
      <p>{weatherForecast.list[key].weather[0].main}</p>
    </div>
  );
};
export default Forecast;
