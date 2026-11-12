import React from "react";

function WeatherCard({ data }) {
  console.log(data);
  const { weather, name, sys, main } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  return (
    <div className="weather-card">
      <h2>
        {name}, {sys.country}
      </h2>
      <img src={iconUrl} alt={weather[0].description} />
      <p>{weather[0].main}</p>
      <h3>{main.temp}°C</h3>
    </div>
  );
}

export default WeatherCard;
