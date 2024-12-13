import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseConfig";

type params = {
  id: string;
  table?:
    | "Voucher"
    | "Partner"
    | "Group_Product"
    | "Shelf"
    | "Product"
    | "Orders"
    | "Ware_House"
    | "Staff"
    | "Warranty"
    | "Event";

  data:
    | TVoucher
    | TPartner
    | TGroupProduct
    | TProduct
    | TOrder
    | TShelf
    | TWarehouse
    | TStaff
    | TStaffAccount
    | TWarranty
    | TEvent;
};
const addData = async ({ data, table, id }: params) => {
  let userId = window.localStorage.getItem("USER_ID");
  await setDoc(doc(db, `/Manager/${userId}/${table}`, id), data)
    .then(() => {
      console.log(">>>>>>>>>> Add Data >>>>>>>>>>");
    })
    .catch((e) => console.log(e));
};

const addStaffAccountData = async (data: TStaffAccount, id: string) => {
  await setDoc(doc(db, `Staff`, id), data)
    .then(() => {
      console.log(">>>>>>>>>> Add Data >>>>>>>>>>");
    })
    .catch((e) => console.log(e));
};

const updateData = async ({ data, table, id }: params) => {
  let userId = window.localStorage.getItem("USER_ID");
  //console.log("OKKK");
  await updateDoc(doc(db, `/Manager/${userId}/${table}`, id), data)
    .then(() => {
      console.log(">>>>>>>>>> Update Data >>>>>>>>>>");
    })
    .catch((e) => console.log(e));
};
export { addData, addStaffAccountData, updateData };
