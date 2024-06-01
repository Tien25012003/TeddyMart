import { Button, Dropdown, MenuProps } from "antd";
import dayjs from "dayjs";
import { t } from "i18next";
import {
  useMemo,
  useState,
  useLayoutEffect,
  useRef,
  forwardRef,
  useCallback,
  useEffect,
} from "react";
import { useTranslation } from "react-i18next";
import { BiDetail } from "react-icons/bi";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";
import warehouseSlice, {
  uploadWarehouse,
} from "state_management/slices/warehouseSlice";
import { deleteWarehouse } from "state_management/slices/warehouseSlice";
import AddNewWarehouseList from "views/Warehouse/components/AddNewWarehouseList";
import { deleteData } from "controller/deleteData";
import AlertModal from "components/AlertModal";
import { message } from "antd";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "firebaseConfig";
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
type TListPRoduct = {
  productId: string;
  productName: string;
  quantity: number;
};
type TContent = {
  address: string;
  warehouseId: string;
  warehouseName: string;
};
const CONTENT: TContent[] = [
  {
    address: "123 Main Street, City, quantityry",
    warehouseId: "W001",
    warehouseName: "Nhà máy 1",
  },
  {
    address: "Dong Nai",
    warehouseId: "W002",
    warehouseName: "Nhà máy 2",
  },
  {
    address: "TP HCM",
    warehouseId: "W003",
    warehouseName: "Nhà máy 3",
  },
];
type TOption = {
  warehouseID?: boolean;
  warehouseName?: boolean;
  address?: boolean;
};
type TSort = {
  createdAtNewest?: boolean;
  createdAtOldest?: boolean;
  idAscending?: boolean;
  idDescending?: boolean;
  nameAZ?: boolean;
  nameZA?: boolean;
};
const options: TOption = {
  warehouseID: true,
  warehouseName: true,
  address: true,
};

type Props = {
  warehouseName?: string;
  sort?: TSort;
  selectedRows?: string[];
  setSelectedRows?: (selectedRows: string[]) => void;
  setOpenAlert?: (openAlert: boolean) => void;
};

const WareHouseTable = forwardRef<HTMLTableElement, Props>(
  (
    { warehouseName, sort, selectedRows, setSelectedRows, setOpenAlert }: Props,
    ref
  ) => {
    const { t } = useTranslation();
    const userId = window.localStorage.getItem("USER_ID");
    const dispatch = useDispatch();

    const q = query(collection(db, `/Manager/${userId}/Ware_House`));
    const unsubscribe = useCallback(
      () =>
        onSnapshot(q, (querySnapshot) => {
          console.log(querySnapshot.docs.map((value) => value.data()));
          dispatch(
            uploadWarehouse(
              querySnapshot.docs.map((value) => value.data()) as TWarehouse[]
            )
          );
        }),
      []
    );
    const warehouses = useSelector((state: RootState) => state.warehouseSlice);
    const role = localStorage.getItem("ROLE");

    const HEADER = useMemo(
      () => [
        options.warehouseID && t("warehouse.warehouseID"),
        options.warehouseName && t("warehouse.warehouseName"),
        options.address && t("warehouse.address"),
        role !== "Staff" && t("activities"),
      ],
      [t, options]
    );

    const warehouseSort = useMemo(() => {
      let warehouselist = [...warehouses];

      if (sort?.createdAtNewest) return warehouselist;

      if (sort?.createdAtOldest) return warehouselist.reverse();

      if (sort?.idAscending) {
        warehouselist.sort((a, b) =>
          a.warehouseId.localeCompare(b.warehouseId)
        );
      }
      if (sort?.idDescending) {
        warehouselist.sort((a, b) =>
          b.warehouseId.localeCompare(a.warehouseId)
        );
      }
      if (sort?.nameAZ) {
        warehouselist.sort((a, b) =>
          a.warehouseName.localeCompare(b.warehouseName)
        );
      }
      if (sort?.nameZA) {
        warehouselist.sort((a, b) =>
          b.warehouseName.localeCompare(a.warehouseName)
        );
      }

      if (warehouseName) {
        return warehouselist?.filter((item) =>
          item.warehouseName.toLowerCase().includes(warehouseName.toLowerCase())
        );
      }
      return warehouselist;
    }, [warehouseName, sort]);

    //const [selectedRows, setSelectedRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleCheckBoxChange = (rowId: string) => {
      if (rowId === null) {
        if (selectedRows.length < warehouseSort.length) {
          setSelectedRows([
            ...warehouseSort.map((content) => content.warehouseId),
          ]);
          return;
        }
        if (selectedRows.length === warehouseSort.length) {
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

    const handleRowsPerPageChange = (e: any) => {
      console.log(e.target.value);
      setRowsPerPage(+e.target.value);
    };
    const maxPages = useMemo(
      () => Math.ceil(warehouseSort.length / rowsPerPage),
      [rowsPerPage]
    );

    const [currentPage, setCurrentPage] = useState(1);

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

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataInput, setDataInput] = useState<TWarehouse>({
      warehouseId: "",
      warehouseName: "",
      address: "",
      listProduct: [],
      count: 0,
    });

    const onUpdate = (warehouse: TWarehouse) => {
      setOpenModalUpdate(true);
      setDataInput({
        warehouseId: warehouse.warehouseId,
        warehouseName: warehouse.warehouseName,
        address: warehouse.address,
        listProduct: warehouse.listProduct,
        count: warehouse.count,
      });
    };
    useEffect(() => {
      unsubscribe();
    }, []);
    return (
      <div className="w-full">
        <div className="max-h-96 overflow-y-auto visible">
          <table
            className="w-full border-collapse border border-gray-300 bg-gray-50"
            ref={ref}
          >
            <thead
              className="bg-gray-200 sticky left-0 z-50"
              style={{ top: -1 }}
            >
              <tr>
                <th className="border border-gray-300 p-2 text-xs">
                  <input
                    className="w-15 h-15 bg-hover"
                    type="checkbox"
                    checked={
                      selectedRows.length === warehouseSort.length &&
                      selectedRows.length !== 0
                    }
                    onChange={() => handleCheckBoxChange(null)}
                  />
                </th>
                {HEADER.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 p-2 text-xs"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-center">
              {warehouseSort.map((content, index) => {
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
                          onChange={() =>
                            handleCheckBoxChange(content.warehouseId)
                          }
                          checked={
                            selectedRows.includes(content.warehouseId)
                              ? true
                              : false
                          }
                        />
                      </td>

                      {options.warehouseID && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.warehouseId}
                        </td>
                      )}
                      {content.warehouseName && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.warehouseName}
                        </td>
                      )}
                      {content.address && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.address}
                        </td>
                      )}
                      {/* NÚT XÓA VÀ SỬA */}
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
                              setSelectedRows([content.warehouseId]);
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
          <span className="text-sm mr-4 text-gray-400 ">
            {t("rowsPerPage")}:
          </span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className=" bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500 focus:bg-white "
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
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

        <AddNewWarehouseList
          openAddNewWarehouse={openModalUpdate}
          setOpenAddNewWarehouse={setOpenModalUpdate}
          isAdd={false}
          data={dataInput}
          setData={setDataInput}
        />
      </div>
    );
  }
);
export default WareHouseTable;
