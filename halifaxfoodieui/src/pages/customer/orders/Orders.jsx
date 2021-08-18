import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios, { Routes } from "../../../services/axios";
import Table from "@material-ui/core/Table";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import { RefreshRounded } from "@material-ui/icons";
import { Button, TextField } from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Orders = () => {
  const classes = useStyles();
  const [orderList, setOrderList] = useState(null);
  const [review, setReview] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    try {
      const { url, method } = Routes.halifaxfoodieAPI.getOrders();
      const { data } = await axios[method](url, {
        customerId: userId,
        customerName: userName,
      });
      if (data.orders) {
        setOrderList(data.orders);
        return;
      }
      alert("No Data Available");
    } catch (err) {
      alert(err);
    }
  };

  const submitReview = () => {
    if (review === "") {
      return;
    }
  };

  return (
    <TableContainer style={{ width: 800, margin: "auto" }} component={Paper}>
      <Table className={classes.table} aria-label="caption table">
        <caption>
          <RefreshRounded onClick={fetchOrders} />
        </caption>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell align="right">Restaurant Name</TableCell>
            <TableCell align="right">Order Date</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Review</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderList &&
            orderList.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.restaurantName}</TableCell>
                <TableCell align="right">
                  {moment(row.orderDate).calendar()}
                </TableCell>
                <TableCell align="right">{row.orderStatus}</TableCell>
                <TableCell align="right">
                  <TextField
                    type="text"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  ></TextField>
                  <Button
                    onClick={submitReview}
                    disabled={row.orderStatus !== "Delivered"}
                  >
                    Give Feedback
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Orders;
