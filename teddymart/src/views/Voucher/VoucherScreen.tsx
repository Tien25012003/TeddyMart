import { DatePicker, Modal, Space } from "antd";
import { ButtonComponent, Header, TextInputComponent } from "components";
import { VoucherTable } from "components/TableComponent";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BiPlus, BiSearch } from "react-icons/bi";
import { PiWarningCircle } from "react-icons/pi";
import AddNewVoucherForm from "./components/AddNewVoucherForm";
import UpdateVoucherForm from "./components/UpdateVoucherForm";
import WarningAlert from "./components/WarningAlert";
function VoucherScreen() {
  const { t } = useTranslation();
  const [openAddVoucher, setOpenAddVoucher] = useState(false);
  const [searchVoucher, setSearchVoucher] = useState("");
  const [openUpdateVoucher, setOpenUpdateVoucher] = useState(false);
  const [openWarningDelete, setOpenWarningDelete] = useState(false);
  const [editContent, setEditContent] = useState<TVoucher>();
  const openEditForm = (voucher: TVoucher) => {
    setOpenUpdateVoucher(true);
    setEditContent(voucher);
  };
  return (
    <div className="w-full">
      <body
        className="bg-white border-2 p-5 m-1.5 rounded-md"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Space direction="vertical" size={10}>
          <div className="flex items-center justify-between">
            <TextInputComponent
              iconLeft={<BiSearch />}
              value={searchVoucher}
              setValue={setSearchVoucher}
              placeHolder={t("voucher.searchVoucher")}
              width={"70%"}
            />
            <ButtonComponent
              label={t("button.addNew")}
              onClick={() => setOpenAddVoucher(true)}
              iconLeft={<BiPlus />}
            />
          </div>
          <div className="my-4">
            <VoucherTable
              searchVoucherName={searchVoucher}
              openEditForm={openEditForm}
            />
          </div>
        </Space>
      </body>
      <AddNewVoucherForm
        openAddVoucher={openAddVoucher}
        setOpenAddVoucher={setOpenAddVoucher}
      />
      <UpdateVoucherForm
        openUpdateVoucher={openUpdateVoucher}
        setOpenUpdateVoucher={setOpenUpdateVoucher}
        data={editContent}
      />
      <WarningAlert
        openWarningDelete={openWarningDelete}
        setOpenWarningDelete={setOpenWarningDelete}
      />
    </div>
  );
}

export default VoucherScreen;
