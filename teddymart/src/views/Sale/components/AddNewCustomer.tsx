import { uuidv4 } from "@firebase/util";
import { message } from "antd";
import Modal from "antd/es/modal/Modal";
import { ButtonComponent, TextInputComponent } from "components";
import { COLORS } from "constants/colors";
import { addData } from "controller/addData";
import { info } from "hooks/useLogger";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addNewPartner } from "state_management/slices/partnerSlice";

const AddNewCustomerForm = ({
  openAddNewCustomer,
  setOpenAddNewCustomer,
}: {
  openAddNewCustomer: boolean;
  setOpenAddNewCustomer: (openAddForm: boolean) => void;
}) => {
  const [search, setSearch] = useState("");
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
    await addData({
      data: data,
      id: id,
      table: "Partner",
    });
    await info({
      message: "Add New Customer",
      data: data,
    });
    dispatch(addNewPartner(data));
    message.success("New Customer added successfully!");
    setOpenAddNewCustomer(false);
  };

  const { t } = useTranslation();
  return (
    <Modal
      title={<h1 className="text-2xl">{t("sale.addNewOrder")}</h1>}
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
