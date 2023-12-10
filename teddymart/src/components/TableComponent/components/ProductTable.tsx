import { Button, Space, Tooltip, message } from "antd";
import { t } from "i18next";
import { ChangeEvent, forwardRef, useEffect, useMemo, useState } from "react";
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
import { TListProduct } from "./BillTable";
import { deleteProduct } from "state_management/slices/productSlice";
import AlertModal from "components/AlertModal";
import { deleteData } from "controller/deleteData";
import { storage } from "firebaseConfig";
import { deleteObject, ref } from "firebase/storage";
import AddNewProduct from "views/Product/components/AddNewProduct";
export type Input = {
  productId: string,
  productName: string,
  groupId: string,
  groupName: string,
  image: string,
  cost_price: number,
  sell_price: number,
  VAT: number,
  note: string,
}


type TContent = {
  productId: string;
  productName: string;
  groupId: string;
  groupName: string;
  image?: string;
  sell_price: number;
  cost_price?: number;
  VAT?: number;
  note?: string;
  quantity?: number;
  totalPrice?: number;
  price?: number;
};

type TOptions = {
  productId?: boolean;
  productName?: boolean;
  productGroup?: boolean;
  productGroupName?: boolean;
  productImage?: boolean;
  sell_price?: boolean;
  costPrice?: boolean;
  VAT?: boolean;
  note?: boolean;
  quantity?: boolean;
  totalPrice?: boolean;
  activities?: boolean;
  price?: boolean;
};

type TSort = {
  nameAscending?: boolean;
  nameDescending?: boolean;
  quantityAscending?: boolean;
  quantityDescending?: boolean;
};

type Props = {
  filterOption?: TOptions;
  warehouseName?: string;
  selectedRows?: string[];
  setSelectedRows?: (selectedRow: string[]) => void;
  productName?: string;
  productGroup?: string;
  sort?: TSort;
  filterListProduct?: TListProduct[];
  isEditQuantity?: boolean;
  setProducts?: (products: TProduct[]) => void;
  data?: TProduct[];
  setData?: (data: TProduct[]) => void;
  isExport?: boolean;
  selectedRows?: string[];
  setSelectedRows?: (selectedRows: string[]) => void;
};
const ProductTable = forwardRef<HTMLTableElement, Props>(
  (
    {
      filterOption,
      warehouseName,
      selectedRows,
      setSelectedRows,
      productName,
      productGroup,
      selectedRows,
      setSelectedRows,
      sort,
      filterListProduct,
      isEditQuantity = false,
      setProducts,
      data,
      setData,
      isExport = true,
    }: Props,
    reference
  ) => {
    const { t } = useTranslation();
    const products = useSelector((state: RootState) => state.product);
    const warehouses = useSelector((state: RootState) => state.warehouseSlice);
    const dispatch = useDispatch();
    const idSelected = useRef<string>("");
    const [dataInput, setDataInput] = useState<TProduct>({
      productId: "",
      productName: "",
      groupId: "",
      groupName: "",
      image: "",
      cost_price: null,
      sell_price: null,
      VAT: null,
      note: "",
    });
    const [open, setOpen] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);


    const productsFilter = useMemo(() => {
      // if (data.length > 0) return data;
      let listProducts: TProduct[] = [...products];

      if (productGroup) {
        let tmp = listProducts.filter(
          (value) => value.groupName === productGroup
        );
        listProducts = tmp;
      }
      if (warehouseName) {
        const listProductWarehouse =
          warehouses.filter((value) => value.warehouseName === warehouseName)[0]
            ?.listProduct ?? [];
        let productFilterProductTable = listProductWarehouse.map((value) => {
          let tmp = listProducts.findIndex(
            (warehouse) => warehouse.productId === value.productId
          );
          //console.log(value);
          if (tmp > -1)
            if (isExport) {
              return {
                ...value,
                sell_price: listProducts[tmp].sell_price,
                totalPrice: value.quantity * listProducts[tmp].sell_price, //????
                note: listProducts[tmp].note,
              };
            }
          return {
            ...value,
            cost_price: listProducts[tmp].cost_price,
            totalPrice: value.quantity * listProducts[tmp].cost_price, //????
            note: listProducts[tmp].note,
          };
        });
        listProducts = [...productFilterProductTable];
      }
      if (productName) {
        let tmp = listProducts.filter((value) =>
          value.productName.toLowerCase().includes(productName.toLowerCase())
        );
        listProducts = tmp;
      }

      if (sort?.nameAscending) {
        let tmp = listProducts.sort((a, b) =>
          a.productName.charAt(0) < b.productName.charAt(0) ? -1 : 1
        );
        listProducts = tmp;
      }
      if (sort?.nameDescending) {
        let tmp = listProducts.sort((a, b) =>
          a.productName.charAt(0) > b.productName.charAt(0) ? -1 : 1
        );
        listProducts = tmp;
      }
      if (sort?.quantityAscending) {
        let tmp = listProducts.sort((a, b) =>
          a.quantity < b.quantity ? -1 : 1
        );
        listProducts = tmp;
      }
      if (sort?.quantityDescending) {
        let tmp = listProducts.sort((a, b) =>
          a.quantity > b.quantity ? -1 : 1
        );
        listProducts = tmp;
      }

      if (filterListProduct) {
        let tmp = listProducts.map((value) => {
          let index = filterListProduct.findIndex(
            (filterProduct) => filterProduct.productId === value.productId
          );
          if (index > -1)
            return {
              ...value,
              quantity: filterListProduct[index]?.quantity,
            };

          return;
        });
        //console.log("list Product", tmp);
        listProducts = tmp.filter((value) => value !== undefined);
      }

      return listProducts ?? [];
    }, [
      warehouseName,
      productName,
      sort,
      filterListProduct,
      products,
      data,
      productGroup,
    ]);
    const options: TOptions = {
      productId: true,
      productName: true,
      productGroup: true,
      productGroupName: true,
      productImage: true,
      sell_price: true,
      costPrice: true,
      VAT: true,
      note: true,
      quantity: false,
      totalPrice: false,
      activities: true,
      price: false,
      ...filterOption,
    };
    const HEADER = useMemo(
      () =>
        [
          options.productId && t("product.productId"),
          options.productName && t("product.productName"),
          options.quantity && t("warehouse.quantity"),
          options.productGroup && t("product.productGroup"),
          options.productGroupName && t("product.productGroupName"),
          options.productImage && t("product.productImage"),
          options.sell_price && t("product.sell_price"),
          options.costPrice && t("product.costPrice"),
          options.totalPrice && t("sale.totalPrice"),
          options.VAT && t("product.VAT"),
          options.note && t("note"),
          options.activities && t("activities"),
          options.price && t("product.price"),
        ].filter((value) => Boolean(value) !== false),
      [t, options]
    );
    // const [selectedRows, setSelectedRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const maxPages = useMemo(
      () => Math.round(productsFilter.length / rowsPerPage),
      [productsFilter]
    );
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

    const handleCheckBoxChange = (product?: TProduct) => {
      const rowId = product.productId;
      if (rowId === null) {
        if (selectedRows.length < productsFilter.length) {
          setSelectedRows([
            ...productsFilter.map((content) => content?.productId),
          ]);
          if (data)
            setData([
              ...productsFilter.map((product) => ({ ...product, quantity: 1 })),
            ]);
          return;
        }
        if (selectedRows.length === productsFilter.length) {
          setSelectedRows([]);
          if (data) setData([]);
          return;
        }
      }
      if (selectedRows?.includes(rowId)) {
        setSelectedRows([...selectedRows.filter((id) => id !== rowId)]);
        if (data) setData([...data.filter((item) => item.productId !== rowId)]);

        return;
      }
      setSelectedRows([...selectedRows, rowId]);
      if (data) setData([...data, { ...product, quantity: 1 }]);
    };
    const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(+e.target.value);
    };
    const onDeleteProduct = (productId: string) => {
      idSelected.current = productId;
      setOpen(true);  
    };

    const onUpdate = (product: TProduct) => {
      setOpenModalUpdate(true);
      setDataInput({
        productId: product.productId,
        productName: product.productName,
        groupId: product.groupId,
        groupName: product.groupName,
        image: product.image,
        cost_price: product.cost_price,
        sell_price: product.sell_price,
        VAT: product.VAT,
        note: product.note,
      })
    }

    const onConfirm = async () => {
      await deleteData({ id: idSelected.current, table: "Product" });
      dispatch(deleteProduct({ productId: idSelected.current }));

      // // Create a reference to the file to delete
      const URL = products.find(x => x.productId === idSelected.current).image

      const refimg = ref(
        storage,
        URL
      )
      // Delete the file
      deleteObject(refimg)
      setOpen(false);
      message.success(t("product.deleteProduct"));
      };

    const onGetProducts = () => {
      let tmp = products.map((product) => {
        if (selectedRows?.includes(product.productId))
          return {
            ...product,
            quantity: 1,
          };
      });
      setProducts?.(tmp.filter((product) => product !== undefined));
    };
    useEffect(() => {
      onGetProducts();
    }, [selectedRows]);

    const changeQuantity = (productId: string, value: number) => {
      if (data) {
        let tmp = [...data];
        let index_data = tmp.findIndex(
          (product) => product.productId === productId
        );

        if (index_data > -1) {
          tmp[index_data] = {
            ...tmp[index_data],
            quantity: value,
          };
        }

        setData?.(tmp);
      }
    };
    const getQuantity = (productId: string) => {
      if (data) {
        let tmp = [...data];
        let index_data = tmp.findIndex(
          (product) => product.productId === productId
        );

        if (index_data > -1) {
          return tmp[index_data].quantity;
        }
      }
    };
    return (
      <div className="w-full">
        <div className="max-h-96 overflow-y-auto visible">
          <table
            className="w-full border-collapse border border-gray-300 bg-gray-50"
            ref={reference}
          >
            <thead
              className="bg-gray-200 sticky left-0 z-50"
              style={{ top: -1 }}
            >
              <tr>
                {selectedRows !== undefined && (
                  <th className="border border-gray-300 p-2 text-xs">
                    <input
                      className="w-15 h-15 bg-hover"
                      type="checkbox"
                      onChange={() => handleCheckBoxChange(null)}
                    />
                  </th>
                )}

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
              {productsFilter.map((content, index) => {
                const displayPrice = isExport
                  ? content.sell_price
                  : content.cost_price;
                if (
                  index < currentPage * rowsPerPage &&
                  index >= (currentPage - 1) * rowsPerPage
                )
                  return (
                    <tr key={index}>
                      {selectedRows !== undefined && (
                        <td className="border border-gray-300 p-2">
                          <input
                            className="w-15 h-15 bg-hover"
                            type="checkbox"
                            onChange={() => handleCheckBoxChange(content)}
                            checked={
                              selectedRows?.includes(content?.productId ?? "")
                                ? true
                                : false
                            }
                          />
                        </td>
                      )}
                      {options.productId && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content?.productId}
                        </td>
                      )}
                      {options.productName && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content?.productName}
                        </td>
                      )}
                      {options.quantity && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {selectedRows?.includes(content.productId) &&
                          isEditQuantity ? (
                            <input
                              type="number"
                              inputMode="numeric"
                              min="1"
                              max={content?.quantity}
                              style={{ textAlign: "center", maxWidth: 100 }}
                              placeholder="0"
                              value={
                                getQuantity(content?.productId)?.toString() ??
                                "0"
                              }
                              onChange={(e) => {
                                if (+e.target.value < content?.quantity)
                                  changeQuantity(
                                    content.productId,
                                    +e.target.value
                                  );
                              }}
                            />
                          ) : (
                            content.quantity
                          )}
                        </td>
                      )}

                      {options.productGroup && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content?.groupId}
                        </td>
                      )}
                      {options.productGroupName && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content?.groupName}
                        </td>
                      )}

                      {options.productImage && (
                        <td className="border border-gray-300 p-2 text-sm ">
                          <img
                            src={content?.image}
                            width={45}
                            height={45}
                            className="inline-block"
                          />
                        </td>
                      )}
                      {options.sell_price && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content?.sell_price}
                        </td>
                      )}

                      {options.costPrice && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {displayPrice}
                        </td>
                      )}

                      {options.price && (
                        <Tooltip title={t("sale.tooltipPrice")}>
                          <td className="border border-gray-300 p-2 text-sm ">
                            {content?.price}
                          </td>
                        </Tooltip>
                      )}
                      {options.totalPrice && (
                        <Tooltip title={t("sale.tooltipTotalPrice")}>
                          <td className="border border-gray-300 p-2 text-sm">
                            {selectedRows?.includes(content.productId)
                              ? getQuantity(content.productId) * displayPrice
                              : content?.totalPrice ?? 0}
                          </td>
                        </Tooltip>
                      )}
                      {options.VAT && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content?.VAT}
                        </td>
                      )}
                      {options.note && (
                        <td className="border border-gray-300 p-2 text-sm">
                          {content?.note}
                        </td>
                      )}

                      {options.activities && (
                        <td className="border border-gray-300 p-2 text-sm">
                          <div className="flex items-center gap-1 justify-center">
                            <Button
                              onClick={() => onUpdate(content)}
                            >
                              <FiEdit />
                            </Button>

                            <Button
                              onClick={() =>
                                onDeleteProduct(content?.productId)
                              }
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
        <AlertModal open={open} setOpen={setOpen} onConfirm={onConfirm} />
        <AddNewProduct
            openAddForm={openModalUpdate}
            setOpenAddForm={setOpenModalUpdate}
            isAdd={false}
            data={dataInput}
            setData={setDataInput}
        />
      </div>
    );
  }
);
export default ProductTable;
