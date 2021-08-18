import firebase from "../firebase";

export const observeChat = (id, userId, observer) => {
  return firebase
    .firestore()
    .collection("chats")
    .doc(id)
    .collection("users")
    .doc(userId)
    .onSnapshot(observer);
};

export const observeUsers = (id, observer) => {
  return firebase
    .firestore()
    .collection("chats")
    .doc(id)
    .collection("users")
    .onSnapshot(observer);
};
