import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx.firebaseapp.com",
  // ...
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
