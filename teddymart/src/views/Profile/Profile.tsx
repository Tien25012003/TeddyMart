import { Space } from "antd";
import { COLORS } from "constants/colors";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AiOutlineMail,
  AiOutlineShop,
  AiOutlinePhone,
  AiOutlineCamera,
  AiOutlineForm,
  AiOutlineUser,
} from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { ChangeInfo, ChangePassword } from "./components";
import { ButtonComponent } from "components";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { uploadManager } from "state_management/slices/managerSlice";
export default function Profile() {
  const { t } = useTranslation();
  const Info = useSelector((state: RootState) => state.manager);
  const [openProfile, setOpenProfile] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const onUpFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      //console.log("IMAGE", event.target.files[0]);
      const storageRef = ref(storage, `/Manager/${Info.userId}/`);
      uploadBytes(storageRef, event.target.files[0]).then((snapshot) => {
        //console.log("Uploaded a blob or file!");
        getDownloadURL(storageRef).then(async (url) => {
          await updateDoc(doc(db, `/Manager/${Info.userId}`), {
            photoURL: url,
          });
          dispatch(
            uploadManager({
              ...Info,
              photoURL: url,
            })
          );
        });
      });
    }
  };
  return (
    <div className="w-full py-2">
      <body className="bg-white border-2 p-5 m-1.5 rounded-md flex items-start justify-center">
        <Space direction="vertical" size={"large"} className="px-4 w-[60%]">
          <div className="flex flex-row items-center">
            <AiOutlineShop size={25} />
            <div className="w-32 ml-5">{t("signUp.shopname")}</div>
            <div>{Info.shopName}</div>
          </div>
          <div className="flex flex-row items-center">
            <AiOutlineMail size={25} />
            <div className="w-32 ml-5">{t("signUp.email")}</div>
            <div>{Info.email}</div>
          </div>
          <div className="flex flex-row items-center">
            <AiOutlineUser size={25} />
            <div className="w-32 ml-5">{t("signUp.userName")}</div>
            <div>{Info.userName ?? Info.staffName}</div>
          </div>
          <div className="flex flex-row items-center">
            <AiOutlinePhone size={25} />
            <div className="w-32 ml-5">{t("signUp.phoneNo")}</div>
            <div>{Info.phoneNumber}</div>
          </div>
          <div className="flex flex-row items-center">
            <IoLocationOutline size={25} />
            <div className="w-32 ml-5">{t("signUp.address")}</div>
            <div>{Info.address}</div>
          </div>
        </Space>

        <div className="flex ml-28 flex-col items-center">
          <div
            className="flex justify-center items-center border border-slate-400 relative mb-5"
            style={{ width: "100px", height: "100px", borderRadius: "100px" }}
          >
            {Info.photoURL ? (
              <img
                src={Info.photoURL}
                alt="User Photo"
                style={{ width: "90px", height: "90px", borderRadius: "90px" }}
              />
            ) : (
              <div className="text-xl font-semibold">
                {Info.shopName?.charAt(0).toLocaleUpperCase()}
              </div>
            )}

            <button
              onClick={() => fileRef?.current.click()}
              className="absolute bottom-0 right-0 flex items-center justify-center bg-light_grey "
              style={{ width: "30px", height: "30px", borderRadius: "30px" }}
            >
              <AiOutlineCamera color={COLORS.extra_gray} />
            </button>

            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={fileRef}
              style={{ display: "none" }}
              onChange={onUpFile}
            />
          </div>
          <div className="flex items-center">
            <div className="mr-2 font-semibold">{Info.shopName}</div>
            <button onClick={() => setOpenProfile(true)}>
              <AiOutlineForm color={COLORS.extra_gray} />
            </button>
          </div>
          <div className="h-4" />
          <ButtonComponent
            label={t("profile.changePassword")}
            onClick={() => setOpenPassword(true)}
            backgroundColor={COLORS.defaultWhite}
            color={COLORS.txt_mediumgrey}
          />
        </div>
      </body>
      <ChangeInfo openModal={openProfile} setOpenModal={setOpenProfile} />
      <ChangePassword openModal={openPassword} setOpenModal={setOpenPassword} />
    </div>
  );
}
