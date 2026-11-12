import React from "react";

function WeatherCard({ data }) {
  const condition = data.weather?.[0] ?? {};
  const iconUrl = condition.icon
    ? `https://openweathermap.org/img/wn/${condition.icon}@2x.png`
    : "";
  const localTime = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date((data.dt + data.timezone) * 1000));

  const details = [
    {
      label: "Feels like",
      value: `${Math.round(data.main.feels_like)}°`,
      icon: "◌",
    },
    { label: "Humidity", value: `${data.main.humidity}%`, icon: "〰" },
    {
      label: "Wind",
      value: `${Math.round(data.wind.speed * 3.6)} km/h`,
      icon: "↗",
    },
    {
      label: "Visibility",
      value: `${(data.visibility / 1000).toFixed(1)} km`,
      icon: "◎",
    },
  ];

  return (
    <article className="weather-card">
      <div className="weather-card-top">
        <span className="live-label">
          <span className="status-dot" />
          RIGHT NOW
        </span>
        <span className="local-time">LOCAL TIME · {localTime}</span>
      </div>

      <div className="current-weather">
        <div className="place-heading">
          <p className="weather-country">{data.sys.country}</p>
          <h2>{data.name}</h2>
          <p className="condition">{condition.description}</p>
        </div>
        <div className="temperature-block">
          {iconUrl && (
            <img
              className="weather-icon"
              src={iconUrl}
              alt={condition.description || "Current weather"}
            />
          )}
          <p className="temperature">{Math.round(data.main.temp)}<span>°</span></p>
          <p className="temperature-unit">CELSIUS</p>
        </div>
      </div>

      <div className="weather-divider" />

      <div className="weather-details">
        {details.map((detail) => (
          <div className="detail-item" key={detail.label}>
            <span className="detail-icon" aria-hidden="true">{detail.icon}</span>
            <span className="detail-label">{detail.label}</span>
            <strong>{detail.value}</strong>
          </div>
        ))}
      </div>

      <p className="weather-note">
        A small check-in with the sky, wherever you are.
      </p>
    </article>
  );
}

export default WeatherCard;
