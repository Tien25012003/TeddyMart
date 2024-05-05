import React, { useEffect, useState } from "react";
import Header from "components/Header";
import DropdownComponent from "components/DropdownComponent";
import ButtonSelect from "components/ButtonSelect";
import { AlertModal } from "components";
import { IoMdArrowDropdown } from "react-icons/io";
import SearchComponent from "components/SearchComponent";
import ButtonComponent from "components/ButtonComponent";
import { COLORS } from "constants/colors";
import {
  LiaBarcodeSolid,
  LiaFileExcel,
  LiaRecycleSolid,
  LiaScribd,
} from "react-icons/lia";
import { TiPlus } from "react-icons/ti";
import { BiFilter } from "react-icons/bi";
import { ResponsiveContainer } from "recharts";
import { GroupProductTable } from "components/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { t } from "i18next";
import { Divider, Modal, Space, message } from "antd";
import { addData, updateData } from "controller/addData";
import AddNewGroupProduct from "./components/AddNewGroupProduct";
import { deleteData } from "controller/deleteData";
import { deleteShelf, updateShelf } from "state_management/slices/shelfSlice";
import { updateProduct } from "state_management/slices/productSlice";
import { deleteGroupProduct } from "state_management/slices/groupProductSlice";
import { updateShelfWarehouse } from "state_management/slices/warehouseSlice";
export type Input = {
  groupId: string;
  groupName: string;
  shelfID: string;
  shelfName: string;
  note: string;
};

export default function ProductScreen() {
  const GROUP = useSelector((state: RootState) => state.groupProduct);
  const [screens, setScreens] = useState();
  const [type, setType] = useState();
  const [productGroup, setProductGroup] = useState();
  const [status, setStatus] = useState();
  const [storeManagement, setStoreManagement] = useState();
  const [sort, setSort] = useState();
  const [search, setSearch] = useState("");
  const [openAddForm, setOpenAddForm] = useState(false);
  const [dataInput, setDataInput] = useState<TGroupProduct>({
    groupId: "",
    groupName: "",
    shelfID: "",
    shelfName: "",
    note: "",
  });
  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const PRODUCT = useSelector((state: RootState) => state.product);
  const WARE_HOUSE = useSelector((state: RootState) => state.warehouseSlice);
  const [isDisable, setIsDisable] = useState(false)

  const SHELF = useSelector((state: RootState) => state.shelf);
  const dispatch = useDispatch();
  const userId = window.localStorage.getItem("USER_ID");
  const onDeleteMultiGroup = () => {
    if (selectedRows.length !== 0) {
      selectedRows.forEach(async (item) => {
        await deleteData({ id: item, table: "Group_Product" });
        dispatch(deleteGroupProduct(GROUP.find((x) => x.groupId === item)));
        PRODUCT.forEach(async (product) => {
          if (product.groupId === item) {
            await updateData({
              data: { ...product, groupId: "", groupName: "" },
              table: "Group_Product",
              id: product.productId,
            });
            dispatch(
              updateProduct({
                currentProduct: product,
                newProduct: { ...product, groupId: "", groupName: "" },
              })
            );
          }
        });
        WARE_HOUSE.forEach((w) => {
          w.listProduct.forEach((p) => {
            const product = PRODUCT.find(
              (temp) => temp.productId === p.productId && temp.groupId === item
            );
            if (product) {
              dispatch(
                updateShelfWarehouse({
                  warehouseName: w.warehouseName,
                  product: { ...p, groupId: item },
                  numberOnShelf: 0,
                  userId: userId,
                })
              );
            }
          });
        });
        const shelfID = GROUP.find((g) => g.groupId === item).shelfID;
        const shelf = SHELF.find((s) => s.shelfId === shelfID);
        updateData({
          data: { ...shelf, currentQuantity: 0 },
          table: "Shelf",
          id: shelfID,
        });
        dispatch(
          updateShelf({
            currentShelfId: shelfID,
            newShelf: {
              ...shelf,
              currentQuantity: 0,
            },
          })
        );
        message.success(t("group.deletedGroup"));
        setOpen(false);
        setSelectedRows([]);
      });
    }
  };

  useEffect(() => {
    if(localStorage.getItem("ROLE") === 'Staff')
      setIsDisable(true);
  }, [])

  return (
    <div className="w-full">
      <div
        className="bg-white border-2 p-5 mx-1.5 my-1.5 rounded-md"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div className="flex items-center justify-between">
          <SearchComponent
            placeholder={t("product.searchByProductGroup")}
            outStyle={{ width: "50%" }}
            search={search}
            setSearch={setSearch}
          />
          <div className="flex items-center">
            <ButtonComponent
              label={t("button.delete")}
              onClick={() => {
                if (selectedRows.length > 0) setOpen(true);
              }}
              backgroundColor={COLORS.checkbox_bg}
              style={{ marginRight: 12 }}
              isDisable={isDisable}
            />
            <ButtonComponent
              label={t("product.addNewProductGroup")}
              onClick={() => setOpenAddForm(true)}
              iconLeft={<TiPlus style={{ fontSize: 22 }} />}
              isDisable={isDisable}
            />
          </div>
        </div>

        <div style={{ width: "100%", margin: "20px auto auto auto" }}>
          <GroupProductTable
            search={search}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            setOpenAlert={setOpen}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------------------------------------------------------- */}
      <AddNewGroupProduct
        openAddNewGroupProduct={openAddForm}
        setOpenAddNewGroupProduct={setOpenAddForm}
        data={dataInput}
        setData={setDataInput}
      />

      <AlertModal
        open={open}
        setOpen={setOpen}
        onConfirm={onDeleteMultiGroup}
      />
    </div>
  );
}
