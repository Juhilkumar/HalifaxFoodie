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
import { InfoRounded } from "@material-ui/icons";
import { MenuItem, Select, InputLabel } from "@material-ui/core";
import { securityQuestion } from "./securityQuestion";
import firebase, { firestore } from "../../../services/firebase";
import { useHistory } from "react-router";

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

const UserInfoPage = ({ user, setUserValidated }) => {
  const classes = useStyles();
  const history = useHistory();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [securityAnswer, setSecurityAnswer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser();
  };

  const addUser = () => {
    const ref = firestore
      .collection("user")
      .doc(user.attributes.sub)
      .set({
        firstName,
        lastName,
        address,
        question: securityQuestion[questionIndex],
        username: user.username,
        email: user.attributes.email,
        role: user.attributes["custom:role"],
        securityAnswer,
        created: firebase.database.ServerValue.TIMESTAMP,
      })
      .then(() => {
        alert("User data stored successfully");
        setUserValidated(true);
        history.push("/");
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <InfoRounded />
        </Avatar>
        <Typography component="h1" variant="h5">
          Welcome to Halifax Foodie!!
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="address"
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel id="security-question">
                Select Security Question
              </InputLabel>
              <Select
                id="security-question"
                placeholder="Select Security Question!"
                label="Security Question"
                value={questionIndex}
                onChange={(e) => setQuestionIndex(e.target.value)}
                required
                style={{ width: "100%" }}
              >
                {securityQuestion.map((question, index) => (
                  <MenuItem key={index} value={index}>
                    {question}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="securityAnswer"
                label="Security Answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
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
            Submit
          </Button>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default UserInfoPage;
