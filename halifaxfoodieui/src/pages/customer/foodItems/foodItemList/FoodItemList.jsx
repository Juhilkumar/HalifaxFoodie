import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    margin: 10,
    width: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const FoodItemList = ({ itemList, placeOrder }) => {
  const classes = useStyles();

  const [cart, setCart] = useState([]);

  const addToBag = (item) => {
    const bag = [...cart];
    const findItem = bag.findIndex((food) => food.id === item.id);
    console.log("item", findItem);
    if (findItem !== -1) {
      bag[findItem].quantity += 1;
      bag[findItem].price += item.cost;
    } else {
      bag.push({
        id: item.id,
        quantity: 1,
        foodItemName: item.foodItemName,
        price: item.cost,
      });
    }
    setCart(bag);
  };

  const isItemInBag = (id) => {
    const findIndex = cart.findIndex((item) => item.id === id);
    if (findIndex === -1) {
      return false;
    }
    return true;
  };

  const removeFromBag = (id) => {
    let bag = [...cart];
    bag = bag.filter((item) => item.id !== id);
    setCart(bag);
  };

  const clearOrder = () => {
    setCart([]);
  };

  console.log("cart", cart);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {itemList &&
          itemList.map((item, index) => {
            return (
              <Card key={index} className={classes.root}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {item.foodItemName}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {item.restaurantName}
                  </Typography>
                  <Typography variant="h4" component="h1">
                    {"$ " + item.cost}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={() => addToBag(item)} size="medium">
                    Add to Bag
                  </Button>
                  {isItemInBag(item.id) && (
                    <Button
                      onClick={() => removeFromBag(item.id)}
                      size="medium"
                    >
                      Remove
                    </Button>
                  )}
                </CardActions>
              </Card>
            );
          })}
      </div>
      {cart && cart.length > 0 && (
        <div>
          <TableContainer style={{ margin: 10, width: 300 }} component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <caption>
                Total Cost:{" "}
                {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                <Button
                  onClick={() => placeOrder(cart, clearOrder)}
                  size="medium"
                >
                  Order Now
                </Button>
              </caption>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Food Name</StyledTableCell>
                  <StyledTableCell align="right">Quantity</StyledTableCell>
                  <StyledTableCell align="right">Price</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((foodItem, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {foodItem.foodItemName}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {foodItem.quantity}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {foodItem.price.toFixed(2)}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};

export default FoodItemList;
