import { Button, Dropdown, Layout, MenuProps, Modal } from "antd";
import dayjs from "dayjs";
import {
  ForwardedRef,
  LegacyRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { BiDetail } from "react-icons/bi";
import { FiEdit, FiTrash } from "react-icons/fi";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import { deleteOrder } from "state_management/slices/orderSlice";
import ProductTable from "./ProductTable";
import { forwardRef } from "react";
import { deleteOrderFirebase } from "utils/appUtils";
import DropdownComponent from "components/DropdownComponent";
import TextComponent from "components/TextComponent";
import { Popover } from "antd";
import { SellerName } from "./SellerName";
type TStatus = "unpaid" | "paid";
const COLOR_STATUS = new Map([
  ["unpaid", "#FF0000"],
  ["paid", "#008000"],
]);
type TProduct = {
  productId: string;
  productName: string;
  quantity: number;
};

type ColOptions = {
  orderId?: boolean;
  createdAt?: boolean;
  partnerID?: boolean;
  partnerName?: boolean;
  receiver?: boolean;
  listProduct?: boolean;
  payment?: boolean;
  debt?: boolean;
  discount?: boolean;
  totalPayment?: boolean;
  voucherID?: boolean;
  seller?: boolean;
  status?: boolean;
  note?: boolean;
  activities?: boolean;
};
enum SORT {
  ORDER_INCREASE,
  ORDER_DECREASE,
  TIME_DECREASE,
  TIME_INCREASE,
  PAYMENT_INCREASE,
  PAYMENT_DECREASE,
}
export type TListProduct = {
  productId: string;
  quantity: number;
  productName: string;
};
type Props = {
  selectedRows?: string[];
  setSelectedRows?: (selectedRows: string[]) => void;
  filterOption?: ColOptions;
  startDate?: number;
  endDate?: number;
  search?: string;
  sort?: number;
  type: "Import" | "Export";
  setOpenAlertModal?: (openAlertModal: boolean) => void;
  setOpenEdit?: (openEdit: boolean) => void;
};
const BillTable = forwardRef<HTMLTableElement, Props>(
  (
    {
      filterOption,
      selectedRows = [],
      setSelectedRows,
      startDate,
      endDate,
      search,
      sort,
      setOpenAlertModal,
      type = "Export",
      setOpenEdit,
    }: Props,
    ref
  ) => {
    //console.log(search);
    const role = window.localStorage.getItem("ROLE");
    const { t } = useTranslation();
    const options = {
      orderId: true,
      createdAt: true,
      partnerID: true,
      partnerName: true,
      receiver: type === "Import",
      listProduct: true,
      payment: true,
      debt: true,
      discount: true,
      totalPayment: true,
      voucherID: true,
      seller: type === "Export",
      status: true,
      note: true,
      activities: role === "Staff" ? false : true,
      ...filterOption,
    };
    const bills = useSelector((state: RootState) => state.order);
    const userId = localStorage.getItem("USER_ID");
    const [tmpData, setTmpData] = useState(bills);
    const [openListProduct, setOpenListProduct] = useState(false);
    const [listProduct, setListProduct] = useState<TListProduct[]>([]);
    const bubbleSort = (
      orders: TOrder[],
      compare: (order_1: TOrder, order_2: TOrder) => boolean
    ) => {
      const length = orders.length;
      let tmpValue = [...orders];
      for (let i = 0; i < length; i++) {
        for (let j = 0; j < length - 1 - i; j++) {
          // refer to note below
          if (compare(tmpValue[j], tmpValue[j + 1])) {
            {
              [tmpValue[j], tmpValue[j + 1]] = [tmpValue[j + 1], tmpValue[j]];
            }
          }
        }
      }
      return tmpValue;
    };
    const filterData = () => {
      let tmp: TOrder[] = bills;
      if (startDate && endDate) {
        let tmp_1 = bills.filter(
          (order) =>
            new Date(order.createdAt).getTime() >= startDate &&
            new Date(order.createdAt).getTime() <= endDate
        );
        tmp = tmp_1;
      }
      if (search) {
        let tmp_1 = tmp.filter(
          (order) =>
            order.partnerName.includes(search) || order.orderId.includes(search)
        );
        tmp = tmp_1;
      }

      if (sort) {
        switch (sort) {
          case SORT.ORDER_INCREASE: {
            let tmp_1 = bubbleSort(
              tmp,
              (order_1, order_2) => order_1.orderId > order_2.orderId
            );
            tmp = tmp_1;
            break;
          }
          case SORT.ORDER_DECREASE: {
            let tmp_1 = bubbleSort(
              tmp,
              (order_1, order_2) => order_1.orderId < order_2.orderId
            );
            tmp = tmp_1;
            break;
          }
          case SORT.PAYMENT_DECREASE: {
            let tmp_1 = bubbleSort(
              tmp,
              (order_1, order_2) => order_1.payment < order_2.payment
            );
            tmp = tmp_1;
            break;
          }
          case SORT.PAYMENT_INCREASE: {
            let tmp_1 = bubbleSort(
              tmp,
              (order_1, order_2) => +order_1.payment > +order_2.payment
            );
            tmp = tmp_1;
            break;
          }
          case SORT.TIME_DECREASE: {
            let tmp_1 = bubbleSort(
              tmp,
              (order_1, order_2) =>
                new Date(order_1.createdAt).getTime() >
                new Date(order_2.createdAt).getTime()
            );
            tmp = tmp_1;
            break;
          }
          case SORT.TIME_INCREASE: {
            let tmp_1 = bubbleSort(
              tmp,
              (order_1, order_2) =>
                new Date(order_1.createdAt).getTime() <
                new Date(order_2.createdAt).getTime()
            );
            tmp = tmp_1;
            break;
          }
        }
      }

      if (type) {
        let tmp_1 = tmp.filter((order) => order.type === type);
        tmp = tmp_1;
      }
      setTmpData([...tmp]);
    };
    useEffect(() => {
      filterData();
    }, [bills, startDate, endDate, search, sort]);
    const HEADER = useMemo(
      () =>
        [
          options.orderId && t("sale.orderId"),
          options.createdAt && t("sale.createdAt"),
          options.partnerID && t("sale.customerId"),
          options.partnerName && t("sale.customerName"),
          options.receiver && t("sale.receiver"),
          options.listProduct && t("sale.listProduct"),
          options.payment && t("sale.payment"),
          options.debt && t("sale.debt"),
          options.discount && t("sale.discount"),
          options.totalPayment && t("sale.totalPayment"),
          options.voucherID && t("voucher.voucherID"),
          options.seller && t("sale.seller"),
          options.status && t("sale.status"),
          options.note && t("sale.note"),
          options.activities && t("activities"),
        ].filter((value) => Boolean(value) !== false),
      [t, options]
    );

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleCheckBoxChange = (rowId: string) => {
      if (rowId === null) {
        if (selectedRows.length < tmpData.length) {
          setSelectedRows(tmpData.map((value) => value.orderId));
          return;
        }
        if (selectedRows.length === tmpData.length) {
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
      setRowsPerPage(e.target.value);
    };
    const maxPages = useMemo(
      () => Math.ceil(bills.length / rowsPerPage),
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
    const onOpenListModal = (listProduct: TListProduct[]) => {
      setOpenListProduct(true);
      setListProduct(listProduct);
    };

    const isDisabledCheckbox = (createdTime: Date) => {
      const currentDate = new Date();
      if (
        createdTime.getDate() === currentDate.getDate() &&
        createdTime.getMonth() === currentDate.getMonth() &&
        createdTime.getFullYear() === currentDate.getFullYear()
      )
        return false;
      return true;
    };
    return (
      <div>
        <div className="max-h-96 overflow-y-auto visible">
          <table
            className="w-full border-collapse border border-gray-300 bg-gray-50 z-50"
            ref={ref}
          >
            <thead
              className="sticky left-0 z-50"
              style={{
                backgroundColor: "#F0EAEA",
                top: -1,
              }}
            >
              <tr>
                <th className="border border-gray-300 p-2 text-xs">
                  <input
                    className="w-15 h-15 bg-hover"
                    type="checkbox"
                    checked={
                      selectedRows.length === tmpData.length &&
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
              {tmpData.map((content, index) => {
                console.log("content order", content);
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
                          onChange={() => handleCheckBoxChange(content.orderId)}
                          checked={
                            selectedRows.includes(content.orderId)
                              ? true
                              : false
                          }
                          disabled={isDisabledCheckbox(
                            new Date(content.createdAt)
                          )}
                        />
                      </td>

                      {options.orderId && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.orderId}
                        </td>
                      )}
                      {options.createdAt && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {new Date(content.createdAt).toLocaleDateString("vi")}{" "}
                          {dayjs(content.createdAt).format("HH:mm:ss")}
                        </td>
                      )}
                      {options.partnerID && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.partnerId}
                        </td>
                      )}

                      {options.partnerName && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.partnerName}
                        </td>
                      )}
                      {options.receiver && (
                        <td className="border border-gray-300 p-2 text-sm">
                          <SellerName id={content.receiver} />
                        </td>
                      )}
                      {options.listProduct && (
                        <td className="border border-gray-300 p-2 text-sm">
                          <Button
                            onClick={() =>
                              onOpenListModal(content?.listProduct ?? [])
                            }
                          >
                            <BiDetail />
                          </Button>
                        </td>
                      )}
                      {options.payment && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {new Intl.NumberFormat().format(content.payment) }             
                        </td>
                      )}
                      {options.debt && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {new Intl.NumberFormat().format(content.debt)}
                        </td>
                      )}
                      {options.discount && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {new Intl.NumberFormat().format(content.discount)}
                        </td>
                      )}
                      {options.totalPayment && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {new Intl.NumberFormat().format(content.totalPayment)}
                        </td>
                      )}
                      {options.voucherID && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.type === "Export" ? content.voucherId : null}
                        </td>
                      )}
                      {options.seller && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.type === "Export" ? (
                            <SellerName id={content.seller} />
                          ) : null}
                        </td>
                      )}

                      {options.status && (
                        <td
                          className="border border-gray-300 p-2 font-[500] text-sm"
                          style={{ color: COLOR_STATUS.get(content.status) }}
                        >
                          {selectedRows?.includes(content.orderId) &&
                          content.status === "unpaid" ? (
                            <Popover
                              placement="bottom"
                              content={
                                <Button
                                  onClick={() => {
                                    setOpenEdit(true);
                                    setSelectedRows([content.orderId]);
                                  }}
                                >
                                  <div style={{ color: "#008000" }}>paid</div>
                                </Button>
                              }
                            >
                              <Button style={{ color: "#FF0000" }}>
                                {content.status}
                              </Button>
                            </Popover>
                          ) : (
                            // <DropdownComponent
                            //   value={content.status}
                            //   options={["paid", "unpaid"]}
                            //   setValue={() => {
                            //     setOpenEdit(true);
                            //     setSelectedRows([content.orderId]);
                            //   }}
                            //   width="10%"
                            // />
                            content.status
                          )}
                        </td>
                      )}
                      {options.note && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.note}
                        </td>
                      )}
                      {options.activities && (
                        <td className="border border-gray-300 p-2 font-[500] text-sm gap-1">
                          <div className="flex items-center justify-center">
                            {/* <Button>
                            <FiEdit />
                          </Button> */}

                            <Button
                              onClick={() => {
                                setSelectedRows([content.orderId]);
                                setOpenAlertModal(true);
                              }}
                            >
                              <FiTrash color="red" />
                            </Button>
                          </div>
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
            {t("rowsPerPage")}
          </span>
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
        {/*Modal Open Product */}
        <Modal
          open={openListProduct}
          onCancel={() => setOpenListProduct(false)}
          footer={false}
          width={"80%"}
        >
          <ProductTable
            filterOption={{ activities: false, quantity: true }}
            filterListProduct={listProduct}
            selectedRows={[]}
            setSelectedRows={() => {}}
          />
        </Modal>
      </div>
    );
  }
);
export default BillTable;
