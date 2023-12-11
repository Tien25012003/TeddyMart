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
import { Divider, Modal, Space, message } from "antd";
import AddNewProduct from "./components/AddNewProduct";
import { deleteData } from "controller/deleteData";
import { deleteProduct } from "state_management/slices/productSlice";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "firebaseConfig";
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
  const OPTIONS = [
    t("product.productNameAZ"),
    t("product.productNameZA"),
    t("product.productPriceDown"),
    t("product.productPriceUp"),
  ];

  const [sort, setSort] = useState(OPTIONS[0]);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [listFilter, setListFilter] = useState([
    {
      id: 0,
      displayName: t("product.quantity"),
      value: false,
    },
    {
      id: 1,
      displayName: t("product.productGroup"),
      value: true,
    },
    {
      id: 2,
      displayName: t("product.productGroupName"),
      value: true,
    },
    {
      id: 3,
      displayName: t("product.sell_price"),
      value: true,
    },
    {
      id: 4,
      displayName: t("product.costPrice"),
      value: true,
    },

    {
      id: 5,
      displayName: t("note"),
      value: true,
    },
    {
      id: 6,
      displayName: t("product.image"),
      value: true,
    },
  ]);

  const filterOptions = {
    productGroup: listFilter[1].value,
    productGroupName: listFilter[2].value,
    productImage: listFilter[6].value,
    sell_price: listFilter[3].value,
    costPrice: listFilter[4].value,
    note: listFilter[5].value,
    quantity: listFilter[0].value,
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

  const dispatch = useDispatch();
  const onDeleteMultiProduct = () => {
    if (selectedRows.length !== 0) {
      selectedRows.forEach(async (item) => {
        await deleteData({ id: item, table: "Product" });
        dispatch(deleteProduct({ productId: item }));
        const URL = PRODUCT.find((x) => x.productId === item)?.image;
        if (URL) {
          const refimg = ref(storage, URL);
          // Delete the file
          deleteObject(refimg);
        }
      });
      setOpen(false);
      message.success(t("product.deleteProduct"));
    }
  };

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
          <ListCheckBox listFilter={listFilter} setListFilter={setListFilter} />
          <ButtonComponent
            label={t("button.delete")}
            onClick={() => {
              console.log(selectedRows);
              if (selectedRows.length > 0) setOpen(true);
            }}
            backgroundColor={COLORS.checkbox_bg}
            style={{ marginInline: 12 }}
          />
          <BtnExport fileName="Sheet1" sheet="sheet1" tableRef={productRef} />
          <ButtonComponent
            label={t("product.addNewProduct")}
            onClick={() => setOpenAddForm(true)}
            iconLeft={<BiPlus size={20} color="white" />}
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
              nameAscending: sort === OPTIONS[0],
              nameDescending: sort === OPTIONS[1],
              quantityAscending: sort === OPTIONS[2],
              quantityDescending: sort === OPTIONS[3],
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
  );
}
