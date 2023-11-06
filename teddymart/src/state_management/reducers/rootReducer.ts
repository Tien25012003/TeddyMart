import { combineReducers } from "@reduxjs/toolkit";
import groupProductSlice from "state_management/slices/groupProductSlice";
import managerSlice from "state_management/slices/managerSlice";
import orderSlice from "state_management/slices/orderSlice";
import partnerSlice from "state_management/slices/partnerSlice";
import productSlice from "state_management/slices/productSlice";
import voucherSlice from "state_management/slices/voucherSlice";
import warehouseSlice from "state_management/slices/warehouseSlice";
export type RootState = {
  partnerSlice: TPartner[];
  voucherSlice: TVoucher[];
  warehouseSlice: TWarehouse[];
  product: TProduct[];
  groupProduct: TGroupProduct[];
  manager: TManager[],
  order: TOrder[];
};

const rootReducer = combineReducers({
  partnerSlice: partnerSlice,
  voucherSlice: voucherSlice,
  warehouseSlice: warehouseSlice,
  product: productSlice,
  manager: managerSlice,
  order: orderSlice,
  groupProduct: groupProductSlice,
});
export default rootReducer;