import React from "react";
import WeatherIcons from "./WeatherIcons";

const Description = ({ currentDateTime, weatherData, getWeatherCondition }) => {
  return (
    <div className="description">
      <p className="date">{currentDateTime.toLocaleString()}</p>
      <h2 style={{ display: "contents" }}>{weatherData.city.name}</h2>
      <span style={{ justifyContent: "center" }}>
        <WeatherIcons
          weatherCondition={getWeatherCondition(weatherData.list[0])}
        />
        {weatherData.list && weatherData.list.length > 0 && (
          <p style={{ fontWeight: 600, fontSize: "2.8vh" }}>
            {Math.trunc(weatherData.list[0].main.temp)}
            °C
          </p>
        )}
      </span>
      <p
        style={{
          fontWeight: 600,
          fontSize: "2vh",
          marginTop: "-1.3vh",
        }}
      >
        Feels like {Math.floor(weatherData.list[0].main.feels_like)}
        °C.
        {weatherData.list && weatherData.list.length > 0
          ? weatherData.list[0].weather[0].description
          : ""}
      </p>
      <div className="descriptionBox">
        <span className="spanDescription">
          <p>Description: {weatherData.list[0].weather[0].description}</p>
          <p>Temperature:{Math.floor(weatherData.list[0].main.temp)}°C</p>
        </span>
        <span className="spanDescription">
          <p>Feels like: {Math.floor(weatherData.list[0].main.feels_like)}°C</p>
          <p>Humidity: {weatherData.list[0].main.humidity}%</p>
        </span>
        <span className="spanDescription">
          <p>Pressure: {weatherData.list[0].main.pressure}</p>
          <p>Wind Speed: {weatherData.list[0].wind.speed}m/s</p>
        </span>
      </div>
    </div>
  );
};

export default Description;
