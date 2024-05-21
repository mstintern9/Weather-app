import React, { useState, useEffect } from "react";
import axios from "axios";
import "./weather.css";
import CityOptions from "./CityOptions";
import { format } from "date-fns";
import Description from "./Description";
import Chart from "./Chart";
import Prediction from "./Prediction";
import Cities from "./Cities";
const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          console.log(
            "Location permission granted:",
            position,
            latitude,
            longitude
          );
        },
        (error) => {
          console.error("Location permission denied:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const fetchReverseGeocodingData = async () => {
      try {
        if (latitude && longitude) {
          const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
          const response = await axios.get(apiUrl);
          const address = response.data.address;

          console.log("Reverse Geocoding Data:", address);
          for (const key in address) {
            if (address.hasOwnProperty(key)) {
              const value = address[key].trim().toLowerCase();
              const matchedCity = Cities.find((city) =>
                value.includes(city.toLowerCase())
              );

              if (matchedCity) {
                setCurrentCity(matchedCity);
                return;
              }
            }
          }
          console.log("No city matched from CityOptions.");
        }
      } catch (error) {
        console.error("Error fetching reverse geocoding data:", error);
      }
    };
    fetchReverseGeocodingData();
  }, [latitude, longitude]);

  useEffect(() => {
    if (currentCity) {
      setCity(currentCity);
    }
  }, [currentCity]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (city) {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=eed0d77cab34b0df8b50420675d0487a`
          );
          setWeatherData(response.data);
          setCurrentDateTime(new Date());
          if (
            !activeIndex &&
            response.data &&
            response.data.list &&
            response.data.list.length > 0
          ) {
            setSelectedForecast(response.data.list[0]);
            setActiveIndex(response.data.list[0].dt);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [city]);

  useEffect(() => {
    if (weatherData && activeIndex) {
      const selected = weatherData.list.find(
        (forecast) => forecast.dt === activeIndex
      );
      setSelectedForecast(selected);
    }
  }, [activeIndex, weatherData]);

  const getTemperatureForTime = (time) => {
    const data = weatherData.list.find((item) => {
      const date = new Date(item.dt_txt);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedTime = `${hours}:${
        minutes < 10 ? "0" + minutes : minutes
      }`;
      return formattedTime === time;
    });
    return data ? `${Math.round(data.main.temp)}°C` : "-";
  };

  const morningTime = "06:00";
  const afternoonTime = "12:00";
  const eveningTime = "18:00";
  const nightTime = "21:00";

  const handleForecastSelection = (index, forecast) => {
    console.log("Clicked index:", index);
    setSelectedForecast(forecast);
    setActiveIndex(index);
    console.log("Clicked id:", forecast.dt);
  };

  const handleInputChange = (e) => {
    const selectedCity = e.target.value;
    console.log("Selected city:", selectedCity);
    setCity(selectedCity);
  };

  const getDayAndDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatHour = (dateString) => {
    const date = new Date(dateString);
    return format(date, "HH:mm");
  };

  const filterTimestamps = (list) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const filteredList = list.filter((item) => {
      const date = new Date(item.dt_txt);
      return date.getDate() === currentDay;
    });
    return filteredList.map((item) => ({
      name: formatHour(item.dt_txt),
      temp: item.main.temp,
    }));
  };

  const handleAction = (index, forecast) => {
    console.log("Clicked forecast:", forecast);
    setSelectedForecast(forecast);
    setActiveIndex(index);

    const tableRow = document.getElementById(`table-row-${index}`);
    if (tableRow) {
      tableRow.classList.add("active");
    }

    const scrollerItem = document.getElementById(`scroller-item-${index}`);
    if (scrollerItem) {
      scrollerItem.classList.add("active");
    }

    document.getElementById("table").style.display = "none";
    document.querySelector(".after-action").style.display = "block";
  };

  const handleAfterAction = () => {
    document.getElementById("table").style.display = "table";
    document.querySelector(".after-action").style.display = "none";
  };

  const getWeatherCondition = (forecast) => {
    if (!forecast) {
      return "";
    }

    const temperature = forecast.main.temp;

    if (temperature >= 22 && temperature <= 26) {
      return "air";
    } else if (temperature >= 27 && temperature <= 35) {
      return "sunny";
    } else if (
      new Date(forecast.dt_txt).getHours() >= 19 &&
      new Date(forecast.dt_txt).getHours() < 24
    ) {
      return "night";
    } else if (
      forecast.weather[0].description.toLowerCase().includes("thunderstorm")
    ) {
      return "thunderstorm";
    } else if (temperature >= 36 && temperature <= 48) {
      return "thermostat";
    } else if (forecast.rain && forecast.rain["3h"] > 0) {
      return "water";
    } else if (forecast.clouds && forecast.clouds.all > 0) {
      return "cloud";
    }

    return "sunny";
  };

  return (
    <>
      <div className="container">
        <div className="firstContainer">
          <select
            name="Location"
            id="Location"
            required
            onChange={handleInputChange}
          >
            <CityOptions />
          </select>
        </div>
        <div className="secondContainer">
          {weatherData ? (
            <>
              <div className="firstRow">
                <Description
                  currentDateTime={currentDateTime}
                  weatherData={weatherData}
                  getWeatherCondition={getWeatherCondition}
                />
                <div className="map">
                  <img
                    style={{ height: 401, width: 833 }}
                    src="./Capture2.png"
                  />
                </div>
              </div>
              <div className="secondRow">
                <Chart
                  weatherData={weatherData}
                  filterTimestamps={filterTimestamps}
                />
                <Prediction
                  weatherData={weatherData}
                  activeIndex={activeIndex}
                  handleAction={handleAction}
                  handleForecastSelection={handleForecastSelection}
                  handleAfterAction={handleAfterAction}
                  selectedForecast={selectedForecast}
                  getWeatherCondition={getWeatherCondition}
                  getTemperatureForTime={getTemperatureForTime}
                  morningTime={morningTime}
                  afternoonTime={afternoonTime}
                  eveningTime={eveningTime}
                  nightTime={nightTime}
                  getDayAndDate={getDayAndDate}
                />
              </div>
            </>
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Weather;
