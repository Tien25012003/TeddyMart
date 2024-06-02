import React, { useState } from "react";
import ButtonSelect from "components/ButtonSelect";
import {
  ButtonComponent,
  ListCheckBox,
  SearchComponent,
  TextInputComponent,
} from "components";
import AddNewCustomer from "./AddNewCustomer";
import { COLORS } from "constants/colors";
import { IoMdArrowDropdown } from "react-icons/io";
import { LiaFileExcel } from "react-icons/lia";
import { TiPlus } from "react-icons/ti";
import { BiFilter, BiSearch, BiTrash } from "react-icons/bi";
import { useTranslation } from "react-i18next";

export default function FieldCustomer() {
  const [isChecked, setIsChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isAddCustomerVisible, setAddCustomerVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const { t } = useTranslation();

  const [listFilter, setListFilter] = useState([
    {
      displayName: t("customer.phoneNumber"),
      value: true,
    },
    {
      displayName: t("customer.email"),
      value: true,
    },
    {
      displayName: t("customer.address"),
      value: true,
    },
    {
      displayName: t("customer.totalBuyAmount"),
      value: true,
    },
    {
      displayName: t("customer.debt"),
      value: true,
    },
    {
      displayName: t("customer.gender"),
      value: true,
    },
    {
      displayName: t("customer.note"),
      value: true,
    },
  ]);

  const openAddCustomer = () => {
    setAddCustomerVisible(true);
  };
  const closeAddCustomer = () => {
    setAddCustomerVisible(false);
  };

  const handleOverlayClick = () => {
    setAddCustomerVisible(false);
  };
  const handleAddCustomerClick = (e: any) => {
    e.stopPropagation();
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

  return (
    <div className="relative">
      <div className="bg-white w-full py-2 flex items-center justify-between flex-wrap gap-x-8">
        <div className="w-100% bg-white flex items-center justify-between py-2 gap-x-2 ">
          <ButtonComponent
            label={t("button.all")}
            onClick={() => alert("Button Clicked")}
            backgroundColor={COLORS.defaultWhite}
            color={COLORS.extra_gray}
          />
          <SearchComponent
            placeholder={t("customer.insertNameToSearch")}
            search={search}
            setSearch={setSearch}
            //width={"250px"}
          />
          <ListCheckBox listFilter={listFilter} setListFilter={setListFilter} />
        </div>
        <div className="w-100% bg-white flex items-center justify-between gap-x-2 flex-wrap">
          <ButtonComponent
            label={t("button.delete")}
            onClick={() => {}}
            style={{ backgroundColor: "#EA5A47", marginInline: 12 }}
            iconLeft={<BiTrash size={20} color="white" />}
          />
          <ButtonComponent
            label={t("button.importOrExportExcel")}
            onClick={() => alert("Button Clicked")}
            backgroundColor={COLORS.lightBlack}
            iconLeft={
              <LiaFileExcel
                style={{ marginRight: 10, color: "white", fontSize: 22 }}
              />
            }
          />
          <ButtonComponent
            label={t("button.addNew")}
            onClick={openAddCustomer}
            iconLeft={
              <TiPlus
                style={{ marginRight: 10, color: "white", fontSize: 22 }}
              />
            }
          />
        </div>
      </div>

      {isAddCustomerVisible && (
        <div
          className="overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
          style={{ zIndex: 1040 }}
          onClick={handleOverlayClick}
        >
          <div onClick={handleAddCustomerClick}>
            <div className="flex justify-center">
              <div className="bg-white border p-5 my-4 rounded-md shadow-md w-fit">
                <h1 className="pr-8 text-3xl">
                  {t("customer.addNewCustomer")}
                </h1>
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
                            width={492}
                            value={customerName}
                            setValue={(value) =>
                              handleInputChange(
                                value,
                                setCustomerName,
                                "customerName"
                              )
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
                              handleInputChange(
                                value,
                                setPhoneNumber,
                                "phoneNumber"
                              )
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
                          />
                          <label className="mr-16">Male</label>
                          <input
                            type="radio"
                            name="radio-gender"
                            className=" w-4 h-4 mr-4"
                          />
                          <label className="mr-16">Female</label>
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
                            value={customerName}
                            setValue={setCustomerName}
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
                            value={customerName}
                            setValue={setCustomerName}
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
                            value={customerName}
                            setValue={setCustomerName}
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
                            value={customerName}
                            setValue={setCustomerName}
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
                            value={customerName}
                            setValue={setCustomerName}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-x-4 mt-4">
                  <ButtonComponent
                    label={t("button.save")}
                    backgroundColor={
                      isFormValid ? COLORS.darkYellow : COLORS.defaultWhite
                    }
                    color={isFormValid ? COLORS.defaultWhite : COLORS.lightGray}
                    onClick={() => isFormValid && alert("Button Clicked")}
                  />
                  <ButtonComponent
                    label={t("button.close")}
                    backgroundColor={COLORS.defaultWhite}
                    color={COLORS.extra_gray}
                    onClick={closeAddCustomer}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
