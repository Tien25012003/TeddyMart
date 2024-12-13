import emailjs from "@emailjs/browser";
import {
  deleteDoc,
  doc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseConfig";

type params = {
  prefix:
    | "ORD"
    | "VCH"
    | "P"
    | "GP"
    | "PD"
    | "S"
    | "WH"
    | "ST"
    | "M"
    | "WR"
    | "EV";
};
const createID = ({ prefix }: params): string => {
  return `${prefix}${Math.floor(Math.random() * 10000000)}`;
};

//order
const addOrderFirebase = async (
  data: TOrder,
  userId: string,
  orderId: string
) => {
  await setDoc(doc(db, `/Manager/${userId}/Orders`, orderId), data);
};
const deleteOrderFirebase = async (orders: string[], userId: string) => {
  for (let index = 0; index < orders.length; index++) {
    const element = orders[index];
    console.log(element);
    await deleteDoc(doc(db, `/Manager/${userId}/Orders`, element));
  }
};

//voucher
const addVoucherFirebase = async (
  data: TVoucher,
  userId: string,
  voucherId: string
) => {
  await setDoc(doc(db, `/Manager/${userId}/Voucher`, voucherId), data);
};
const updateVoucherFirebase = async (
  data: TVoucher,
  userId: string,
  voucherId: string
) => {
  const voucherRef = doc(db, `/Manager/${userId}/Voucher`, voucherId);
  await updateDoc(voucherRef, {
    ...data,
  });
};
const deleteVoucherFirebase = async (vouchers: string[], userId: string) => {
  for (const voucher of vouchers) {
    await deleteDoc(doc(db, `/Manager/${userId}/Voucher`, voucher));
  }
};

//Partner
const updatePartnerFirebase = async (
  data: TPartner,
  userId: string,
  partnerId: string
) => {
  const partnerRef = doc(db, `/Manager/${userId}/Partner`, partnerId);
  await updateDoc(partnerRef, {
    ...data,
  });
};
const deletePartnerFirebase = async (partners: string[], userId: string) => {
  for (const partner in partners) {
    await deleteDoc(doc(db, `/Manager/${userId}/Partner`, partner));
  }
};
const updateProductFirebase = async (
  userId: string,
  warehouseId: string,
  listProduct: {
    productId: string;
    productName: string;
    quantity?: number;
  }[],
  count: number
) => {
  const ref = doc(db, `/Manager/${userId}/Ware_House/${warehouseId}`);
  await updateDoc(ref, {
    listProduct: listProduct,
    count: increment(count),
  });
};
const addNotificationFirebase = async (
  data: { title: string; subTitle: string; img: string; notiId: string },
  userId: string
) => {
  await setDoc(doc(db, `/Manager/${userId}/Notification/${data.notiId}`), data);
};

const deleteNotificationFirebase = async (notificationIds: string[]) => {
  let userId = window.localStorage.getItem("USER_ID");
  for (const notificationId of notificationIds) {
    await deleteDoc(doc(db, `/Manager/${userId}/Notification`, notificationId));
  }
};

const sendEmail = async (toEmail: string, name: string, password: string) => {
  emailjs.send(
    "service_78klm4w",
    "template_yn3eyrv",
    {
      name: name,
      password: password,
      toEmail: toEmail,
    },
    {
      publicKey: "IGRuTmn5cNknr2Iuw",
    }
  );
};

function generateRandomPassword() {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
export {
  addNotificationFirebase,
  addOrderFirebase,
  addVoucherFirebase,
  createID,
  deleteNotificationFirebase,
  deleteOrderFirebase,
  deletePartnerFirebase,
  deleteVoucherFirebase,
  generateRandomPassword,
  sendEmail,
  updatePartnerFirebase,
  updateProductFirebase,
  updateVoucherFirebase,
};
