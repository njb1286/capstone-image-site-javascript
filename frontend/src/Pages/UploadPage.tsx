import { FormEvent } from "react";
import classes from "./UploadPage.module.scss";
import { FormControl, FormGroup } from "react-bootstrap";

function UploadPage() {
  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  return <form className={classes.form} onSubmit={submitHandler}>
    <FormGroup>
      <label htmlFor="image-title">Title</label>
      <FormControl placeholder="Enter title..." id="image-title"></FormControl>
    </FormGroup>

    <FormGroup>
      <label htmlFor="image-file-uploader">Image</label>
      <FormControl type="file" id="image-file-uploader" accept=".png .jpg .jpeg" />
    </FormGroup>
  </form>;
}

export default UploadPage;