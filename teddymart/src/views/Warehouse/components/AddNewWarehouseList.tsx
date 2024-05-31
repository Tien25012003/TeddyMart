import React, { useState, useDeferredValue, useRef, useMemo } from "react";
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
import {
  addNewWarehouse,
  updateWarehouse,
} from "state_management/slices/warehouseSlice";
import { addData, updateData } from "controller/addData";
import { deleteMultiOrder } from "state_management/slices/warehouseSlice";
import { info } from "hooks/useLogger";

type Props = {
  openAddNewWarehouse: boolean;
  setOpenAddNewWarehouse: (openAddNewWarehouse: boolean) => void;
  data?: TWarehouse;
  setData?: (data: TWarehouse) => void;
  isAdd?: boolean;
};

export default function AddNewWarehouseList({
  openAddNewWarehouse,
  setOpenAddNewWarehouse,
  data,
  setData,
  isAdd = true,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onChange = (value: string, fieldName: string) => {
    setData({
      ...data,
      [fieldName]: value,
    });
  };

  const backgroundColor = useMemo(
    () =>
      data.warehouseName !== "" && data.address !== ""
        ? COLORS.darkYellow
        : COLORS.defaultWhite,
    [data.warehouseName, data.address]
  );
  const color = useMemo(
    () =>
      data.warehouseName !== "" && data.address !== ""
        ? COLORS.defaultWhite
        : COLORS.lightGray,
    [data.warehouseName, data.address]
  );
  const WAREHOUSE = useSelector((state: RootState) => state.warehouseSlice);
  const onAddNewWarehouse = async () => {
    const trimmedName = data.warehouseName.trim();
    const trimmedAddress = data.address.trim();
    if (!trimmedName || !trimmedAddress) {
      message.warning(t("fillData"));
      return;
    }
    const warehouseId = createID({ prefix: "WH" });
    const newData: TWarehouse = {
      warehouseId: warehouseId,
      warehouseName: data.warehouseName,
      address: data.address,
      listProduct: [],
      count: 0,
    };

    if (isAdd) {
      if (
        WAREHOUSE.findIndex(
          (warehouse) =>
            warehouse.warehouseName === data.warehouseName &&
            warehouse.address == data.address
        ) !== -1
      ) {
        message.error(t("warehouse.existed"));
        return;
      }
      dispatch(addNewWarehouse(newData));
      addData({ data: newData, table: "Ware_House", id: warehouseId });
      await info({
        message: "Add New Warehouse",
        data: newData,
      });
      message.success(t("warehouse.addSuccess"));
    } else {
      dispatch(
        updateWarehouse({ warehouseId: data.warehouseId, updatedData: data })
      );
      await info({
        message: "Update Warehouse",
        data: data,
      });
      await updateData({
        data: data,
        table: "Ware_House",
        id: data.warehouseId,
      });
      message.success(t("warehouse.updateSuccess"));
    }
    setOpenAddNewWarehouse(false);

    setData({
      warehouseId: "",
      warehouseName: "",
      address: "",
      listProduct: [],
      count: 0,
    });
  };
  return (
    <Modal
      open={openAddNewWarehouse}
      onCancel={() => setOpenAddNewWarehouse(false)}
      footer={false}
      title={
        <h1 className="text-2xl">
          {isAdd ? t("warehouse.addNewWarehouse") : "Update Warehouse"}
        </h1>
      }
      width={"60%"}
    >
      <div className="border hidden md:flex border-gray-100"></div>
      <div className="flex flex-col gap-y-5 px-5 py-10">
        <TextInputComponent
          label={t("warehouse.warehouseName")}
          width={"100%"}
          value={data.warehouseName}
          setValue={(value) => onChange(value, "warehouseName")}
        />
        <TextInputComponent
          label={t("warehouse.address")}
          width={"100%"}
          value={data.address}
          setValue={(value) => onChange(value, "address")}
        />

        {/* <Checkbox>
            <h1 className="font-bold">{t("warehouse.defaultWarehouse")}</h1>
        </Checkbox> */}
      </div>

      <div className="border hidden md:flex border-gray-100"></div>

      <div className="flex mt-10 items-center justify-center">
        <Space>
          <ButtonComponent
            label={t("button.save")}
            backgroundColor={backgroundColor}
            color={color}
            onClick={() => {
              onAddNewWarehouse();
            }}
          />
          <ButtonComponent
            label={t("button.cancel")}
            onClick={() => {
              setOpenAddNewWarehouse(false);
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
