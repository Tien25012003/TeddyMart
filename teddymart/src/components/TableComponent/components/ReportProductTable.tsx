import { Button } from "antd";
import React, { ChangeEvent, forwardRef, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";
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
  import?: boolean;
  export?: boolean;
  stock?: boolean;
};
type Props = {
  filterOption?: TOptions;
  date: D;
  search?: string;
};
const ReportProductTable = forwardRef<HTMLTableElement, Props>(
  ({ filterOption, date, search }: Props, ref) => {
    const { t } = useTranslation();
    const options: TOptions = {
      productId: true,
      productName: true,
      import: true,
      export: true,
      stock: true,
      ...filterOption,
    };
    const HEADER = useMemo(
      () =>
        [
          options.productId && t("product.ID"),
          options.productName && t("product.productName"),
          options.import && t("report.quantity"),
          options.export && t("report.revenue"),
          options.stock && t("report.profit"),
        ].filter((value) => Boolean(value) !== false),
      [t, options]
    );
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const PRODUCTS = useSelector((state: RootState) => state.reportProduct);

    const data = useMemo(() => {
      let tmp: TRProduct[] = [];
      PRODUCTS.forEach((p) => {
        if (
          new Date(p.date).getTime() > date.from.getTime() &&
          new Date(p.date).getTime() < date.to.getTime()
        ) {
          if (tmp.length === 0) {
            tmp = [...p.products];
          } else {
            p.products.forEach((item) => {
              let index = tmp.findIndex((t) => t.productId === item.productId);
              if (index) {
                tmp.push(item);
              } else {
                tmp[index].export += item.export;
                tmp[index].import += item.import;
                tmp[index].stock += item.import - item.export;
              }
            });
          }
        }
      });
      if (search !== "") {
        return tmp.filter((t) => t.productName.includes(search));
      }
      return tmp;
    }, [PRODUCTS, date, search]);

    //console.log("DATA", data);

    const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
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
                      {options.import && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.import}
                        </td>
                      )}
                      {options.export && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.export}
                        </td>
                      )}
                      {options.stock && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.stock}
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
            <option value="5">5</option>
            <option value="10" selected>
              10
            </option>
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
      </div>
    );
  }
);

export default ReportProductTable;
