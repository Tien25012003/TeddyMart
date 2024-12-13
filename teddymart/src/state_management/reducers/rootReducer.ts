import { combineReducers } from "@reduxjs/toolkit";
import groupProductSlice from "state_management/slices/groupProductSlice";
import managerSlice from "state_management/slices/managerSlice";
import orderSlice from "state_management/slices/orderSlice";
import partnerSlice from "state_management/slices/partnerSlice";
import productSlice from "state_management/slices/productSlice";
import voucherSlice from "state_management/slices/voucherSlice";
import warehouseSlice from "state_management/slices/warehouseSlice";
import controlSlice, { TControl } from "state_management/slices/controlSlice";
import reportSlice from "state_management/slices/reportSlice";
import reportProduct from "state_management/slices/reportProduct";
import shelfSlice from "state_management/slices/shelfSlice";
import notificationSlice, {
  TNotification,
} from "state_management/slices/notificationSlice";
import staffSlice from "state_management/slices/staffSlice";
import warrantySlice from "state_management/slices/warrantySlice";
export type RootState = {
  partnerSlice: TPartner[];
  voucherSlice: TVoucher[];
  warehouseSlice: TWarehouse[];
  product: TProduct[];
  groupProduct: TGroupProduct[];
  manager: TManager;
  order: TOrder[];
  reportSlice: TReportSlice;
  controlSlice: TControl;
  reportProduct: TReportProduct[];
  shelf: TShelf[];
  notificationSlice: TNotification[];
  staffSlice: TStaff[];
  warrantySlice: TWarranty[];
};

const rootReducer = combineReducers({
  partnerSlice: partnerSlice,
  voucherSlice: voucherSlice,
  warehouseSlice: warehouseSlice,
  product: productSlice,
  manager: managerSlice,
  order: orderSlice,
  groupProduct: groupProductSlice,
  shelf: shelfSlice,
  controlSlice: controlSlice,
  reportSlice: reportSlice,
  reportProduct: reportProduct,
  notificationSlice: notificationSlice,
  staffSlice: staffSlice,
  warrantySlice: warrantySlice,
});
export default rootReducer;
