import React, { useState, useEffect } from "react";
import axios from "axios";
import "./weather.css";
import CityOptions from "./CityOptions";
import { format } from "date-fns";
import Description from "./Description";
import Chart from "./Chart";
import Prediction from "./Prediction";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=eed0d77cab34b0df8b50420675d0487a`
        );
        setWeatherData(response.data);
        setCurrentDateTime(new Date());
        if (
          activeIndex &&
          response.data &&
          response.data.list &&
          response.data.list.length > 0
        ) {
          const selected = response.data.list.find(
            (forecast) => forecast.dt === activeIndex
          );
          setSelectedForecast(selected);
        } else if (
          response.data &&
          response.data.list &&
          response.data.list.length > 0
        ) {
          setSelectedForecast(response.data.list[0]);
          setActiveIndex(response.data.list[0].dt);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [city, activeIndex]);

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
    setActiveIndex(index); // Update activeIndex when a forecast is selected in the scroller
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
