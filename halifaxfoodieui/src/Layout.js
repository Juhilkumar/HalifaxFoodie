import React, { useEffect, useState } from "react";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { firestore } from "./services/firebase";
import Main from "./pages/Main";
import SecurityCheck from "./pages/security-check/SecurityCheck";

const Layout = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userValidated, setUserValidated] = useState(false);

  useEffect(() => {
    isUserExist();
  }, [user]);

  const isUserExist = () => {
    if (user && user.attributes) {
      const ref = firestore.collection("user").doc(user.attributes.sub);
      ref
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUserInfo(doc.data());
          } else {
            setUserInfo(null);
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  };

  const isUserValid = (securityAnswer) => {
    if (
      userInfo &&
      securityAnswer.toLowerCase() === userInfo.securityAnswer.toLowerCase()
    ) {
      localStorage.setItem(
        "userName",
        userInfo.firstName + " " + userInfo.lastName
      );
      localStorage.setItem("userId", user.attributes.sub);
      localStorage.setItem(
        "token",
        user.signInUserSession.accessToken.jwtToken
      );
      setUserValidated(true);
      return;
    }
    setUserValidated(false);
    alert("Invalid Answer, Please login again");
    Auth.signOut();
  };

  return (
    <div>
      {userValidated ? (
        <Main setUserValidated={setUserValidated} user={user} />
      ) : (
        <SecurityCheck
          userInfo={userInfo}
          user={user}
          isUserValid={isUserValid}
          setUserValidated={setUserValidated}
        />
      )}
    </div>
  );
};

export default Layout;
