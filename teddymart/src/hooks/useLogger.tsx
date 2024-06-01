import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";

type TData = {
  message: string;
  data?: any;
};
const debug = async (data: TData) => {
  const authID = getAuth()?.currentUser?.uid ?? "";
  await setDoc(
    doc(
      db,
      "Logging",
      `${
        "Debug" +
        `${authID ? " - " + authID + " - " : " - "}` +
        new Date().getTime()
      }`
    ),
    {
      backgroundColor: "#cccccc",
      textColor: "#333333",
      createdAt: new Date().getTime(),
      ...data,
    }
  );
};
const info = async (data: TData) => {
  const authID = getAuth()?.currentUser?.uid ?? "";
  await setDoc(
    doc(
      db,
      "Logging",
      `${
        "Info" +
        `${authID ? " - " + authID + " - " : " - "}` +
        new Date().getTime()
      }`
    ),
    {
      backgroundColor: "#e0f7fa",
      textColor: "#000000",
      createdAt: new Date().getTime(),
      ...data,
    }
  );
};
const warning = async (data: TData) => {
  const authID = getAuth()?.currentUser?.uid ?? "";
  await setDoc(
    doc(
      db,
      "Logging",
      `${
        "Warning" +
        `${authID ? " - " + authID + " - " : " - "}` +
        new Date().getTime()
      }`
    ),
    {
      backgroundColor: "#ffff99",
      textColor: "#000000",
      createdAt: new Date().getTime(),
      ...data,
    }
  );
};
const error = async (data: TData) => {
  const authID = getAuth()?.currentUser?.uid ?? "";
  await setDoc(
    doc(
      db,
      "Logging",
      `${
        "Error" +
        `${authID ? " - " + authID + " - " : " - "}` +
        new Date().getTime()
      }`
    ),
    {
      backgroundColor: "#ffcccc",
      textColor: "#000000",
      createdAt: new Date().getTime(),
      ...data,
    }
  );
};

export { debug, info, warning, error };
