import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    maxWidth: 275,
    margin: 10,
    minWidth: 200,
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

const FoodItemList = ({ itemList }) => {
  const classes = useStyles();
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {itemList &&
        itemList.map((item, index) => {
          return (
            <Card key={index} className={classes.root}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {item.foodItemName}
                </Typography>
                <Typography variant="h4" component="h1">
                  {"$ " + item.cost}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="medium">Learn More</Button>
              </CardActions>
            </Card>
          );
        })}
    </div>
  );
};

export default FoodItemList;
