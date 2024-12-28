import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import addNotification from "react-push-notification";
import { DELETE_PRODUCT } from "state_management/actions/actions";
import { RESET_ALL_STORES } from "state_management/actions/actions";
import { store } from "state_management/stores/store";
import { addNotificationFirebase, updateProductFirebase } from "utils/appUtils";
import { addNotifications } from "./notificationSlice";
import { updateData } from "controller/addData";
type WarehouseUpdate = {
  warehouseName: string;
  listProduct: {
    productId: string;
    productName: string;
    quantity: number;
    numberOnShelf?: number;
  }[];
};
const warehouseSlice = createSlice({
  name: "warehouseSlice",
  initialState: [],
  reducers: {
    addNewWarehouse: (
      state: TWarehouse[],
      action: PayloadAction<TWarehouse>
    ) => {
      state.unshift(action.payload);
    },
    uploadWarehouse: (
      state: TWarehouse[],
      action: PayloadAction<TWarehouse[]>
    ) => {
      return [...action.payload];
    },
    deleteWarehouse: (
      state: TWarehouse[],
      action: PayloadAction<Pick<TWarehouse, "warehouseId">>
    ) => {
      return state.filter((w) => w.warehouseId !== action.payload.warehouseId);
    },
    deleteMultiOrder: (
      state: TWarehouse[],
      action: PayloadAction<string[]>
    ) => {
      return state.filter((w) => !action.payload.includes(w.warehouseId));
    },
    updateWarehouse: (
      state: TWarehouse[],
      action: PayloadAction<{ warehouseId: string; updatedData: TWarehouse }>
    ) => {
      const index = state.findIndex(
        (w) => w.warehouseId === action.payload.warehouseId
      );
      if (index > 0) {
        state[index] = { ...action.payload.updatedData };
      }
    },
    updateProductWarehouse: (
      state: TWarehouse[],
      action: PayloadAction<{
        userId: string;
        listUpdate: WarehouseUpdate[];
        // warehouseName: string;
        // listProduct: {
        //   productId: string;
        //   productName: string;
        //   quantity: number;
        // }[];
        type: "Import" | "Export";
        isDelete: boolean;
      }>
    ) => {
      console.log("v1", state.length);

      for (const item of action.payload.listUpdate) {
        const warehouseIndex = state.findIndex(
          (w) => w.warehouseName === item.warehouseName
        );
        const count =
          item.listProduct.reduce((pre, cur) => pre + cur.quantity, 0) *
          (action.payload.type === "Import" ? 1 : -1);
        console.log("update product warehouse", warehouseIndex);
        if (warehouseIndex > -1) {
          let listProduct = state[warehouseIndex].listProduct;
          console.log("v2", listProduct);

          let products = item.listProduct;
          console.log("v3", products);

          for (let index = 0; index < products.length; index++) {
            const element = products[index];
            console.log("element", element);
            let index_product = listProduct.findIndex(
              (product) => product.productId === element.productId
            );
            console.log(
              "index product",
              index_product,
              listProduct[index_product]
            );

            if (index_product > -1) {
              if (action.payload.type === "Import")
                listProduct[index_product] = {
                  ...listProduct[index_product],
                  quantity: !action.payload.isDelete
                    ? listProduct[index_product].quantity + element.quantity
                    : listProduct[index_product].quantity - element.quantity,
                };
              else {
                listProduct[index_product] = {
                  ...listProduct[index_product],
                  quantity: !action.payload.isDelete
                    ? listProduct[index_product].quantity - element.quantity
                    : listProduct[index_product].quantity + element.quantity,
                  numberOnShelf: element.numberOnShelf,
                };
              }
            } else {
              listProduct = [...state[warehouseIndex].listProduct, element];
            }
          }

          state[warehouseIndex] = {
            ...state[warehouseIndex],
            listProduct: listProduct,
            count:
              state[warehouseIndex].count +
              count *
                (action.payload.isDelete || action.payload.type === "Export"
                  ? -1
                  : 1),
          };
          updateProductFirebase(
            action.payload.userId,
            state[warehouseIndex].warehouseId,
            listProduct,
            count *
              (action.payload.isDelete || action.payload.type === "Export"
                ? -1
                : 1)
          );
        }
      }
    },

    updateShelfWarehouse: (
      state: TWarehouse[],
      action: PayloadAction<{
        warehouseName: string;
        product: TProduct;
        numberOnShelf: number;
        userId: string;
      }>
    ) => {
      const warehouseIndex = state.findIndex(
        (w) => w.warehouseName === action.payload.warehouseName
      );
      if (warehouseIndex > -1) {
        const productIndex = state[warehouseIndex].listProduct.findIndex(
          (p) => p.productId === action.payload.product?.productId
        );
        if (productIndex !== -1) {
          state[warehouseIndex].listProduct[productIndex] = {
            ...state[warehouseIndex].listProduct[productIndex],
            numberOnShelf: action.payload.numberOnShelf,
          };
          updateProductFirebase(
            action.payload.userId,
            state[warehouseIndex].warehouseId,
            state[warehouseIndex].listProduct,
            0
          );
        }
      }
    },
    deleteProductWarehouse: (
      state: TWarehouse[],
      action: PayloadAction<{ products: TProduct[] }>
    ) => {
      const productNames = action.payload.products.map((p) => p.productName);
      state?.forEach((s) => {
        const tmp = s.listProduct;
        s.listProduct = s.listProduct.filter(
          (p) => !productNames.includes(p.productName)
        );
        if (tmp.length !== s.listProduct.length) {
          updateData({ data: s, table: "Ware_House", id: s.warehouseId });
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_ALL_STORES, (state: TWarehouse[]) => {
      return [];
    });
  },
});
export const {
  addNewWarehouse,
  uploadWarehouse,
  deleteWarehouse,
  deleteMultiOrder,
  updateWarehouse,
  updateProductWarehouse,
  updateShelfWarehouse,
  deleteProductWarehouse,
} = warehouseSlice.actions;
export default warehouseSlice.reducer;
