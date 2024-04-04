import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "state_management/reducers/rootReducer";
import { composeWithDevTools } from "@redux-devtools/extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage: storage,
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  //reducer: rootReducer,
  reducer: pReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  // devTools: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
});
export const persistor = persistStore(store);
