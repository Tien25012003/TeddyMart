import React, { useState, useDeferredValue, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TextInputComponent from "components/TextInputComponent";
import Header from "components/Header";
import {
  ButtonComponent,
  DropdownComponent,
  ListCheckBox,
  SearchComponent,
} from "components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { COLORS } from "constants/colors";
import { Button, Checkbox, Space, Modal, message } from "antd";
import { LiaFileExcel } from "react-icons/lia";
import { BiPlus } from "react-icons/bi";
import { WareHouseTable } from "components/TableComponent";
import { BtnExport } from "components";
import { createID } from "utils/appUtils";
import { deleteWarehouse } from "state_management/slices/warehouseSlice";
import { addData } from "controller/addData";
import { deleteMultiOrder } from "state_management/slices/warehouseSlice";
import AddNewWarehouseList from "./AddNewWarehouseList";
import { AlertModal } from "components";
import { deleteData } from "controller/deleteData";
export default function WarehouseList() {
  const [search, setSearch] = useState("");
  const [openAddForm, setOpenAddForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [defaultWarehouse, setDefaultWarehouse] = useState(false);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("ROLE") === "Staff") setIsDisable(true);
  }, []);

  const OPTIONS = [
    t("button.createdAtNewest"),
    t("button.createdAtOldest"),
    t("warehouse.warehouseIDAscending"),
    t("warehouse.warehouseIDDescending"),
    t("warehouse.warehouseNameAZ"),
    t("warehouse.warehouseNameZA"),
  ];
  const WAREHOUSES = useSelector((state: RootState) => state.warehouseSlice);
  const [sort, setSort] = useState(OPTIONS[0]);
  const [warehouse, setWarehouse] = useState(WAREHOUSES[0]?.warehouseName);
  const warehouseName = useDeferredValue(search);
  const [isFormValid, setIsFormValid] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  //const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const wareListRef = useRef(null);
  const dispatch = useDispatch();

  const [dataInput, setDataInput] = useState<TWarehouse>({
    warehouseId: "",
    warehouseName: "",
    address: "",
    listProduct: [],
    count: 0,
  });

  const onDeleteMultiWarehouse = () => {
    if (selectedRows.length !== 0) {
      selectedRows.forEach(async (item) => {
        const warehouseId = item;
        await deleteData({ id: warehouseId, table: "Ware_House" });
        dispatch(deleteWarehouse({ warehouseId }));
        setOpen(false);
      });
      message.success(t("warehouse.deleteSuccess"));
      setSelectedRows([]);
    }
  };
  return (
    <div className="w-full bg-extreme_lg_grey min-h-screen">
      {/* Header */}
      {/* <Header width={"100%"} title={t("warehouse.warehouseList")}/> */}

      {/* Body */}
      <div className="bg-white border-1.5 mx-5 my-1.5 rounded-md px-3 ">
        {/* <ModalSelectDate setResult={setTime} /> */}

        <div className="w-full justify-between items-center flex flex-wrap py-5">
          <div className="flex">
            <SearchComponent
              search={search}
              setSearch={setSearch}
              placeholder={t("warehouse.searchByName")}
              width={"35vw"}
            />
          </div>
          <div className="flex">
            <ButtonComponent
              label={t("button.delete")}
              onClick={() => {
                if (selectedRows.length > 0) setOpen(true);
              }}
              backgroundColor={COLORS.checkbox_bg}
              style={{ borderWidth: 0 }}
              disabled={isDisable}
            />

            <div className="w-3" />
            <BtnExport
              fileName={t("warehouse.warehouseList")}
              sheet={t("warehouse.warehouseList")}
              tableRef={wareListRef}
            />

            {/* <div className="w-3" /> */}
            <ButtonComponent
              label={t("button.addNew")}
              onClick={() => {
                setOpenAddForm(true);
              }}
              iconLeft={<BiPlus size={20} color="white" />}
              disabled={isDisable}
            />
          </div>
        </div>
        <div>
          <DropdownComponent
            label={t("button.sortBy")}
            options={OPTIONS}
            value={sort}
            setValue={setSort}
          />
        </div>

        {/* Table */}
        <div className="h-3" />
        <WareHouseTable
          warehouseName={warehouseName}
          sort={{
            createdAtNewest: sort === OPTIONS[0],
            createdAtOldest: sort === OPTIONS[1],
            idAscending: sort === OPTIONS[2],
            idDescending: sort === OPTIONS[3],
            nameAZ: sort === OPTIONS[4],
            nameZA: sort === OPTIONS[5],
          }}
          ref={wareListRef}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          setOpenAlert={setOpen}
        />
      </div>

      {/* ADD NEW WAREHOUSE */}
      <AddNewWarehouseList
        openAddNewWarehouse={openAddForm}
        setOpenAddNewWarehouse={setOpenAddForm}
        data={dataInput}
        setData={setDataInput}
      />
      <AlertModal
        open={open}
        setOpen={setOpen}
        onConfirm={onDeleteMultiWarehouse}
      />
    </div>
  );
}
