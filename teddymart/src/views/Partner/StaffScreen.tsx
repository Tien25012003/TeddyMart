import {
  AlertModal,
  BtnExport,
  ButtonComponent,
  ListCheckBox,
  SearchComponent,
} from "components";
import { COLORS } from "constants/colors";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TiPlus } from "react-icons/ti";
import AddNewSupplierForm from "./Components/AddNewSupplier";
import { deleteAccount, deleteData } from "controller/deleteData";
import { useDispatch } from "react-redux";
import { deletePartner } from "state_management/slices/partnerSlice";
import { message } from "antd";
import { PartnerTable } from "components/TableComponent";
import AddNewStaffForm from "./Components/AddNewStaff";
import StaffTable from "components/TableComponent/components/StaffTable";
import { deleteStaff } from "state_management/slices/staffSlice";
import { deleteUser, getAuth } from "firebase/auth";
import { BiTrash } from "react-icons/bi";

const StaffScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [openAddNewSupplier, setOpenAddNewSupplier] = useState(false);

  const [dataInput, setDataInput] = useState<TStaff>({
    userId: "",
    staffName: "",
    phoneNumber: "",
    email: "",
    address: "",
    gender: "female",
    type: "",
    salary: 0,
    note: "",
  });
  const [listFilter, setListFilter] = useState([
    {
      displayName: t("staff.id"),
      value: true,
    },
    {
      displayName: t("staff.staffName"),
      value: true,
    },
    {
      displayName: t("staff.phoneNumber"),
      value: true,
    },
    {
      displayName: t("staff.email"),
      value: true,
    },
    {
      displayName: t("staff.address"),
      value: true,
    },
    {
      displayName: t("staff.gender"),
      value: true,
    },
    {
      displayName: t("staff.type"),
      value: true,
    },
    {
      displayName: t("staff.salary"),
      value: true,
    },
    {
      displayName: t("Note"),
      value: true,
    },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);

  const excelRef = useRef(null);
  const onDeleteMultiShelf = () => {
    if (selectedRows.length !== 0) {
      selectedRows.forEach(async (item) => {
        await deleteAccount({ id: item });
        dispatch(deleteStaff({ id: item }));
        message.success(t("partner.deleteStaff"));
        setOpen(false);
        setSelectedRows([]);
      });
    }
  };
  const filterOptions = {
    id: listFilter[0].value,
    staffName: listFilter[1].value,
    phoneNumber: listFilter[2].value,
    email: listFilter[3].value,
    address: listFilter[4].value,
    gender: listFilter[5].value,
    type: listFilter[6].value,
    salary: listFilter[7].value,
    note: listFilter[8].value,
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
                // width={"100%"}
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
                onClick={() => setOpenAddNewSupplier(true)}
                iconLeft={
                  <TiPlus
                    style={{ marginRight: 10, color: "white", fontSize: 22 }}
                  />
                }
              />
            </div>
          </div>
        </div>
        <AddNewStaffForm
          openAddNewStaff={openAddNewSupplier}
          setOpenAddNewStaff={setOpenAddNewSupplier}
          data={dataInput}
          setData={setDataInput}
        />
        <AlertModal
          open={open}
          setOpen={setOpen}
          onConfirm={onDeleteMultiShelf}
        />
        <StaffTable
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
};

export default StaffScreen;
