import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./App.module.scss";
import Header from "./Components/Header";
import LoadingPage from "./Components/LoadingPage";
import { validateToken } from "./helpers/validateToken";
import { getToken } from "./helpers/token";
import { useDispatch, useSelector } from "react-redux";

// TODO: Remove these imports
import UploadForm from "./Components/UploadForm";
import { ImageState } from "./store/images-store";


const AboutPage = lazy(() => import("./Pages/AboutPage"));
const ContentPage = lazy(() => import("./Pages/ContentPage"));
const UploadPage = lazy(() => import("./Pages/UploadPage"));
const UpdatePage = lazy(() => import("./Pages/UpdatePage"));
const HomePage = lazy(() => import("./Pages/HomePage"));
const LoginPage = lazy(() => import("./Pages/LoginPage"));
const GeneratePasswordPage = lazy(() => import("./Pages/GeneratePasswordPage"));
const PageNotFound = lazy(() => import("./Pages/PageNotFound"));

function App() {
  const [state, setState] = useState("loading");
  const dispatch = useDispatch();

  const token = useSelector((state: ImageState) => state.token);
  const [serverFound, setServerFound] = useState(true);

  useEffect(() => {
    const getTokenIsValid = async () => {
      const isValid = await validateToken(token);

      if ("status" in isValid) {
        setServerFound(false);
        return;
      }

      if (isValid.valid) {
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

  if (!serverFound) return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontSize: "2rem"
    }}>
      <h1>We apologize for the inconvenience</h1>
      <p>Our server appears to be down. Please try again later</p>
    </div>
  );

  const loadingPage = <LoadingPage />;

  let component = loadingPage;

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
            <Route element={<Suspense fallback={loadingPage}><UploadPage redirect="/" /></Suspense>} path="/upload" />
            <Route element={<Suspense fallback={loadingPage}><UpdatePage /></Suspense>} path="/update" />
            <Route element={<Suspense fallback={loadingPage}><GeneratePasswordPage /></Suspense>} path="/generate-password" />
            <Route element={<Suspense fallback={loadingPage}><PageNotFound hasLink message="Hmmm... we couldn't find that page" /></Suspense>} path="/*" />
            <Route element={<UploadForm />} path="/upload-form" />
          </Routes>
        </div>

      </div>
    )
  }

  const returnedComponent = state !== "valid" ? <Routes>
    <Route path="/*" element={component} />
  </Routes> : component;

  if (location.pathname.startsWith("/api")) return;

  return (
    <BrowserRouter>
      {returnedComponent}
    </BrowserRouter>
  )
}

export default App
