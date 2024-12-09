import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RESET_ALL_STORES } from "state_management/actions/actions";
const warrantySlice = createSlice({
  name: "warrantySlice",
  initialState: [],
  reducers: {
    addNewWarranty: (state: TWarranty[], action: PayloadAction<TWarranty>) => {
      state.unshift(action.payload);
    },
    uploadWarranty: (
      state: TWarranty[],
      action: PayloadAction<TWarranty[]>
    ) => {
      return [...action.payload];
    },
    deleteWarranty: (
      state: TWarranty[],
      action: PayloadAction<Pick<TWarranty, "warrantyId">>
    ) => {
      return state.filter((w) => w.warrantyId !== action.payload.warrantyId);
    },
    deleteMultiWarranty: (
      state: TWarranty[],
      action: PayloadAction<string[]>
    ) => {
      return state.filter((w) => !action.payload.includes(w.warrantyId));
    },
    updateWarranty: (
      state: TWarranty[],
      action: PayloadAction<{
        currentWarranty: TWarranty;
        newWarranty: TWarranty;
      }>
    ) => {
      const index = state.findIndex(
        (w) => w.warrantyId === action.payload.currentWarranty.warrantyId
      );
      if (index !== -1) {
        state[index] = { ...action.payload.newWarranty };
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_ALL_STORES, (state: TWarranty[]) => {
      return [];
    });
  },
});

export const {
  addNewWarranty,
  uploadWarranty,
  deleteWarranty,
  updateWarranty,
  deleteMultiWarranty,
} = warrantySlice.actions;
export default warrantySlice.reducer;
