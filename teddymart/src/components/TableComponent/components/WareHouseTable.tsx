import { Button, Dropdown, MenuProps } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";
/**
 * Chưa thanh toán (Unpaid): Hóa đơn vẫn chưa được thanh toán hoặc chưa đến hạn thanh toán.

  Đã thanh toán (Paid): Hóa đơn đã được thanh toán đầy đủ hoặc theo một phần.

  Chờ xác nhận (Pending): Hóa đơn đã được tạo, nhưng chưa được xác nhận hoặc chưa được chấp nhận bởi người nhận.

  Quá hạn (Overdue): Hóa đơn đã đến hạn thanh toán và vẫn chưa được thanh toán.

  Hoàn trả (Refunded): Hóa đơn đã được hoàn trả hoặc trả lại tiền cho người mua hàng.

  Hủy bỏ (Canceled): Hóa đơn đã bị hủy bỏ và không còn hiệu lực.

  Giao dịch lỗi (Error): Có sự cố hoặc lỗi trong quá trình thanh toán, và hóa đơn đang ở trạng thái này để kiểm tra và xử lý sự cố.

  Chờ duyệt (Pending Approval): Hóa đơn cần được xem xét và duyệt bởi người quản lý hoặc bộ phận tài chính trước khi thanh toán.

  Chờ giao hàng (Awaiting Delivery): Hóa đơn đã được thanh toán, nhưng hàng hóa hoặc dịch vụ chưa được giao.

  Thành công (Success): Hóa đơn đã hoàn toàn thành công và đã được xử lý.
 */
type TStatus =
  | "Đã tạo đơn hàng"
  | "Chờ xác nhận"
  | "Đã xác nhận"
  | "Đang nhập"
  | "Hoàn thành"
  | "Chờ kiểm tra chất lượng"
  | "Hỏng hoặc lỗi"
  | "Chờ phân loại"
  | "Chờ đánh dấu giá"
  | "Đã phân loại"
  | "Chờ thanh toán"
  | "Đã thanh toán"
  | "Trả lại nhà cung cấp"
  | "Chờ kiểm kê"
  | "Hết hạn";
const COLOR_STATUS = new Map([
  ["Đã tạo đơn hàng", "#3498db"],
  ["Chờ xác nhận", "#9b59b6"],
  ["Đã xác nhận", "#2ecc71"],
  ["Đang nhập", "#e67e22"],
  ["Hoàn thành", "#27ae60"],
  ["Chờ kiểm tra chất lượng", "#f1c40f"],
  ["Hỏng hoặc lỗi", "#c0392b"],
  ["Chờ phân loại", "#34495e"],
  ["Chờ đánh dấu giá", "#8e44ad"],
  ["Đã phân loại", "#1abc9c"],
  ["Chờ thanh toán", "#d35400"],
  ["Đã thanh toán", "#3498db"],
  ["Trả lại nhà cung cấp", "#e74c3c"],
  ["Chờ kiểm kê", "#f39c12"],
  ["Hết hạn", "#e74c3c"],
]);
type TContent = {
  id: number;
  createdAt: Date;
  transaction_code: number;
  staff: string;
  delivery_partner: string;
  total: number;
  paid: number;
  quantity: number;
  remain: number;
  status: TStatus;
};
const CONTENT: TContent[] = [
  {
    id: 1,
    createdAt: new Date(),
    transaction_code: 12345,
    staff: "John Doe",
    delivery_partner: "DeliveryExpress",
    total: 1000,
    paid: 800,
    quantity: 5,
    remain: 200,
    status: "Đã tạo đơn hàng",
  },
  {
    id: 1,
    createdAt: new Date(),
    transaction_code: 12345,
    staff: "John Doe",
    delivery_partner: "DeliveryExpress",
    total: 1000,
    paid: 800,
    quantity: 5,
    remain: 200,
    status: "Đã tạo đơn hàng",
  },
];

const HEADER = [
  "NGÀY TẠO",
  "MÃ PHIẾU",
  "NHÂN VIÊN",
  "ĐỐI TÁC CHUYỂN",
  "ĐÃ THANH TOÁN",
  "TÊN BẢNG GIÁ",
  "SỐ LƯỢNG",
  "CÒN LẠI",
  "TRẠNG THÁI",
  "THAO TÁC",
];

const WareHouseTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleCheckBoxChange = (rowId: number) => {
    if (rowId === -1) {
      console.log("ok");
      if (selectedRows.length === 0) {
        setSelectedRows([...CONTENT.map((content) => content.id)]);
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
  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(e.target.value);
  };
  return (
    <div className="w-full">
      <table className="w-full border-collapse border border-gray-300 bg-gray-50">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2 text-xs">
              <input
                className="w-15 h-15 bg-hover"
                type="checkbox"
                onChange={() => handleCheckBoxChange(-1)}
              />
            </th>
            <th className="border border-gray-300 p-2 text-xs">#</th>
            {HEADER.map((header, index) => (
              <th key={index} className="border border-gray-300 p-2 text-xs">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center">
          {CONTENT.map((content, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">
                <input
                  className="w-15 h-15 bg-hover"
                  type="checkbox"
                  onChange={() => handleCheckBoxChange(content.id)}
                  checked={selectedRows.includes(content.id) ? true : false}
                />
              </td>
              <td className="border border-gray-300 p-2 text-sm">{index}</td>

              <td className="border border-gray-300 p-2 text-sm">
                {content.createdAt.toLocaleDateString("vi")}
              </td>
              <td className="border border-gray-300 p-2 text-sm">
                {content.transaction_code}
              </td>
              <td className="border border-gray-300 p-2 text-sm">
                {content.staff}
              </td>
              <td className="border border-gray-300 p-2 text-sm">
                {content.delivery_partner}
              </td>
              <td className="border border-gray-300 p-2 text-sm">
                {content.total}
              </td>
              <td className="border border-gray-300 p-2 text-sm">
                {content.paid}
              </td>
              <td className="border border-gray-300 p-2 text-sm">
                {content.quantity}
              </td>
              <td className="border border-gray-300 p-2 font-[500] text-sm">
                {content.remain}
              </td>
              <td
                className="border border-gray-300 p-2 font-[500] text-sm"
                style={{ color: COLOR_STATUS.get(content.status) }}
              >
                {content.status}
              </td>
              <td className="border border-gray-300 p-2 font-[500] text-sm gap-1">
                <Button className="mr-2">
                  <FiEdit />
                </Button>

                <Button>
                  <FiTrash color="red" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full text-left my-5 flex row justify-end pr-10 items-center ">
        <span className="text-sm mr-4 text-gray-400 ">Số mục mỗi trang:</span>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className=" bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500 focus:bg-white "
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>

        <div className="ml-4 flex items-center">
          <span className="text-sm text-gray-400  mr-4">0 trên 0</span>
          <Button>
            <HiOutlineChevronDoubleLeft />
          </Button>
          <div className="w-2" />
          <Button>
            <HiOutlineChevronLeft />
          </Button>
          <div className="w-2" />

          <Button>
            <HiOutlineChevronRight />
          </Button>
          <div className="w-2" />

          <Button>
            <HiOutlineChevronDoubleRight />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default WareHouseTable;
