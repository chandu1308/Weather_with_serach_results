import { useEffect, useRef, useState } from "react";
import WeatherCard from "./weatherCard";
import "./styles.css";

const apiKey = "92b06df8557fd7709373e87987aa6291";

export default function App() {
  const [city, setCity] = useState("");
  const [locations, setLocations] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const searchRequestId = useRef(0);

  useEffect(() => {
    const query = city.trim();
    if (query.length < 2) {
      setLocations([]);
      setError("");
      setIsSearching(false);
      return undefined;
    }

    let controller;
    const timeoutId = setTimeout(async () => {
      controller = new AbortController();
      const requestId = ++searchRequestId.current;
      setIsSearching(true);
      setError("");

      try {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          query
        )}&limit=6&appid=${apiKey}`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "The weather service could not authorize this request. Check the API key."
              : "We couldn't search for that city. Please try again."
          );
        }

        const results = await response.json();
        if (requestId === searchRequestId.current) {
          setLocations(results);
          if (results.length === 0) {
            setError(`No places found for "${query}". Try another city.`);
          }
        }
      } catch (requestError) {
        if (requestError.name !== "AbortError" && requestId === searchRequestId.current) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Something went wrong while searching. Please try again."
          );
        }
      } finally {
        if (requestId === searchRequestId.current) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timeoutId);
      if (controller) controller.abort();
      searchRequestId.current += 1;
    };
  }, [city]);

  const fetchLocations = async (event) => {
    event.preventDefault();
    const query = city.trim();
    if (!query || isLoading) return;

    const requestId = ++searchRequestId.current;
    setIsSearching(true);
    setError("");

    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        query
      )}&limit=6&appid=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "The weather service could not authorize this request. Check the API key."
            : "We couldn't search for that city. Please try again."
        );
      }

      const results = await response.json();
      if (requestId !== searchRequestId.current) return;
      if (results.length === 0) {
        setError(`No places found for "${query}". Try another city.`);
      } else {
        setLocations(results);
      }
    } catch (requestError) {
      if (requestId === searchRequestId.current) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Something went wrong while searching. Please try again."
        );
      }
    } finally {
      if (requestId === searchRequestId.current) setIsSearching(false);
    }
  };

  const selectLocation = async (location) => {
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "The weather service could not authorize this request. Check the API key."
            : "We couldn't load the weather for this place. Please try again."
        );
      }

      const result = await response.json();
      setWeatherData(result);
      setLocations([]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while loading the weather. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Atmos home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path
                d="M7 20.5a7.5 7.5 0 0 1 14.6-2.4A5 5 0 1 1 22 28H9a4 4 0 0 1-2-7.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M16 3v4m9.2-.2-2.8 2.8M28 16h-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="brand-name">atmos<span>.</span></span>
        </a>
        <span className="topbar-note">
          <span className="status-dot" />
          Your little window to the world
        </span>
      </header>

      <main>
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">A forecast for wherever you are</p>
          <h1 id="page-title">
            Find your <span>kind of weather.</span>
          </h1>
          <p className="intro-copy">
            A little sunshine, a little rain check. Look up a place and see
            what the sky has in store.
          </p>
        </section>

        <div className="weather-layout">
          <section className="search-panel" aria-labelledby="search-title">
            <div className="panel-heading">
              <span className="panel-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
                  <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <h2 id="search-title">Explore a place</h2>
                <p>Start with a city, town, or region</p>
              </div>
            </div>

            <form className="search-form" onSubmit={fetchLocations}>
              <label className="sr-only" htmlFor="city-search">
                City or location
              </label>
              <div className="input-wrap">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M19 10.2c0 5-7 11-7 11s-7-6-7-11a7 7 0 1 1 14 0Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.7" />
                </svg>
                <input
                  id="city-search"
                  type="search"
                  value={city}
                  onChange={(event) => {
                    setCity(event.target.value);
                    setLocations([]);
                    setError("");
                  }}
                  placeholder="Try “Lisbon” or “Tokyo”"
                  autoComplete="off"
                />
              </div>
              <button
                className="search-button"
                type="submit"
                disabled={!city.trim() || isLoading || isSearching}
              >
                {isLoading || isSearching ? (
                  <>
                    <span className="button-spinner" aria-hidden="true" />
                    Looking
                  </>
                ) : (
                  <>
                    Search
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="search-hint" aria-live="polite">
              {isSearching
                ? "Searching places…"
                : "Pick a matching place to see its current weather."}
            </p>

            {error && (
              <p className="feedback-message error-message" role="alert">
                <span aria-hidden="true">!</span>
                {error}
              </p>
            )}

            {locations.length > 0 && (
              <div className="location-results" aria-label="Matching places">
                <p className="results-label">PICK A PLACE</p>
                {locations.map((location) => (
                  <button
                    className="location-option"
                    key={`${location.lat}-${location.lon}`}
                    type="button"
                    onClick={() => selectLocation(location)}
                    disabled={isLoading}
                  >
                    <span className="location-pin" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M19 10.2c0 5-7 11-7 11s-7-6-7-11a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.7" />
                        <circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.7" />
                      </svg>
                    </span>
                    <span className="location-copy">
                      <strong>{location.name}</strong>
                      <span>
                        {[location.state, location.country].filter(Boolean).join(", ")}
                      </span>
                    </span>
                    <svg className="location-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section
            className={`weather-stage${weatherData ? " has-weather" : ""}`}
            aria-label="Weather results"
            aria-live="polite"
          >
            {weatherData ? (
              <WeatherCard data={weatherData} />
            ) : (
              <div className="empty-state">
                <div className="sky-art" aria-hidden="true">
                  <span className="sun-orb" />
                  <span className="cloud cloud-back" />
                  <span className="cloud cloud-front" />
                </div>
                <p className="empty-kicker">A little space to breathe</p>
                <h2>Your forecast starts here.</h2>
                <p>Search for a place and your current conditions will show up right here.</p>
                <div className="empty-decoration" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="footer">
        <span>Made for curious skies.</span>
        <span>Weather data by OpenWeather</span>
      </footer>
    </div>
  );
}
