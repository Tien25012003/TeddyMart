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
  openAddNewCustomer: boolean;
  setOpenAddNewCustomer: (openAddNewCustomer: boolean) => void;
  data?: TPartner;
  setData?: (data: TPartner) => void;
  isAdd?: boolean;
};

export default function AddNewCustomerForm({
  openAddNewCustomer,
  setOpenAddNewCustomer,
  data,
  setData,
  isAdd = true,
}: Props) {
  const [selectedGender, setSelectedGender] = useState<string>(
    isAdd ? "female" : data.gender.toLocaleLowerCase()
  );

  const { t } = useTranslation();
  const userId = localStorage.getItem('USER_ID')
  const dispatch = useDispatch();
  const onChange = (value: string, fieldName: string) => {
    setData({
      ...data,
      [fieldName]: value,
    });
  };

  const onAddNewCustomer = async () => {
    const trimmedName = data.partnerName.trim();
    const trimmedPhone = data.phoneNumber.trim();
    if (!trimmedName || !trimmedPhone) {
      message.warning(t("partner.fill"));
      return;
    }
    const newData: TPartner = {
      partnerId: isAdd ? createID({ prefix: "P" }) : data.partnerId,
      partnerName: data.partnerName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      note: data.note,
      gender: selectedGender as "female" | "male",
      type: "Customer",
      totalBuyAmount: data.totalBuyAmount,
      debt: data.debt,
    };

    if (isAdd) {
      dispatch(addNewPartner(newData));
      addData({ data: newData, table: "Partner", id: newData.partnerId });
      message.success(t("partner.addSuccess"));
    } else {
      dispatch(updatePartner({ partnerId: data.partnerId, newData: newData }));
      await updateData({
        data: newData,
        table: "Partner",
        id: newData.partnerId,
      });
      message.success(t("partner.updateSuccess"));
    }

    setOpenAddNewCustomer(false);

    setData({
      partnerId: "",
      partnerName: "",
      gender: "male",
      phoneNumber: "",
      email: "",
      address: "",
      debt: 0,
      totalBuyAmount: 0,
      certificate: "",
      note: "",
      type: "Customer",
    });
  };

  const backgroundColor = useMemo(
    () =>
      data.partnerName !== "" && data.phoneNumber !== ""
        ? COLORS.darkYellow
        : COLORS.defaultWhite,
    [data.partnerName, data.phoneNumber]
  );
  const color = useMemo(
    () =>
      data.partnerName !== "" && data.phoneNumber !== ""
        ? COLORS.defaultWhite
        : COLORS.lightGray,
    [data.partnerName, data.phoneNumber]
  );
  return (
    <Modal
      open={openAddNewCustomer}
      onCancel={() => setOpenAddNewCustomer(false)}
      footer={false}
      title={
        <h1 className="pr-8 text-3xl">
          {isAdd ? t("partner.addNewCustomer") : t("partner.updateCustomer")}
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
                  {t("customer.customerName")}
                  <span className="text-red-600">*</span>
                </p>
              </td>
              <td>
                <TextInputComponent
                  placeHolder=""
                  width={"100%"}
                  value={data.partnerName}
                  setValue={(value) => onChange(value, "partnerName")}
                />
              </td>
            </tr>
            <tr>
              <td className="pr-8 py-6">
                <p>
                  {t("customer.phoneNumber")}
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
                <p>{t("customer.gender")}</p>
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
                <p>{t("customer.email")}</p>
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
                <p>{t("customer.address")}</p>
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
                <p>{t("customer.totalBuyAmount")}</p>
              </td>
              <td>
                {isAdd ? (
                  <TextInputComponent
                    placeHolder="0"
                    width={"100%"}
                    value={
                      data.totalBuyAmount.toString() === "0"
                        ? ""
                        : data.totalBuyAmount.toString()
                    }
                    setValue={(value) => onChange(value, "totalBuyAmount")}
                  />
                ) : (
                  <span>{new Intl.NumberFormat().format(data.totalBuyAmount)}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="pr-8 py-6">
                <p>{t("customer.debt")}</p>
              </td>
              <td>
                {isAdd ? (
                  <TextInputComponent
                    placeHolder="0"
                    width={"100%"}
                    value={
                      data.debt.toString() === "0" ? "" : data.debt.toString()
                    }
                    setValue={(value) => onChange(value, "debt")}
                  />
                ) : (
                  <span>{new Intl.NumberFormat().format(data.debt)}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="pr-8 py-6">
                <p>{t("customer.note")}</p>
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
          onClick={() => setOpenAddNewCustomer(false)}
        />
      </div>
    </Modal>
  );
}
