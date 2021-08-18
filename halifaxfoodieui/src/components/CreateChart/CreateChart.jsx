/**
 * Author: Nikunj Shamjibhai Dhola
 * Description: Creates a chart for given datasets and options
 */
import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js";

const CreateChart = ({ options, data, type }) => {
  const myChart = useRef();
  const [chartInstance, setChartInstance] = useState(null);
  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
    const chartInstanceTemp = new Chart(myChart.current.getContext("2d"), {
      type: type,
      data: data,
      options: options,
    });
    setChartInstance(chartInstanceTemp);
  }, [options, data, type]);
  return (
    <canvas
      className="chart-canvas"
      style={{ maxHeight: 500, maxWidth: 500, margin: "10px auto" }}
      ref={myChart}
    ></canvas>
  );
};

export default CreateChart;
