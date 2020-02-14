import axios from 'axios';

export const fetchWeather = (apiType) => (params) => {
  const {
    cityName,
    zipcode,
    timeframe = 1,
  } = params;
  const apiTypes = ['forecast', 'weather'];
  if(!apiTypes.includes(apiType) || !(cityName || zipcode)) {
    return Promise.reject('Insufficient data to make request');
  }
  const API_KEY = "YOU API KEY HERE";
  const BASE_URL = "https://api.openweathermap.org/data/2.5";
  return axios.get(
    `${BASE_URL}/${apiType}?q=${cityName}&cnt=${timeframe}&appid=${API_KEY}`,
  )
    .then((res) => {
      if(res.status === 200) {
        const weatherData = timeframe > 1 ?
          res.data.list.map((d) => formatWeatherData(d)) : 
          [formatWeatherData(res.data)];
        return weatherData;
      } else {
        return res;
      }
    })
    .catch((err) => {
      console.dir(err);
      return err;
    });
};

const KtoC = (degree) => (degree - 273.15);
const CtoF = (degree) => (degree * 1.8) + 32;

export const CELSIUS = "Celsius";
export const FARENHEIT = "Farenheit";

const formatWeatherData = (data) => {
  const {
    main,
    wind,
  } = data;
  const convertedDegreeData = Object.keys(main)
    .reduce((acc, key) => {
      if(key.includes("temp") || key === "feels_like") {
        const { temps } = acc;
        const celsius = KtoC(main[key]);
        const fahrenheit = CtoF(celsius);
        return {
          ...acc,
          temps: {
            [CELSIUS]: { ...temps[CELSIUS], [key]: celsius },
            [FARENHEIT]: { ...temps[FARENHEIT], [key]: fahrenheit }
          }
        };
      }
      return { ...acc, [key]: main[key] };
    }, { temps: { [CELSIUS]: {}, [FARENHEIT]: {} } } );

  const weather = {
    ...convertedDegreeData,
    ...wind
  }
  return weather;
};
