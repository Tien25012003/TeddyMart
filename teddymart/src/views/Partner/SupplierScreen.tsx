import Header from "components/Header";
import { PartnerTable } from "components/TableComponent";
import FieldSupplier from "./Components/FieldSupplier";
import React, { useState, useRef, useEffect } from "react";
import {
  AlertModal,
  BtnExport,
  ButtonComponent,
  ListCheckBox,
  SearchComponent,
  TextInputComponent,
} from "components";
import { COLORS } from "constants/colors";
import { LiaFileExcel } from "react-icons/lia";
import { TiPlus } from "react-icons/ti";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { uuidv4 } from "@firebase/util";
import { addData } from "controller/addData";
import { Button, message } from "antd";
import { useDispatch } from "react-redux";
import { addNewPartner } from "state_management/slices/partnerSlice";
import AddNewSupplierForm from "./Components/AddNewSupplier";
import { deletePartner } from "state_management/slices/partnerSlice";
import { deleteData } from "controller/deleteData";
import { BiTrash } from "react-icons/bi";

export default function CustomerScreen() {
  const excelRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const SUPPLIERS = useSelector((state: RootState) => state.partnerSlice);
  const [supplier, setsupplier] = useState(SUPPLIERS[0]?.partnerId);
  const [isDisable, setIsDisable] = useState(false);

  const [opernAddNewSupplier, setOpernAddNewSupplier] = useState(false);
  const [listFilter, setListFilter] = useState([
    {
      displayName: t("supplier.phoneNumber"),
      value: true,
    },
    {
      displayName: t("supplier.email"),
      value: true,
    },
    {
      displayName: t("supplier.address"),
      value: true,
    },
    {
      displayName: t("supplier.totalBuyAmount"),
      value: true,
    },
    {
      displayName: t("supplier.debt"),
      value: true,
    },
    {
      displayName: t("supplier.certificate"),
      value: true,
    },
    {
      displayName: t("Note"),
      value: true,
    },
  ]);

  const filterOptions = {
    partnerID: true,
    partnerName: true,
    gender: listFilter[5].value,
    phoneNumber: listFilter[0].value,
    email: listFilter[5].value,
    address: listFilter[5].value,
    debt: listFilter[5].value,
    totalBuyAmount: listFilter[5].value,
    certificate: listFilter[5].value,
    note: listFilter[5].value,
  };

  const [dataInput, setDataInput] = useState<TPartner>({
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

  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("ROLE") === "Staff") setIsDisable(true);
  }, []);

  const onDeleteMultiShelf = () => {
    if (selectedRows.length !== 0) {
      selectedRows?.forEach(async (item) => {
        await deleteData({ id: item, table: "Partner" });
        dispatch(deletePartner({ partnerId: item }));
        message.success(t("partner.deletePartner"));
        setOpen(false);
        setSelectedRows([]);
      });
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* <Header width={"100%"} title={"Supplier"} /> */}
      <div
        className="bg-white border-2 p-5 mx-1.5 my-1.5 rounded-md"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div className="relative">
          <div className="bg-white w-full py-2 flex items-center justify-between flex-wrap gap-x-8 pb-8">
            <div className="w-100% bg-white flex items-center justify-between py-2 gap-x-2 ">
              <SearchComponent
                placeholder={t("supplier.insertNameToSearch")}
                search={search}
                setSearch={setSearch}
                //width={"250px"}
              />
              <ListCheckBox
                listFilter={listFilter}
                setListFilter={setListFilter}
              />
            </div>
            <div className="w-100% bg-white flex items-center justify-between gap-x-2 flex-wrap">
              <ButtonComponent
                label={t("button.delete")}
                onClick={() => {
                  if (selectedRows.length > 0) setOpen(true);
                }}
                backgroundColor={COLORS.checkbox_bg}
                style={{ marginRight: 12 }}
                disabled={isDisable}
                iconLeft={<BiTrash size={20} color="white" />}
              />
              <BtnExport
                fileName={
                  t("export.reportSupplier") +
                  `_${new Date().toLocaleDateString("vi")}`
                }
                sheet={t("export.reportSupplier")}
                tableRef={excelRef}
              />
              <ButtonComponent
                label={t("button.addNew")}
                onClick={() => setOpernAddNewSupplier(true)}
                iconLeft={
                  <TiPlus
                    style={{ marginRight: 10, color: "white", fontSize: 22 }}
                  />
                }
                disabled={isDisable}
              />
            </div>
          </div>
        </div>
        <AddNewSupplierForm
          opernAddNewSupplier={opernAddNewSupplier}
          setOpernAddNewSupplier={setOpernAddNewSupplier}
          data={dataInput}
          setData={setDataInput}
        />
        <AlertModal
          open={open}
          setOpen={setOpen}
          onConfirm={onDeleteMultiShelf}
        />
        <PartnerTable
          isCustomer={false}
          filterOption={filterOptions}
          search={search}
          ref={excelRef}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          setOpenAlert={setOpen}
        />
      </div>
    </div>
  );
}
