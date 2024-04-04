import { useEffect, useRef, useState } from "react";
import TextInputComponent from "components/TextInputComponent";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { NAV_LINK } from "routes/components/NAV_LINK";
import { Button, Spin } from "antd";
import { getData, generateReport, generateProduct } from "controller/getData";
import { useDispatch } from "react-redux";
import { uploadVoucher } from "state_management/slices/voucherSlice";
import { uploadPartner } from "state_management/slices/partnerSlice";
import { uploadGroupProduct } from "state_management/slices/groupProductSlice";
import { uploadProduct } from "state_management/slices/productSlice";
import { uploadWarehouse } from "state_management/slices/warehouseSlice";
import { uploadOrder } from "state_management/slices/orderSlice";
import { uploadReport } from "state_management/slices/reportSlice";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import { uploadReportProduct } from "state_management/slices/reportProduct";
import {
  getDocs,
  collection,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "firebaseConfig";
import {
  signInWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { uploadManager } from "state_management/slices/managerSlice";
import { uploadShelf } from "state_management/slices/shelfSlice";
import {
  TNotification,
  updateNotifications,
} from "state_management/slices/notificationSlice";
import { uploadStaff } from "state_management/slices/staffSlice";
import Hotjar from "@hotjar/browser";

type Inputs = {
  userName: string;
  password: string;
};
const provider = new GoogleAuthProvider();
export default function LoginScreen() {
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    const userId = window.localStorage.getItem("USER_ID");
    if (userId) {
      navigate(NAV_LINK.REPORT);
    }
    setLoading(false);

    if (Hotjar.isReady()) {
      Hotjar.stateChange("/");
    }
  }, []);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onLogin: SubmitHandler<Inputs> = async (data) => {
    Hotjar.event("Login Screen --- Click Login");
    setLoading(true);
    const snapshot = await getDocs(collection(db, "Manager"));
    const user = snapshot.docs.find(
      (d) =>
        d.data().email === data.userName || d.data().userName === data.userName
    );
    if (!user) {
      setError("userName", {
        type: "custom",
        message: t("login.errUser"),
      });
      setLoading(false);
      return;
    }
    if (data.userName.includes("@")) {
      await signInWithEmailAndPassword(auth, data.userName, data.password)
        .then(async (userCredential) => {
          if (!userCredential.user.emailVerified) {
            setError("userName", {
              type: "custom",
              message: t("login.errVerify"),
            });
            return;
          }
          if (user.data().password !== data.password) {
            updateDoc(doc(db, "Manager", userCredential.user.uid), {
              password: data.password,
              emailVerified: true,
            }).then(async () => {
              await getDoc(doc(db, "Manager", userCredential.user.uid)).then(
                (d) => {
                  let { emailVerified, ...rest } = d.data();
                  dispatch(uploadManager(rest as TManager));
                }
              );
            });
          } else {
            await updateDoc(doc(db, "Manager", userCredential.user.uid), {
              emailVerified: true,
            });
            await getDoc(doc(db, "Manager", userCredential.user.uid)).then(
              (d) => {
                let { emailVerified, ...rest } = d.data();
                dispatch(uploadManager(rest as TManager));
              }
            );
          }
          await onFetchData(userCredential.user.uid);
          window.localStorage.setItem("USER_ID", userCredential.user.uid);
          Hotjar.identify("USER_ID", { email: data.userName });
          //console.log("login success");
        })
        .catch((e) => {
          setError("password", {
            type: "custom",
            message: t("login.wrongPassword"),
          });
          setLoading(false);
          console.log(e);
        });
    } else {
      await signInWithEmailAndPassword(auth, user.data().email, data.password)
        .then(async (userCredential) => {
          if (!userCredential.user.emailVerified) {
            setError("userName", {
              type: "custom",
              message: t("login.errVerify"),
            });
            return;
          }
          if (user.data().password !== data.password) {
            updateDoc(doc(db, "Manager", userCredential.user.uid), {
              password: data.password,
              emailVerified: true,
            }).then(async () => {
              await getDoc(doc(db, "Manager", userCredential.user.uid)).then(
                (d) => {
                  let { emailVerified, ...rest } = d.data();
                  dispatch(uploadManager(rest as TManager));
                }
              );
            });
          } else {
            await updateDoc(doc(db, "Manager", userCredential.user.uid), {
              emailVerified: true,
            });
            await getDoc(doc(db, "Manager", userCredential.user.uid)).then(
              (d) => {
                let { emailVerified, ...rest } = d.data();
                dispatch(uploadManager(rest as TManager));
              }
            );
          }
          await onFetchData(userCredential.user.uid);
          window.localStorage.setItem("USER_ID", userCredential.user.uid);
          Hotjar.identify("USER_ID", { email: data.userName });
        })
        .catch((e) => {
          setError("password", {
            type: "custom",
            message: t("login.wrongPassword"),
          });
          setLoading(false);
          console.log(e);
        });
    }
  };

  const onFetchData = async (userId: string) => {
    await Promise.all([
      getData(`/Manager/${userId}/Notification`).then((data: TNotification[]) =>
        dispatch(updateNotifications(data))
      ),
      getData(`/Manager/${userId}/Voucher`).then((data: TVoucher[]) =>
        dispatch(uploadVoucher(data))
      ),
      getData(`/Manager/${userId}/Shelf`).then((data: TShelf[]) =>
        dispatch(uploadShelf(data))
      ),
      getData(`/Manager/${userId}/Group_Product`).then(
        (data: TGroupProduct[]) => dispatch(uploadGroupProduct(data))
      ),
      new Promise((resolve) => {
        getData(`/Manager/${userId}/Product`).then((data: TProduct[]) => {
          dispatch(uploadProduct(data));
          resolve(data);
        });
      }),
      getData(`/Manager/${userId}/Partner`).then((data: TPartner[]) => {
        dispatch(uploadPartner(data));
      }),
      getData(`/Manager/${userId}/Staff`).then((data: TStaff[]) => {
        dispatch(uploadStaff(data));
      }),
      new Promise((resolve) => {
        getData(`/Manager/${userId}/Ware_House`).then((data: TWarehouse[]) => {
          dispatch(uploadWarehouse(data));
          resolve(data);
        });
      }),

      new Promise((resolve) => {
        getData(`/Manager/${userId}/Orders`, "createdAt").then(
          (data: TOrder[]) => {
            dispatch(uploadOrder(data));
            dispatch(uploadReport(generateReport(data)));
            resolve(data);
            //console.log(generateProduct(data));
          }
        );
      }),
    ]).then((values: any) => {
      dispatch(
        uploadReportProduct(
          generateProduct(values[7] as TOrder[], values[6] as TWarehouse[])
        )
      );
      setLoading(false);
      navigate(NAV_LINK.REPORT);
      reset();
    });
  };

  const onLoginGoogle = async () => {
    const auth = getAuth();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = await getDoc(doc(db, "Manager", result.user.uid));

        if (!user.data()) {
          navigate(`/signup/${result.user.uid}/${result.user.email}`);
        } else {
          setLoading(true);
          let { emailVerified, ...rest } = user.data();
          dispatch(uploadManager(rest as TManager));
          await onFetchData(result.user.uid);
          window.localStorage.setItem("USER_ID", result.user.uid);
        }
      })
      .catch((e) => {
        console.log("ERROR", e);
      })
      .finally(() => setLoading(false));
  };

  const buttonRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        // Enter key was pressed, handle the event here
        event.preventDefault();
        buttonRef.current.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

          <div className="border hidden md:flex border-gray-100"></div>

          <div className="md:w-1/2 w-full lg:w-1/2 p-5 ">
            <p className="text-center text-sidebar font-medium text-3xl mb-1">
              {t("login.login")}
            </p>
            <p className="text-center">{t("login.signInToManageStore")}</p>

            <form onSubmit={handleSubmit(onLogin)}>
              <div className="gap-y-1 mt-4">
                <TextInputComponent
                  label={t("login.userName")}
                  width={"100%"}
                  required={true}
                  register={register}
                  registerName="userName"
                />
                {errors.userName && (
                  <p className="text-xs text-red-500">
                    {errors.userName.message}
                  </p>
                )}
              </div>
              <div className="gap-y-1 mt-5">
                <TextInputComponent
                  label={t("login.password")}
                  width={"100%"}
                  required={true}
                  inputType={visible ? "text" : "password"}
                  icon={visible ? <AiFillEyeInvisible /> : <AiFillEye />}
                  onIconClick={() => {
                    console.log("Eye icon clicked");
                    setVisible(!visible);
                  }}
                  register={register}
                  registerName="password"
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col justify-center items-center gap-y-3 mt-4">
                <button
                  className="w-5/12 py-2 bg-sidebar text-white text-xl rounded-md hover:bg-hover"
                  onClick={() => onLogin}
                  ref={buttonRef}
                >
                  {t("login.login")}
                </button>
                <button
                  className="w-5/12 text-sidebar text-14"
                  onClick={() => navigate(NAV_LINK.FORGOT_PASSWORD)}
                >
                  {t("login.forgotpassword")}
                </button>

                <div className="flex justify-center gap-2 text-16 pt-2 pb-2">
                  <p>{t("login.newTeddyMart")}</p>
                  <button
                    className="text-sidebar font-medium"
                    onClick={() => navigate(NAV_LINK.SIGN_UP)}
                  >
                    {t("login.signUp")}
                  </button>
                </div>

                <Button onClick={onLoginGoogle}>
                  <div className="flex">
                    <img
                      src={
                        "https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png"
                      }
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: 10,
                      }}
                      alt="image"
                    />
                    <div>{t("login.loginWithGG")}</div>
                  </div>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Spin>
  );
}
