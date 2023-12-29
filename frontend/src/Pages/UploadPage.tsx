import { ChangeEvent, FormEvent, useState } from "react";
import classes from "./UploadPage.module.scss";
import { Button, Form, FormControl, FormGroup } from "react-bootstrap";
import { backendUrl } from "../store/backend-url";

function UploadPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission here
  }

  const imageUploadHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (!event.target.files) return;

    const file = event.target.files[0];
    setSelectedImage(file);

    const formData = new FormData();
    formData.append("image", file);

    fetch(`${backendUrl}/image-upload`, {
      method: "POST",
      body: formData
    })
  }

  return (
    <div className={classes["upload-page"]}>
      <h2>Upload an Image</h2>
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Form.Label>Title</Form.Label>
          <FormControl
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Form.Label>Image</Form.Label>
          <FormControl
            type="file"
            accept="image/*"
            onChange={imageUploadHandler}
          />
        </FormGroup>
        <FormGroup>
          <Form.Label>Description</Form.Label>
          <FormControl
            as="textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            style={{ resize: "vertical", minHeight: "10rem", maxHeight: "50rem" }}
          />
        </FormGroup>
        <Button className={classes.submit} type="submit">Submit</Button>
      </Form>
    </div>
  );
}


export default UploadPage;