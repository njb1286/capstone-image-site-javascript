import { ChangeEvent, FormEvent, useState } from 'react';

import classes from "./LoginPage.module.scss";

import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { backendUrl } from '../store/backend-url';
import { getToken, setToken } from '../helpers/token';
import { useDispatch } from 'react-redux';

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [isSingleUse, setIsSingleUse] = useState(false);

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsError(false);

    setIsSubmitting(true);

    const response = await fetch(`${backendUrl}/login`, {
      method: "POST",
      headers: {
        password,
        token: getToken() ?? "",
        singleUse: isSingleUse.toString(),
      }
    });

    const data = await response.json() as { message: string } | { token: string };

    setIsSubmitting(false);
    setPassword("");

    if ("token" in data) {
      setToken(data.token);
      dispatch({
        type: "SET_TOKEN",
        payload: data.token,
      })
      return;
    }

    setIsError(true);
  }

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const switchHandler = () => {
    setIsSingleUse(prevState => !prevState);
  }

  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <Form onSubmit={submitHandler} className={classes.form}>
        <Form.Group className={classes.group} controlId="formPassword">
          <h2 className="text-center">Password</h2>
          <Form.Control value={password} onChange={changeHandler} disabled={isSubmitting} type="password" placeholder="Enter password" />
          <Form.Check
            type="checkbox"
            label="Single-use password"
            checked={isSingleUse}
            onChange={switchHandler}
            className={classes.switch}
            id="single-use-password-input"
          />
          {isError && <p className="text-danger fs-3">Incorrect password!</p>}
        </Form.Group>
        {isSubmitting && <Spinner variant='primary' animation='border' />}
        <Button className={classes.button} variant="primary" type="submit" disabled={isSubmitting}>
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
