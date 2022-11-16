import React, { useEffect } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import { ThemeProvider } from "@mui/material";

import { browserRouter } from "_routes/routes";

import theme from "_theme";

import { setAuthToken } from "_axios/";

import { actions } from "src/store/slices/auth.slice";

import { getProfile } from "_api/auth.api";

import "_styles/index.scss";
import { isSuccess } from "_func/";

const router = createBrowserRouter(browserRouter);

function App() {
  //#region Data
  const dispatch = useDispatch();

  const token = localStorage.getItem("access_token");

  const { isLogined } = useSelector((state) => state.auth.isLogined);
  //#endregion

  useEffect(() => {
    const init = async () => {
      try {
        if (token) {
          await setAuthToken(token);

          const res = await getProfile();

          if (isSuccess(res)) dispatch(actions.setProfile(res.data));
        } else {
          console.log("Logout");
        }
      } catch (error) {
        console.log(error);
      }
    };

    !isLogined && init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogined]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;
