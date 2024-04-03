import { useState, useRef, useEffect, useMemo } from "react";
import ButtonComponent from "components/ButtonComponent";
import TextInputComponent from "components/TextInputComponent";
import { COLORS } from "constants/colors";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { useTranslation } from "react-i18next";
import { Modal, message } from "antd";
import { createID } from "utils/appUtils";
import {
  addNewPartner,
  updatePartner,
} from "state_management/slices/partnerSlice";
import { addData, updateData } from "controller/addData";

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

  const { t } = useTranslation();
  const { userId } = useSelector((state: RootState) => state.manager);
  const dispatch = useDispatch();
  const onChange = (value: string, fieldName: string) => {
    setData({
      ...data,
      [fieldName]: value,
    });
  };

  const onAddNewCustomer = async () => {
    const trimmedName = data.staffName.trim();
    const trimmedPhone = data.phoneNumber.trim();
    if (!trimmedName || !trimmedPhone) {
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
      type: "Customer",
      salary: data.salary,
    };

    if (isAdd) {
      //   dispatch(addNewPartner(newData));
      addData({ data: newData, table: "Partner", id: newData.id });
      message.success(t("partner.addSuccess"));
    } else {
      //   dispatch(updatePartner({ partnerId: data.id, newData: newData }));
      await updateData({
        data: newData,
        table: "Partner",
        id: newData.id,
      });
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
      type: "Customer",
    });
  };

  const backgroundColor = useMemo(
    () =>
      data.staffName !== "" && data.phoneNumber !== ""
        ? COLORS.darkYellow
        : COLORS.defaultWhite,
    [data.staffName, data.phoneNumber]
  );
  const color = useMemo(
    () =>
      data.staffName !== "" && data.phoneNumber !== ""
        ? COLORS.defaultWhite
        : COLORS.lightGray,
    [data.staffName, data.phoneNumber]
  );
  return (
    <Modal
      open={openAddNewStaff}
      onCancel={() => setOpenAddNewStaff(false)}
      footer={false}
      title={
        <h1 className="pr-8 text-3xl">
          {isAdd ? t("partner.addNewStaff") : t("partner.updateCustomer")}
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
                <p>{t("staff.email")}</p>
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
          color={color}
          onClick={() => {
            onAddNewCustomer();
          }}
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
