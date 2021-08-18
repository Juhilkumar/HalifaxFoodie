import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios, { Routes } from "../../../services/axios";
import { TextField, Button } from "@material-ui/core";

const CustomerPubSub = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      receiveMessage();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const receiveMessage = async () => {
    const userId = localStorage.getItem("userName");
    try {
      const { url, method } = Routes.pubsubapi.receiveMessage();
      const { data } = await axios[method](url, {
        subscriptionId: "supportsubscriptionforuser",
      });
      if (data.message) {
        const msg = JSON.parse(data.message);
        console.log("customer old messages", msg.message.userId, userId);
        if (msg.userId !== userId) {
          setMessages((oldMessages) => [...oldMessages, msg]);
        }
      }
    } catch (err) {
      alert(err);
    }
  };

  const sendMessage = async () => {
    const userId = localStorage.getItem("userName");
    if (message === "") {
      return;
    }
    try {
      const { url, method } = Routes.pubsubapi.sendMessage();
      const { data } = await axios[method](url, {
        message: { message, userId },
        topic: "support",
      });
      setMessages((oldMessages) => [...oldMessages, { message, userId }]);
      setMessage("");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      {messages &&
        messages.map((message, index) => <div>{message.message}</div>)}
      <div>
        <TextField
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></TextField>
        <Button onClick={() => sendMessage()}>Send</Button>
      </div>
    </div>
  );
};

export default CustomerPubSub;
