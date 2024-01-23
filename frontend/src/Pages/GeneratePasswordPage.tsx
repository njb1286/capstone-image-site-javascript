import Button from 'react-bootstrap/Button';

import classes from "./GeneratePasswordPage.module.scss";

const GeneratePasswordPage = () => {
  return (
    <div className={`d-flex fs-4 justify-content-start align-items-center flex-column vh-100 ${classes.container}`}>
      <h1 className={classes.title}>Generate a single use password</h1>
      <Button variant="primary" size="lg" className={classes.button}>
        Generate
      </Button>
    </div>
  );
};

export default GeneratePasswordPage;