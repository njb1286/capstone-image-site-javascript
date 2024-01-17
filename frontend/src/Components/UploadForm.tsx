import { FormEvent, useEffect, useState } from "react";
import classes from "./UploadForm.module.scss";
import { Button, ButtonGroup, Form, FormControl, FormGroup } from "react-bootstrap";
import { useFormField } from "../hooks/useFormField";
import { useNavigate } from "react-router";

export type UploadFormSubmitEvent = (title: string, description: string, image: File | null) => void;

type UploadFormProps = {
  title?: string;
  description?: string;
  updating?: boolean;
  id?: number
  onSubmit: UploadFormSubmitEvent;
}

function UploadForm(props: Readonly<UploadFormProps>) {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
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

    props.onSubmit(title, description, image);
  };

  function makeInitialState<T>(value: T): {
    touched: boolean;
    isValid: boolean;
    value: T;
    errorMessage: string | undefined;
  } {
    return {
      touched: false,
      isValid: false,
      value,
      errorMessage: undefined,
    }
  }

  const [titleComponent, titleValid, title, setTitleTouched, setTitleValid] = useFormField(
    FormControl,
    { as: "input" },
    makeInitialState(props.title ?? ""),
    (event) => event.target.value,
    (value) => {
      if (value.length === 0) {
        return "Title is required"
      }
    }
  );

  const [
    descriptionComponent,
    descriptionValid,
    description,
    setDescriptionTouched,
    setDescriptionValid,
  ] = useFormField(
    FormControl,
    { as: "textarea", style: { height: "300px" } },
    makeInitialState(props.description ?? ""),
    (event) => event.target.value,
    (value) => {
      if (value.length === 0) {
        return "Description is required"
      }
    }
  );

  const [imageComponent, imageValid, image, setImageTouched, setImageValid] = useFormField(
    FormControl,
    { type: "file", accept: "image/*" },
    makeInitialState(null),
    (event) => event.target.files![0],
    (value) => {
      if (!value && props.updating !== true) {
        return "Image is required"
      }
    }
  );

  const setTouchedEvents = [
    setTitleTouched,
    setDescriptionTouched,
    setImageTouched,
  ];

  const setValidEvents = [
    setTitleValid,
    setDescriptionValid,
    setImageValid,
  ]

  useEffect(() => {
    if (props.updating === true) {
      setValidEvents.forEach(setValid => setValid(true));
      setTouchedEvents.forEach(setTouched => setTouched(true));
    }
  }, [])

  return (
    <div className={classes["upload-form"]}>
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

        <ButtonGroup>
          <Button
            disabled={
              !titleValid ||
              !descriptionValid ||
              !imageValid ||
              submitting
            }
            className={classes.btn}
            type="submit"
          >
            Submit
          </Button>

          {props.updating && <Button className={`${classes.btn} btn-danger`} type="button" onClick={() => navigate(`/views?id=${props.id!}`)}>Cancel</Button>}
        </ButtonGroup>
      </Form>
    </div>
  )
}

export default UploadForm;