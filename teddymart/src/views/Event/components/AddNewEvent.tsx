import { Divider, message, Modal, Select, Space } from "antd";
import { ButtonComponent, ButtonSelect, TextInputComponent } from "components";
import { addData, updateData } from "controller/addData";
import dayjs from "dayjs";
import { info } from "hooks/useLogger";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IoMdArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { addNewEvent, updateEvent } from "state_management/slices/eventSlice";
import { createID } from "utils/appUtils";
import { EVENT_STATUS_ENUM } from "utils/enums/event.enum";

type Props = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  data?: TEvent;
  setData?: (data: TEvent) => void;
  isAdd?: boolean;
};
export default function AddNewEvent({
  open = false,
  setOpen,
  data,
  setData,
  isAdd = true,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const CUSTOMER = useSelector((state: RootState) => state.partnerSlice).filter(
    (p) => p.type === "Customer"
  );

  const PRODUCT = useSelector((state: RootState) => state.product);
  const ProductOptions = useMemo(
    () =>
      PRODUCT?.map((item) => ({
        value: item.productId,
        label: item.productName,
      })),
    [PRODUCT]
  );
  const statuses = useMemo(
    () =>
      Object.keys(EVENT_STATUS_ENUM).map((item) => ({
        value: item,
        label: t(`event.${item}`),
      })),
    [t]
  );

  const onChange = (value: any, fieldName: string) => {
    setData({
      ...data,
      [fieldName]: value,
    });
  };

  const onAddNewEvent = async () => {
    try {
      const newData: TEvent = {
        eventId: isAdd ? createID({ prefix: "EV" }) : data.eventId,
        eventName: data.eventName,
        products: data.products,
        endDate: data.endDate,
        startDate: data.startDate,
        status: data.status,
        discount: data.discount,
        maximumValue: data.maximumValue
      };
      if (isAdd) {
        await addData({
          data: newData,
          table: "Event",
          id: newData.eventId,
        });
        dispatch(addNewEvent(newData));
        // addData({ data: newData, table: "Warranty", id: newData.warrantyId });
        // console.log(
        //   "Redux state after adding warranty:",
        //   useSelector((state: RootState) => state.warrantySlice)
        // );

        await info({
          message: "Add New Event",
          data: { data: newData, table: "Event", id: newData.eventId },
        });
        message.success(t("event.addSuccess"));
      } else {
        await updateData({
          data: newData,
          table: "Event",
          id: newData.eventId,
        });
        dispatch(updateEvent({ currentEvent: data, newEvent: newData }));
        await info({
          message: "Update event",
          data: {
            data: newData,
            table: "Event",
            id: newData.eventId,
          },
        });
        message.success(t("warranty.updateSuccess"));
      }
      setOpen(false);
      setData({
        eventId: "",
        eventName: "",
        products: [],
        startDate: new Date(),
        endDate: new Date(),
        status: "NOT_START",
        discount: 0,
        maximumValue:0,
      });
    } catch (e) {
      console.error("Error while adding/updating event:", e);
    }
  };
  return (
    <Modal
      title={
        isAdd ? (
          <h1 className="text-2xl">{t("event.addNewEvent")}</h1>
        ) : (
          <h1 className="text-2xl">{t("event.eventInfo")}</h1>
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
          {t("event.eventId")}
          <p className="inline-block text-red-600">*</p>
        </label>
        <div className="px-2 col-span-3 inline-block">
          <TextInputComponent
            value={data.eventId}
            setValue={(value) => onChange(value, "eventId")}
            placeHolder={t("event.eventId")}
            width="100%"
            disabled
          />
        </div>
        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("event.eventName")}
          <p className="inline-block text-red-600">*</p>
        </label>
        <div className="px-2 col-span-3 inline-block">
          <TextInputComponent
            value={data.eventName}
            setValue={(value) => onChange(value, "eventName")}
            placeHolder={t("event.eventName")}
            width="100%"
          />
        </div>
        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("event.discount")} (%)
          <p className="inline-block text-red-600">*</p>
        </label>
        <div className="px-2 col-span-3 inline-block">
          <TextInputComponent
            value={data.discount.toString()}
            setValue={(value) => onChange(+value, "discount")}
            placeHolder={t("event.discount")}
            width="100%"
            inputType="number"
          />
        </div>
        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("event.maximumValue")} (VND)
          <p className="inline-block text-red-600">*</p>
        </label>
        <div className="px-2 col-span-3 inline-block">
          <TextInputComponent
            value={data.maximumValue.toString()}
            setValue={(value) => onChange(+value, "maximumValue")}
            placeHolder={t("event.maximumValue")}
            width="100%"
            inputType="number"
          />
        </div>
        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("event.productIds")}
          <p className="inline-block text-red-600">*</p>
        </label>
        <div className="px-2 col-span-3 inline-block w-full">
          <Select
            labelInValue
            value={data.products.map((product) => ({
              label: product.productName,
              value: product.id,
            }))}
            mode="multiple"
            onChange={(e) =>
              onChange(
                e.map((item) => ({ productName: item.label, id: item.value })),
                "products"
              )
            }
            placeholder={t("event.productIds")}
            title={t("event.productIds")}
            options={ProductOptions}
            className={` text-sm !h-12 text-gray-900 border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full `}
          />
        </div>
        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("event.status")}
          <p className="inline-block text-red-600">*</p>
        </label>
        <div className="col-span-3 inline-block w-full">
          <ButtonSelect
            iconRight={
              <IoMdArrowDown style={{ marginLeft: 50, color: "gray" }} />
            }
            width="100%"
            title={t("event.status")}
            label={t("event.status")}
            value={t(`event.${data.status}`)}
            setValue={(value) => {
              setData({
                ...data,
                status: statuses[value].value as any,
              });
            }}
            options={statuses?.map((i) => i.label)}
          />
        </div>
        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("event.startDate")}
          <p className="inline-block text-red-600">*</p>
        </label>
        <div className="px-2 col-span-3 inline-block">
          <TextInputComponent
            inputType="date"
            value={dayjs(data.startDate).format("YYYY-MM-DD")}
            setValue={(value) => {
              console.log(value);
              onChange(value, "startDate");
            }}
            placeHolder={t("event.startDate")}
            width="100%"
          />
        </div>
        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("event.endDate")}
          <p className="inline-block text-red-600">*</p>
        </label>
        <div className="px-2 col-span-3 inline-block">
          <TextInputComponent
            value={dayjs(data.endDate).format("YYYY-MM-DD")}
            inputType="date"
            setValue={(value) => onChange(value, "endDate")}
            placeHolder={t("event.endDate")}
            width="100%"
          />
        </div>
      </div>
      <div className="flex mt-10 items-center justify-center">
        <Space>
          <ButtonComponent label={t("button.save")} onClick={onAddNewEvent} />
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
