import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { WeatherDataProps } from "../types/global";
import { AiOutlineSearch } from "react-icons/ai";
import { WiHumidity } from "react-icons/wi";
import { WiStrongWind } from "react-icons/wi";
import { RiLoaderFill } from "react-icons/ri";
import { changeIcon } from "../assets/icons";

const api_key = "97bf6193f51e7422f3acfd691b634bde";
const api_Endpoint = "https://api.openweathermap.org/data/2.5/";

const Weather = () => {
  const [weatherData, setWeatherData] = useState<WeatherDataProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchCity, setSearchCity] = useState<string>("");

  const fetchCurrentWeather = useCallback(async (lat: number, lon: number) => {
    const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  }, []);

  const fetchWeatherData = async (city: string) => {
    const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
    const searchResponse = await axios.get(url);

    const currentWeatherData: WeatherDataProps = searchResponse.data;
    return { currentWeatherData };
  };

  const handleSearch = async () => {
    if (searchCity.trim() === "") {
      return;
    } else {
      const { currentWeatherData } = await fetchWeatherData(searchCity);
      setWeatherData(currentWeatherData);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const [currentWeather] = await Promise.all([
          fetchCurrentWeather(latitude, longitude),
        ]);
        setWeatherData(currentWeather);
        setIsLoading(true);
      });
    };

    fetchData();
  }, [fetchCurrentWeather]);

  return (
    <div className="weather">
      <div className="weather__search">
        <input
          className="weather__search__input"
          type="text"
          placeholder="Enter a city"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />

        <div className="button">
          <AiOutlineSearch onClick={handleSearch} />
        </div>
      </div>

      {weatherData && isLoading ? (
        <>
          {/* weatherArea */}
          <div className="result">
            <h1 className="result__name">{weatherData.name}</h1>
            <span className="result__country">{weatherData.sys.country}</span>
            <div className="result__icon">
              {changeIcon(weatherData.weather[0].main)}
            </div>
            <h1>{weatherData.main.temp.toFixed(0)}°C</h1>
            <h2 className="result__weather">{weatherData.weather[0].main}</h2>
          </div>
          {/* bottomInfoArea */}
          <div className="info">
            <div className="info__card">
              <WiHumidity className="info__card__icon" />
              <div className="humidInfo">
                <h1>{weatherData.main.humidity}%</h1>
                <p>Humidity</p>
              </div>
            </div>

            <div className="info__card">
              <WiStrongWind className="info__card__icon" />
              <div className="wind__humidInfo">
                <h1>{weatherData.wind.speed}km/h</h1>
                <p>Wind speed</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="loading">
          <RiLoaderFill className="loading__icon" />
          <p className="loading__text">Loading</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
