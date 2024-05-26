import React, { useEffect, useState } from "react";
import TextInputComponent from "components/TextInputComponent";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { NAV_LINK } from "routes/components/NAV_LINK";
import { useTranslation } from "react-i18next";
import { SubmitHandler, useForm } from "react-hook-form";
import { Spin } from "antd";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { db } from "firebaseConfig";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import { uploadManager } from "state_management/slices/managerSlice";
import { AlertModal } from "components";
import { createID } from "utils/appUtils";
type Inputs = {
  userName: string;
  email: string;
  password: string;
  shopName: string;
  phoneNumber: string;
  address: string;
};
export default function SignUpScreen() {
  const dispatch = useDispatch();
  const params = useParams();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const navigate = useNavigate();

  useEffect(() => {
    if (params) {
      setValue("email", params.email);
    }
  }, []);

  const onSignUp: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    if (!params.email) {
      console.log("Sign up with no params");
      const snapshot = await getDocs(
        query(collection(db, "Manager"), where("userName", "==", data.userName))
      );
      if (snapshot.size !== 0) {
        setError("userName", {
          type: "custom",
          message: t("signUp.errUserName"),
        });
        setLoading(false);
        return;
      } else {
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, data.email, data.password)
          .then(async (userCredential) => {
            sendEmailVerification(userCredential.user);
            await setDoc(doc(db, "Manager", userCredential.user.uid), {
              emailVerified: false,
              ...data,
              userId: userCredential.user.uid,
            });
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            setLoading(false);
            setOpen(true);
            // navigate(NAV_LINK.LOGIN);
            // reset();
          });
      }
    } else {
      await setDoc(doc(db, "Manager", params.userId), {
        ...data,
        email: params.email,
        emailVerified: true,
        photoURL: "",
        userId: params.userId,
        userName: "",
      })
        .then(async () => {
          reset();
          dispatch(
            uploadManager({
              ...data,
              email: params.email,
              photoURL: "",
              userId: params.userId,
              userName: "",
            })
          );
          window.localStorage.setItem("USER_ID", params.userId);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setLoading(false);
          navigate(NAV_LINK.SALE);
        });
    }
  };

  const onConfirm = () => {
    navigate(NAV_LINK.LOGIN);
    reset();
    setOpen(false);
  };

  return (
    <Spin spinning={loading}>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-t from-sidebar to-white">
        <div className="flex w-8/12 shadow-lg bg-white rounded-md p-2">
          <div className="w-1/2 flex-col justify-center items-center p-5 hidden md:flex">
            <img src={require("assets/images/logo.png")} alt="image" />
            <p className="pt-5 text-center text-sidebar font-medium text-2xl">
              {t("login.slogan")}
            </p>
          </div>

          <div className="border border-gray-100 hidden md:flex"></div>

          <div className="md:w-1/2 w-full py-5 px-2">
            <p className="text-center text-sidebar font-medium text-3xl">
              {t("signUp.signUp")}
            </p>
            <p className="py-2 text-center text-black text-14">
              {t("signUp.createAccount")}
            </p>

            <form onSubmit={handleSubmit(onSignUp)}>
              <div className="flex">
                <div className="w-full grid grid-cols-2 gap-y-7 py-2 gap-2">
                  {!params.email && (
                    <div>
                      <TextInputComponent
                        label={t("signUp.userName")}
                        width={"100%"}
                        required={true}
                        register={register}
                        registerName={"userName"}
                      />
                      {errors.userName && (
                        <p className="text-xs text-red-500">
                          {errors.userName.message}
                        </p>
                      )}
                    </div>
                  )}

                  {!params.email && (
                    <div>
                      <TextInputComponent
                        label={t("signUp.password")}
                        width={"100%"}
                        required={true}
                        inputType={visible ? "text" : "password"}
                        icon={visible ? <AiFillEyeInvisible /> : <AiFillEye />}
                        onIconClick={() => setVisible(!visible)}
                        register={register}
                        registerName="password"
                        minLength={{
                          value: 9,
                          message: t("signUp.errPassword"),
                        }}
                      />
                      {errors.password && (
                        <p className="text-xs text-red-500">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <TextInputComponent
                      label={t("signUp.email")}
                      disabled={params.email ? true : false}
                      width={"100%"}
                      required={true}
                      register={register}
                      registerName="email"
                      pattern={{
                        value:
                          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: t("signUp.errEmail"),
                      }}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <TextInputComponent
                      label={t("signUp.phoneNo")}
                      width={"100%"}
                      required={true}
                      register={register}
                      registerName="phoneNumber"
                      pattern={{
                        value: /^(?:[0-9] ?){6,14}[0-9]$/,
                        message: t("signUp.errPhoneNumber"),
                      }}
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  <TextInputComponent
                    label={t("signUp.shopname")}
                    width={"100%"}
                    required={true}
                    register={register}
                    registerName="shopName"
                  />
                  <TextInputComponent
                    label={t("signUp.address")}
                    width={"100%"}
                    required={true}
                    register={register}
                    registerName="address"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center items-center gap-y-3">
                <button
                  className="w-5/12 py-2 bg-sidebar text-white text-xl rounded-md hover:bg-hover"
                  onClick={() => onSignUp}
                >
                  {t("signUp.signUp")}
                </button>
              </div>
            </form>
            <div className=" flex flex-row gap-2 text-16 pt-5">
              <div className="self-center">
                <AiOutlineArrowLeft color="#217CA3" />
              </div>
              <button
                className="text-sidebar font-medium"
                onClick={() => navigate(NAV_LINK.LOGIN)}
              >
                {t("login.login")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <AlertModal
        open={open}
        setOpen={setOpen}
        onConfirm={onConfirm}
        title={t("signUp.emailConfirm")}
      />
    </Spin>
  );
}
