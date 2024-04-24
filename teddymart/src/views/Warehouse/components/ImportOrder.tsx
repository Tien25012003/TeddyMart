import { Button, Checkbox, Space, DatePicker } from "antd";
import Search, { SearchProps } from "antd/es/input/Search";
import {
  AlertModal,
  ButtonComponent,
  ListCheckBox,
  ModalSelectDate,
  SearchComponent,
} from "components";
import DropdownComponent from "components/DropdownComponent";
import { BillTable, ProductTable } from "components/TableComponent";
import ReportProductTable from "components/TableComponent/components/ReportProductTable";
import TextInputComponent from "components/TextInputComponent";
import { COLORS } from "constants/colors";
import { title } from "process";
import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiSearch, BiTrash, BiPlus } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import {
  deleteMultiOrder,
  updateOrder,
} from "state_management/slices/orderSlice";
import { IoAlertCircleOutline } from "react-icons/io5";
import AddForm from "views/Sale/components/AddForm";
import SearchProductForm from "views/Sale/components/SearchProductForm";
import AlertDelete from "views/Sale/components/AlertDelete";
import { BtnExport } from "components";
import { deleteOrderFirebase } from "utils/appUtils";
import AddProductToMenu from "./AddProductToMenu";
import { DELETE_ORDER, UPDATE_ORDER } from "state_management/actions/actions";
import { updateProductWarehouse } from "state_management/slices/warehouseSlice";
import { updateData } from "controller/addData";
const { RangePicker } = DatePicker;
const CUS_INFO = {
  customerName: "NVA",
  gender: "Male",
  phoneNumber: 123123,
  totalBuyAmount: 123,
  email: "123123@gmail.com",
  debt: 0,
};
export default function ImportOrder() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [date, setDate] = useState<{ from: Date; to: Date }>();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [products, setProducts] = useState<TProduct[]>([]);
  const userId = localStorage.getItem('USER_ID')
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const initialFilter = useMemo(
    () => [
      {
        displayName: t("sale.seller"),
        key: "seller",
        value: true,
      },
      {
        displayName: t("sale.status"),
        key: "status",
        value: true,
      },
      {
        displayName: t("sale.payment"),
        key: "payment",
        value: true,
      },
      {
        displayName: t("sale.debt"),
        key: "debt",
        value: true,
      },
      {
        displayName: t("sale.discount"),
        key: "discount",
        value: true,
      },
      {
        displayName: t("sale.note"),
        key: "note",
        value: true,
      },
      {
        displayName: t("sale.totalPayment"),
        key: "totalPayment",
        value: true,
      },
    ],
    [t]
  );

  const [listFilter, setListFilter] = useState(initialFilter);
  const [openEdit, setOpenEdit] = useState(false);
  const objectFilter = useMemo(() => {
    const resultObject: Record<string, boolean> = {};
    listFilter.forEach((value) => {
      resultObject[value.key] = value.value;
    });
    return resultObject;
  }, [listFilter]);

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const onChange = (key: string) => {
    console.log(key);
  };

  const ORDERS = useSelector((state: RootState) => state.order);

  const onDelete = () => {
    dispatch(deleteMultiOrder(selectedRows));
    deleteOrderFirebase(selectedRows, userId);

    const tmp = ORDERS.filter((o) => selectedRows.includes(o.orderId));
    dispatch({ type: DELETE_ORDER, payload: tmp });

    dispatch(
      updateProductWarehouse({
        userId: userId,
        listUpdate: tmp.map((t) => ({
          warehouseName: t.warehouseName,
          listProduct: t.listProduct,
        })),
        type: "Import",
        isDelete: true,
      })
    );
    setOpenAlertModal(false);
    setSelectedRows([]);
  };
  const orderRef = useRef(null);
  const onConfirm = async () => {
    if (selectedRows.length !== 0) {
      const tmp = ORDERS.find((o) => o.orderId === selectedRows[0]);
      if (tmp.status === "unpaid") {
        const newData: TOrder = {
          ...tmp,
          status: "paid",
          totalPayment: tmp.payment,
          debt: 0,
        };
        await updateData({ data: newData, table: "Orders", id: tmp.orderId });
        dispatch(
          updateOrder({
            currentOrder: tmp,
            newOrder: newData,
          })
        );
        setSelectedRows([]);
        setOpenEdit(false);
        dispatch({ type: UPDATE_ORDER, payload: tmp });
      }
    }
  };

  return (
    <div className="w-full">
      {/*Body */}
      <body
        className="bg-white border-2 p-5 m-1.5 rounded-md"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Space direction="vertical" size={10}>
          <ModalSelectDate setResult={setDate} />

          <div className=" flex items-center">
            <TextInputComponent
              value={search}
              setValue={setSearch}
              style={{ borderRadius: 5 }}
              outStyle={{ width: "100%", marginRight: 20 }}
              placeHolder={t("sale.placeholderSearch")}
              iconLeft={<BiSearch />}
            />

            <ListCheckBox
              listFilter={listFilter}
              setListFilter={setListFilter}
            />

            <ButtonComponent
              label={t("button.delete")}
              onClick={() => setOpenAlertModal(true)}
              style={{ backgroundColor: "#EA5A47", marginInline: 12 }}
              iconLeft={<BiTrash size={20} color="white" />}
            />

            <BtnExport
              fileName={
                t("export.reportImport") +
                `_${new Date().toLocaleDateString("vi")}`
              }
              sheet={t("export.reportImport")}
              tableRef={orderRef}
            />
            <ButtonComponent
              label={t("button.addNew")}
              onClick={() => {
                setOpenAddForm(true);
              }}
              iconLeft={<BiPlus size={20} color="white" />}
            />
          </div>
          <div className="flex items-center ">
            <Space direction="horizontal" size={10}>
              <DropdownComponent
                value={sort}
                setValue={setSort}
                options={[
                  t("sort.orderAscending"),
                  t("sort.orderDescending"),
                  t("sort.createdAtNewest"),
                  t("sort.createdAtOldest"),
                  t("sort.totalPaymentAscending"),
                  t("sort.totalPaymentDescending"),
                ]}
                isValueIndex={true}
              />
            </Space>
          </div>
          {/* <Tabs defaultActiveKey="1" items={items} onChange={onChange} /> */}
          <BillTable
            startDate={date?.from.getTime()}
            endDate={date?.to.getTime()}
            search={search}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            sort={+sort}
            filterOption={objectFilter}
            setOpenAlertModal={setOpenAlertModal}
            ref={orderRef}
            type="Import"
            setOpenEdit={setOpenEdit}
          />
        </Space>
      </body>
      {/*Modal add form */}
      <AddForm
        setOpenAddForm={setOpenAddForm}
        openAddForm={openAddForm}
        typeAdd="Import"
      />
      {/*Modal search product */}
      <SearchProductForm
        setOpenSearchModal={setOpenSearchModal}
        openSearchModal={openSearchModal}
      />

      {/*Modal Alert Delete */}
      <AlertDelete
        openAlertModal={openAlertModal}
        setOpenAlertModal={setOpenAlertModal}
        onDelete={onDelete}
      />

      <AlertModal
        open={openEdit}
        setOpen={setOpenEdit}
        onConfirm={onConfirm}
        title={t("warningSave")}
      />
    </div>
  );
}
