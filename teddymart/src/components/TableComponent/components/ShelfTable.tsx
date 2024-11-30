import { Button } from "antd";
import AlertModal from "components/AlertModal";
import { deleteData } from "controller/deleteData";
import { t } from "i18next";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiTrash } from "react-icons/fi";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { deleteShelf } from "state_management/slices/shelfSlice";
import { message } from "antd";
import AddNewShelf from "views/Shelf/components/AddNewShelf";
import { updateGroupProduct } from "state_management/slices/groupProductSlice";
import { updateData } from "controller/addData";
type TContent = {
  shelfId: string;
  shelfName: string;
  capacity: number;
  note: string;
};

type TOptions = {
  shelfId?: boolean;
  shelfName?: boolean;
  shelfCapacity: number;
  note?: boolean;
  currentQuantity?: boolean;
};

const ShelfTable = ({
  filterOption,
  search,
  selectedRows,
  setSelectedRows,
  setOpenAlert,
}: {
  filterOption?: TOptions;
  search: string;
  selectedRows: string[];
  setSelectedRows: (selectedRows: string[]) => void;
  setOpenAlert?: (openAlert: boolean) => void;
}) => {
  const { t } = useTranslation();
  const options: TOptions = {
    shelfId: true,
    shelfName: true,
    shelfCapacity: true,
    note: true,
    currentQuantity: true,
    ...filterOption,
  };
  const role = window.localStorage.getItem("ROLE");
  const HEADER = useMemo(
    () =>
      [
        options.shelfId && t("shelf.shelfId"),
        options.shelfName && t("shelf.shelfName"),
        options.shelfCapacity && t("shelf.capacity"),
        options.currentQuantity && t("product.numberOnShelf"),
        options.note && t("note"),
        role !== "Staff" && t("activities"),
      ].filter((value) => Boolean(value) !== false),
    [t]
  );
  const SHELF = useSelector((state: RootState) => state.shelf);
  const data = useMemo(() => {
    if (search !== "") {
      return SHELF.filter((s) => s.shelfName.includes(search));
    }
    return SHELF;
  }, [search, SHELF]);

  console.log("data", data);

  // const [selectedRows, setSelectedRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const maxPages = useMemo(
    () => Math.ceil(data.length / rowsPerPage),
    [rowsPerPage]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataInput, setDataInput] = useState<TShelf>({
    shelfId: "",
    shelfName: "",
    capacity: "",
    note: "",
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

  const onBackAll = () => {
    setCurrentPage(1);
  };
  const onBack = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const onForward = () => {
    if (currentPage < maxPages) setCurrentPage(currentPage + 1);
  };
  const onForwardAll = () => {
    setCurrentPage(maxPages);
  };
  const handleCheckBoxChange = (rowId: string) => {
    if (rowId === null) {
      //console.log("ok");
      if (selectedRows.length === 0) {
        setSelectedRows([...data.map((content) => content.shelfId)]);
        return;
      }
      setSelectedRows([]);
      return;
    }
    if (selectedRows.includes(rowId)) {
      setSelectedRows([...selectedRows.filter((id) => id !== rowId)]);
      return;
    }
    setSelectedRows([...selectedRows, rowId]);
  };

  const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(+e.target.value);
  };

  const onUpdate = (shelf: TShelf) => {
    setOpenModalUpdate(true);
    setDataInput({
      shelfId: shelf.shelfId,
      shelfName: shelf.shelfName,
      capacity: shelf.capacity.toString(),
      note: shelf.note,
    });
  };

  return (
    <div className="w-full">
      <div className="max-h-96 overflow-y-auto visible">
        <table className="w-full border-collapse border border-gray-300 bg-gray-50">
          <thead className="bg-gray-200 sticky left-0 z-50" style={{ top: -1 }}>
            <tr>
              <th className="border border-gray-300 p-2 text-xs">
                <input
                  className="w-15 h-15 bg-hover"
                  type="checkbox"
                  checked={
                    selectedRows.length === data.length &&
                    selectedRows.length !== 0
                  }
                  onChange={() => handleCheckBoxChange(null)}
                />
              </th>
              {HEADER.map((header, index) => (
                <th key={index} className="border border-gray-300 p-2 text-xs">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center">
            {data?.map((content, index) => {
              if (
                index < currentPage * rowsPerPage &&
                index >= (currentPage - 1) * rowsPerPage
              )
                return (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      <input
                        className="w-15 h-15 bg-hover"
                        type="checkbox"
                        onChange={() => handleCheckBoxChange(content.shelfId)}
                        checked={
                          selectedRows.includes(content.shelfId) ? true : false
                        }
                      />
                    </td>
                    {options.shelfId && (
                      <td className="border border-gray-300 p-2 text-sm">
                        {content.shelfId}
                      </td>
                    )}
                    {options.shelfName && (
                      <td className="border border-gray-300 p-2 text-sm">
                        {content.shelfName}
                      </td>
                    )}
                    {options.shelfCapacity && (
                      <td className="border border-gray-300 p-2 text-sm">
                        {content.capacity}
                      </td>
                    )}
                    {options?.currentQuantity && (
                      <td className="border border-gray-300 p-2 text-sm">
                        {content?.currentQuantity}
                      </td>
                    )}
                    {options.note && (
                      <td className="border border-gray-300 p-2 text-sm">
                        {content.note}
                      </td>
                    )}

                    {role !== "Staff" && (
                      <td className="border border-gray-300 p-2 font-[500] text-sm gap-1">
                        <Button
                          className="mr-2"
                          onClick={() => onUpdate(content)}
                        >
                          <FiEdit />
                        </Button>

                        <Button
                          onClick={() => {
                            setOpenAlert(true);
                            setSelectedRows([content.shelfId]);
                          }}
                        >
                          <FiTrash color="red" />
                        </Button>
                      </td>
                    )}
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>
      <div className="w-full text-left my-5 flex row justify-end pr-10 items-center ">
        <span className="text-sm mr-4 text-gray-400 ">{t("rowsPerPage")}</span>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className=" bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500 focus:bg-white "
        >
          <option value="5">5</option>
          <option value="10" selected>
            10
          </option>
          <option value="15">15</option>
        </select>

        <div className="ml-4 flex items-center">
          <span className="text-sm text-gray-400  mr-4">
            {currentPage} {t("on")} {maxPages}
          </span>
          <Button onClick={onBackAll}>
            <HiOutlineChevronDoubleLeft />
          </Button>
          <div className="w-2" />
          <Button onClick={onBack}>
            <HiOutlineChevronLeft />
          </Button>
          <div className="w-2" />

          <Button onClick={onForward}>
            <HiOutlineChevronRight />
          </Button>
          <div className="w-2" />

          <Button onClick={onForwardAll}>
            <HiOutlineChevronDoubleRight />
          </Button>
        </div>
      </div>

      <AddNewShelf
        openAddNewShelf={openModalUpdate}
        setOpenAddShelf={setOpenModalUpdate}
        isAdd={false}
        data={dataInput}
        setData={setDataInput}
      />
    </div>
  );
};
export default ShelfTable;
