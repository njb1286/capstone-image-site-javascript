import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./App.module.scss";
import Header from "./Components/Header";
import LoadingPage from "./Components/LoadingPage";
import { validateToken } from "./helpers/validateToken";

// TODO: Remove these imports
import UploadForm from "./Components/UploadForm";

const AboutPage = lazy(() => import("./Pages/AboutPage"));
const ContentPage = lazy(() => import("./Pages/ContentPage"));
const UploadPage = lazy(() => import("./Pages/UploadPage"));
const UpdatePage = lazy(() => import("./Pages/UpdatePage"));
const HomePage = lazy(() => import("./Pages/HomePage"));
const LoginPage = lazy(() => import("./Pages/LoginPage"));
const GeneratePasswordPage = lazy(() => import("./Pages/GeneratePasswordPage"));
const PageNotFound = lazy(() => import("./Pages/PageNotFound"));

type LoadingState = "loading" | "login" | "valid";

function App() {
  const [state, setState] = useState<LoadingState>("loading");

  const [serverFound, setServerFound] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("_token");    

    const getTokenIsValid = async () => {
      const response = await validateToken(token);

      if ("status" in response) {
        setServerFound(false);
        return;
      }

      if (response.valid) {
        setState("valid");        
        return;
      }

      setState("login");
    }

    getTokenIsValid();
  }, []);

  const loginPageSubmitHandler = (valid: boolean) => {
    if (valid) {
      setState("valid");
      return;
    }

    setState("login");
  }

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
    component = <Suspense fallback={loadingPage}><LoginPage onSubmit={loginPageSubmitHandler} /></Suspense>;
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
