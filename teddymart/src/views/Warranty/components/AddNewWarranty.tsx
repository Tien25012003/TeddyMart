import { Divider, message, Modal, Space } from "antd";
import { ButtonComponent, ButtonSelect, TextInputComponent } from "components";
import { COLORS } from "constants/colors";
import { addData, updateData } from "controller/addData";
import { info } from "hooks/useLogger";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IoMdArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import {
  addNewWarranty,
  updateWarranty,
} from "state_management/slices/warrantySlice";
import { createID } from "utils/appUtils";
import { WARRANTY_STATUS_ENUM } from "utils/enums/warranty.enum";

type Props = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  data?: TWarranty;
  setData?: (data: TWarranty) => void;
  isAdd?: boolean;
};
export default function AddNewWarranty({
  open = false,
  setOpen,
  data,
  setData,
  isAdd = true,
}: Props) {
  const { t } = useTranslation();

  const CUSTOMER = useSelector((state: RootState) => state.partnerSlice).filter(
    (p) => p.type === "Customer"
  );

  const customerInfo = useMemo(() => {
    const customer = CUSTOMER.find(
      (partner) => partner.phoneNumber === data.customerPhoneNumber
    );
    return customer;
  }, [CUSTOMER, data.customerPhoneNumber]);

  const PRODUCT = useSelector((state: RootState) => state.product);
  const ProductOptions = useMemo(
    () => PRODUCT?.map((item) => item.productId),
    [PRODUCT]
  );

  const productInfo = useMemo(() => {
    const product = PRODUCT.find((p) => p.productId === data.productId);
    return product;
  }, [PRODUCT, data.productId]);

  const statuses = useMemo(
    () =>
      Object.keys(WARRANTY_STATUS_ENUM).map((item) => ({
        value: item,
        label: t(`warranty.${item}`),
      })),
    [t]
  );

  const backgroundColor = useMemo(
    () => (data.productId !== "" ? COLORS.darkYellow : COLORS.defaultWhite),
    [data.productId]
  );

  const color = useMemo(
    () => (data.productId !== "" ? COLORS.defaultWhite : COLORS.lightGray),
    [data.productId]
  );

  const onChange = (value: string, fieldName: string) => {
    setData({
      ...data,
      [fieldName]: value,
    });
  };

  const userId = localStorage.getItem("USER_ID");
  const dispatch = useDispatch();

  const onAddNewWaranty = async () => {
    try {
      const newData: TWarranty = {
        warrantyId: isAdd ? createID({ prefix: "WR" }) : data.warrantyId,
        productId: productInfo.productId,
        productName: productInfo.productName,
        supplierID: productInfo.supplierID,
        customerID: customerInfo.partnerId,
        customerName: customerInfo.partnerName,
        customerPhoneNumber: customerInfo.phoneNumber,
        reason: data.reason,
        status: data.status,
      };
      if (isAdd) {
        await addData({
          data: newData,
          table: "Warranty",
          id: newData.warrantyId,
        });
        dispatch(addNewWarranty(newData));
        // addData({ data: newData, table: "Warranty", id: newData.warrantyId });
        // console.log(
        //   "Redux state after adding warranty:",
        //   useSelector((state: RootState) => state.warrantySlice)
        // );

        await info({
          message: "Add New Warranty",
          data: { data: newData, table: "Warranty", id: newData.warrantyId },
        });
        message.success(t("warranty.addSuccess"));
      } else {
        await updateData({
          data: newData,
          table: "Warranty",
          id: newData.warrantyId,
        });
        dispatch(
          updateWarranty({ currentWarranty: data, newWarranty: newData })
        );
        await info({
          message: "Update Warranty",
          data: {
            data: newData,
            table: "Warranty",
            id: newData.warrantyId,
          },
        });
        message.success(t("warranty.updateSuccess"));
      }
      setOpen(false);
      setData({
        warrantyId: "",
        productId: "",
        productName: "",
        supplierID: "",
        customerID: "",
        customerName: "",
        customerPhoneNumber: "",
        reason: "",
        status: "NEW",
      });
    } catch (e) {
      console.error("Error while adding/updating warranty:", e);
    }
  };

  console.log("data", data);

  return (
    <Modal
      title={
        isAdd ? (
          <h1 className="text-2xl">{t("warranty.addNewWarranty")}</h1>
        ) : (
          <h1 className="text-2xl">{t("warranty.warrantyInfo")}</h1>
        )
      }
      width={"60%"}
      open={open}
      onCancel={() => setOpen(false)}
      footer={false}
    >
      <Divider style={{ backgroundColor: "black" }} />
      <div className="grid grid-cols-4 gap-4">
        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("warranty.customerPhoneNumber")}
          <p className="inline-block text-red-600">*</p>
        </label>
        <div className="px-2 col-span-3 inline-block">
          <TextInputComponent
            value={data.customerPhoneNumber}
            setValue={(value) => onChange(value, "customerPhoneNumber")}
            width="100%"
          />
        </div>

        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("warranty.customerId")}
        </label>
        <div className="px-2 col-span-3 inline-block">
          <TextInputComponent
            value={customerInfo?.partnerId || ""}
            width="100%"
            disabled={true}
          />
        </div>

        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("warranty.customerName")}
        </label>
        <div className="px-2 col-span-3 inline-block">
          <TextInputComponent
            value={customerInfo?.partnerName || ""}
            width="100%"
            disabled={true}
          />
        </div>

        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("warranty.productId")}
        </label>
        <div className="col-span-3 inline-block w-full">
          <ButtonSelect
            iconRight={
              <IoMdArrowDown style={{ marginLeft: 50, color: "gray" }} />
            }
            width="100%"
            title={t("warranty.productId")}
            label={t("warranty.productId")}
            value={data.productId}
            setValue={(value) => {
              setData({
                ...data,
                productId: ProductOptions[value],
              });
            }}
            options={ProductOptions}
          />
        </div>

        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("warranty.productName")}
        </label>
        <div className="px-2 col-span-3 inline-block">
          <TextInputComponent
            value={productInfo?.productName || ""}
            width="100%"
            disabled={true}
          />
        </div>

        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("warranty.supplierID")}
        </label>
        <div className="px-2 col-span-3 inline-block">
          <TextInputComponent
            value={productInfo?.supplierID || ""}
            width="100%"
            disabled={true}
          />
        </div>

        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("warranty.reason")}
        </label>
        <div className="px-2 col-span-3 inline-block">
          <TextInputComponent
            value={data.reason}
            setValue={(value) => onChange(value, "reason")}
            width="100%"
          />
        </div>

        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("warranty.status")}
          <p className="inline-block text-red-600">*</p>
        </label>
        <div className="col-span-3 inline-block w-full">
          <ButtonSelect
            iconRight={
              <IoMdArrowDown style={{ marginLeft: 50, color: "gray" }} />
            }
            width="100%"
            title={t("warranty.status")}
            label={t("warranty.status")}
            value={t(`warranty.${data.status}`)}
            setValue={(value) => {
              setData({
                ...data,
                status: statuses[value].value as any,
              });
            }}
            options={statuses?.map((i) => i.label)}
          />
        </div>
      </div>

      <div className="flex mt-10 items-center justify-center">
        <Space>
          <ButtonComponent
            label={t("button.save")}
            backgroundColor={backgroundColor}
            color={color}
            onClick={() => {
              onAddNewWaranty();
            }}
          />
          <ButtonComponent
            label={t("button.cancel")}
            onClick={() => {
              setOpen(false);
            }}
            style={{
              backgroundColor: "white",
              borderWidth: 1,
              color: "#9A9A9A",
            }}
          />
        </Space>
      </div>
    </Modal>
  );
}
// function dispatch(arg0: {
//   payload: TWarranty;
//   type: "warrantySlice/addNewWarranty";
// }) {
//   throw new Error("Function not implemented.");
// }
