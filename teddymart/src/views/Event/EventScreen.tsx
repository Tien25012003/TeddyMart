import { message, Spin } from "antd";
import { AlertModal, ButtonComponent, SearchComponent } from "components";
import EventTable from "components/TableComponent/components/EventTable";
import { COLORS } from "constants/colors";
import { deleteData } from "controller/deleteData";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BiTrash } from "react-icons/bi";
import { TiPlus } from "react-icons/ti";
import { useDispatch } from "react-redux";
import { deleteEvent } from "state_management/slices/eventSlice";
import AddNewEvent from "./components/AddNewEvent";

const EventScreen = () => {
  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [dataInput, setDataInput] = useState<TEvent>({
    eventId: "",
    eventName: "",
    products: [],
    status: "NOT_START",
    endDate: new Date(),
    startDate: new Date(),
    discount: 0,
    maximumValue:0,
  });
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const onDeleteMultiWarranty = () => {
    if (selectedRows.length !== 0) {
      selectedRows.forEach(async (item) => {
        await deleteData({ id: item, table: "Event" });
        dispatch(deleteEvent({ eventId: item }));
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
              placeholder={t("event.searchByName")}
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
                iconLeft={<BiTrash size={20} color="white" />}
              />
              <ButtonComponent
                label={t("event.addNewEvent")}
                iconLeft={<TiPlus style={{ fontSize: 22 }} />}
                onClick={() => setOpenAddForm(true)}
              />
            </div>
          </div>

          <div style={{ width: "100%", margin: "20px auto auto auto" }}>
            <EventTable
              search={search}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              setOpenAlert={setOpen}
            />
          </div>
          <AddNewEvent
            data={dataInput}
            setData={setDataInput}
            open={openAddForm}
            setOpen={setOpenAddForm}
          />
          <AlertModal
            open={open}
            setOpen={setOpen}
            onConfirm={onDeleteMultiWarranty}
          />
        </div>
      </div>
    </Spin>
  );
};

export default EventScreen;
