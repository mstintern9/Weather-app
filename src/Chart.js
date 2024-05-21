import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Chart({ weatherData, filterTimestamps }) {
  return (
    <div className="chart">
      {weatherData ? (
        <ResponsiveContainer width="96%" height={376}>
          <LineChart data={filterTimestamps(weatherData.list)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={({ x, y, payload }) => {
                const { value } = payload;
                const hour = parseInt(value.split(':')[0]);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour % 12 || 12;
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={16}
                      textAnchor="middle"
                      fill="#666"
                      fontSize={10}
                    >
                      {`${hour12} ${ampm}`}
                    </text>
                  </g>
                );
              }}
            />

            <YAxis tick={{ fill: "rgb(235, 110, 115)" }} />
            <Tooltip />
            <Line
              type="natural"
              dataKey="temp"
              stroke="rgb(235, 110, 115)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}
