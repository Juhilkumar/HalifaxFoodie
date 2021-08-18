import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios, { Routes } from "../../../services/axios";
import CreateFoodItem from "./createFoodItem/CreateFoodItem";
import FoodItemList from "./foodItemList/FoodItemList";

const FoodItems = ({ user }) => {
  const [itemList, setItemList] = useState(null);

  useEffect(() => {
    loadItemsList();
  }, []);

  const loadItemsList = async () => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("username");
    try {
      const { url, method } =
        Routes.halifaxfoodieAPI.getFoodItemsByRestaurant();
      const { data } = await axios[method](url, {
        restaurantName: userName,
        restaurantId: userId,
      });
      if (data.foodItems) {
        setItemList(data.foodItems);
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      <CreateFoodItem loadItemsList={loadItemsList} />
      <FoodItemList itemList={itemList} />
    </div>
  );
};

export default FoodItems;
