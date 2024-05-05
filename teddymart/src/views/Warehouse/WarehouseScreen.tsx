import React from "react";
import { Header } from "components";
import { useTranslation } from "react-i18next";
import Card from "./components/Card";
import { FaBoxArchive, FaList, FaArrowRightToBracket } from "react-icons/fa6";
import { COLORS } from "constants/colors";
import { NAV_LINK } from "routes/components/NAV_LINK";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
export default function WarehouseScreen() {
  const { t } = useTranslation();
  const LISTS = [
    {
      title: t("warehouse.warehouse"),
      subTitle: t("warehouse.manageInventory"),
      icon: <FaBoxArchive color={COLORS.blue} size={30} />,
      link: NAV_LINK.WAREHOUSE_MANAGEMENT,
    },
    {
      title: t("warehouse.warehouseList"),
      subTitle: t("warehouse.manageList"),
      icon: <FaList color={COLORS.blue} size={30} />,
      link: NAV_LINK.WAREHOUSE_LIST,
    },
    localStorage.getItem("ROLE") !== "Staff" && {
      title: t("warehouse.importOrder"),
      subTitle: t("warehouse.manageImportOrder"),
      icon: <FaArrowRightToBracket color={COLORS.blue} size={30} />,
      link: NAV_LINK.IMPORT_ORDER,
    },
  ].filter(Boolean);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-extreme_lg_grey min-h-screen">
      {/* <Header width={"100%"} title={t("warehouse.warehouseManagement")} /> */}
      <div className="py-5 px-32 grid lg:grid-cols-2 md:gap-x-32 grid-cols-1 gap-y-10">
        {LISTS.map((l, i) => {
          return (
            <Card
              title={l.title}
              subTitle={l.subTitle}
              key={i}
              icon={l.icon}
              onClick={() => navigate(l.link)}
            />
          );
        })}
      </div>
    </div>
  );
}
