import RootRoutes from "./routes/route/RootRoutes";
import { store, persistor } from "state_management/stores/store";
import { Provider } from "react-redux";
import { Notifications } from "react-push-notification";
import Draft from "./views/Draft/Draft";
import { PersistGate } from "redux-persist/lib/integration/react";
import { useHistory, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { NAV_LINK } from "routes/components/NAV_LINK";
import Hotjar from "@hotjar/browser";
const siteId = 3926064;
const hotjarVersion = 6;
Hotjar.init(siteId, hotjarVersion);
const App = () => {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={<div>loading...</div>} persistor={persistor}>
        <>
          <RootRoutes />
          <Notifications />
        </>
      </PersistGate> */}
      <RootRoutes />
      <Notifications />
    </Provider>
  );
};

export default App;
