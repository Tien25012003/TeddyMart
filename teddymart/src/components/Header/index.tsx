import TextComponent from "components/TextComponent";
import { HeaderProps } from "./props";
import {
  BiDotsVerticalRounded,
  BiSolidStar,
  BiMenu,
  BiNotification,
} from "react-icons/bi";
import DropdownImage from "components/DropDownImage";
import { useState, useEffect } from "react";
import { AiOutlineBell } from "react-icons/ai";
import { COLORS } from "constants/colors";
import { Avatar, Button, Card, Drawer, Dropdown, MenuProps } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import {
  toggleDrawer,
  toggleLanguage,
} from "state_management/slices/controlSlice";
import { useTranslation } from "react-i18next";
import Meta from "antd/es/card/Meta";
import { deleteNotifications } from "../../state_management/slices/notificationSlice";
import { deleteNotificationFirebase } from "../../utils/appUtils";

export default function Header({
  width = "100%",
  title = "Title",
}: HeaderProps) {
  //const [language, setLanguage] = useState("VI");
  const { openDrawer } = useSelector((state: RootState) => state.controlSlice);
  const notifications =
    useSelector((state: RootState) => state.notificationSlice) ?? [];
  const userId = localStorage.getItem('USER_ID')
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const language = useSelector(
    (state: RootState) => state.controlSlice
  ).language;
  const numberOfNotifications = notifications?.length;
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);
  console.log("notifications", notifications);
  const handleClearAllNotifications = async () => {
    const notificationIds = notifications.map(
      (notification) => notification.notiId
    );
    console.log("Dispatching deleteNotifications action...");
    dispatch(deleteNotifications([...notificationIds]));
    console.log("Deleting notifications from Firebase...");
    await deleteNotificationFirebase(notificationIds);
  };

  const items: MenuProps["items"] = [
    ...notifications?.slice(0, 2).map((notification, index) => ({
      key: index,
      label: <h1 className="text-base font-bold">{notification.title}</h1>,
      icon: <BiNotification size={24} />,
    })),

    {
      key: "4",
      label: (
        <h1
          className="text-base font-medium"
          style={{ color: "blue", textAlign: "center" }}
        >
          View All
        </h1>
      ),
      onClick: () => setOpen(!open),
    },

    {
      key: "5",
      label: (
        <h1
          className="text-base font-medium"
          style={{ color: "red", textAlign: "center" }}
          // onClick={handleClearAllNotifications}
        >
          Clear all
        </h1>
      ),
      onClick: () => handleClearAllNotifications(),
    },
  ];

  return (
    <div
      className="flex bg-white border-b items-center justify-between py-2 px-10"
      style={{ width }}
    >
      <div className="flex items-center">
        <button
          className="bg-txt_mediumgrey w-8 h-8 rounded-full items-center justify-center flex hover:bg-txt_lightgrey"
          onClick={() => dispatch(toggleDrawer())}
        >
          {!openDrawer ? (
            <BiDotsVerticalRounded color={COLORS.defaultWhite} />
          ) : (
            <BiMenu color={COLORS.defaultWhite} />
          )}
        </button>
        <TextComponent
          style={{ marginLeft: 10, letterSpacing: 0.8 }}
          fontSize={20}
          color={COLORS.extra_gray}
        >
          {title}
        </TextComponent>
      </div>
      <div className="flex items-center">
        <div style={{ marginRight: 20 }}>
          <DropdownImage
            options={[
              { image: require("assets/images/vn_flag.png"), title: "VI" },
              { image: require("assets/images/en_flag.png"), title: "EN" },
            ]}
            value={language}
            setValue={(e) => dispatch(toggleLanguage(e))}
            width={"15vw"}
          />
        </div>
        <Dropdown menu={{ items }}>
          <Button
            type="text"
            shape="circle"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 20,
            }}
          >
            <AiOutlineBell size={"22px"} color={COLORS.txt_mediumgrey} />
            <div
              className="absolute w-5 h-5 rounded-full bg-purple items-center flex justify-center text-10 text-white font-semibold hover:bg-light_purple"
              style={{ top: -5, right: -6 }}
            >
              {numberOfNotifications}
            </div>
          </Button>
        </Dropdown>
        {/* <Button
          onClick={() => {}}
          type="text"
          shape="circle"
          icon={<BiSolidStar size={"22px"} color={COLORS.checkbox_bg} />}
        /> */}
        <Drawer
          title={t("notification")}
          placement={"right"}
          width={500}
          onClose={() => setOpen(false)}
          open={open}
        >
          {notifications.map((notification, index) => (
            <Card
              key={index}
              style={{ width: "auto" }}
              className="mb-4"
              cover={
                <img
                  alt="example"
                  src={
                    notification.img ??
                    "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  }
                  style={{ height: 200 }}
                />
              }
            >
              <Meta
                avatar={
                  <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
                }
                title={notification.title}
                description={notification.subTitle}
              />
            </Card>
          ))}
        </Drawer>
      </div>
    </div>
  );
}
