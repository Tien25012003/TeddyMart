import { ButtonComponent, TextInputComponent } from "components";
import { COLORS } from "constants/colors";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { uploadManager } from "state_management/slices/managerSlice";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import { Spin } from "antd";

type Props = {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
};
type Inputs = {
  userName: string;
  email: string;
  shopName: string;
  phoneNumber: string;
  address: string;
};
export default function ChangeInfo({ openModal, setOpenModal }: Props) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const Info = useSelector((state: RootState) => state.manager);
  useEffect(() => {
    if (openModal === true) {
      setValue("shopName", Info.shopName);
      setValue("email", Info.email);
      setValue("userName", Info.userName ?? Info.staffName);
      setValue("phoneNumber", Info.phoneNumber);
      setValue("address", Info.address);
    }
  }, [openModal]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    await updateDoc(doc(db, `/Manager/${Info.userId}`), {
      ...Info,
      ...data,
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
        ...data,
      })
    );
  };
  if (openModal) {
    return (
      <Spin spinning={loading}>
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
              height: "90vh",
              minWidth: "300px",
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center justify-center flex-col w-full border-t py-5 px-6">
                <div className="mb-10 text-lg">
                  {t("profile.changeProfile")}
                </div>

                <div className="grid-cols-1 grid gap-6 w-[80%] mb-2">
                  <TextInputComponent
                    label={t("signUp.shopname")}
                    width={"100%"}
                    register={register}
                    registerName={"shopName"}
                    required={true}
                  />
                  <TextInputComponent
                    label={t("signUp.email")}
                    width={"100%"}
                    disabled={true}
                    register={register}
                    registerName={"email"}
                  />
                  <TextInputComponent
                    label={t("signUp.userName")}
                    width={"100%"}
                    register={register}
                    registerName={"userName"}
                    required={true}
                  />
                  <div>
                    <TextInputComponent
                      label={t("signUp.phoneNo")}
                      width={"100%"}
                      register={register}
                      registerName={"phoneNumber"}
                      pattern={{
                        value: /^(?:[0-9] ?){6,14}[0-9]$/,
                        message: t("signUp.errPhoneNumber"),
                      }}
                      required={true}
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  <TextInputComponent
                    label={t("signUp.address")}
                    width={"100%"}
                    register={register}
                    registerName={"address"}
                    required={true}
                  />
                </div>
                <div className="w-10" />

                <div className="flex justify-end w-[80%] mt-3">
                  <button
                    className="w-[20%] py-2 bg-btn_main_bg text-white rounded-md"
                    onClick={() => onSubmit}
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
      </Spin>
    );
  }
}
