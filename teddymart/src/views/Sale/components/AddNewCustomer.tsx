import { message } from "antd";
import Modal from "antd/es/modal/Modal";
import { ButtonComponent, TextInputComponent } from "components";
import { COLORS } from "constants/colors";
import { addData } from "controller/addData";
import { info } from "hooks/useLogger";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { addNewPartner } from "state_management/slices/partnerSlice";

const AddNewCustomerForm = ({
  openAddNewCustomer,
  setOpenAddNewCustomer,
}: {
  openAddNewCustomer: boolean;
  setOpenAddNewCustomer: (openAddForm: boolean) => void;
}) => {
  const customers = useSelector((state: RootState) => state.partnerSlice);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [totalBuyAmount, setTotalBuyAmount] = useState("");
  const [debt, setDebt] = useState("");
  const [note, setNote] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useDispatch();
  const [selectedGender, setSelectedGender] = useState<string>("Female");
  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
  };
  const handleInputChange = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    fieldName: string
  ) => {
    setValue(value);
    validateForm(fieldName, value);
  };

  const validateForm = (fieldName: string, value: string) => {
    if (fieldName === "customerName") {
      setIsFormValid(value !== "" && phoneNumber !== "");
    } else if (fieldName === "phoneNumber") {
      setIsFormValid(value !== "" && customerName !== "");
    }
  };
  const addNewCustomer = async () => {
    const trimmedName = customerName.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName || !trimmedPhone) {
      message.warning(t("partner.fill"));
      return;
    }
    if (debt < totalBuyAmount) {
      message.error(t("partner.debtCheck"));
      return;
    }
    const isPhoneExists = customers
      .filter((customer) => customer.type === "Customer")
      .some((customer) => customer.phoneNumber === trimmedPhone);

    if (isPhoneExists) {
      message.error(t("partner.phoneExists"));
      return;
    }

    const id = "P" + Math.floor(Math.random() * 10000);
    const data: TPartner = {
      partnerId: id,
      partnerName: customerName,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
      note: note,
      gender: selectedGender as "female" | "male",
      type: "Customer",
      totalBuyAmount: parseInt(totalBuyAmount),
      debt: parseInt(debt),
      createdAt: new Date(),
    };
    dispatch(addNewPartner(data));
    addData({ data: data, table: "Partner", id: data.partnerId });
    await info({
      message: "Add New Partner",
      data: { data: data, table: "Partner", id: data.partnerId },
    });
    message.success(t("partner.addSuccess"));
    setOpenAddNewCustomer(false);
  };

  const { t } = useTranslation();
  return (
    <Modal
      title={<h1 className="text-2xl">{t("partner.addNewCustomer")}</h1>}
      open={openAddNewCustomer}
      onCancel={() => setOpenAddNewCustomer(false)}
      footer={false}
      width={"40%"}
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="overflow-y-auto h-96 w-auto">
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
                  width={492}
                  value={customerName}
                  setValue={(value) =>
                    handleInputChange(value, setCustomerName, "customerName")
                  }
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
                  width={492}
                  value={phoneNumber}
                  setValue={(value) =>
                    handleInputChange(value, setPhoneNumber, "phoneNumber")
                  }
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
                  checked={selectedGender === "Male"}
                  onChange={() => handleGenderChange("Male")}
                />
                <label className="mr-16">{t("customer.male")}</label>
                <input
                  type="radio"
                  name="radio-gender"
                  className=" w-4 h-4 mr-4"
                  checked={selectedGender === "Female"}
                  onChange={() => handleGenderChange("Female")}
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
                  width={492}
                  value={email}
                  setValue={setEmail}
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
                  width={492}
                  value={address}
                  setValue={setAddress}
                />
              </td>
            </tr>
            <tr>
              <td className="pr-8 py-6">
                <p>{t("customer.totalBuyAmount")}</p>
              </td>
              <td>
                <TextInputComponent
                  placeHolder=""
                  width={492}
                  value={totalBuyAmount}
                  setValue={setTotalBuyAmount}
                />
              </td>
            </tr>
            <tr>
              <td className="pr-8 py-6">
                <p>{t("customer.debt")}</p>
              </td>
              <td>
                <TextInputComponent
                  placeHolder=""
                  width={492}
                  value={debt}
                  setValue={setDebt}
                />
              </td>
            </tr>
            <tr>
              <td className="pr-8 py-6">
                <p>{t("customer.note")}</p>
              </td>
              <td>
                <TextInputComponent
                  placeHolder=""
                  width={492}
                  value={note}
                  setValue={setNote}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end gap-x-4 mt-4">
          <ButtonComponent
            label="Save"
            backgroundColor={COLORS.defaultWhite}
            color={COLORS.lightGray}
            onClick={addNewCustomer}
          />
          <ButtonComponent
            label="Close"
            backgroundColor={COLORS.defaultWhite}
            color={COLORS.extra_gray}
            onClick={() => alert("Button Clicked")}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddNewCustomerForm;
