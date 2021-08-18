import axios from "axios";
import halifaxfoodieAPI from "./halifaxFoodAPI/halifaxFoodAPI";
import feedback from "./halifaxFoodAPI/feedback";
import pubsubapi from "./halifaxFoodAPI/pubsubapi";

// axios.defaults.baseURL =
//   process.env.NODE_ENV === "development"
//     ? `https://test.api.userqual.com/api`
//     : `https://api.userqual.com/api`;

axios.interceptors.request.use(
  function (config) {
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    };
    return { ...config, headers };
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const Routes = { halifaxfoodieAPI, feedback, pubsubapi };

export default axios;
