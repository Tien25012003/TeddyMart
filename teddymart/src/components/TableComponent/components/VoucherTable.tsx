import { Button } from "antd";
import dayjs from "dayjs";
import { t } from "i18next";
import { ChangeEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiTrash } from "react-icons/fi";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { deleteVoucher } from "state_management/slices/voucherSlice";
import { deleteVoucherFirebase } from "utils/appUtils";
type TContent = {
  voucherId: string;
  discountAmount: number;
  expirationDate: string;
  publicDate: string;
  voucherName: string;
};
const CONTENT: TContent[] = [
  {
    voucherId: "V001",
    voucherName: "20/11",
    expirationDate: "2023-09-01",
    publicDate: "2023-09-01",
    discountAmount: 1000,
  },
  {
    voucherId: "V001",
    voucherName: "20/11",
    expirationDate: "2023-09-01",
    publicDate: "2023-09-01",
    discountAmount: 1000,
  },
];
type TOptions = {
  voucherID?: boolean;
  voucherName?: boolean;
  publicDate?: boolean;
  expirationDate?: boolean;
  discountAmount?: boolean;
};
const VoucherTable = ({
  filterOption,
  searchVoucherName,
  openEditForm,
  onDelete,
}: {
  filterOption?: TOptions;
  searchVoucherName?: string;
  openEditForm?: (voucher: TVoucher) => void;
  onDelete?: (open: boolean, voucherId: string) => void;
}) => {
  const { t } = useTranslation();
  const options: TOptions = {
    voucherID: true,
    voucherName: true,
    publicDate: true,
    expirationDate: true,
    discountAmount: true,
    ...filterOption,
  };
  const vouchers = useSelector((state: RootState) => state.voucherSlice);
  const role = window.localStorage.getItem("ROLE");
  const HEADER = useMemo(
    () =>
      [
        options.voucherID && t("voucher.voucherID"),
        options.voucherName && t("voucher.voucherName"),
        options.publicDate && t("voucher.publicDate"),
        options.expirationDate && t("voucher.expirationDate"),
        options.discountAmount && t("voucher.discountAmount"),
        role !== "Staff" && t("activities"),
      ].filter((value) => Boolean(value) !== false),
    [t, options]
  );
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const maxPages = useMemo(
    () => Math.ceil(vouchers.length / rowsPerPage),
    [rowsPerPage]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const handleCheckBoxChange = (rowId: string) => {
    if (rowId === null) {
      console.log("ok");
      if (selectedRows.length < vouchers.length) {
        setSelectedRows([...vouchers.map((content) => content.voucherId)]);
        return;
      }
      if (selectedRows.length === vouchers.length) {
        setSelectedRows([]);
        return;
      }
    }
    if (selectedRows.includes(rowId)) {
      setSelectedRows([...selectedRows.filter((id) => id !== rowId)]);
      return;
    }
    setSelectedRows([...selectedRows, rowId]);
  };
  const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    //console.log("okkkkk");
    setRowsPerPage(+e.target.value);
  };
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
  const onDeleteVoucher = (voucherId: string) => {};
  const voucherFilter = useMemo(() => {
    let listVouchers = [...vouchers];
    if (searchVoucherName) {
      let tmp = listVouchers.filter((value) =>
        value.voucherName
          .toLowerCase()
          .includes(searchVoucherName.toLowerCase())
      );
      listVouchers = tmp;
    }
    return listVouchers;
  }, [vouchers, searchVoucherName]);
  return (
    <div className="w-full">
      <div className="max-h-96 overflow-y-auto visible">
        <table className="w-full border-collapse border border-gray-300 bg-gray-50">
          <thead className="bg-gray-200 sticky left-0 z-50" style={{ top: -1 }}>
            <tr>
              {/* <th className="border border-gray-300 p-2 text-xs">
                <input
                  className="w-15 h-15 bg-hover"
                  type="checkbox"
                  checked={selectedRows.length === voucherFilter.length}
                  onChange={() => handleCheckBoxChange(null)}
                />
              </th> */}
              {HEADER.map((header, index) => (
                <th key={index} className="border border-gray-300 p-2 text-xs">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center">
            {voucherFilter.map((content, index) => {
              if (
                index < currentPage * rowsPerPage &&
                index >= (currentPage - 1) * rowsPerPage
              ) {
                return (
                  <tr key={index}>
                    {/* <td className="border border-gray-300 p-2">
                      <input
                        className="w-15 h-15 bg-hover"
                        type="checkbox"
                        onChange={() => handleCheckBoxChange(content.voucherId)}
                        checked={
                          selectedRows.includes(content.voucherId)
                            ? true
                            : false
                        }
                      />
                    </td> */}
                    <td className="border border-gray-300 p-2 text-sm">
                      {content.voucherId}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {content.voucherName}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {new Date(content.publicDate).toLocaleDateString("vi")}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {new Date(content.expirationDate).toLocaleDateString(
                        "vi"
                      )}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {content.discountAmount}%
                    </td>
                    {role !== "Staff" && (
                      <td className="border border-gray-300 p-2 font-[500] text-sm gap-1">
                        {/* <Button
      className="mr-2"
      onClick={() => openEditForm(content)}
    >
      <FiEdit />
    </Button> */}

                        <Button
                          onClick={() => onDelete(true, content.voucherId)}
                        >
                          <FiTrash color="red" />
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              }
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
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>

        <div className="ml-4 flex items-center">
          <span className="text-sm text-gray-400  mr-4">
            {currentPage} trên {maxPages}
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
    </div>
  );
};
export default VoucherTable;
