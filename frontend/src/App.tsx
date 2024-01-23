import { lazy, Suspense, useEffect, useState } from "react";
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

const AboutPage = lazy(() => import("./Pages/AboutPage"));
const ContentPage = lazy(() => import("./Pages/ContentPage"));
const UploadPage = lazy(() => import("./Pages/UploadPage"));
const UpdatePage = lazy(() => import("./Pages/UpdatePage"));
const HomePage = lazy(() => import("./Pages/HomePage"));
const LoginPage = lazy(() => import("./Pages/LoginPage"));
const GeneratePasswordPage = lazy(() => import("./Pages/GeneratePasswordPage"));

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
            <Route element={<Suspense fallback={loadingPage}><GeneratePasswordPage /></Suspense>} path="/generate-password" />
          </Routes>
        </div>

      </div>
    )
  }

  const returnedComponent = state !== "valid" ? <Routes>
    <Route path="/" element={component} />
  </Routes> : component;

  if (location.pathname.startsWith("/api")) return;

  return (
    <BrowserRouter>
      {returnedComponent}
    </BrowserRouter>
  )
}

export default App
