import { Button } from "antd";
import React, { ChangeEvent, forwardRef, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
type TContent = {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
  profit: number;
};
// const CONTENT: TContent[] = [
//   {
//     productId: "12312das",
//     productName: "DO Nau Bep",
//     revenue: 13123,
//     profit: 12323,
//     quantity: 123,
//   },
//   {
//     productId: "12312das",
//     productName: "DO Nau Bep",
//     revenue: 13123,
//     profit: 12323,
//     quantity: 123,
//   },
//   {
//     productId: "12312das",
//     productName: "DO Nau Bep",
//     revenue: 13123,
//     profit: 12323,
//     quantity: 123,
//   },
//   {
//     productId: "12312das",
//     productName: "DO Nau Bep",
//     revenue: 13123,
//     profit: 12323,
//     quantity: 123,
//   },
//   {
//     productId: "12312das",
//     productName: "DO Nau Bep",
//     revenue: 13123,
//     profit: 12323,
//     quantity: 123,
//   },
//   {
//     productId: "12312das",
//     productName: "DO Nau Bep",
//     revenue: 13123,
//     profit: 12323,
//     quantity: 123,
//   },
//   {
//     productId: "12312das",
//     productName: "DO Nau Bep",
//     revenue: 13123,
//     profit: 12323,
//     quantity: 123,
//   },
//   {
//     productId: "12312das",
//     productName: "DO Nau Bep",
//     revenue: 13123,
//     profit: 12323,
//     quantity: 123,
//   },
//   {
//     productId: "12312das",
//     productName: "DO Nau Bep",
//     revenue: 13123,
//     profit: 12323,
//     quantity: 123,
//   },
//   {
//     productId: "12312das",
//     productName: "DO Nau Bep",
//     revenue: 13123,
//     profit: 12323,
//     quantity: 123,
//   },
// ];
type TOptions = {
  productId?: boolean;
  productName?: boolean;
  quantity?: boolean;
  revenue?: boolean;
  profit?: boolean;
};
type Props = {
  filterOption?: TOptions;
  data?: TReportProduct[];
};
const ReportProductTable = forwardRef<HTMLTableElement, Props>(
  ({ filterOption, data }: Props, ref) => {
    const { t } = useTranslation();
    const options: TOptions = {
      productId: true,
      productName: true,
      quantity: true,
      revenue: true,
      profit: true,
      ...filterOption,
    };
    const HEADER = useMemo(
      () =>
        [
          options.productId && t("product.ID"),
          options.productName && t("product.productName"),
          options.quantity && t("report.quantity"),
          options.revenue && t("report.revenue"),
          options.profit && t("report.profit"),
        ].filter((value) => Boolean(value) !== false),
      [t, options]
    );
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
      console.log("okkkkk");
      setRowsPerPage(+e.target.value);
    };
    const maxPages = useMemo(
      () => Math.round(data.length / rowsPerPage),
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
                      {options.productId && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.productId}
                        </td>
                      )}
                      {options.productName && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.productName}
                        </td>
                      )}
                      {options.quantity && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.quantity}
                        </td>
                      )}
                      {options.revenue && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.revenue}
                        </td>
                      )}
                      {options.profit && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.profit}
                        </td>
                      )}
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
        <div className="w-full text-left my-5 flex row justify-end pr-10 items-center ">
          <span className="text-sm mr-4 text-gray-400 ">Số mục mỗi trang:</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className=" bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500 focus:bg-white "
          >
            <option value="10">10</option>
            <option value="20" selected>
              20
            </option>
            <option value="50">50</option>
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
  }
);

export default ReportProductTable;
