import React, { useState } from "react";
import ButtonSelect from "components/ButtonSelect";
import {
  ButtonComponent,
  ListCheckBox,
  SearchComponent,
  TextInputComponent,
  ModalSelectDate,
  DropdownComponent,
} from "components";
import { COLORS } from "constants/colors";
import { IoMdArrowDropdown } from "react-icons/io";
import { BiCalendar } from "react-icons/bi";
import { useTranslation } from "react-i18next";

export default function AdvancedSearch({
  onSearch,
  onReset,
}: {
  onSearch: (filters: Record<string, string>) => void;
  onReset: () => void;
}) {
  const [debtBalanceFrom, setdebtBalanceFrom] = useState("");
  const [debtBalanceTo, setdebtBalanceTo] = useState("");
  const [totalPaymentFrom, setTotalPaymentFrom] = useState("");
  const [totalPaymentTo, setTotalPaymentTo] = useState("");
  const [isAdvancedSearchVisible, setAdvancedSearchVisible] = useState(false);
  const { t } = useTranslation();
  const OPTIONS = [t("customer.male"), t("customer.female")];
  const [gender, setGender] = useState<string | null>(null);

  const handleSearchClick = () => {
    const validGender =
      gender === "Nam" ? "Male" : gender === "Nữ" ? "Female" : gender;
    const filters = {
      gender: validGender?.toLowerCase() || "",
      debtBalanceFrom,
      debtBalanceTo,
      totalPaymentFrom,
      totalPaymentTo,
    };

    console.log("filter:", filters);

    onSearch(filters);
  };

  const resetFilters = () => {
    setGender(null);
    setdebtBalanceFrom("");
    setdebtBalanceTo("");
    setTotalPaymentFrom("");
    setTotalPaymentTo("");
    onReset();
  };

  const [date, setDate] = useState<D>({
    from: new Date(),
    to: new Date(),
  });
  return (
    <div className="bg-white border my-4 rounded-md shadow-md h-full">
      <div
        className="relative flex flex-wrap justify-between items-center hover:bg-gray-200 p-5"
        role="button"
        onClick={() => setAdvancedSearchVisible(!isAdvancedSearchVisible)}
      >
        <input
          type="checkbox"
          className="peer absolute inset-x-0 w-full h-12 z-10 cursor-pointer opacity-0"
        />
        <h1 className="	font-semibold text-[#207ca3]">
          {t("customer.advancedSearch")}
        </h1>
        <IoMdArrowDropdown className="transition-transform duration-500 rotate-0 peer-checked:rotate-180" />
      </div>

      <div
        className={`overflow-hidden transition-all duration-700 ${
          isAdvancedSearchVisible ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="flex flex-wrap gap-8 p-5">
          <div className="flex flex-row flex-wrap gap-8">
            <DropdownComponent
              label={t("customer.gender")}
              options={OPTIONS}
              value={gender}
              setValue={setGender}
            />
            <TextInputComponent
              label={t("customer.debtBalanceFrom")}
              placeHolder={"10.000"}
              value={debtBalanceFrom}
              setValue={setdebtBalanceFrom}
            />
            <TextInputComponent
              label={t("customer.debtBalanceTo")}
              placeHolder={"100.000"}
              value={debtBalanceTo}
              setValue={setdebtBalanceTo}
            />
            <TextInputComponent
              label={t("customer.totalPurchasesFrom")}
              placeHolder={"10.000"}
              value={totalPaymentFrom}
              setValue={setTotalPaymentFrom}
            />
            <TextInputComponent
              label={t("customer.totalPurchasesTo")}
              placeHolder={"100.000"}
              value={totalPaymentTo}
              setValue={setTotalPaymentTo}
            />
          </div>
        </div>

        <div className="flex justify-center gap-x-4 mt-4 pb-5">
          <ButtonComponent
            label={t("button.search")}
            onClick={handleSearchClick}
          />
          <ButtonComponent
            label={t("button.reset")}
            onClick={() => {
              resetFilters();
            }}
          />
        </div>
      </div>
    </div>
  );
}
