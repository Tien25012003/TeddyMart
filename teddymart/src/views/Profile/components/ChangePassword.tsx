import { ButtonComponent, TextInputComponent } from "components";
import { COLORS } from "constants/colors";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import { RootState } from "state_management/reducers/rootReducer";
import { getAuth, updatePassword } from "firebase/auth";
import { uploadManager } from "state_management/slices/managerSlice";

type Props = {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
};
type Inputs = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};
export default function ChangePassword({ openModal, setOpenModal }: Props) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [loading, setLoading] = useState(false);
  const Info = useSelector((state: RootState) => state.manager);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (Info.password !== data.oldPassword) {
      setError("oldPassword", {
        type: "custom",
        message: t("login.wrongPassword"),
      });
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "custom",
        message: t("signUp.errConfirm"),
      });
      return;
    }
    if (data.password.length < 9) {
      setError("password", {
        type: "custom",
        message: t("signUp.errPassword"),
      });
      return;
    }

    const user = getAuth().currentUser;

    setLoading(true);

    updatePassword(user, data.password)
      .then(() => {
        console.log("change password success", data.password, user);
      })
      .catch((e) => console.log(e));
    await updateDoc(doc(db, `/Manager/${Info.userId}`), {
      password: data.password,
    })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoading(false);
        setOpenModal(false);
        reset();
      });
    dispatch(
      uploadManager({
        ...Info,
        password: data.password,
      })
    );
  };
  if (openModal) {
    return (
      <div
        className="overlay fixed flex items-center justify-center inset-0"
        style={{ zIndex: 999 }}
      >
        <div
          className="absolute w-full h-full bg-black bg-opacity-75"
          onClick={() => setOpenModal(false)}
          style={{ zIndex: 1 }}
        />
        <div
          className="bg-white overflow-y-auto rounded"
          style={{
            zIndex: 2,
            width: "50vw",
            minWidth: "300px",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center justify-center flex-col w-full border-t py-5 px-6">
              <div className="mb-10">{t("profile.changePassword")}</div>
              <div className="grid-cols-1 grid gap-6 w-[80%] mb-2">
                <div>
                  <TextInputComponent
                    label={t("signUp.password")}
                    width={"100%"}
                    register={register}
                    registerName={"oldPassword"}
                    required={true}
                    inputType={visible3 ? "text" : "password"}
                    icon={
                      visible3 ? (
                        <AiFillEyeInvisible color={COLORS.extra_gray} />
                      ) : (
                        <AiFillEye color={COLORS.extra_gray} />
                      )
                    }
                    onIconClick={() => setVisible3(!visible3)}
                  />
                  {errors.oldPassword && (
                    <p className="text-xs text-red-500">
                      {errors.oldPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <TextInputComponent
                    label={t("signUp.newPass")}
                    width={"100%"}
                    register={register}
                    registerName={"password"}
                    required={true}
                    inputType={visible ? "text" : "password"}
                    icon={
                      visible ? (
                        <AiFillEyeInvisible color={COLORS.extra_gray} />
                      ) : (
                        <AiFillEye color={COLORS.extra_gray} />
                      )
                    }
                    onIconClick={() => setVisible(!visible)}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <TextInputComponent
                    label={t("signUp.confirmPassword")}
                    width={"100%"}
                    register={register}
                    registerName={"confirmPassword"}
                    inputType={visible2 ? "text" : "password"}
                    icon={
                      visible2 ? (
                        <AiFillEyeInvisible color={COLORS.extra_gray} />
                      ) : (
                        <AiFillEye color={COLORS.extra_gray} />
                      )
                    }
                    onIconClick={() => setVisible2(!visible2)}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-10" />
              <div className="flex justify-end w-[80%] mt-3">
                <button
                  className="w-[20%] py-2 bg-btn_main_bg text-white rounded-md"
                  onClick={() => onSubmit}
                  disabled={loading}
                >
                  {t("button.save")}
                </button>

                <div className="w-5" />
                <ButtonComponent
                  label={t("cancel")}
                  backgroundColor={COLORS.defaultWhite}
                  color={COLORS.txt_mediumgrey}
                  onClick={() => setOpenModal(false)}
                  style={{ width: "20%", justifyContent: "center" }}
                />
                <div className="w-2" />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
