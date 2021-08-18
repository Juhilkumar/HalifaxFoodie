import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { firestore } from "../../../services/firebase";
import { useHistory } from "react-router";

const useStyles = makeStyles({
  root: {
    maxWidth: 275,
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

const Chats = ({ user }) => {
  const classes = useStyles();
  const history = useHistory();
  const [restaurantList, setRestaurantList] = useState(null);
  useEffect(() => {
    loadRestaurantDetails();
  }, []);

  const loadRestaurantDetails = async () => {
    const temp = [];
    const snapshots = await firestore.collection("user").get();
    snapshots.docs.map((doc) => {
      if (doc.exists) {
        const data = doc.data();
        if (data.role === "H") {
          temp.push({ ...data, id: doc.id });
        }
      } else {
        console.log("No Such a Document");
      }
    });
    setRestaurantList(temp);
  };

  const startChat = (id) => {
    history.push({
      pathname: `/chats/${id}`,
      params: {
        user,
      },
    });
  };
  return (
    <div>
      {restaurantList &&
        restaurantList.map((restaurant, index) => {
          return (
            <Card key={index} className={classes.root}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {restaurant.firstName + " " + restaurant.lastName}
                </Typography>
                <Typography variant="body2" component="p">
                  {restaurant.address}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="medium" onClick={() => startChat(restaurant.id)}>
                  Start Chat
                </Button>
              </CardActions>
            </Card>
          );
        })}
    </div>
  );
};

export default Chats;
