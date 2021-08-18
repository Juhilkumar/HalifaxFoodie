import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { InfoRounded, EmojiFoodBeverage } from "@material-ui/icons";
// import firebase, { firestore } from "../../../services/firebase";
import { useHistory } from "react-router";
import axios, { Routes } from "../../../../services/axios";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Halifax Foodie
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const CreateFoodItem = ({ loadItemsList }) => {
  const classes = useStyles();
  const history = useHistory();

  const [foodItemName, setFoodItemName] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    try {
      const { url, method } = Routes.halifaxfoodieAPI.createFoodItem();
      const { data } = await axios[method](url, {
        restaurantId: userId,
        restaurantName: userName,
        foodItemName,
        cost,
      });
      alert(data.message);
      setFoodItemName("");
      setCost("");
      loadItemsList();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <EmojiFoodBeverage />
        </Avatar>
        <Typography component="h1" variant="h5">
          We are ready to add your tastey dishes
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="itemname"
                variant="outlined"
                required
                fullWidth
                id="foodItemName"
                label="Food Item Name"
                value={foodItemName}
                onChange={(e) => setFoodItemName(e.target.value)}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                type="number"
                id="cost"
                label="Cost"
                steps="any"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                autoComplete="cost"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Add Item
          </Button>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default CreateFoodItem;
