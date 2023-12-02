import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Components/Header";

import classes from "./App.module.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import { Provider } from "react-redux";
import { imageStore } from "./store/images-store";
import ContentPage from "./Pages/ContentPage";
import AboutPage from "./Pages/AboutPage";
import UploadPage from "./Pages/UploadPage";

function App() {
  return (
    <Provider store={imageStore}>
      <BrowserRouter>
        <div className={classes["column-wrapper"]}>
          <div className={classes.column}>
            <Header />

            <Routes>
              <Route Component={HomePage} path="/" />

              <Route element={<AboutPage />} path="/about" />
              <Route element={<ContentPage />} path="/views/*" />
              <Route element={<UploadPage />} path="/upload" />
            </Routes>
          </div>

        </div>

      </BrowserRouter>
    </Provider>
  )
}

export default App
