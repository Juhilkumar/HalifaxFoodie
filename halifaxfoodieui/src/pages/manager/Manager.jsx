import React from "react";
import FoodItems from "./foodItems/FoodItems";
import WordCloud from "./namedentity/WordCloud";
import Sentiment from "./sentiment/Sentiment";

const Manager = ({ user }) => {
  return (
    <div>
      <FoodItems user={user} />
      <Sentiment />
      <WordCloud />
    </div>
  );
};

export default Manager;
