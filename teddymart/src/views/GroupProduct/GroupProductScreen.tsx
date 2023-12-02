import React, { useState } from "react";
import Header from "components/Header";
import DropdownComponent from "components/DropdownComponent";
import ButtonSelect from "components/ButtonSelect";
import { IoMdArrowDropdown } from "react-icons/io";
import SearchComponent from "components/SearchComponent";
import ButtonComponent from "components/ButtonComponent";
import { COLORS } from "constants/colors";
import {
  LiaBarcodeSolid,
  LiaFileExcel,
  LiaRecycleSolid,
  LiaScribd,
} from "react-icons/lia";
import { TiPlus } from "react-icons/ti";
import { BiFilter } from "react-icons/bi";
import { ResponsiveContainer } from "recharts";
import { GroupProductTable } from "components/TableComponent";
import { useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { t } from "i18next";
import { Divider, Modal, Space } from "antd";
import { addData } from "controller/addData";
import AddNewGroupProduct from "./components/AddNewGroupProduct";

export default function ProductScreen() {
  const GROUP = useSelector((state: RootState) => state.groupProduct);
  const [screens, setScreens] = useState();
  const [type, setType] = useState();
  const [productGroup, setProductGroup] = useState();
  const [status, setStatus] = useState();
  const [storeManagement, setStoreManagement] = useState();
  const [sort, setSort] = useState();
  const [search, setSearch] = useState();
  const [openAddForm, setOpenAddForm] = useState(false);

  return (
    <div className="w-full">
      {/* <Header width={"100%"} title={"Product"} ></Header> */}
      <div
        className="bg-white border-2 p-5 mx-1.5 my-1.5 rounded-md"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-start">
            <div className="mx-2">
              <SearchComponent
                placeholder={t("product.searchByProductGroup")}
              />
            </div>
          </div>
          <div className="flex justify-end items-center">
            <div className="mr-10">
              <ButtonComponent
                label={t("button.delete")}
                onClick={() => alert("Button Clicked")}
                backgroundColor={COLORS.checkbox_bg}
              />
            </div>
            <div className="mr-10">
              <ButtonComponent
                label={t("product.addNewProductGroup")}
                onClick={() => setOpenAddForm(true)}
                iconLeft={
                  <TiPlus
                    style={{ marginRight: 10, color: "white", fontSize: 22 }}
                  />
                }
              />
            </div>
          </div>
        </div>
        <div style={{ width: "100%", margin: "20px auto auto auto" }}>
          <GroupProductTable data={GROUP} />
        </div>
      </div>

      {/* ------------------------------------------------------------------------------------------------------------------- */}
      <AddNewGroupProduct 
        openAddNewGroupProduct={openAddForm}
        setOpenAddNewSupplier={setOpenAddForm}
      />
    </div>
  );
}
