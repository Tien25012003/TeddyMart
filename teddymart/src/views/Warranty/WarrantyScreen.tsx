import { message, Spin } from "antd";
import { AlertModal, ButtonComponent, SearchComponent } from "components";
import WarrantyTable from "components/TableComponent/components/WarrantyTable";
import { COLORS } from "constants/colors";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BiTrash } from "react-icons/bi";
import { TiPlus } from "react-icons/ti";
import AddNewWarranty from "./components/AddNewWarranty";
import { deleteMultiOrder } from "state_management/slices/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { deleteData } from "controller/deleteData";
import {
  deleteMultiWarranty,
  deleteWarranty,
} from "state_management/slices/warrantySlice";

export default function WarrantyScreen() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [dataInput, setDataInput] = useState<TWarranty>({
    warrantyId: "",
    customerID: "",
    customerName: "",
    customerPhoneNumber: "",
    productId: "",
    productName: "",
    supplierID: "",
    reason: "",
    status: "REQUEST",
  });
  const dispatch = useDispatch();
  const WARRANTIES = useSelector((state: RootState) => state.warrantySlice);
  const onDeleteMultiWarranty = () => {
    if (selectedRows.length !== 0) {
      selectedRows.forEach(async (item) => {
        await deleteData({ id: item, table: "Warranty" });
        dispatch(deleteWarranty({ warrantyId: item }));
        setOpen(false);
      });
      message.success(t("warranty.deleteSuccess"));
      setSelectedRows([]);
    }
  };
  return (
    <Spin spinning={false}>
      <div className="w-full">
        <div
          className="bg-white border-2 p-5 mx-1.5 my-1.5 rounded-md"
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div className=" flex items-center justify-between">
            <SearchComponent
              placeholder={t("warranty.searchByID")}
              setSearch={setSearch}
              search={search}
              style={{
                paddingTop: 9,
                paddingBottom: 9,
              }}
              outStyle={{ width: "50%" }}
            />

            <div className="flex items-center">
              <ButtonComponent
                label={t("button.delete")}
                onClick={() => {
                  if (selectedRows.length > 0) setOpen(true);
                }}
                backgroundColor={COLORS.checkbox_bg}
                style={{ marginRight: 12 }}
                disabled={isDisable}
                iconLeft={<BiTrash size={20} color="white" />}
              />
              <ButtonComponent
                label={t("warranty.addNewWarranty")}
                onClick={() => setOpenAddForm(true)}
                iconLeft={<TiPlus style={{ fontSize: 22 }} />}
                disabled={isDisable}
              />
            </div>
          </div>
          <AlertModal
            open={open}
            setOpen={setOpen}
            onConfirm={onDeleteMultiWarranty}
          />
          <div style={{ width: "100%", margin: "20px auto auto auto" }}>
            <WarrantyTable
              search={search}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              setOpenAlert={setOpen}
            />
          </div>
        </div>

        <AddNewWarranty
          open={openAddForm}
          setOpen={setOpenAddForm}
          data={dataInput}
          setData={setDataInput}
        />
      </div>
    </Spin>
  );
}
