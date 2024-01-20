import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./App.module.scss";
import Header from "./Components/Header";
import LoadingPage from "./Components/LoadingPage";
import { validateToken } from "./helpers/validateToken";
import { getToken } from "./helpers/token";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { ImageActions, ImageState } from "./store/images-store";

const lazyLoader = (path: string) => React.lazy(() => import(/* @vite-ignore */path));

const AboutPage = lazyLoader("./Pages/AboutPage");
const ContentPage = lazyLoader("./Pages/ContentPage");
const UploadPage = lazyLoader("./Pages/UploadPage");
const UpdatePage = lazyLoader("./Pages/UpdatePage");
const HomePage = lazyLoader("./Pages/HomePage");
const LoginPage = lazyLoader("./Pages/LoginPage");

type State = "loading" | "login" | "valid";

function App() {
  const [state, setState] = useState<State>("loading");
  const dispatch = useDispatch<Dispatch<ImageActions>>();
  const token = useSelector((state: ImageState) => state.token);

  const loadingPage = <LoadingPage />;

  useEffect(() => {
    const getTokenIsValid = async () => {
      const isValid = await validateToken(token);

      if (isValid) {
        setState("valid");
        return;
      }

      setState("login");
    }

    getTokenIsValid();
  }, [token]);

  useEffect(() => {
    const token = getToken();

    dispatch({
      type: "SET_TOKEN",
      payload: token,
    })
  }, []);

  let component = <LoadingPage />;

  if (state === "login") {
    component = <Suspense fallback={loadingPage}><LoginPage /></Suspense>;
  }

  if (state === "valid") {
    component = (
      <div className={classes["column-wrapper"]}>
        <div className={classes.column}>
          <Header />

          <Routes>
            <Route element={<Suspense fallback={loadingPage}><HomePage /></Suspense>} path="/" />

            <Route element={<Suspense fallback={loadingPage}><AboutPage /></Suspense>} path="/about" />
            <Route element={<Suspense fallback={loadingPage}><ContentPage /></Suspense>} path="/views/*" />
            <Route element={<Suspense fallback={loadingPage}><UploadPage /></Suspense>} path="/upload" />
            <Route element={<Suspense fallback={loadingPage}><UpdatePage /></Suspense>} path="/update" />
          </Routes>
        </div>

      </div>
    )
  }

  const returnedComponent = state !== "valid" ? <Routes>
    <Route path="/*" element={component} />
  </Routes> : component;

  return (
    <BrowserRouter>
      {returnedComponent}
    </BrowserRouter>
  )
}

export default App
