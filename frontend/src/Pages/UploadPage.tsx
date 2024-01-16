import { FormEvent, useState } from "react";
import classes from "./UploadPage.module.scss";
import { Button, Form, FormGroup } from "react-bootstrap";
import { backendUrl } from "../store/backend-url";
import { useNavigate } from "react-router";
import { useUpdateImageItems } from "../hooks/useUpdateImageItems";
import { useFormField } from "../hooks/useFormField";


function UploadPage() {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const updateImagesState = useUpdateImageItems();

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Note: this is just in case the user manually changes the button's disabled tag to false
    if (
      !titleValid ||
      !descriptionValid ||
      !imageValid
    ) {
      setTouchedEvents.forEach(setTouched => setTouched(true));
      return;
    }

    setSubmitting(true);

    const formData = new FormData();

    formData.append("image", image!);
    formData.append("title", title);
    formData.append("description", description);

    await fetch(`${backendUrl}/form`, {
      method: "POST",
      body: formData,
    });

    updateImagesState();
    navigate("/");
  };

  function makeInitialState<T>(value: T) {
    return {
      touched: false,
      isValid: false,
      value,
    }
  }

  const [titleComponent, titleValid, title, setTitleTouched] = useFormField({}, makeInitialState(""), event => event.target.value, value => value.length > 0);
  const [descriptionComponent, descriptionValid, description, setDescriptionTouched] = useFormField({}, makeInitialState(""), event => event.target.value, value => value.length > 0);
  const [imageComponent, imageValid, image, setImageTouched] = useFormField({ type: "file" }, makeInitialState(null as File | null), event => event.target.files![0], value => !!value);

  const setTouchedEvents = [
    setTitleTouched,
    setDescriptionTouched,
    setImageTouched,
  ]

  return (
    <div className={classes["upload-page"]}>
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Form.Label>Title</Form.Label>
          {titleComponent}
        </FormGroup>

        <FormGroup>
          <Form.Label>Image</Form.Label>
          {imageComponent}
        </FormGroup>

        <FormGroup>
          <Form.Label>Description</Form.Label>
          {descriptionComponent}
        </FormGroup>

        <Button
          disabled={
            !titleValid ||
            !descriptionValid ||
            !imageValid ||
            submitting
          }
          className={classes.submit}
          type="submit"
        >
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default UploadPage;