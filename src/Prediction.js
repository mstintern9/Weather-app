import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import WeatherIcons from "./WeatherIcons";

export default function Prediction({
  weatherData,
  activeIndex,
  handleAction,
  handleForecastSelection,
  handleAfterAction,
  selectedForecast,
  getWeatherCondition,
  getDayAndDate,
}) {
  const getTimestamps = (forecastDate) => {
    const selectedDayData = weatherData.list.filter((forecast) => {
      const forecastDateObj = new Date(forecast.dt_txt);
      return forecastDateObj.getDate() === forecastDate.getDate();
    });

    const morningForecast = selectedDayData.find((forecast) => {
      const forecastDateObj = new Date(forecast.dt_txt);
      return forecastDateObj.getHours() === 6;
    });

    const afternoonForecast = selectedDayData.find((forecast) => {
      const forecastDateObj = new Date(forecast.dt_txt);
      return forecastDateObj.getHours() === 12;
    });

    const eveningForecast = selectedDayData.find((forecast) => {
      const forecastDateObj = new Date(forecast.dt_txt);
      return forecastDateObj.getHours() === 18;
    });
    const nightForecast = selectedDayData.find((forecast) => {
      const forecastDateObj = new Date(forecast.dt_txt);
      return forecastDateObj.getHours() === 21;
    });

    return {
      morningTemp: morningForecast ? morningForecast.main.temp : "-",
      afternoonTemp: afternoonForecast ? afternoonForecast.main.temp : "-",
      eveningTemp: eveningForecast ? eveningForecast.main.temp : "-",
      nightTemp: nightForecast ? nightForecast.main.temp : "-",
      morningFeelsLike: morningForecast ? morningForecast.main.feels_like : "-",
      afternoonFeelsLike: afternoonForecast
        ? afternoonForecast.main.feels_like
        : "-",
      eveningFeelsLike: eveningForecast ? eveningForecast.main.feels_like : "-",
      nightFeelsLike: nightForecast ? nightForecast.main.feels_like : "-",
    };
  };

  return (
    <div className="predictions">
      <h3 style={{ display: "flex", marginLeft: "8vh", fontSize: "2vh" }}>
        5 Day Forecast
      </h3>
      {weatherData && weatherData.list ? (
        <table id="table">
          <tbody>
            {weatherData.list
              .filter(
                (forecast, index, self) =>
                  index ===
                  self.findIndex(
                    (f) =>
                      getDayAndDate(f.dt_txt) === getDayAndDate(forecast.dt_txt)
                  )
              )
              .slice(0, 5)
              .map((forecast) => (
                <tr
                  key={forecast.dt}
                  id={`table-row-${forecast.dt}`}
                  className={forecast.dt === activeIndex ? "active" : ""}
                >
                  <td style={{ paddingBottom: "2vh", width: "26vh" }}>
                    {getDayAndDate(forecast.dt_txt)}
                  </td>
                  <td style={{ display: "flex", gap: "0.4vh" }}>
                    <div className="weather-icon-container">
                      <WeatherIcons
                        weatherCondition={getWeatherCondition(forecast)}
                      />
                    </div>
                    {Math.floor(forecast.main.temp)}°C
                  </td>
                  <td className="descriptionColumn">
                    {forecast.weather[0].description}
                  </td>
                  <td className="arrowColumn">
                    <button
                      className="actionButton"
                      style={{
                        color: "black",
                        border: "none",
                        background: "white",
                        paddingBottom: "1vh",
                      }}
                      onClick={() => handleAction(forecast.dt, forecast)}
                    >
                      <ArrowDropDownIcon />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>Loading forecast data...</p>
      )}

      <div
        className="after-action"
        style={{ display: "none", marginTop: "1vh", paddingLeft: "4vh" }}
      >
        <div className="scroller">
          {weatherData && weatherData.list ? (
            weatherData.list
              .filter(
                (forecast, index, self) =>
                  index ===
                  self.findIndex(
                    (f) =>
                      getDayAndDate(f.dt_txt) === getDayAndDate(forecast.dt_txt)
                  )
              )
              .slice(0, 5)
              .map((forecast) => (
                <li
                  id={`scroller-item-${forecast.dt}`}
                  className={forecast.dt === activeIndex ? "active" : ""}
                  style={{ width: "19vh", listStyleType: "none" }}
                  key={forecast.dt}
                  onClick={() => handleForecastSelection(forecast.dt, forecast)}
                >
                  {getDayAndDate(forecast.dt_txt)}
                </li>
              ))
          ) : (
            <p>Loading forecast data...</p>
          )}

          <button
            onClick={handleAfterAction}
            style={{
              color: "black",
              border: "none",
              background: "rgb(242, 242, 242)",
              height: "2vh",
            }}
          >
            <ArrowDropUpIcon />
          </button>
        </div>

        <div className="scrollerDescription">
          <WeatherIcons
            weatherCondition={getWeatherCondition(selectedForecast)}
          />
          <div className="topSection">
            <p style={{ fontWeight: "700", fontSize: "1.7vh" }}>
              {selectedForecast && selectedForecast.weather[0].description}
            </p>
            <p>
              Temperature is {selectedForecast && selectedForecast.main.temp}°C
            </p>
          </div>
        </div>
        <ul className="details">
          <li className="list-item">
            {selectedForecast && selectedForecast.main.temp}°C
          </li>
          <li className="list-item">
            {selectedForecast && selectedForecast.main.pressure}hPa
          </li>
          <li className="list-item">
            {selectedForecast && selectedForecast.main.sea_level}msl
          </li>
          <li className="list-item">
            humidity: {selectedForecast && selectedForecast.main.humidity}%
          </li>
          <li className="list-item">
            {selectedForecast && selectedForecast.wind.speed}m/s
          </li>
          <li className="list-item">
            gust:{selectedForecast && selectedForecast.wind.gust}m
          </li>
        </ul>
        <table className="timestamps">
          <thead>
            <tr>
              <td></td>
              <td>Morning</td>
              <td>Afternoon</td>
              <td>Evening</td>
              <td>Night</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: "gray" }}>Temperature</td>
              <td>
                {getTimestamps(new Date(selectedForecast.dt_txt)).morningTemp}
              </td>
              <td>
                {getTimestamps(new Date(selectedForecast.dt_txt)).afternoonTemp}
              </td>
              <td>
                {getTimestamps(new Date(selectedForecast.dt_txt)).eveningTemp}
              </td>
              <td>
                {getTimestamps(new Date(selectedForecast.dt_txt)).nightTemp}
              </td>
            </tr>
            <tr>
              <td style={{ color: "gray" }}>Feels Like</td>
              <td>
                {
                  getTimestamps(new Date(selectedForecast.dt_txt))
                    .morningFeelsLike
                }
              </td>
              <td>
                {
                  getTimestamps(new Date(selectedForecast.dt_txt))
                    .afternoonFeelsLike
                }
              </td>
              <td>
                {
                  getTimestamps(new Date(selectedForecast.dt_txt))
                    .eveningFeelsLike
                }
              </td>
              <td>
                {
                  getTimestamps(new Date(selectedForecast.dt_txt))
                    .nightFeelsLike
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
