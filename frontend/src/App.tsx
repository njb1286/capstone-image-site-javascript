import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Components/Header";

import classes from "./App.module.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Pages/Home";
import { Provider } from "react-redux";
import { imageStore } from "./store/images-store";

function App() {
  return (
    <Provider store={imageStore}>
      <BrowserRouter>
        <div className={classes["column-wrapper"]}>
          <div className={classes.column}>
            <Header />

            <Routes>
              <Route Component={Home} path="/" />
            </Routes>
          </div>

        </div>

      </BrowserRouter>
    </Provider>
  )
}

export default App
