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
import { Button } from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const RestaurantOrders = () => {
  const classes = useStyles();
  const [orderList, setOrderList] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    try {
      const { url, method } = Routes.halifaxfoodieAPI.getRestaurantOrders();
      const { data } = await axios[method](url, {
        restaurantId: userId,
        restaurantName: userName,
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

  const updateStatus = async (id, currentStatus) => {
    const userId = localStorage.getItem("userId");
    try {
      const { url, method } = Routes.halifaxfoodieAPI.changeOrderStatus();
      const { data } = await axios[method](url, {
        id,
        currentStatus,
        restaurantId: userId,
      });
      alert("Status Updated");
      fetchOrders();
    } catch (err) {
      alert(err);
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
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderList &&
            orderList.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.customerName}</TableCell>
                <TableCell align="right">
                  {moment(row.orderDate).calendar()}
                </TableCell>
                <TableCell align="right">{row.orderStatus}</TableCell>
                <TableCell align="right">
                  <Button
                    disabled={row.orderStatus === "Delivered" ? true : false}
                    onClick={() => updateStatus(row.id, row.orderStatus)}
                  >
                    Update Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RestaurantOrders;
