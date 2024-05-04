import { useState, useRef, useEffect, useMemo } from "react";
import ButtonComponent from "components/ButtonComponent";
import TextInputComponent from "components/TextInputComponent";
import { COLORS } from "constants/colors";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { useTranslation } from "react-i18next";
import { Modal, message } from "antd";
import { createID, generateRandomPassword, sendEmail } from "utils/appUtils";
import {
  addNewPartner,
  updatePartner,
} from "state_management/slices/partnerSlice";
import { addData, addStaffAccountData, updateData } from "controller/addData";
import {
  addNewStaff,
  addNewStaffAccount,
  updateStaff,
} from "state_management/slices/staffSlice";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { create } from "domain";
import { doc, setDoc } from "firebase/firestore";
import { db } from "firebaseConfig";

type Props = {
  openAddNewStaff: boolean;
  setOpenAddNewStaff: (openAddNewStaff: boolean) => void;
  data?: TStaff;
  setData?: (data: TStaff) => void;
  isAdd?: boolean;
};

export default function AddNewStaffForm({
  openAddNewStaff,
  setOpenAddNewStaff,
  data,
  setData,
  isAdd = true,
}: Props) {
  const [selectedGender, setSelectedGender] = useState<string>(
    isAdd ? "female" : data.gender.toLocaleLowerCase()
  );
  const auth = getAuth();
  const manager = useSelector((state: RootState) => state.manager);
  console.log(auth);
  const { t } = useTranslation();
  const userId = localStorage.getItem("USER_ID");
  const dispatch = useDispatch();
  const onChange = (value: string, fieldName: string) => {
    setData({
      ...data,
      [fieldName]: value,
    });
  };
  const addNewAccount = async (data: TStaff, password: string) => {
    await createUserWithEmailAndPassword(auth, data.email, password)
      .then(async (userCredential) => {
        await setDoc(doc(db, "Manager", userCredential.user.uid), {
          emailVerified: true,
          email: data.email,
          password: password,
          userName: data.staffName,
          managerId: manager.userId,
          shopName: manager.shopName,
          userId: userCredential.user.uid,
          role: "Staff",
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const onAddNewCustomer = async () => {
    const password = generateRandomPassword();

    const trimmedName = data.staffName.trim();
    const trimmedPhone = data.phoneNumber.trim();
    const trimmedEmail = data.email.trim();
    if (!trimmedName || !trimmedPhone || !trimmedEmail) {
      message.warning(t("partner.fill"));
      return;
    }
    const newData: TStaff = {
      id: isAdd ? createID({ prefix: "P" }) : data.id,
      staffName: data.staffName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      note: data.note,
      gender: selectedGender as "female" | "male",
      type: "Staff",
      salary: data.salary,
    };

    const newAccountData: TStaffAccount = {
      id: newData.id,
      email: data.email,
      password: password,
      managerId: window.localStorage.getItem("USER_ID"),
    };

    if (isAdd) {
      //dispatch(addNewPartner(newData));
      addData({ data: newData, table: "Staff", id: newData.id });
      addStaffAccountData(newAccountData, newAccountData.id);
      dispatch(addNewStaff({ ...data, id: newData.id }));
      sendEmail(data.email, data.staffName, password);
      addNewAccount(data, password);
      message.success(t("partner.addSuccess"));
    } else {
      // dispatch(updatePartner({ partnerId: data.id, newData: newData }));
      await updateData({
        data: newData,
        table: "Staff",
        id: newData.id,
      });
      dispatch(updateStaff({ id: newData.id, newData }));
      message.success(t("partner.updateSuccess"));
    }

    setOpenAddNewStaff(false);

    setData({
      id: "",
      staffName: "",
      gender: "male",
      phoneNumber: "",
      email: "",
      address: "",
      salary: 0,

      note: "",
      type: "",
    });
  };

  const backgroundColor = useMemo(
    () =>
      data.staffName !== "" && data.phoneNumber !== ""
        ? COLORS.darkYellow
        : COLORS.defaultWhite,
    [data.staffName, data.phoneNumber]
  );
  const isDisabledButton = useMemo(
    () => data.staffName === "" || data.phoneNumber === "" || data.email === "",

    [data.staffName, data.phoneNumber, data.email]
  );
  return (
    <Modal
      open={openAddNewStaff}
      onCancel={() => setOpenAddNewStaff(false)}
      footer={false}
      title={
        <h1 className="pr-8 text-3xl">
          {isAdd ? t("partner.addNewStaff") : t("partner.updateStaff")}
        </h1>
      }
      width={"60%"}
    >
      <hr className="h-0.5 my-4 bg-black" />
      <div className="overflow-y-auto h-96">
        {" "}
        <table>
          <tbody>
            <tr>
              <td className="pr-8 py-6">
                <p>
                  {t("staff.staffName")}
                  <span className="text-red-600">*</span>
                </p>
              </td>
              <td>
                <TextInputComponent
                  placeHolder=""
                  width={"100%"}
                  value={data.staffName}
                  setValue={(value) => onChange(value, "staffName")}
                />
              </td>
            </tr>
            <tr>
              <td className="pr-8 py-6">
                <p>
                  {t("staff.phoneNumber")}
                  <span className="text-red-600">*</span>
                </p>
              </td>
              <td>
                <TextInputComponent
                  placeHolder=""
                  width={"100%"}
                  value={data.phoneNumber}
                  setValue={(value) => onChange(value, "phoneNumber")}
                />
              </td>
            </tr>

            <tr>
              <td className="pr-8 py-6">
                <p>{t("staff.gender")}</p>
              </td>
              <td>
                <input
                  type="radio"
                  name="radio-gender"
                  className="w-4 h-4 mr-4"
                  checked={selectedGender === "male"}
                  value={selectedGender}
                  onChange={() => setSelectedGender("male")}
                />
                <label className="mr-16">{t("customer.male")}</label>
                <input
                  type="radio"
                  name="radio-gender"
                  className=" w-4 h-4 mr-4"
                  checked={selectedGender === "female"}
                  value={selectedGender}
                  onChange={() => setSelectedGender("female")}
                />
                <label className="mr-16">{t("customer.female")}</label>
              </td>
            </tr>
            <tr>
              <td className="pr-8 py-6">
                <p>
                  {t("staff.email")}
                  <span className="text-red-600">*</span>
                </p>
              </td>
              <td>
                <TextInputComponent
                  placeHolder=""
                  width={"100%"}
                  value={data.email}
                  setValue={(value) => onChange(value, "email")}
                />
              </td>
            </tr>

            <tr>
              <td className="pr-8 py-6">
                <p>{t("staff.address")}</p>
              </td>
              <td>
                <TextInputComponent
                  placeHolder=""
                  width={"100%"}
                  value={data.address}
                  setValue={(value) => onChange(value, "address")}
                />
              </td>
            </tr>
            <tr>
              <td className="pr-8 py-6">
                <p>{t("staff.salary")}</p>
              </td>
              <td>
                {isAdd ? (
                  <TextInputComponent
                    placeHolder="0"
                    width={"100%"}
                    value={
                      data.salary.toString() === "0"
                        ? ""
                        : data.salary.toString()
                    }
                    setValue={(value) => onChange(value, "salary")}
                  />
                ) : (
                  <span>{new Intl.NumberFormat().format(data.salary)}</span>
                )}
              </td>
            </tr>

            <tr>
              <td className="pr-8 py-6">
                <p>{t("staff.note")}</p>
              </td>
              <td>
                <TextInputComponent
                  placeHolder=""
                  width={"100%"}
                  value={data.note}
                  setValue={(value) => onChange(value, "note")}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-x-4 mt-4">
        <ButtonComponent
          label={t("button.save")}
          backgroundColor={backgroundColor}
          disabled={isDisabledButton}
          color={isDisabledButton ? COLORS.extra_gray : COLORS.mediumBlack}
          onClick={onAddNewCustomer}
        />
        <ButtonComponent
          label={t("button.close")}
          backgroundColor={COLORS.defaultWhite}
          color={COLORS.extra_gray}
          onClick={() => setOpenAddNewStaff(false)}
        />
      </div>
    </Modal>
  );
}
