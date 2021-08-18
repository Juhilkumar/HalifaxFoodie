const PUBSUB_API = "https://pubsubapi-5o6mak5rpa-ue.a.run.app";
export default {
  sendMessage: () => {
    return {
      url: `${PUBSUB_API}/sendMessage`,
      method: "post",
    };
  },
  receiveMessage: () => {
    return {
      url: `${PUBSUB_API}/receiveMessage`,
      method: "post",
    };
  },
};
