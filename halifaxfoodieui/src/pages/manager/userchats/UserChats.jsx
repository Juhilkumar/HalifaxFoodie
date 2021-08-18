import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { firestore } from "../../../services/firebase";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";
import { observeUsers } from "../../../services/users/functions";

const useStyles = makeStyles({
  root: {
    maxWidth: 275,
    margin: 10,
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

const UserChats = ({ user }) => {
  const classes = useStyles();
  const history = useHistory();

  const [userList, setUserList] = useState(null);
  const [currentTime, setCurrentTime] = useState(+new Date());

  useEffect(() => {
    loadUserList();
  }, []);

  // const updateUserListWithNewMessages = (id, newMessages) => {
  //   if (userList) {
  //     const temp = [...userList];
  //     const updateTemp = temp.map((user, index) => {
  //       console.log("condition", user.id === id);
  //       if (user.id === id) {
  //         return {
  //           ...user,
  //         };
  //       }
  //       return user;
  //     });
  //     setUserList(JSON.parse(JSON.stringify(updateTemp)));
  //   }
  // };

  useEffect(() => {
    const unsubscribe = observeUsers(user.attributes.sub, {
      next: (querySnapshot) => {
        loadUserList();
      },
      error: (err) => alert(err),
    });
    return unsubscribe;
  }, [user]);

  const loadUserList = async () => {
    const temp = [];
    const snapshots = await firestore
      .collection("chats")
      .doc(user.attributes.sub)
      .collection("users")
      .get();
    for (const doc of snapshots.docs) {
      if (doc.exists) {
        const chatData = doc.data();
        const user = await fetchUserDetails(chatData.userId);
        const newMessages = chatData.messages.reduce(
          (sum, message) => (message.created > currentTime ? 1 + sum : 0 + sum),
          0
        );
        temp.push({ ...user, messageCount: newMessages });
        console.log("inside temp1", newMessages);
        // setUserList([...temp, { ...user, messageCount: newMessages }]);
      } else {
        console.log("no such a document");
      }
    }
    console.log("new Tempdasdas", temp);
    setUserList(temp);
  };

  const fetchUserDetails = (userId) => {
    return new Promise(async (resolve, reject) => {
      const snapshot = await firestore.collection("user").doc(userId).get();
      if (snapshot.exists) {
        const user = snapshot.data();
        console.log("user", user);
        resolve({ ...user, id: snapshot.id });
      }
      resolve(null);
    });
  };

  const startChat = (id) => {
    history.push({
      pathname: `/chats/${id}`,
      params: {
        user,
        restaurantId: user.attributes.sub,
      },
    });
  };

  console.log("userLIst", userList);

  return (
    <div>
      {userList &&
        userList.map((user, index) => {
          return (
            <Card key={index} className={classes.root}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {user.firstName + " " + user.lastName}
                </Typography>
                <Typography variant="body2" component="p">
                  {user.address}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="medium" onClick={() => startChat(user.id)}>
                  Start Chat
                </Button>
                <Badge
                  color="secondary"
                  badgeContent={user.messageCount ? user.messageCount : 0}
                >
                  <MailIcon />
                </Badge>
              </CardActions>
            </Card>
          );
        })}
    </div>
  );
};

export default UserChats;
