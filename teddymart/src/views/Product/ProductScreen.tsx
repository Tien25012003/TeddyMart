import React, { useDeferredValue, useEffect, useRef, useState } from "react";

import DropdownComponent from "components/DropdownComponent";

import { AlertModal, BtnExport, SearchComponent } from "components";
import ButtonComponent from "components/ButtonComponent";
import { COLORS } from "constants/colors";

import { BiPlus } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { ProductTable } from "components/TableComponent";
import { RootState } from "state_management/reducers/rootReducer";
import { ListCheckBox } from "components";
import { t } from "i18next";
import { Divider, Modal, Space, message, Spin } from "antd";
import AddNewProduct from "./components/AddNewProduct";
import { deleteData } from "controller/deleteData";
import { deleteProduct } from "state_management/slices/productSlice";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "firebaseConfig";
import { deleteProductWarehouse } from "state_management/slices/warehouseSlice";
import { updateShelf } from "state_management/slices/shelfSlice";
import { updateData } from "controller/addData";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { info } from "hooks/useLogger";
import { collection, query } from "firebase/firestore";
export type Input = {
  productId: string;
  productName: string;
  groupId: string;
  groupName: string;
  image: string;
  cost_price: number;
  sell_price: number;
  VAT: number;
  note: string;
};

export default function ProductScreen() {
  const productRef = useRef(null);
  const [search, setSearch] = useState("");
  const productName = useDeferredValue(search);
  const [selectedRows, setSelectedRows] = useState([]);
  const GROUP = useSelector((state: RootState) => state.groupProduct);
  const PRODUCT = useSelector((state: RootState) => state.product);
  const shelfs = useSelector((state: RootState) => state.shelf);
  const WAREHOUSE = useSelector((state: RootState) => state.warehouseSlice);
  const [isDisable, setIsDisable] = useState(false);

  const OPTIONS = [
    t("button.createdAtNewest"),
    t("button.createdAtOldest"),
    t("product.productNameAZ"),
    t("product.productNameZA"),
    t("product.productCostUp"),
    t("product.productCostDown"),
    t("product.productRetailUp"),
    t("product.productRetailDown"),
  ];

  const [sort, setSort] = useState(OPTIONS[0]);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [listFilter, setListFilter] = useState([
    {
      id: 0,
      displayName: t("product.productGroup"),
      value: true,
    },
    {
      id: 1,
      displayName: t("product.productGroupName"),
      value: true,
    },
    {
      id: 2,
      displayName: t("product.sell_price"),
      value: true,
    },
    {
      id: 3,
      displayName: t("product.costPrice"),
      value: true,
    },

    {
      id: 4,
      displayName: t("note"),
      value: true,
    },
    {
      id: 5,
      displayName: t("product.image"),
      value: true,
    },
  ]);

  const filterOptions = {
    productGroup: listFilter[0].value,
    productGroupName: listFilter[1].value,
    productImage: listFilter[5].value,
    sell_price: listFilter[2].value,
    costPrice: listFilter[3].value,
    note: listFilter[4].value,
  };

  const [dataInput, setDataInput] = useState<TProduct>({
    productId: "",
    productName: "",
    groupId: "",
    groupName: "",
    image: "",
    cost_price: null,
    sell_price: null,
    VAT: null,
    note: "",
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const onDeleteMultiProduct = async () => {
    if (selectedRows.length !== 0) {
      setLoading(true);
      selectedRows?.forEach(async (item) => {
        await deleteData({ id: item, table: "Product" });
        dispatch(deleteProduct({ productId: item }));
        const URL = PRODUCT.find((x) => x.productId === item)?.image;
        if (URL) {
          const refimg = ref(storage, URL);
          // Delete the file
          deleteObject(refimg);
        }
      });
      const tmp = PRODUCT.filter((p) => selectedRows.includes(p.productId));

      tmp.forEach((t) => {
        WAREHOUSE.forEach((w) => {
          w.listProduct.forEach(async (p) => {
            if (p.productName === t.productName) {
              const shelfID = GROUP.find(
                (g) => g.groupId === t.groupId
              ).shelfID;
              const shelf = shelfs.find((s) => s.shelfId === shelfID);
              if (shelfID) {
                dispatch(
                  updateShelf({
                    currentShelfId: shelfID,
                    newShelf: {
                      ...shelf,
                      currentQuantity: Math.max(
                        shelf?.currentQuantity ?? 0 - p.quantity,
                        0
                      ),
                    },
                  })
                );

                await updateData({
                  data: {
                    ...shelf,
                    currentQuantity: Math.max(
                      shelf?.currentQuantity ?? 0 - p.quantity,
                      0
                    ),
                  },
                  table: "Shelf",
                  id: shelfID,
                }).then(() => setLoading(false));
              }
            }
          });
        });
      });

      dispatch(deleteProductWarehouse({ products: tmp }));
      await info({
        message: "Delete Product",
        data: { products: tmp },
      });
      setOpen(false);
      setLoading(false);
      message.success(t("product.deleteProduct"));
      setSelectedRows([]);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("ROLE") === "Staff") setIsDisable(true);
  }, []);

  return (
    <Spin spinning={loading}>
      <div className="w-full">
        <div
          className="bg-white border-2 p-5 mx-1.5 my-1.5 rounded-md"
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div className=" flex items-center">
            <SearchComponent
              placeholder={t("product.searchByProduct")}
              setSearch={setSearch}
              search={search}
              style={{
                paddingTop: 9,
                paddingBottom: 9,
              }}
              outStyle={{ width: "100%" }}
            />

            <div style={{ width: 36 }} />
            <ListCheckBox
              listFilter={listFilter}
              setListFilter={setListFilter}
            />
            <ButtonComponent
              label={t("button.delete")}
              onClick={() => {
                console.log(selectedRows);
                if (selectedRows.length > 0) setOpen(true);
              }}
              backgroundColor={COLORS.checkbox_bg}
              style={{ marginInline: 12 }}
              disabled={isDisable}
            />
            <BtnExport
              fileName={
                t("export.reportProduct") +
                `_${new Date().toLocaleDateString("vi")}`
              }
              sheet={t("export.reportProduct")}
              tableRef={productRef}
            />
            <ButtonComponent
              label={t("product.addNewProduct")}
              onClick={() => setOpenAddForm(true)}
              iconLeft={<BiPlus size={20} color="white" />}
              disabled={isDisable}
            />
          </div>
          <div className="flex items-center my-2">
            <DropdownComponent
              value={sort}
              setValue={setSort}
              options={OPTIONS}
            />
          </div>

          <div style={{ width: "100%", margin: "20px auto auto auto" }}>
            <ProductTable
              productName={productName}
              filterOption={filterOptions}
              sort={{
                createdAtNewest: sort === OPTIONS[0],
                createdAtOldest: sort === OPTIONS[1],
                nameAscending: sort === OPTIONS[2],
                nameDescending: sort === OPTIONS[3],
                costAscending: sort === OPTIONS[4],
                costDescending: sort === OPTIONS[5],
                retailAscending: sort === OPTIONS[6],
                retailDescending: sort === OPTIONS[7],
              }}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              ref={productRef}
              setOpenAlert={setOpen}
            />
          </div>
        </div>
        <AddNewProduct
          openAddForm={openAddForm}
          setOpenAddForm={setOpenAddForm}
          data={dataInput}
          setData={setDataInput}
        />

        <AlertModal
          open={open}
          setOpen={setOpen}
          onConfirm={onDeleteMultiProduct}
        />
      </div>
    </Spin>
  );
}
