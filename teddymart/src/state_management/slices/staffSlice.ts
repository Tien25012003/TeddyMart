import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addData, updateData } from "controller/addData";
import {
  ADD_ORDER,
  ADD_STAFF,
  ADD_STAFF_ACCOUNT,
  DELETE_STAFF,
  RESET_ALL_STORES,
} from "state_management/actions/actions";

const staffSlice = createSlice({
  name: "staffSlice",
  initialState: [],
  reducers: {
    addNewStaff: (state: TStaff[], action: PayloadAction<TStaff>) => {
      state.unshift(action.payload);
    },
    addNewStaffAccount: (state: TStaffAccount[], action: PayloadAction<TStaffAccount>) => {
      state.unshift(action.payload);
    },
    uploadStaff: (state: TStaff[], action: PayloadAction<TStaff[]>) => {
      return [...action.payload];
    },
    deleteStaff: (state: TStaff[], action: PayloadAction<{ id: string }>) => {
      return state.filter((p) => p.id !== action.payload.id);
    },

    updateStaff: (
      state: TStaff[],
      action: PayloadAction<{ id: string; newData: TStaff }>
    ) => {
      // Only allow to update Partner Name, email, phone number, address, total buy amount, debt, note, gender, certificate
      const index = state.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...action.payload.newData };
      }
      return state;
    },
  },
  extraReducers(builder) {
    builder.addCase(RESET_ALL_STORES, (state: TStaff[]) => {
      return [];
    });
    builder.addCase(
      ADD_STAFF,
      (state: TStaff[], action: PayloadAction<TStaff>) => {
        const order = action.payload;
        const index = state.findIndex((s) => s.id === order.id);
        if (index !== -1) {
          addData({
            data: {
              ...state[index],
            },
            table: "Staff",
            id: state[index].id,
          });
        }
      }
    );
    // builder.addCase(
    //   ADD_STAFF_ACCOUNT,
    //   (state: TStaffAccount[], action: PayloadAction<TStaffAccount>) => {
    //     const order = action.payload;
    //     const index = state.findIndex((s) => s.id === order.id);
    //     if (index !== -1) {
    //       addData({
    //         data: {
    //           ...state[index],
    //         },
    //         table: "Staff",
    //         id: state[index].id,
    //       });
    //     }
    //   }
    // );
  },
});
export const { addNewStaff, updateStaff, uploadStaff, deleteStaff, addNewStaffAccount } =
  staffSlice.actions;
export default staffSlice.reducer;
