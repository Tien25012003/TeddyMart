import { Button } from "antd";
import { ChangeEvent, forwardRef, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiTrash } from "react-icons/fi";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
import WarrantyBadge from "views/Warranty/components/WarrantyBadge";

const SAMPLE_DATA: TWarranty[] = [
  {
    warrantyId: "1",
    customerID: "1",
    customerName: "Nguyễn Văn A",
    customerPhoneNumber: "0123456789",
    productId: "1",
    productName: "Sản phẩm test thử",
    supplierID: "1",
    reason: "Hư nắp",
    status: "FIXED",
  },
];

type Props = {
  search?: string;
  selectedRows: string[];
  setSelectedRows: (selectedRows: string[]) => void;
  setOpenAlert?: (openAlert: boolean) => void;
};

const WarrantyTable = forwardRef<HTMLTableElement, Props>(
  ({ search, selectedRows, setSelectedRows, setOpenAlert }, ref) => {
    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
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

    const HEADER = useMemo(
      () =>
        [
          t("warranty.warrantyId"),
          t("warranty.customerId"),
          t("warranty.customerName"),
          t("warranty.customerPhoneNumber"),
          t("warranty.productId"),
          t("warranty.productName"),
          t("warranty.supplierID"),
          t("warranty.reason"),
          t("warranty.status"),
          t("activities"),
        ].filter((value) => Boolean(value) !== false),
      [t]
    );

    // Change like shelf screen
    const WARRANTIES = useSelector((state: RootState) => state.warrantySlice);
    const data: TWarranty[] = useMemo(() => {
      let listWarranties = WARRANTIES;
      if (search) {
        listWarranties = listWarranties.filter((w) =>
          w.warrantyId.toLowerCase().includes(search.toLowerCase())
        );
      }
      return WARRANTIES;
    }, [WARRANTIES]);
    // const WARRANTIES = useSelector((state: RootState) => state.warrantySlice);

    // const data: TWarranty[] = useMemo(() => {
    //   let listWarranties = WARRANTIES;

    //   const isFixed = false;
    //   if (isFixed) {
    //     listWarranties = listWarranties.filter((w) => w.status === "FIXED");
    //   }

    //   if (search) {
    //     listWarranties = listWarranties.filter((w) =>
    //       w.warrantyId.toLowerCase().includes(search.toLowerCase())
    //     );
    //   }

    //   return listWarranties;
    // }, [WARRANTIES, search]);

    const maxPages = useMemo(
      () => Math.ceil(data.length / rowsPerPage),
      [rowsPerPage]
    );

    const handleCheckBoxChange = (rowId: string) => {
      if (rowId === null) {
        //console.log("ok");
        if (selectedRows.length === 0) {
          setSelectedRows([...data.map((content) => content.warrantyId)]);
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

    const onUpdate = (data: TWarranty) => {
      setOpenModalUpdate(true);
      setDataInput({
        warrantyId: data.warrantyId,
        customerID: data.customerID,
        customerName: data.customerName,
        customerPhoneNumber: data.customerPhoneNumber,
        productId: data.productId,
        productName: data.productName,
        supplierID: data.supplierID,
        reason: data.reason,
        status: data.status,
      });
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

    return (
      <div className="w-full">
        <div className="max-h-96 overflow-y-auto visible">
          <table className="w-full border-collapse border border-gray-300 bg-gray-50">
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
                      selectedRows.length === data.length &&
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
                          onChange={() =>
                            handleCheckBoxChange(content.warrantyId)
                          }
                          checked={
                            selectedRows.includes(content.warrantyId)
                              ? true
                              : false
                          }
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        {content.warrantyId}
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        {content.customerID}
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        {content.customerName}
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        {content.customerPhoneNumber}
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        {content.productId}
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        {content.productName}
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        {content.supplierID}
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        {content.reason}
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        <WarrantyBadge status={content.status} />
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        <div className="flex items-center gap-1 justify-center">
                          <Button onClick={() => onUpdate(content)}>
                            <FiEdit />
                          </Button>

                          <Button
                            onClick={() => {
                              setOpenAlert(true);
                              setSelectedRows([content.warrantyId]);
                            }}
                          >
                            <FiTrash color="red" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                return null;
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
      </div>
    );
  }
);

export default WarrantyTable;
