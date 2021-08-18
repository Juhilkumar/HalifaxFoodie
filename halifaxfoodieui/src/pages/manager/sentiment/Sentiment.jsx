import React, { Fragment } from "react";
import { Chart } from "chart.js";
import { useState } from "react";
import { useEffect } from "react";
import axios, { Routes } from "../../../services/axios";
import CreateChart from "../../../components/CreateChart/CreateChart";

const Sentiment = ({ participantIndex }) => {
  const [sentimentData, setSentimentData] = useState(null);
  const [options, setOptions] = useState(null);

  let data = [];

  useEffect(() => {
    loadSentimentData();
  }, []);

  const loadSentimentData = async () => {
    try {
      const { url, method } = Routes.feedback.fetchReviewsAnalysis();
      const { data } = await axios[method](url);
      console.log("Sentiment", data);
      processInput(data);
    } catch (err) {
      alert(err);
    }
  };

  const sentimentCost = (value) => {
    switch (true) {
      case value >= 0.9:
        return "Very Positive";
      case value >= 0.75:
        return "Positive";
      case value >= 0:
        return "Neutral";
      case value >= -0.5:
        return "Negative";
      case value >= -1:
        return "Very Negative";
    }
  };

  const sentimentWeight = (value) => {
    switch (true) {
      case value >= -0.75 && value <= 0.75:
        return 5;
      case (value > 0.75 && value < 0.95) || (value < -0.75 && value > -0.95):
        return 7;
      case value >= 0.95 || value <= -0.95:
        return 10;
    }
  };

  const processInput = (sentimentAnalysis) => {
    sentimentAnalysis.map((s, index) => {
      switch (s.Sentiment) {
        case "POSITIVE":
          data.push({
            x: s.SentimentScore.Positive,
            y: Math.random(),
          });
          break;
        case "NEGATIVE":
          data.push({
            x: 0 - s.SentimentScore.Negative,
            y: Math.random(),
          });
          break;
        case "NEUTRAL":
          data.push({
            x: s.SentimentScore.Neutral,
            y: Math.random(),
          });
          break;
        case "MIXED":
          data.push({
            x: s.SentimentScore.Mixed,
            y: Math.random(),
          });
          break;
      }
    });
    const total = data.reduce((sum, point) => sum + point.x, 0);
    const avgSentiment = total / data.length;

    const sentimentData = {
      datasets: [
        {
          label: "Sentiment Values",
          borderColor:
            participantIndex !== null
              ? data.map((d, i) =>
                  i === participantIndex ? "#FF9480" : "rgb(0, 193, 148)"
                )
              : "rgb(0, 193, 148)",
          backgroundColor:
            participantIndex !== null
              ? data.map((d, i) =>
                  i === participantIndex ? "#FF9480" : "rgb(0, 193, 148)"
                )
              : "rgb(0, 193, 148)",
          data: data,
          pointRadius: data.map((d, index) => sentimentWeight(d.x)),
        },
      ],
    };
    setSentimentData(sentimentData);
    const options = {
      title: {
        display: true,
        text: [
          `Average Sentiment: ${avgSentiment.toFixed(2)}`,
          `Overall Sentiment: ${sentimentCost(avgSentiment)}`,
        ],
      },
      aspectRatio: 1,
      legend: {
        position: "bottom",
      },
      scales: {
        yAxes: [
          {
            display: true,
            ticks: {
              suggestedMin: 0, // minimum will be 0, unless there is a lower value.
              suggestedMax: 1,
            },
          },
        ],
        xAxes: [
          {
            display: true,
            ticks: {
              suggestedMin: -1, // minimum will be 0, unless there is a lower value.
              suggestedMax: 1,
            },
          },
        ],
      },
    };
    setOptions(options);
  };

  return (
    <Fragment>
      {options && sentimentData && (
        <div>
          <CreateChart
            type="scatter"
            options={options}
            data={sentimentData}
          ></CreateChart>
        </div>
      )}
    </Fragment>
  );
};

export default React.memo(Sentiment);
