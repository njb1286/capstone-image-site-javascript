import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Components/Header";

import classes from "./App.module.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ContentPage from "./Pages/ContentPage";
import AboutPage from "./Pages/AboutPage";
import UploadPage from "./Pages/UploadPage";
import { useEffect } from "react";
import { useUpdateImageItems } from "./hooks/useUpdateImageItems";
import UpdatePage from "./Pages/UpdatePage";
import { useSelector } from "react-redux";
import { StoreState } from "./store/combined-stores";
import OverlayModal from "./Components/OverlayModal";

function App() {
  const updateImageItems = useUpdateImageItems();

  const modalState = useSelector((state: StoreState) => state.modal);

  useEffect(() => {
    updateImageItems();
  }, [updateImageItems]);

  return (
    <BrowserRouter>
      <OverlayModal {...modalState} />

      <div className={classes["column-wrapper"]}>
        <div className={classes.column}>
          <Header />

          <Routes>
            <Route Component={HomePage} path="/" />

            <Route element={<AboutPage />} path="/about" />
            <Route element={<ContentPage />} path="/views/*" />
            <Route element={<UploadPage />} path="/upload" />
            <Route element={<UpdatePage />} path="/update" />
          </Routes>
        </div>

      </div>

    </BrowserRouter>
  )
}

export default App
