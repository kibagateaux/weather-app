import React from "react";

const LocationInput = (props) => {
  const {
    setCity,
    setTimeframe,
    setMetric,
    degreeMetrics,
  } = props;  

  return (
    <div id="location-input">
      <label>City Name: </label>
      <input
        name="city"
        type="text"
        required
        onChange={setCity}
      />

      <label for="timeframe">How many days of weather? (1-16)</label>
      <input
        name="timeframe"
        type="text"
        onChange={setTimeframe}
      />

      <label for="degree-metric">Display degrees in:</label>
      <div>
        {[...degreeMetrics].sort().map((str) => (
          <div className="radio" key={str}>
            <label>{str}</label>
            <input
              name="degree-metric"
              type="radio"
              value={str}
              onChange={setMetric}
              {...(degreeMetrics[0] === str && {checked: "checked"})}
            />
        </div>
        ))}
      </div>

    </div>
  );

};

export default LocationInput;
