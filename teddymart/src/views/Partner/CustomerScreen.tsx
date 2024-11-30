import Header from "components/Header";
import { ResponsiveContainer } from "recharts";
import { PartnerTable } from "components/TableComponent";
import FieldCustomer from "./Components/FieldCustomer";
import AdvancedSearch from "./Components/AdvancedSearch";
import React, { useState, useEffect, useRef } from "react";
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
import { useDispatch } from "react-redux";
import { addNewPartner } from "state_management/slices/partnerSlice";
import { Button, message } from "antd";
import AddNewCustomerForm from "./Components/AddNewCustomer";
import { deletePartner } from "state_management/slices/partnerSlice";
import { deleteData } from "controller/deleteData";
import { BiTrash } from "react-icons/bi";

export default function CustomerScreen() {
  const [search, setSearch] = useState("");
  const excelRef = useRef(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const CUSTOMERS = useSelector((state: RootState) => state.partnerSlice);
  const [customer, setCustomer] = useState(CUSTOMERS[0]?.partnerId);

  //console.log(search);
  const [opernAddNewCustomer, setOpernAddNewCustomer] = useState(false);
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

  const filterOptions = {
    partnerID: true,
    partnerName: true,
    gender: listFilter[5].value,
    phoneNumber: listFilter[0].value,
    email: listFilter[1].value,
    address: listFilter[2].value,
    debt: listFilter[4].value,
    totalBuyAmount: listFilter[3].value,
    //certificate: listFilter[5].value,
    note: listFilter[6].value,
  };

  const [filterValues, setFilterValues] = useState({});
  const [isTableReset, setIsTableReset] = useState(false);
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
    createdAt: new Date(),
  });
  const role = localStorage.getItem("ROLE");
  const handleSearch = (filterValues: Record<string, any>) => {
    setFilterValues(filterValues);
  };
  const handleResetTable = () => {
    setIsTableReset(true);
    setFilterValues({});
  };
  useEffect(() => {
    if (isTableReset) {
      setIsTableReset(false);
    }
  }, [isTableReset]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const onDeleteMultiPartner = () => {
    if (selectedRows.length !== 0) {
      selectedRows.forEach(async (item) => {
        await deleteData({ id: item, table: "Partner" });
        dispatch(deletePartner({ partnerId: item }));
        setOpen(false);
      });
      message.success(t("partner.deletePartner"));
      setSelectedRows([]);
    }
  };
  return (
    <div className="w-full">
      {/* <Header width={"100%"} title={"Customer"} /> */}
      <div
        className="bg-white border-2 p-5 mx-1.5 my-1.5 rounded-md"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div className="relative">
          <div className="bg-white w-full py-2 flex items-center justify-between flex-wrap gap-x-8">
            <div className="w-100% bg-white flex items-center justify-between py-2 gap-x-2 ">
              <SearchComponent
                placeholder={t("customer.insertNameToSearch")}
                search={search}
                setSearch={setSearch}
                //width={"250px"}
              />
              {/* <TextInputComponent
                value={search}
                setValue={setSearch}
              /> */}
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
                iconLeft={<BiTrash size={20} color="white" />}
                disabled={role === "Staff"}
              />
              <BtnExport
                fileName={
                  t("export.reportCustomer") +
                  `_${new Date().toLocaleDateString("vi")}`
                }
                sheet={t("export.reportCustomer")}
                tableRef={excelRef}
              />
              <ButtonComponent
                label={t("button.addNew")}
                onClick={() => setOpernAddNewCustomer(true)}
                iconLeft={
                  <TiPlus
                    style={{ marginRight: 10, color: "white", fontSize: 22 }}
                  />
                }
              />
            </div>
          </div>
        </div>
        <AddNewCustomerForm
          openAddNewCustomer={opernAddNewCustomer}
          setOpenAddNewCustomer={setOpernAddNewCustomer}
          data={dataInput}
          setData={setDataInput}
        />
        <AlertModal
          open={open}
          setOpen={setOpen}
          onConfirm={onDeleteMultiPartner}
        />
        <AdvancedSearch onSearch={handleSearch} onReset={handleResetTable} />
        <PartnerTable
          isCustomer={true}
          filterOption={filterOptions}
          search={search}
          additionalFilters={filterValues}
          resetTable={isTableReset}
          ref={excelRef}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          setOpenAlert={setOpen}
        />
      </div>
    </div>
  );
}
