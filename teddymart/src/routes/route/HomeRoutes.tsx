import { Header } from "components";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import { RootState } from "state_management/reducers/rootReducer";
import Chatbot from "views/Chatbot/Chatbot";
import Draft from "views/Draft/Draft";
import EventScreen from "views/Event/EventScreen";
import GroupProductScreen from "views/GroupProduct/GroupProductScreen";
import CustomerScreen from "views/Partner/CustomerScreen";
import StaffScreen from "views/Partner/StaffScreen";
import SupplierScreen from "views/Partner/SupplierScreen";
import ProductScreen from "views/Product/ProductScreen";
import Profile from "views/Profile/Profile";
import ReportScreen from "views/Report/Report";
import SaleScreen from "views/Sale/SaleScreen";
import ShelfScreen from "views/Shelf/ShelfScreen";
import VoucherScreen from "views/Voucher/VoucherScreen";
import {
  ImportOrder,
  Warehouse,
  WarehouseList,
} from "views/Warehouse/components";
import WarehouseScreen from "views/Warehouse/WarehouseScreen";
import WarrantyScreen from "views/Warranty/WarrantyScreen";
import Drawer from "../components/Drawer";

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
    {
      path: "event",
      element: <EventScreen />,
      name: t("header.event"),
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
