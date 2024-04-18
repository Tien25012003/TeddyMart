import { useState, useRef, useMemo } from "react";
import ButtonComponent from "components/ButtonComponent";
import TextInputComponent from "components/TextInputComponent";
import { COLORS } from "constants/colors";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { useTranslation } from "react-i18next";
import { Modal, message } from "antd";
import { createID } from "utils/appUtils";
import {
  addNewPartner,
  updatePartner,
} from "state_management/slices/partnerSlice";
import { addData, updateData } from "controller/addData";
import { db, storage } from "firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

type Props = {
  opernAddNewSupplier: boolean;
  setOpernAddNewSupplier: (opernAddNewSupplier: boolean) => void;
  data?: TPartner;
  setData?: (data: TPartner) => void;
  isAdd?: boolean;
};

export default function AddNewSupplierForm({
  opernAddNewSupplier,
  setOpernAddNewSupplier,
  data,
  setData,
  isAdd = true,
}: Props) {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const selectedImageFile = event.target.files[0];
      const imageUrl = URL.createObjectURL(selectedImageFile);
      setSelectedImage(imageUrl);
      setData({
        ...data,
        certificate: imageUrl,
      });
    }
  };

  const { t } = useTranslation();
  const userId = localStorage.getItem('USER_ID')
  const dispatch = useDispatch();
  const onChange = (value: string, fieldName: string) => {
    setData({
      ...data,
      [fieldName]: value,
    });
  };

  const onAddNewSupplier = async () => {
    try {
      const trimmedName = data.partnerName.trim();
      const trimmedPhone = data.phoneNumber.trim();
      if (!trimmedName || !trimmedPhone) {
        message.warning(t("partner.fill"));
        return;
      }

      if (isAdd) {
        const partnerId = createID({ prefix: "P" });
        let certificateImageUrl = null;
        if (selectedImage) {
          const storageRef = ref(storage, `/Supplier/${partnerId}`);
          const selectedImageFile = await getImageFileFromUrl(selectedImage);
          await uploadBytes(storageRef, selectedImageFile);
          certificateImageUrl = await getDownloadURL(storageRef);
        }
        const newData: TPartner = {
          partnerId: partnerId,
          partnerName: data.partnerName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
          note: data.note,
          type: "Supplier",
          totalBuyAmount: +data.totalBuyAmount,
          debt: +data.debt,
          certificate: certificateImageUrl,
        };

        dispatch(addNewPartner(newData));
        addData({ data: newData, table: "Partner", id: partnerId });

        message.success(t("partner.addSuccess"));
        setOpernAddNewSupplier(false);
      } else {
        let newCertificateImageUrl = data.certificate;
        if (selectedImage) {
          const storageRef = ref(storage, `/Supplier/${data.partnerId}`);
          const selectedImageFile = await getImageFileFromUrl(selectedImage);
          await uploadBytes(storageRef, selectedImageFile);
          newCertificateImageUrl = await getDownloadURL(storageRef);
          //data.certificate = newCertificateImageUrl;
        }
        dispatch(
          updatePartner({
            partnerId: data.partnerId,
            newData: { ...data, certificate: newCertificateImageUrl },
          })
        );
        await updateData({ data: data, table: "Partner", id: data.partnerId });
        message.success(t("partner.updateSuccess"));
        setOpernAddNewSupplier(false);
      }
    } catch (error) {
      console.error("Error adding new supplier:", error);
    }
    setData({
      partnerId: "",
      partnerName: "",
      gender: "male",
      phoneNumber: "",
      email: "",
      address: "",
      debt: 0,
      totalBuyAmount: 0,
      certificate: "",
      note: "",
      type: "Supplier",
    });
    setSelectedImage("");
  };

  const getImageFileFromUrl = async (imageUrl: string): Promise<File> => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new File([blob], "selectedImageFile");
  };
  const backgroundColor = useMemo(
    () =>
      data.partnerName !== "" && data.phoneNumber !== ""
        ? COLORS.darkYellow
        : COLORS.defaultWhite,
    [data.partnerName, data.phoneNumber]
  );
  const color = useMemo(
    () =>
      data.partnerName !== "" && data.phoneNumber !== ""
        ? COLORS.defaultWhite
        : COLORS.lightGray,
    [data.partnerName, data.phoneNumber]
  );
  return (
    <Modal
      open={opernAddNewSupplier}
      onCancel={() => setOpernAddNewSupplier(false)}
      footer={false}
      title={
        <h1 className="pr-8 text-3xl">
          {isAdd ? t("partner.addNewSupplier") : t("partner.updateSupplier")}
        </h1>
      }
      width={"60%"}
    >
      <hr className="h-0.5 my-4 bg-black" />
      <div className="overflow-y-auto max-h-96">
        <table>
          <tbody>
            <tr>
              <td className="pr-8 py-6">
                <p>
                  {t("supplier.supplierName")}
                  <span className="text-red-600">*</span>
                </p>
              </td>
              <td>
                <TextInputComponent
                  placeHolder=""
                  width={"100%"}
                  value={data.partnerName}
                  setValue={(value) => onChange(value, "partnerName")}
                />
              </td>
            </tr>
            <tr>
              <td className="pr-8 py-6">
                <p>
                  {t("supplier.phoneNumber")}
                  <span className="text-red-600">*</span>
                </p>
              </td>
              <td>
                <TextInputComponent
                  placeHolder=""
                  width={"auto"}
                  value={data.phoneNumber}
                  setValue={(value) => onChange(value, "phoneNumber")}
                />
              </td>
            </tr>

            <tr>
              <td className="pr-8 py-6">
                <p>{t("supplier.email")}</p>
              </td>
              <td>
                <TextInputComponent
                  placeHolder=""
                  width={492}
                  value={data.email}
                  setValue={(value) => onChange(value, "email")}
                />
              </td>
            </tr>

            <tr>
              <td className="pr-8 py-6">
                <p>{t("supplier.address")}</p>
              </td>
              <td>
                <TextInputComponent
                  placeHolder=""
                  width={492}
                  value={data.address}
                  setValue={(value) => onChange(value, "address")}
                />
              </td>
            </tr>
            <tr>
              <td className="pr-8 py-6">
                <p>{t("supplier.totalBuyAmount")}</p>
              </td>
              <td>
                {isAdd ? (
                  <TextInputComponent
                    placeHolder="0"
                    width={"100%"}
                    value={data.totalBuyAmount.toString()==="0"?"":data.totalBuyAmount.toString()}
                    setValue={(value) => onChange(value, "totalBuyAmount")}
                  />
                ) : (
                  <span>{new Intl.NumberFormat().format(data.totalBuyAmount)}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="pr-8 py-6">
                <p>{t("supplier.debt")}</p>
              </td>
              <td>
                {isAdd ? (
                  <TextInputComponent
                    placeHolder="0"
                    width={"100%"}
                    value={data.debt.toString()==="0"?"":data.debt.toString()}
                    setValue={(value) => onChange(value, "debt")}
                  />
                ) : (
                  <span>{new Intl.NumberFormat().format(data.debt)}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="pr-8 py-6">
                <p>{t("supplier.note")}</p>
              </td>
              <td>
                <TextInputComponent
                  placeHolder=""
                  width={492}
                  value={data.note}
                  setValue={(value) => onChange(value, "note")}
                />
              </td>
            </tr>
            <tr>
              <td className="pr-8 py-6">
                <p>{t("supplier.certificate")}</p>
              </td>
              <td>
                <div
                  className="flex flex-col items-center border border-gray-300 rounded-lg w-fit h-fit px-10 py-4 cursor-pointer hover:bg-gray-300 active:bg-white"
                  onClick={() => fileInputRef.current.click()}
                >
                  {selectedImage || data.certificate ? (
                    <img
                      src={selectedImage || data.certificate}
                      alt="Selected"
                      style={{ width: "100%", maxHeight: "100px" }}
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <p className="text-6xl font-thin text-gray-400">+</p>
                      <p className="text-gray-400">
                        {t("supplier.uploadImage")}
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageSelected}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-x-4 mt-4">
        <ButtonComponent
          label={t("button.save")}
          backgroundColor={backgroundColor}
          color={color}
          onClick={onAddNewSupplier}
        />
        <ButtonComponent
          label={t("button.close")}
          backgroundColor={COLORS.defaultWhite}
          color={COLORS.extra_gray}
          onClick={() => setOpernAddNewSupplier(false)}
        />
      </div>
    </Modal>
  );
}
