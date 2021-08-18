import React, { Fragment, useEffect } from "react";
import { Route, Switch } from "react-router";
import Chats from "./customer/chats/Chats";
import ChatWindow from "./customer/chatwindow/ChatWindow";
import Customer from "./customer/Customer";
import CustomerPubSub from "./customer/customerpubsub/CustomerPubSub";
import FoodItems from "./customer/foodItems/FoodItems";
import Orders from "./customer/orders/Orders";
import Header from "./Header";
import Manager from "./manager/Manager";
import RestaurantOrders from "./manager/orders/Orders";
import PubSub from "./manager/pubsub/PubSub";
import UserChats from "./manager/userchats/UserChats";
import UserChatWindow from "./manager/userchatwindow/UserChatWindow";

const Main = ({ user, setUserValidated }) => {
  console.log("user", user);
  return (
    <div className="hello">
      <Header setUserValidated={setUserValidated} />
      {user.attributes["custom:role"] === "U" ? (
        <Switch>
          <Route
            exact
            path="/chats/:id"
            render={() => <ChatWindow user={user} />}
          />
          <Route
            exact
            path="/restaurant/:restaurantId"
            render={() => <FoodItems user={user} />}
          />
          <Route path="/pubsub" render={() => <CustomerPubSub user={user} />} />
          <Route path="/orders" render={() => <Orders user={user} />} />
          <Route path="/chats" render={() => <Chats user={user} />} />
          <Route path="/" render={() => <Customer user={user} />} />
        </Switch>
      ) : (
        <Switch>
          <Route
            exact
            path="/chats/:id"
            render={() => <UserChatWindow user={user} />}
          />
          <Route
            path="/orders"
            render={() => <RestaurantOrders user={user} />}
          />
          <Route path="/pubsub" render={() => <PubSub user={user} />} />
          <Route path="/chats" render={() => <UserChats user={user} />} />
          <Route path="/" render={() => <Manager user={user} />} />
        </Switch>
      )}
    </div>
  );
};

export default Main;
