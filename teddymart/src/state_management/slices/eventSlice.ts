import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RESET_ALL_STORES } from "state_management/actions/actions";
const eventSlice = createSlice({
  name: "eventSlice",
  initialState: [],
  reducers: {
    addNewEvent: (state: TEvent[], action: PayloadAction<TEvent>) => {
      state.unshift(action.payload);
    },
    uploadEvent: (state: TEvent[], action: PayloadAction<TEvent[]>) => {
      return [...action.payload];
    },
    deleteEvent: (
      state: TEvent[],
      action: PayloadAction<Pick<TEvent, "eventId">>
    ) => {
      return state.filter((w) => w.eventId !== action.payload.eventId);
    },
    deleteMultiEvent: (state: TEvent[], action: PayloadAction<string[]>) => {
      return state.filter((w) => !action.payload.includes(w.eventId));
    },
    updateEvent: (
      state: TEvent[],
      action: PayloadAction<{
        currentEvent: TEvent;
        newEvent: TEvent;
      }>
    ) => {
      const index = state.findIndex(
        (w) => w.eventId === action.payload.currentEvent.eventId
      );
      if (index !== -1) {
        state[index] = { ...action.payload.newEvent };
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_ALL_STORES, (state: TEvent[]) => {
      return [];
    });
  },
});

export const {
  addNewEvent,
  deleteEvent,
  deleteMultiEvent,
  updateEvent,
  uploadEvent,
} = eventSlice.actions;
export default eventSlice.reducer;
