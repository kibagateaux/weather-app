import React, { useState } from "react";
import LocationInput from "./LocationInput";
import WeatherDisplay from './WeatherDisplay';

import "../App.css";
import { fetchWeather, CELSIUS, FARENHEIT } from "../utils";


function App() {
  const [weatherData, setWeather] = useState([{}]);
  const [cityName, setCity] = useState('');
  const [degreeMetrics, setMetric] = useState([FARENHEIT, CELSIUS ]);
  const [timeframe, setTimeframe] = useState(1); // number of days
  const [error, setError] = useState();

  const onInputChange = (func) => (event) => func(event.target.value);
  const updateMetric = (selectedMetric) => {
    // Puts selected degree metric as first element in state's array
    const nonSelectedMetrics = [...degreeMetrics]
      .filter(val =>val !== selectedMetric);
    const newArr = [selectedMetric, ...nonSelectedMetrics];
    return setMetric(newArr);
  };

  const getWeather = () => {
    if(cityName.length < 1 || !Number(timeframe)) {
      return setError('Error: Please check that the information you input');
    }
    const apiType = (Number(timeframe) || 1) > 1 ? 'forecast' : 'weather';
    const callApi = fetchWeather(apiType);
    return callApi({
      cityName,
      timeframe,
    })
    .then((weather) => {
      setError(null);
      setWeather(weather);
    })
    .catch((err) => {
      const statusCode = err.response.status;
      if(statusCode === 404) {
        return setError("Can not find selected region. Please try again.");
      }
      if(statusCode === 401) {
        return setError("Unauthorized! Please check your API key");
      }
    })
    
  };

  return (
    <div id="app">
      <h1>Weather In: {cityName}</h1>
      <h3> {error ? error : `Displaying degrees in: ${degreeMetrics[0]}°`} </h3>

      <div id="app-container">
        <LocationInput
          setCity={onInputChange(setCity)}
          setMetric={onInputChange(updateMetric)}
          setTimeframe={onInputChange(setTimeframe)}
          getWeather={getWeather}
          degreeMetrics={degreeMetrics}
        />
        <WeatherDisplay
          weatherData={weatherData}
          cityName={cityName}
          degreeMetric={degreeMetrics[0]}
        />
      </div>

      <button
        onClick={getWeather}
        id="big-button"
      >
        View your weather
      </button>
    </div>
  );
}

export default App;
