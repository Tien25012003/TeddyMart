import { Space, DatePicker } from "antd";
import { SearchProps } from "antd/es/input/Search";
import {
  AlertModal,
  ButtonComponent,
  ListCheckBox,
  ModalSelectDate,
  SearchComponent,
} from "components";
import DropdownComponent from "components/DropdownComponent";
import { BillTable } from "components/TableComponent";
import TextInputComponent from "components/TextInputComponent";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiSearch, BiTrash, BiPlus } from "react-icons/bi";
import { BsFileExcel } from "react-icons/bs";
import { IoMdAlert } from "react-icons/io";
import { LiaFileExcel } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import {
  deleteMultiOrder,
  deleteOrder,
  updateOrder,
} from "state_management/slices/orderSlice";
import { IoAlertCircleOutline } from "react-icons/io5";
import AddForm from "./components/AddForm";
import SearchProductForm from "./components/SearchProductForm";
import AlertDelete from "./components/AlertDelete";
import { BtnExport } from "components";
import { deleteOrderFirebase } from "utils/appUtils";
import addNotification from "react-push-notification";
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
export default function SaleScreen() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [date, setDate] = useState<{ from: Date; to: Date }>();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const userId = localStorage.getItem('USER_ID')
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [openEdit, setOpenEdit] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
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

  useEffect(() => {
    if (localStorage.getItem("ROLE") === "Staff")
      setIsDisable(true);
  }, [])

  const [listFilter, setListFilter] = useState(initialFilter);
  const objectFilter = useMemo(() => {
    const resultObject: Record<string, boolean> = {};
    listFilter.forEach((value) => {
      resultObject[value.key] = value.value;
    });
    return resultObject;
  }, [listFilter]);

  const ORDERS = useSelector((state: RootState) => state.order);

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const onChange = (key: string) => {
    console.log(key);
  };

  const onDelete = () => {
    //console.log("delete");
    dispatch(deleteMultiOrder(selectedRows));

    const tmp = ORDERS.filter((o) => selectedRows.includes(o.orderId));

    dispatch({ type: DELETE_ORDER, payload: tmp });

    deleteOrderFirebase(selectedRows, userId);

    dispatch(
      updateProductWarehouse({
        userId: userId,
        listUpdate: tmp.map((t) => ({
          warehouseName: t.warehouseName,
          listProduct: t.listProduct,
        })),
        type: "Export",
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
        //console.log("KKKKK", tmp);
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
        console.log("ABC", tmp.totalPayment);
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
              style={{  backgroundColor: "#EA5A47", marginInline: 12 }}
              iconLeft={<BiTrash size={20} color="white" />}
              // isDisable= {isDisable}
            />

            <BtnExport
              fileName={
                t("export.reportExport") +
                `_${new Date().toLocaleDateString("vi")}`
              }
              sheet={t("export.reportExport")}
              tableRef={orderRef}
            />
            <ButtonComponent
              label={t("button.addNew")}
              onClick={() => {
                // addNotification({
                //   title: "Warning",
                //   subtitle: "HELLO",
                //   message: "HGOWDq",
                //   theme: "light",
                //   native: true,
                // });
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
                  t("sort.createdAtOldest"),
                  t("sort.createdAtNewest"),

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
            type="Export"
            setOpenEdit={setOpenEdit}
          />
        </Space>
      </body>
      {/*Modal add form */}
      <AddForm
        setOpenAddForm={setOpenAddForm}
        openAddForm={openAddForm}
        typeAdd="Export"
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
