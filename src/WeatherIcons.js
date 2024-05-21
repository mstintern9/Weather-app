import React from "react";
import AirIcon from "@mui/icons-material/Air";
import WbSunnySharpIcon from "@mui/icons-material/WbSunnySharp";
import ModeNightSharpIcon from "@mui/icons-material/ModeNightSharp";
import ThunderstormSharpIcon from "@mui/icons-material/ThunderstormSharp";
import CloudIcon from "@mui/icons-material/Cloud";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterIcon from "@mui/icons-material/Water";

const WeatherIcons = ({ weatherCondition }) => {
  const weatherIcons = [
    {
      condition: "air",
      temperatureRange: [22, 26],
      icon: <AirIcon sx={{ height: "100px", width: "3.6vh" ,fill:"rgb(241, 93, 70)"}} />,
    },
    {
      condition: "sunny",
      temperatureRange: [27, 35],
      icon: <WbSunnySharpIcon sx={{ height: "100px", width: "3.6vh",fill:"rgb(241, 93, 70)" }} />,
    },
    {
      condition: "night",
      timeRange: [19, 24],
      icon: <ModeNightSharpIcon sx={{ height: "100px", width: "3.6vh",fill:"rgb(241, 93, 70)" }} />,
    },
    {
      condition: "thunderstorm",
      description: "thunderstorm",
      icon: <ThunderstormSharpIcon sx={{ height: "100px", width: "3.6vh",fill:"rgb(241, 93, 70)" }} />,
    },
    {
      condition: "cloud",
      hasClouds: true,
      icon: <CloudIcon sx={{ height: "100px", width: "3.6vh",fill:"rgb(239, 239, 237)" }} />,
    },
    {
      condition: "thermostat",
      temperatureRange: [36, 48],
      icon: <ThermostatIcon sx={{ height: "100px", width: "3.6vh",fill:"rgb(241, 93, 70)" }} />,
    },
    {
      condition: "water",
      isRaining: true,
      icon: <WaterIcon sx={{ height: "100px", width: ".6vh",fill:"rgb(241, 93, 70)" }} />,
    },
  ];

  const selectedIcon = weatherIcons.find(
    (icon) => icon.condition === weatherCondition
  );

  return <div>{selectedIcon && selectedIcon.icon}</div>;
};

export default WeatherIcons;
