import { Button } from "antd";
import { ChangeEvent, forwardRef, useMemo, useState } from "react";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";
import { FiEdit, FiTrash } from "react-icons/fi";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { RootState } from "state_management/reducers/rootReducer";
import { useSelector } from "react-redux";
import AddNewCustomerForm from "views/Partner/Components/AddNewCustomer";
import AddNewSupplierForm from "views/Partner/Components/AddNewSupplier";
import AddNewStaffForm from "views/Partner/Components/AddNewStaff";

type TOptions = {
  id: boolean;
  staffName?: boolean;
  phoneNumber?: boolean;
  email?: boolean;
  address?: boolean;
  gender?: boolean;
  type?: boolean;
  salary?: boolean;
  note?: boolean;
};

type Props = {
  isCustomer?: boolean;
  filterOption?: TOptions;
  search?: string;
  additionalFilters?: any;
  resetTable?: boolean;
  minDate?: number;
  maxDate?: number;
  gender?: string; // gender should enum
  debtFrom?: number;
  debtTo?: number;
  totalPaymentFrom?: number;
  totalPaymentTo?: number;
  selectedRows: string[];
  setSelectedRows: (selectedRows: string[]) => void;
  setOpenAlert?: (openAlert: boolean) => void;
};
const StaffTable = forwardRef<HTMLTableElement, Props>(
  (
    {
      isCustomer = false,
      filterOption,
      additionalFilters,
      search = "",
      minDate,
      maxDate,
      gender,
      debtFrom,
      debtTo,
      totalPaymentFrom,
      totalPaymentTo,
      selectedRows,
      setSelectedRows,
      setOpenAlert,
    }: Props,
    ref
  ) => {
    const { t } = useTranslation();
    const PARTNERS = useSelector((state: RootState) => state.staffSlice);
    const DATA = useMemo(() => {
      let listPartners: TStaff[] = PARTNERS;
      if (search) {
        let tmp = listPartners.filter((p) =>
          p.staffName.toLowerCase().includes(search.toLowerCase())
        );
        listPartners = tmp;
      }
      if (minDate && maxDate) {
      }
      if (additionalFilters?.gender && additionalFilters?.gender !== "") {
        let tmp = listPartners.filter(
          (p) => p?.gender === additionalFilters?.gender
        );
        listPartners = tmp;
      }
      // if (
      //   additionalFilters?.debtBalanceFrom &&
      //   additionalFilters?.debtBalanceTo &&
      //   additionalFilters?.debtBalanceFrom !== "" &&
      //   additionalFilters?.debtBalanceTo !== ""
      // ) {
      //   let tmp = listPartners.filter(
      //     (p) =>
      //       p.salary >= Number(additionalFilters.debtBalanceFrom) &&
      //       p.salary <= Number(additionalFilters.debtBalanceTo)
      //   );
      //   listPartners = tmp;
      // }
      // if (
      //   additionalFilters?.totalPaymentFrom &&
      //   additionalFilters?.totalPaymentTo &&
      //   additionalFilters?.totalPaymentFrom !== "" &&
      //   additionalFilters?.totalPaymentTo !== ""
      // ) {
      //   let tmp = listPartners.filter(
      //     (p) =>
      //       p.debt >= Number(additionalFilters.totalPaymentFrom) &&
      //       p.debt <= Number(additionalFilters.totalPaymentTo)
      //   );
      //   listPartners = tmp;
      // }

      return listPartners;
    }, [
      PARTNERS,
      search,
      isCustomer,
      minDate,
      maxDate,
      gender,
      debtFrom,
      debtTo,
      totalPaymentFrom,
      totalPaymentTo,
      additionalFilters,
    ]);

    const options: TOptions = {
      id: true,
      staffName: true,
      gender: true,
      phoneNumber: true,
      email: true,
      address: true,
      salary: true,

      note: true,
      ...filterOption,
    };
    const HEADER = useMemo(
      () =>
        [
          options.id && t("staff.id"),
          options.staffName && t("staff.staffName"),
          options.gender && t("staff.gender"),
          options.phoneNumber && t("staff.phoneNumber"),
          options.email && t("staff.email"),
          options.address && t("staff.address"),
          options.salary && t("staff.salary"),
          options.note && t("note"),
          t("activities"),
        ].filter((value) => Boolean(value) !== false),
      [t, filterOption]
    );

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleCheckBoxChange = (rowId: string | null) => {
      if (rowId === null) {
        if (selectedRows.length === 0 || selectedRows.length < DATA.length) {
          setSelectedRows([...DATA.map((content) => content.userId)]);
        } else {
          setSelectedRows([]);
        }
        return;
      }

      if (selectedRows.includes(rowId)) {
        setSelectedRows([...selectedRows.filter((id) => id !== rowId)]);
      } else {
        setSelectedRows([...selectedRows, rowId]);
      }
    };

    const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(+e.target.value);
    };
    const maxPages = useMemo(
      () => Math.ceil(PARTNERS?.length / rowsPerPage),
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

    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [updateDataInput, setUpdateDataInput] = useState<TStaff>({
      userId: "",
      staffName: "",
      gender: "male",
      phoneNumber: "",
      email: "",
      address: "",
      salary: 0,
      note: "",
      type: "",
    });

    const onUpdate = (staff: TStaff) => {
      setUpdateModalVisible(true);
      setUpdateDataInput(staff);
    };
    console.log(DATA);
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
                      selectedRows.length === DATA.length &&
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
              {DATA?.map((content, index) => {
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
                          onChange={() => handleCheckBoxChange(content.userId)}
                          checked={
                            selectedRows.includes(content.userId) ? true : false
                          }
                        />
                      </td>
                      {options.id && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.userId}
                        </td>
                      )}

                      {options.staffName && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.staffName}
                        </td>
                      )}
                      {options.gender && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.gender}
                        </td>
                      )}
                      {options.phoneNumber && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.phoneNumber}
                        </td>
                      )}
                      {options.email && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.email}
                        </td>
                      )}
                      {options.address && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.address}
                        </td>
                      )}
                      {options.salary && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {new Intl.NumberFormat().format(content.salary)}
                        </td>
                      )}

                      {options.note && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content.note}
                        </td>
                      )}
                      <td className="border border-gray-300 p-2 font-[500] text-sm gap-1">
                        <div className="flex items-center gap-1 justify-center">
                          <Button onClick={() => onUpdate(content)}>
                            <FiEdit />
                          </Button>

                          <Button
                            onClick={() => {
                              setOpenAlert(true);
                              setSelectedRows([content.userId]);
                            }}
                          >
                            <FiTrash color="red" />
                          </Button>
                        </div>
                      </td>
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

        <AddNewStaffForm
          openAddNewStaff={updateModalVisible}
          setOpenAddNewStaff={setUpdateModalVisible}
          isAdd={false}
          data={updateDataInput}
          setData={setUpdateDataInput}
        />
      </div>
    );
  }
);
export default StaffTable;
