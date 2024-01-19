import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./App.module.scss";
import Header from "./Components/Header";
import { useUpdateImageItems } from "./hooks/useUpdateImageItems";

const AboutPage = lazy(() => import("./Pages/AboutPage"));
const ContentPage = lazy(() => import("./Pages/ContentPage"));
const UploadPage = lazy(() => import("./Pages/UploadPage"));
const UpdatePage = lazy(() => import("./Pages/UpdatePage"));
const HomePage = lazy(() => import("./Pages/HomePage"));

function App() {
  const updateImageItems = useUpdateImageItems();

  useEffect(() => {
    updateImageItems();
  }, [updateImageItems]);

  return (
    <BrowserRouter>

      <div className={classes["column-wrapper"]}>
        <div className={classes.column}>
          <Header />

          <Routes>
            <Route element={<Suspense><HomePage /></Suspense>} path="/" />

            <Route element={<Suspense><AboutPage /></Suspense>} path="/about" />
            <Route element={<Suspense><ContentPage /></Suspense>} path="/views/*" />
            <Route element={<Suspense><UploadPage /></Suspense>} path="/upload" />
            <Route element={<Suspense><UpdatePage /></Suspense>} path="/update" />
          </Routes>
        </div>

      </div>

    </BrowserRouter>
  )
}

export default App
