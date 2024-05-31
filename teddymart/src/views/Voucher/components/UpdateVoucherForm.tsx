import { DatePicker, Modal, Space } from "antd";
import { ButtonComponent, TextInputComponent } from "components";
import dayjs, { Dayjs } from "dayjs";
import { info } from "hooks/useLogger";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { updateVoucher } from "state_management/slices/voucherSlice";
import { updateVoucherFirebase } from "utils/appUtils";
type Props = {
  openUpdateVoucher: boolean;
  setOpenUpdateVoucher: (openUpdateVoucher: boolean) => void;
  data?: TVoucher;
};
const UpdateVoucherForm = ({
  openUpdateVoucher,
  setOpenUpdateVoucher,
  data,
}: Props) => {
  const [voucherName, setVoucherName] = useState(data?.voucherName);
  const [dateFrom, setDateFrom] = useState(dayjs(data?.publicDate));
  const [dateTo, setDateTo] = useState(dayjs(data?.expirationDate));
  const [discountAmount, setDiscountAmount] = useState(
    data?.discountAmount.toString()
  );
  const userId = localStorage.getItem("USER_ID");
  const dispatch = useDispatch();
  const onUpdateVoucher = async () => {
    const dataUpdate: TVoucher = {
      voucherId: data.voucherId,
      voucherName: voucherName,
      expirationDate: dateFrom.toISOString(),
      publicDate: dateFrom.toISOString(),
      discountAmount: +discountAmount,
    };
    dispatch(
      updateVoucher({
        voucherId: data.voucherId,
        updateData: dataUpdate,
      })
    );
    await info({
      message: "Update Voucher",
      data: dataUpdate,
    });
    updateVoucherFirebase(dataUpdate, userId, data.voucherId);
    setOpenUpdateVoucher(false);
  };
  const { t } = useTranslation();
  return (
    <Modal
      open={openUpdateVoucher}
      onCancel={() => setOpenUpdateVoucher(false)}
      title={
        <h1 className=" text-center" style={{ color: "#9A9A9A" }}>
          {t("button.updateVoucher")}
        </h1>
      }
      width={"auto"}
      footer={false}
    >
      <TextInputComponent
        label={t("voucher.voucherName")}
        labelColor="#9A9A9A"
        width={"100%"}
        style={{ marginBlock: 12 }}
        value={voucherName}
        setValue={setVoucherName}
      />
      <Space
        style={{
          justifyContent: "space-between",
          width: "100%",
          marginBlock: 12,
        }}
      >
        <Space direction="vertical">
          <label>{t("voucher.expirationDate")}</label>
          <DatePicker onChange={setDateFrom} value={dateFrom} />
        </Space>
        <Space direction="vertical">
          <label>{t("voucher.publicDate")}</label>
          <DatePicker onChange={setDateTo} value={dateTo} />
        </Space>
      </Space>
      <TextInputComponent
        label={t("voucher.discountAmount")}
        labelColor="#9A9A9A"
        width={"100%"}
        style={{ marginBlock: 12 }}
        value={discountAmount}
        setValue={setDiscountAmount}
      />
      {/* <TextInputComponent
        label={t("voucher.note")}
        labelColor="#9A9A9A"
        width={"100%"}
        style={{ marginBlock: 12 }}
      /> */}
      <div className="flex items-center justify-center">
        <ButtonComponent
          label={t("button.updateVoucher")}
          onClick={onUpdateVoucher}
          paddingHorizontal={20}
        />
      </div>
    </Modal>
  );
};

export default UpdateVoucherForm;
