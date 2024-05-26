import { useNavigate, useLocation } from "react-router-dom";
import { NAV_LINK } from "./NAV_LINK";
import { useCallback, useState } from "react";
import {
  BsCart2,
  BsTruck,
  BsPeople,
  BsBox,
  BsBarChartLine,
  BsReverseLayoutTextSidebarReverse,
  BsCaretDownFill,
  BsFileEarmarkText,
  BsGift,
  BsPerson,
  BsBoxArrowInLeft,
  BsBoxes,
} from "react-icons/bs";
import { FaBarsProgress } from "react-icons/fa6";
import { BiBox } from "react-icons/bi";
import { MdOutlinePeople } from "react-icons/md";
import { Menu } from "antd";
import { useTranslation } from "react-i18next";
import { Divider } from "antd";
import { COLORS } from "constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { auth } from "firebaseConfig";
import { signOut } from "firebase/auth";
type DrawerItemProps = {
  name?: string;
  link?: string;
  icon1?: React.ReactNode;
  icon2?: React.ReactNode;
};

export type DrawerProps = DrawerItemProps & {
  subDrawer?: DrawerItemProps[];
};

export default function Drawer() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("/");
  const { openDrawer } = useSelector((state: RootState) => state.controlSlice);
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const Info = useSelector((state: RootState) => state.manager);
  const DRAWER_ITEM: DrawerProps[] = [
    {
      name: t("drawer.sale"),
      link: "",
      icon1: <BsCart2 size={25} />,
      icon2: <BsCaretDownFill size={15} color="white" />,
      subDrawer: [
        {
          name: t("drawer.order"),
          icon1: <BsFileEarmarkText size={20} />,
          link: NAV_LINK.SALE,
        },
        {
          name: t("drawer.voucher"),
          link: NAV_LINK.VOUCHER,
          icon1: <BsGift size={20} />,
        },
      ],
    },
    {
      name: t("drawer.partner"),
      link: "",
      icon1: <BsPeople size={25} />,
      icon2: <BsCaretDownFill size={15} />,
      subDrawer: [
        {
          name: t("drawer.customer"),
          link: NAV_LINK.CUSTOMER,
          icon1: <BsPerson size={20} />,
        },
        {
          name: t("drawer.supplier"),
          link: NAV_LINK.SUPPLIER,
          icon1: <BsTruck size={20} />,
        },
        localStorage.getItem("ROLE") !== "Staff" && {
          name: t("drawer.staff"),
          link: NAV_LINK.STAFF,
          icon1: <MdOutlinePeople size={20} />,
        } 
      ].filter(Boolean) as DrawerProps[],
    },
    {
      name: t("drawer.product"),
      link: "",
      icon1: <BsReverseLayoutTextSidebarReverse size={25} />,
      icon2: <BsCaretDownFill size={15} />,
      subDrawer: [
        {
          name: t("drawer.shelf"),
          link: NAV_LINK.SHELF,
          icon1: <FaBarsProgress size={20} />,
        },
        {
          name: t("drawer.groupProduct"),
          link: NAV_LINK.GROUP_PRODUCT,
          icon1: <BsBoxes size={20} />,
        },
        {
          name: t("drawer.product"),
          link: NAV_LINK.PRODUCT,
          icon1: <BsBox size={20} />,
        },
      ],
    },
    {
      name: t("drawer.warehouse"),
      link: NAV_LINK.WAREHOUSE,
      icon1: <BiBox size={25} />,
    },
    localStorage.getItem("ROLE") !== "Staff" &&{
      name: t("drawer.report"),
      link: NAV_LINK.REPORT,
      icon1: <BsBarChartLine size={25} />,
    },
    {
      name: t("drawer.signOut"),
      link: "SignOut",
      icon1: <BsBoxArrowInLeft size={25} />,
    },
  ].filter(Boolean) as DrawerProps[];

  const chooseColor = useCallback(
    (name: string, link: string) => {
      return currentTab === name || currentTab === link
        ? COLORS.primaryBlue
        : COLORS.defaultWhite;
    },
    [currentTab]
  );
  return (
    <div className="h-full justify-center">
      {/* Avatar */}
      <button
        className="flex flex-row px-5 mt-5 items-center text-txt_white gap-2"
        onClick={() => navigate(NAV_LINK.PROFILE)}
      >
        {Info.photoURL ? (
          <img
            src={Info.photoURL}
            alt="User Photo"
            style={{ width: "40px", height: "40px", borderRadius: "60px" }}
          />
        ) : (
          <div className="flex w-10 h-10 bg-hover rounded-full items-center justify-center ">
            {Info.shopName?.charAt(0).toUpperCase()}
          </div>
        )}

        {!openDrawer && (
          <div className="text-white text-lg">{Info.shopName}</div>
        )}
      </button>
      <Divider className="bg-slate-400" />
      <Menu
        expandIcon={<BsCaretDownFill size={15} color="white" />}
        theme="light"
        mode="inline"
        className={`bg-sidebar text-white`}
        inlineCollapsed={openDrawer}
        style={{ borderWidth: 0 }}
        onClick={(e) => {
          if (e.key === "SignOut") {
            signOut(auth).then(() => {
              console.log("log out success");
              navigate(NAV_LINK.LOGIN);
              dispatch({ type: "RESET_ALL_STORES" });
              window.localStorage.removeItem("USER_ID");
            });
          } else {
            navigate(e.key);
            setCurrentTab(e.key);
          }
        }}
        items={DRAWER_ITEM.map((d, i) => ({
          label: (
            <span
              style={{
                color: chooseColor(d.name, d.link),
              }}
            >
              {d.name}
            </span>
          ),
          key: d.link !== "" ? d.link : d.name,
          icon: (
            <p
              style={{
                color: chooseColor(d.name, d.link),
              }}
            >
              {d.icon1}
            </p>
          ),
          children: d.subDrawer?.map((s, index) => ({
            label: s.name,
            key: s.link,
            icon: s.icon1,
          })),
        }))}
      />
    </div>
  );
}
