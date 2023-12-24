import { Card, Divider, Modal, Space, Tooltip, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  ButtonComponent,
  DropdownComponent,
  TextInputComponent,
} from "components";
import { ProductTable } from "components/TableComponent";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiSearch } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { addNewOrder } from "state_management/slices/orderSlice";
import {
  addNotificationFirebase,
  addOrderFirebase,
  createID,
  updateProductFirebase,
} from "utils/appUtils";
import AddNewCustomerForm from "./AddNewCustomer";
import AddNewProduct from "views/Product/components/AddNewProduct";
import { ADD_ORDER } from "state_management/actions/actions";
import AddProductToMenu from "views/Warehouse/components/AddProductToMenu";
import { updateProductWarehouse } from "state_management/slices/warehouseSlice";
import addNotification from "react-push-notification";
import { addNotifications } from "state_management/slices/notificationSlice";
const CUS_INFO = {
  customerName: "NVA",
  gender: "Male",
  phoneNumber: 123123,
  totalBuyAmount: 123,
  email: "123123@gmail.com",
  debt: 0,
};
type ListProduct = {
  productId: string;
  productName: string;
  quantity: number;
};
const AddForm = ({
  openAddForm,
  setOpenAddForm,
  typeAdd,
}: {
  openAddForm: boolean;
  setOpenAddForm: (openAddForm: boolean) => void;
  typeAdd: "Import" | "Export";
}) => {
  const { t } = useTranslation();
  const listWarehouseName = useSelector(
    (state: RootState) => state.warehouseSlice
  ).map((value) => value.warehouseName);
  const vouchers = useSelector((state: RootState) => state.voucherSlice);
  const { userId } = useSelector((state: RootState) => state.manager);
  const warehouse = useSelector((state: RootState) => state.warehouseSlice);
  // const [sum, setSum] = useState(1000);
  const [productMenu, setProductMenu] = useState<TProduct[]>([]);
  const [warehouseName, setWarehouseName] = useState(listWarehouseName[0]);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [search, setSearch] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [voucher, setVoucher] = useState("");
  const [payment, setPayment] = useState("");
  const [note, setNote] = useState("");
  const [openAddCustomerForm, setOpenAddCustomerForm] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const getVoucherInfo = (voucherName: string) => {
    let item = vouchers.find((value) => value.voucherName === voucherName);
    return {
      discount: item?.discountAmount ?? 0,
      voucherId: item?.voucherId ?? "",
    };
  };
  const partners = useSelector((state: RootState) =>
    state.partnerSlice.filter((p) =>
      typeAdd === "Export" ? p.type === "Customer" : "Supplier"
    )
  );
  const warehouses = useSelector((state: RootState) => state.warehouseSlice);
  const discount = getVoucherInfo(voucher).discount;
  const voucherId = getVoucherInfo(voucher).voucherId;
  const dispatch = useDispatch();
  const customerInfo = useMemo(() => {
    let customer = partners.find((partner) =>
      partner.phoneNumber.includes(searchCustomer)
    );
    return customer;
  }, [searchCustomer]);

  const sum = useMemo(() => {
    if (typeAdd === "Export") {
      return productMenu.reduce(
        (pre, cur) => pre + cur.sell_price * cur.quantity,
        0
      );
    }
    return productMenu.reduce(
      (pre, cur) => pre + cur.cost_price * cur.quantity,
      0
    );
  }, [productMenu]);
  const onAddOrder = async () => {
    const listProduct = [
      ...productMenu.map((product) => ({
        productId: product.productId,
        productName: product.productName,
        quantity: product.quantity,
      })),
    ];
    console.log("LIST", listProduct);
    const y = new Date().getFullYear();
    const m = new Date().getMonth();
    const d = new Date().getDate();
    const createdAt = new Date(y, m, d, 0, 0, 0, 0);
    const orderId = createID({ prefix: "ORD" });
    const data: TOrder = {
      createdAt: createdAt.toISOString(),
      debt: sum - discount - +payment,
      discount: discount,
      listProduct: listProduct,
      note: note,
      orderId: orderId,
      partnerId: customerInfo.partnerId,
      partnerName: customerInfo.partnerName,
      payment: sum, ///
      seller: "TeddyMart",
      status: +payment === sum ? "paid" : "unpaid",
      totalPayment: +payment, ///
      type: typeAdd,
      voucherId: voucherId ?? "",
      receiver: "TeddyMart",
      warehouseName: warehouseName ?? "",
    };
    addOrderFirebase(data, userId, orderId);
    dispatch(addNewOrder(data));
    dispatch(
      updateProductWarehouse({
        userId: userId,
        listUpdate: [
          { warehouseName: warehouseName, listProduct: listProduct },
        ],
        type: typeAdd,
        isDelete: false,
      })
    );
    setProductMenu([]);
    setSelectedRows([]);
    message.success("Add Order Success");
    setOpenAddForm(false);
    dispatch({ type: ADD_ORDER, payload: data });
    setPayment("");
    setVoucher("");
  };
  const checkProductWarehouse = (warehouseName: string) => {
    console.log(productMenu);
    for (const item of productMenu) {
      const index = warehouse.findIndex(
        (w) => w.warehouseName === warehouseName
      );
      console.log("index", index);

      if (index > -1) {
        const index_product = warehouse[index].listProduct.findIndex(
          (product) => product.productId === item.productId
        );

        if (index_product > -1) {
          console.log(
            "condition",
            warehouse[index].listProduct[index_product].quantity -
              item.quantity,
            item.quantity,
            item
          );
          if (
            warehouse[index].listProduct[index_product].quantity +
              item.quantity * (typeAdd === "Import" ? 1 : -1) <
            5
          ) {
            const data = {
              notiId: "Noti" + Math.floor(Math.random() * 1000),
              img: "https://i.pinimg.com/564x/02/f8/da/02f8da32d01361bd68a1718fcbe6a537.jpg",
              title: "Warning",
              subTitle: `The ${item.productName} is up to out of stock in ${warehouse[index].warehouseName}`,
            };
            addNotification({
              title: "Warning",
              subtitle: `The ${item.productName} is up to out of stock in ${warehouse[index].warehouseName}`,
              theme: "light",
              native: true,
            });
            dispatch(
              addNotifications({
                notiId: "Noti" + Math.floor(Math.random() * 1000),
                img: "https://i.pinimg.com/564x/02/f8/da/02f8da32d01361bd68a1718fcbe6a537.jpg",
                title: "Warning",
                subTitle: `The ${item.productName} is up to out of stock in ${warehouse[index].warehouseName}`,
              })
            );
            addNotificationFirebase(data, userId);
          }
        }
      }
    }
  };

  return (
    <Modal
      title={<h1 className="text-2xl">{t("sale.addNewOrder")}</h1>}
      width={"70%"}
      open={openAddForm}
      onCancel={() => setOpenAddForm(false)}
      footer={false}
    >
      <Divider style={{ borderWidth: 1, borderColor: "#9A9A9A" }} />
      <Card
        title={
          <h1 className=" text-2xl">
            {typeAdd === "Export"
              ? t("sale.customerInfo")
              : t("sale.supplierInfo")}
          </h1>
        }
        bordered={true}
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: "#9A9A9A",
        }}
      >
        <div className="flex w-full items-center gap-4">
          <TextInputComponent
            width={"100%"}
            iconLeft={<BiSearch size={28} />}
            setValue={setSearchCustomer}
            placeHolder={t("sale.searchCusPhoneNumber")}
          />
          <ButtonComponent
            label={t("partner.addNewCustomer")}
            onClick={() => setOpenAddCustomerForm(true)}
          />
        </div>
        <div className="grid grid-cols-4 gap-3 my-5">
          <h1 className=" text-base font-medium">
            {t("partner.customerName")}
          </h1>
          <h1 className="text-base italic">{customerInfo?.partnerName}</h1>

          <h1 className=" text-base font-medium">{t("partner.gender")}</h1>
          <h1 className="text-base italic">{customerInfo?.gender}</h1>

          <h1 className=" text-base font-medium">{t("partner.phoneNumber")}</h1>
          <h1 className="text-base italic">{customerInfo?.phoneNumber}</h1>

          <h1 className=" text-base font-medium">
            {t("partner.totalBuyAmount")}
          </h1>
          <h1 className="text-base italic">{customerInfo?.totalBuyAmount}</h1>

          <h1 className=" text-base font-medium">{t("partner.email")}</h1>
          <h1 className="text-base italic">{customerInfo?.email}</h1>

          <h1 className=" text-base font-medium">{t("partner.debt")}</h1>
          <h1 className="text-base italic">{customerInfo?.debt}</h1>
        </div>
      </Card>
      <Card
        title={
          <Space>
            <h1 className=" text-2xl">{t("product.productInfo")}</h1>
            <DropdownComponent
              options={listWarehouseName}
              value={warehouseName}
              setValue={setWarehouseName}
            />
          </Space>
        }
        bordered={true}
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: "#9A9A9A",
          marginBlock: 12,
        }}
      >
        <div className="flex w-full items-center gap-4">
          <TextInputComponent
            width={"100%"}
            iconLeft={<BiSearch size={28} />}
            placeHolder={t("product.searchProduct")}
            setValue={setSearch}
            value={search}
            enterAction={() => {
              setOpenSearchModal(!openSearchModal);
            }}
          />
          {/* <ButtonComponent
            label={t("product.addNewProduct")}
            onClick={() => setOpenAddProductForm(true)}
          /> */}
        </div>
        <div className="my-5">
          <ProductTable
            filterOption={{
              productGroup: false,
              productGroupName: false,
              totalPrice: true,
              quantity: true,
              productImage: false,
              VAT: false,
              sell_price: typeAdd === "Export" ? true : false,
              activities: false,
              costPrice: typeAdd === "Import" ? true : false,
            }}
            productName={search}
            warehouseName={typeAdd === "Export" ? warehouseName : ""}
            data={productMenu}
            setData={setProductMenu}
            isEditQuantity={true}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            isExport={typeAdd === "Export"}
          />
        </div>
      </Card>
      {typeAdd === "Export" && (
        <Card
          title={<h1 className=" text-2xl">{t("voucher.voucherInfo")}</h1>}
          bordered={true}
          style={{
            width: "100%",
            borderWidth: 1,
            borderColor: "#9A9A9A",
            marginBlock: 12,
          }}
        >
          <DropdownComponent
            value={voucher}
            setValue={setVoucher}
            options={[...vouchers.map((voucher) => voucher.voucherName)]}
          />
        </Card>
      )}
      <Card
        title={<h1 className=" text-2xl">{t("voucher.note")}</h1>}
        bordered={true}
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: "#9A9A9A",
          marginBlock: 12,
        }}
      >
        <TextArea
          placeholder={t("voucher.placeholderNote")}
          rows={4}
          maxLength={150}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Card>
      <div className="flex items-centers">
        <div className="flex w-[100%]" />
        <div className=" grid grid-cols-2 gap-4 w-[30%] self-end">
          <Tooltip title="Payment = Sum(Total Price) ">
            <h1 className=" text-base font-medium">{t("sale.payment")}:</h1>
          </Tooltip>
          <h1 className=" text-base italic">${sum}</h1>

          <h1 className=" text-base font-medium">{t("sale.discount")}:</h1>
          <h1 className=" text-base italic">{discount}</h1>

          <Tooltip title={t("sale.tooltipPayment")}>
            <h1 className=" text-base font-medium">{t("sale.totalPrice")}:</h1>
          </Tooltip>
          <input
            className=" text-base italic"
            defaultValue={payment}
            placeholder="0"
            onChange={(e) => {
              setPayment(e.target.value);
            }}
          ></input>
          <h1 className=" text-base font-medium">{t("sale.debt")}:</h1>
          <h1 className=" text-base italic">{sum - discount - +payment}</h1>
        </div>
      </div>
      <div className=" flex justify-center items-center">
        <ButtonComponent
          label={t("button.addOrder")}
          onClick={() => {
            checkProductWarehouse(warehouseName);
            onAddOrder();
          }}
          paddingHorizontal={30}
          fontSize={26}
        />
      </div>
      <AddNewCustomerForm
        openAddNewCustomer={openAddCustomerForm}
        setOpenAddNewCustomer={setOpenAddCustomerForm}
      />
      {/* <AddNewProduct
        openAddForm={openAddProductForm}
        setOpenAddForm={setOpenAddProductForm}
      /> */}
      {/* <AddProductToMenu
        openMenu={openAddProductForm}
        setOpenMenu={setOpenAddProductForm}
        setProducts={setProductMenu}
      /> */}
    </Modal>
  );
};

export default AddForm;
