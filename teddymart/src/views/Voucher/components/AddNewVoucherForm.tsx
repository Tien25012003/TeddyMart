import { DatePicker, DatePickerProps, Modal, Space, message } from "antd";
import { ButtonComponent, TextInputComponent } from "components";
import { timeFormat } from "constants/time";
import dayjs from "dayjs";
import { info } from "hooks/useLogger";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { addNewVoucher } from "state_management/slices/voucherSlice";
import { addVoucherFirebase, createID } from "utils/appUtils";
type Props = {
  openAddVoucher: boolean;
  setOpenAddVoucher: (openAddVoucher: boolean) => void;
};
const AddNewVoucherForm = ({ openAddVoucher, setOpenAddVoucher }: Props) => {
  // const y = new Date().getFullYear();
  // const m = new Date().getMonth();
  // const d = new Date().getDate();
  const { t } = useTranslation();
  const [voucherName, setVoucherName] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>(new Date());
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [discountAmount, setDiscountAmount] = useState("");
  const userId = localStorage.getItem("USER_ID");
  const dispatch = useDispatch();
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return new Date(y, m, d, 0, 0, 0, 0).toISOString();
  };
  //console.log(dateTo);
  // console.log(new Date().getTime());
  // console.log(formatDate(dateTo));
  const onAddNewVoucher = async () => {
    const voucherId = createID({ prefix: "VCH" });
    const data: TVoucher = {
      voucherId: voucherId,
      voucherName: voucherName,
      discountAmount: +discountAmount,
      expirationDate: formatDate(dateTo),
      publicDate: formatDate(dateFrom),
    };

    dispatch(addNewVoucher(data));
    await info({
      message: "Add New Voucher",
      data: data,
    });
    addVoucherFirebase(data, userId, voucherId);
    setOpenAddVoucher(false);
    message.success("Add voucher success");
  };
  return (
    <Modal
      open={openAddVoucher}
      onCancel={() => setOpenAddVoucher(false)}
      title={
        <h1 className=" text-center" style={{ color: "#9A9A9A" }}>
          {t("button.addNew")}
        </h1>
      }
      footer={false}
    >
      <TextInputComponent
        label={t("voucher.voucherName")}
        labelColor="#9A9A9A"
        width={"100%"}
        style={{ marginBlock: 12 }}
        setValue={setVoucherName}
        value={voucherName}
      />
      <Space
        style={{
          justifyContent: "space-between",
          width: "100%",
          marginBlock: 12,
        }}
      >
        <Space direction="vertical">
          <label>{t("voucher.publicDate")}</label>
          <DatePicker
            format={["DD/MM/YYYY"]}
            onChange={(e) => {
              if (e) {
                setDateFrom(e.toDate());
              }
            }}
          />
        </Space>
        <Space direction="vertical">
          <label>{t("voucher.expirationDate")}</label>
          <DatePicker
            format={["DD/MM/YYYY"]}
            onChange={(e) => {
              if (e) {
                setDateTo(e.toDate());
              }
            }}
          />
        </Space>
      </Space>
      <TextInputComponent
        label={t("voucher.discountAmount")}
        labelColor="#9A9A9A"
        width={"100%"}
        style={{ marginBlock: 12 }}
        value={discountAmount}
        setValue={setDiscountAmount}
        placeHolder="0"
        rightContent={<div>%</div>}
      />
      {/* <TextInputComponent
        label={t("voucher.note")}
        labelColor="#9A9A9A"
        width={"100%"}
        style={{ marginBlock: 12 }}
      /> */}
      <div className="flex items-center justify-center">
        <ButtonComponent
          label={t("button.publish")}
          onClick={onAddNewVoucher}
          paddingHorizontal={20}
        />
      </div>
    </Modal>
  );
};

export default AddNewVoucherForm;
