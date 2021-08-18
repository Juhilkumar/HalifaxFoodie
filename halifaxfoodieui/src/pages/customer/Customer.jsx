import React from "react";
import { AmplifyChatbot } from "@aws-amplify/ui-react";
import FoodItems from "./foodItems/FoodItems";
import Restaurants from "./restaurants/Restaurants";

const Customer = () => {
  const handleComplete = (data) => {
    console.log(data);
    return data;
  };

  return (
    <div>
      <div>Customer Page</div>
      <iframe
        width="600"
        height="450"
        src="https://datastudio.google.com/embed/reporting/121d144d-8400-4d1b-af71-5293c045de92/page/24PWC"
      ></iframe>
      <Restaurants />
      <div>
        <AmplifyChatbot
          onChatCompleted={handleComplete}
          botName="HalifaxFoodie_dev"
          botTitle="My ChatBot"
          welcomeMessage="Hello, how can I help you?"
        />
      </div>
    </div>
  );
};

export default Customer;
