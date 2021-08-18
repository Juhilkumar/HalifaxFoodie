import React, { Fragment } from "react";
import UserInfoPage from "./userinfopage/UserInfoPage";
import ValidateUserwithQnA from "./validateUserwithQnA/ValidateUserwithQnA";

const SecurityCheck = ({ userInfo, user, isUserValid, setUserValidated }) => {
  console.log("user details", userInfo);
  return (
    <Fragment>
      {userInfo ? (
        <ValidateUserwithQnA user={userInfo} isUserValid={isUserValid} />
      ) : (
        <UserInfoPage user={user} setUserValidated={setUserValidated} />
      )}
    </Fragment>
  );
};

export default SecurityCheck;
