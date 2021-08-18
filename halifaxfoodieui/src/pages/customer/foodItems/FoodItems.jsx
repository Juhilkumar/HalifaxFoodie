import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import axios, { Routes } from "../../../services/axios";
import FoodItemList from "./foodItemList/FoodItemList";

const FoodItems = ({ user }) => {
  const [foodItemList, setFoodItemList] = useState(null);
  const { restaurantId } = useParams();
  const history = useHistory();
  const [restaurantName, setRestaurantName] = useState(null);

  useEffect(() => {
    loadAllFoodItems();
    if (history && history.location) {
      setRestaurantName(history.location.params.restaurantName);
    }
  }, []);

  const loadAllFoodItems = async () => {
    try {
      const { url, method } = Routes.halifaxfoodieAPI.getAllFoodItems();
      const { data } = await axios[method](url);
      if (data.foodItems) {
        const foodItems = data.foodItems.filter(
          (item, index) => item.restaurantId === restaurantId
        );
        setFoodItemList(foodItems);
      } else {
        alert("no food item available");
      }
    } catch (err) {
      alert(err);
    }
  };

  const placeOrder = async (cart, clearOrder) => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    try {
      const { url, method } = Routes.halifaxfoodieAPI.createOrder();
      const { data } = await axios[method](url, {
        customerId: userId,
        customerName: userName,
        orderTotalCost: cart
          .reduce((sum, item) => sum + item.price, 0)
          .toFixed(2),
        restaurantName: restaurantName,
        foodItems: cart,
      });
      alert("Order placed Successfully");
      clearOrder();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      <FoodItemList placeOrder={placeOrder} itemList={foodItemList} />
    </div>
  );
};

export default FoodItems;
