import { FormEvent } from "react";
import classes from "./UploadPage.module.scss";

function UploadPage() {
  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  return <form className={classes.form} onSubmit={submitHandler}>
    <div className="form-group">
      <label htmlFor="image-title">Title</label>
      <input placeholder="Enter title..." type="text" className="form-control" id="image-title" />
    </div>
  </form>;
}

export default UploadPage;