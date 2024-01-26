import Button from 'react-bootstrap/Button';
import { useState, useRef } from 'react';
import { backendUrl } from '../store/backend-url';
import { getRequestData } from '../helpers/token';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Spinner, Overlay, Tooltip } from 'react-bootstrap';
import classes from "./GeneratePasswordPage.module.scss";
import { FaCopy } from 'react-icons/fa';

/**
 * @typedef {{ message: string } | { password: string }} Response
 */

const GeneratePasswordPage = () => {
  const dispatch = useDispatch();
  /**
   * @type {string}
   */
  const password = useSelector((state) => state.tempPassword);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const copyButtonRef = useRef(null);
  const textAreaRef = useRef(null);

  const generatePasswordHandler = async () => {
    const response = await fetch(`${backendUrl}/generate-password`, getRequestData("GET"));

    if (response.status !== 200) {
      setError("Something went wrong");
      return;
    }

    /**
     * @type {Response}
     */
    const data = await response.json();

    if ("message" in data) {
      setError(data.message);
      return;
    }

    dispatch({
      type: "SET_TEMP_PASSWORD",
      payload: data.password
    });
  }

  const clickHandler = async () => {
    setError(null);
    setFetching(true);
    await generatePasswordHandler();
    setFetching(false);
  }

  const copyHandler = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
    }
  }

  const textAreaClickHandler = () => {
    if (textAreaRef.current) {
      textAreaRef.current.select();
    }
  }

  return (
    <div className={`d-flex fs-4 justify-content-start align-items-center flex-column vh-100 ${classes.container}`}>
      <h1 className={classes.title}>Generate a single use password</h1>

      <Spinner className={`${classes.spinner} ${fetching ? classes.visible : ""}`} variant='primary' animation='border' />

      <Button disabled={fetching} onClick={clickHandler} variant="primary" size="lg" className={classes.button}>
        Generate
      </Button>

      {error && <Alert variant="danger">{error}</Alert>}

      {password && (
        <Alert variant="success" className={classes.success}>
          <div className={classes["message-items"]}>
            <textarea value={password} onClick={textAreaClickHandler} ref={textAreaRef} rows={1} readOnly className={classes["password-text"]} />
            <Overlay target={copyButtonRef.current} show={showTooltip} placement="top">
              {(props) => (
                <Tooltip className={classes.tooltip} id="copy-tooltip" {...props}>
                  Copied!
                </Tooltip>
              )}
            </Overlay>
            <button onClick={copyHandler} ref={copyButtonRef} className={classes["copy-wrapper"]}>
              <div className={classes.copy}>
                <FaCopy />
              </div>
            </button>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default GeneratePasswordPage;