import { useState } from "react";
import WeatherCard from "./weatherCard";
import "./styles.css";

export default function App() {
  const [city, setCity] = useState("");
  const [data, setData] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = "92b06df8557fd7709373e87987aa6291";

  const locationClick = async (i) => {
    const lat = data[i].lat;
    const lon = data[i].lon;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
      const response2 = await fetch(url);
      const data2 = await response2.json();
      setWeatherData(data2);
      setData([]);
    } catch (error) {
      console.log("Check the Error", error);
    }

    return null;
  };

  const fetchLocations = async (city) => {
    if (!city) return;

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=10&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (data.length > 0) {
        setData(data);
      } else {
        alert("City not found!");
        setData([]);
      }
    } catch (error) {
      console.log("Check the Error", error);
    }
  };

  return (
    <div className="App">
      <h1>Weather Search</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      ></input>
      <div style={{ border: "1px solid black" }}>
        {data.map((each, i) => {
          return (
            <p
              key={i.toString()}
              onClick={() => locationClick(i)}
              style={{ cursor: "pointer" }}
            >
              {data[i].name + ", " + data[i].state}
            </p>
          );
        })}
      </div>
      <button onClick={() => fetchLocations(city)}>Search Weather</button>
      {weatherData && <WeatherCard data={weatherData} />}
    </div>
  );
}
