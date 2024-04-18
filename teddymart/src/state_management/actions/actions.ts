import { createAction } from "@reduxjs/toolkit";

export const RESET_ALL_STORES = createAction("RESET_ALL_STORES");
export const ADD_ORDER = createAction("ADD_ORDER");
export const DELETE_ORDER = createAction("DELETE_ORDER");
export const UPDATE_ORDER = createAction("UPDATE_ORDER");
export const DELETE_PRODUCT = createAction("DELETE_PRODUCT");
export const ADD_STAFF = createAction("ADD_STAFF");
export const DELETE_STAFF = createAction("DELETE_STAFF");
export const UPDATE_STAFF = createAction("UPDATE_STAFF");
export const ADD_STAFF_ACCOUNT = createAction("ADD_STAFF_ACCOUNT")
