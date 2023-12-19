import { ChangeEvent, FormEvent, useState } from "react";
import classes from "./UploadPage.module.scss";
import { FormControl, FormGroup } from "react-bootstrap";
import { backendUrl } from "../store/backend-url";

function UploadPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  const imageUploadHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (!event.target.files) return;

    const file = event.target.files[0];
    setSelectedImage(file);

    fetch(`${backendUrl}/image-upload`, {
      method: "POST",
      body: JSON.stringify(file)
    })
  }

  return <form className={classes.form} onSubmit={submitHandler}>
    <FormGroup>
      <label htmlFor="image-title">Title</label>
      <FormControl placeholder="Enter title..." id="image-title"></FormControl>
    </FormGroup>

    <FormGroup>
      <label htmlFor="image-file-uploader">Image</label>
      <FormControl type="file" id="image-file-uploader" accept=".png, .jpg, .jpeg" onChange={imageUploadHandler} />
    </FormGroup>
  </form>;
}

export default UploadPage;