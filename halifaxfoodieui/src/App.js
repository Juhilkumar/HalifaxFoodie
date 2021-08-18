import "./App.css";
import {
  AmplifyAuthenticator,
  AmplifySignUp,
  AmplifyConfirmSignUp,
} from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { useState } from "react";
import Layout from "./Layout";

function App() {
  const [userRole, setUserRole] = useState("U");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const onAuthChange = async (state) => {
    console.log(state);
    if (state === "signedin") {
      setIsUserLoggedIn(true);
      const userData = await Auth.currentUserPoolUser();
      setUser(userData);
      return;
    }
    setIsUserLoggedIn(false);
  };

  const handleSignUp = (data) => {
    if (data.attributes["custom:role"] === "H") {
      data.attributes["custom:role"] = "H";
    } else {
      data.attributes["custom:role"] = "U";
    }
    Auth.signUp(data);
    Auth.signOut();
  };

  console.log("role", userRole);

  return (
    <div className="App">
      <AmplifyAuthenticator handleAuthStateChange={onAuthChange}>
        <AmplifySignUp
          slot="sign-up"
          handleSignUp={handleSignUp}
          formFields={[
            { type: "username" },
            { type: "password" },
            { type: "email", required: true },
            {
              type: "custom:role",
              required: true,
              label:
                "User Role (Enter 'U' for user and 'H' for restaurant employee)",
            },
          ]}
        />
        <AmplifyConfirmSignUp slot="confirm-sign-up" />
      </AmplifyAuthenticator>
      {isUserLoggedIn && <Layout user={user} />}
    </div>
  );
}

export default App;
