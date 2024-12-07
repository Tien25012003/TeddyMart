import { Route, Routes } from "react-router-dom";
import SaleScreen from "views/Sale/SaleScreen";
import ProductScreen from "views/Product/ProductScreen";
import ReportScreen from "views/Report/Report";
import CustomerScreen from "views/Partner/CustomerScreen";
import SupplierScreen from "views/Partner/SupplierScreen";
import WarehouseScreen from "views/Warehouse/WarehouseScreen";
import Drawer from "../components/Drawer";
import Draft from "views/Draft/Draft";
import VoucherScreen from "views/Voucher/VoucherScreen";
import GroupProductScreen from "views/GroupProduct/GroupProductScreen";
import { useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import {
  ImportOrder,
  Warehouse,
  WarehouseList,
} from "views/Warehouse/components";
import { Header } from "components";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import Profile from "views/Profile/Profile";
import ShelfScreen from "views/Shelf/ShelfScreen";
import StaffScreen from "views/Partner/StaffScreen";
import Chatbot from "views/Chatbot/Chatbot";
import WarrantyScreen from "views/Warranty/WarrantyScreen";

export default function HomeRoutes() {
  const { openDrawer } = useSelector((state: RootState) => state.controlSlice);
  const { t } = useTranslation();

  const ROUTES = [
    { path: "sale", element: <SaleScreen />, name: t("header.sale") },
    { path: "product", element: <ProductScreen />, name: t("header.product") },
    { path: "report", element: <ReportScreen />, name: t("header.report") },
    {
      path: "customer",
      element: <CustomerScreen />,
      name: t("header.customer"),
    },
    {
      path: "supplier",
      element: <SupplierScreen />,
      name: t("header.supplier"),
    },
    {
      path: "staff",
      element: <StaffScreen />,
      name: t("header.staff"),
    },
    {
      path: "warehouse",
      element: <WarehouseScreen />,
      name: t("header.warehouse"),
    },
    {
      path: "warehouse/warehouseManagement",
      element: <Warehouse />,
      name: t("header.warehouseManagement"),
    },
    {
      path: "warehouse/warehouseList",
      element: <WarehouseList />,
      name: t("header.warehouseList"),
    },
    {
      path: "warehouse/importOrder",
      element: <ImportOrder />,
      name: t("header.importOrder"),
    },
    { path: "voucher", element: <VoucherScreen />, name: t("header.voucher") },
    { path: "draft", element: <Draft /> },
    {
      path: "shelf",
      element: <ShelfScreen />,
      name: t("header.shelf"),
    },
    {
      path: "groupProduct",
      element: <GroupProductScreen />,
      name: t("header.groupProduct"),
    },
    {
      path: "profile",
      element: <Profile />,
      name: t("header.profile"),
    },
    {
      path: "warranty",
      element: <WarrantyScreen />,
      name: t("header.warranty"),
    },
  ];

  const location = useLocation();
  const title = useMemo(
    () => ROUTES.find((r) => location.pathname.endsWith(r.path)).name,
    [location, t]
  );

  return (
    <div className="flex max-h-screen">
      <div
        className="fixed top-0 left-0 h-screen scrollbar-hide hidden md:block bg-sidebar overflow-y-auto"
        style={{
          width: !openDrawer ? "20%" : "7%",
        }}
      >
        <Drawer />
      </div>
      <div
        className={`transition-all ${
          openDrawer ? "duration-800" : "duration-0"
        } ease-in-out`}
        style={{
          width: !openDrawer ? "20%" : "7%",
        }}
      />
      <div
        className="w-fit"
        style={{
          width: !openDrawer ? "80%" : "93%",
        }}
      >
        <Header title={title} />
        <Routes>
          {ROUTES.map((route, i) => {
            return <Route path={route.path} element={route.element} key={i} />;
          })}
        </Routes>
      </div>
      <Chatbot />
    </div>
  );
}
