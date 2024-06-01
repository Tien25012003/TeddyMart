import { Divider, Modal, Space, message } from "antd";
import { ButtonComponent, TextInputComponent } from "components";
import { COLORS } from "constants/colors";
import { addData, updateData } from "controller/addData";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { updateGroupProduct } from "state_management/slices/groupProductSlice";
import { addNewShelf, updateShelf } from "state_management/slices/shelfSlice";
import { createID } from "utils/appUtils";

type Props = {
  openAddNewShelf: boolean;
  setOpenAddShelf: (openAddNewShelf: boolean) => void;
  data?: TShelf;
  setData?: (data: TShelf) => void;
  isAdd?: boolean;
};

export default function AddNewShelf({
  openAddNewShelf,
  setOpenAddShelf,
  data,
  setData,
  isAdd = true,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const SHELF = useSelector((state: RootState) => state.shelf);
  const GROUP_PRODUCT = useSelector((state: RootState) => state.groupProduct);
  const onChange = (value: string, fieldName: string) => {
    setData({
      ...data,
      [fieldName]: value,
    });
  };

  const onAddNewShelf = async () => {
    if (data.shelfName === "" || data.capacity === "") {
      message.error(t("fillData"));
      return;
    }

    if (isAdd) {
      if (
        SHELF.findIndex((shelf) => shelf.shelfName === data.shelfName) !== -1
      ) {
        message.error(t("shelf.shelfExist"));
        return;
      }
      // Add new shelf
      const ShelfID = createID({ prefix: "S" });
      const newdata: TShelf = {
        shelfId: ShelfID,
        shelfName: data.shelfName,
        capacity: +data.capacity,
        note: data.note,
        currentQuantity: 0,
      };
      //dispatch(addNewShelf(newdata));
      addData({ data: newdata, table: "Shelf", id: ShelfID });
      message.success(t("shelf.shelfAddSuccess"));
    } else {
      // Update shelf
      //dispatch(updateShelf({ currentShelfId: data.shelfId, newShelf: data }));
      await updateData({ data: data, table: "Shelf", id: data.shelfId });
      GROUP_PRODUCT.forEach(async (g) => {
        if (g.shelfID === data.shelfId) {
          if (g.shelfName !== data.shelfName) {
            await updateData({
              data: { ...g, shelfName: data.shelfName },
              table: "Group_Product",
              id: g.groupId,
            });
            dispatch(
              updateGroupProduct({
                currentGroupProduct: g,
                newGroupProduct: { ...g, shelfName: data.shelfName },
              })
            );
          }
        }
      });
      message.success(t("shelf.updateSuccess"));
    }
    setOpenAddShelf(false);
    setData({
      shelfId: "",
      shelfName: "",
      capacity: "",
      note: "",
    });
  };

  const backgroundColor = useMemo(
    () =>
      data.shelfName !== "" && data.capacity !== ""
        ? COLORS.darkYellow
        : COLORS.defaultWhite,
    [data.shelfName, data.capacity]
  );
  const color = useMemo(
    () =>
      data.shelfName !== "" && data.capacity !== ""
        ? COLORS.defaultWhite
        : COLORS.lightGray,
    [data.shelfName, data.capacity]
  );
  return (
    <Modal
      title={
        isAdd ? (
          <h1 className="text-2xl">{t("shelf.addNewShelf")}</h1>
        ) : (
          <h1 className="text-2xl">{t("shelf.shelfInfo")}</h1>
        )
      }
      width={"60%"}
      open={openAddNewShelf}
      onCancel={() => setOpenAddShelf(false)}
      footer={false}
    >
      <Divider style={{ backgroundColor: "black" }} />
      <div className="grid grid-cols-4">
        <label className="self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("shelf.shelfName")} <p className="inline-block text-red-600">*</p>
        </label>
        <div className="col-span-3 inline-block">
          <TextInputComponent
            value={data.shelfName}
            setValue={(value) => onChange(value, "shelfName")}
            width="100%"
          />
        </div>

        <label className="mt-5 self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("shelf.capacity")} <p className="inline-block text-red-600">*</p>
        </label>
        <div className="mt-5 col-span-3 inline-block">
          <TextInputComponent
            value={data.capacity.toString()}
            inputType="number"
            placeHolder="0"
            setValue={(value) => onChange(value, "capacity")}
            width="100%"
            min="0"
          />
        </div>

        <label className="mt-5 self-center font-bold md:text-right mb-1 md:mb-0 pr-4">
          {t("shelf.note")}
        </label>
        <div className="mt-5 col-span-3 inline-block">
          <TextInputComponent
            value={data.note}
            setValue={(value) => onChange(value, "note")}
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
              onAddNewShelf();
            }}
          />
          <ButtonComponent
            label={t("button.cancel")}
            onClick={() => {
              setOpenAddShelf(false);
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
