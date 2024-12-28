import { Divider, Modal, Space, message } from "antd";
import { ButtonComponent, ButtonSelect, TextInputComponent } from "components";
import { COLORS } from "constants/colors";
import { addData, updateData } from "controller/addData";
import { t } from "i18next";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdArrowDropdown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import {
  addNewGroupProduct,
  updateGroupProduct,
} from "state_management/slices/groupProductSlice";
import { updateProduct } from "state_management/slices/productSlice";
import { createID } from "utils/appUtils";

type Props = {
  openAddNewGroupProduct: boolean;
  setOpenAddNewGroupProduct: (openAddNewGroupProduct: boolean) => void;
  data?: TGroupProduct;
  setData?: (data: TGroupProduct) => void;
  isAdd?: boolean;
};

export default function AddNewGroupProduct({
  openAddNewGroupProduct,
  setOpenAddNewGroupProduct,
  data,
  setData,
  isAdd = true,
}: Props) {
  const SHELF = useSelector((state: RootState) => state.shelf);
  const PRODUCT = useSelector((state: RootState) => state.product);
  const GROUP = useSelector((state: RootState) => state.groupProduct);
  const ShelfOptions = SHELF.map((item) => ({
    ID: item.shelfId,
    shelfname: item.shelfName,
  }));

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onChange = (value: string, fieldName: string) => {
    setData({
      ...data,
      [fieldName]: value,
    });
  };

  const onAddNewGroupProduct = async () => {
    if (data.groupName === "" || data.shelfName === "" || data.shelfID === "") {
      console.log(data);
      message.error(t("fillData"));
      return;
    }

    if (isAdd) {
      if (
        GROUP.findIndex((group) => group.groupName === data.groupName) !== -1
      ) {
        message.error(t("group.groupExist"));
        return;
      }
      //Add new group
      const GroupID = createID({ prefix: "GP" });
      const newdata: TGroupProduct = {
        groupId: GroupID,
        groupName: data.groupName,
        shelfID: data.shelfID,
        shelfName: data.shelfName,
        note: data.note,
      };
      dispatch(addNewGroupProduct(newdata));
      addData({ data: newdata, table: "Group_Product", id: GroupID });
      message.success("Group Product added successfully!");
    } else {
      //Update group
      dispatch(
        updateGroupProduct({ currentGroupProduct: data, newGroupProduct: data })
      );
      await updateData({
        data: data,
        table: "Group_Product",
        id: data.groupId,
      });
      PRODUCT?.forEach(async (p) => {
        console.log("ok", p);
        if (p.groupId === data.groupId) {
          if (p.groupName !== data.groupName) {
            await updateData({
              data: { ...p, groupName: data.groupName },
              table: "Product",
              id: p.productId,
            });
            dispatch(
              updateProduct({
                currentProduct: p,
                newProduct: { ...p, groupName: data.groupName },
              })
            );
          }
        }
      });
      message.success(t("group.updateSuccess"));
    }
    setOpenAddNewGroupProduct(false);
    setData({
      groupId: "",
      groupName: "",
      shelfID: "",
      shelfName: "",
      note: "",
    });
  };

  const backgroundColor = useMemo(
    () =>
      data.groupName !== "" && data.shelfName !== "" && data.shelfID !== ""
        ? COLORS.darkYellow
        : COLORS.defaultWhite,
    [data.groupName, data.shelfName, data.shelfID]
  );
  const color = useMemo(
    () =>
      data.groupName !== "" && data.shelfName !== "" && data.shelfID !== ""
        ? COLORS.defaultWhite
        : COLORS.lightGray,
    [data.groupName, data.shelfName, data.shelfID]
  );

  return (
    <Modal
      title={
        isAdd ? (
          <h1 className="text-2xl">{t("group.addNewProductGroup")}</h1>
        ) : (
          <h1 className="text-2xl">{t("group.editProductGroupInfo")}</h1>
        )
      }
      width={"60%"}
      open={openAddNewGroupProduct}
      onCancel={() => setOpenAddNewGroupProduct(false)}
      footer={false}
    >
      <Divider style={{ backgroundColor: "black" }} />
      <div className="grid grid-cols-4">
        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("group.groupName")} <p className="inline-block text-red-600">*</p>
        </label>
        <div className="px-2 col-span-3 inline-block">
          <TextInputComponent
            value={data.groupName}
            setValue={(value) => {
              onChange(value, "groupName");
            }}
            width="100%"
          />
        </div>

        <label className="mt-5 self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("shelf.shelfName")} <p className="inline-block text-red-600">*</p>
        </label>
        <div className="mt-5 col-span-3 inline-block">
          <ButtonSelect
            iconRight={
              <IoMdArrowDropdown style={{ marginLeft: 50, color: "gray" }} />
            }
            width="100%"
            title="All"
            label={t("shelf.shelfName")}
            value={data.shelfName}
            setValue={(value) => {
              setData({
                ...data,
                shelfID: ShelfOptions[value].ID,
                shelfName: ShelfOptions[value].shelfname,
              });
            }}
            options={ShelfOptions.map((item) => item.shelfname)}
          />
        </div>

        <label className="mt-5 self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("note")}
        </label>
        <div className="px-2 mt-5 col-span-3 inline-block">
          <TextInputComponent
            value={data.note}
            setValue={(value) => {
              onChange(value, "note");
            }}
            width="100%"
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
              onAddNewGroupProduct();
            }}
          />
          <ButtonComponent
            label={t("button.cancel")}
            onClick={() => {
              setOpenAddNewGroupProduct(false);
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
