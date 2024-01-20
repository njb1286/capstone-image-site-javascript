import { FormEvent, useEffect, useState } from "react";
import classes from "./UploadForm.module.scss";
import { Button, ButtonGroup, Form, FormControl, FormGroup, Spinner } from "react-bootstrap";
import { useFormField } from "../hooks/useFormField";
import { useNavigate } from "react-router";
import { Category, categories } from "../store/images-store";
import CategoriesDropdown from "../Components/CategoriesDropdown";

export type UploadFormSubmitEvent = (title: string, description: string, image: File | null, category: Category) => Promise<void>;

type UploadFormProps = {
  title?: string;
  description?: string;
  updating?: boolean;
  id?: number
  onSubmit: UploadFormSubmitEvent;
  category?: Category;
}

// Do not mistake this for a component, it was converted from a component to a hook
export function useUploadForm(props: Readonly<UploadFormProps>) {
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState<Category>(props.category ?? "Other");
  const [isError, setIsError] = useState(false);

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

    props.onSubmit(title, description, image, category);
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

  const [titleComponent, titleValid, title, setTitleTouched, setTitleValid, setTitleValue] = useFormField(
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
    setDescriptionValue,
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
  }, []);

  const errorHandler = () => {
    setIsError(true);
    setSubmitting(false);
  }

  const setValues = (title: string, description: string, category: Category) => {
    setTitleValue(title);
    setDescriptionValue(description);
    setCategory(category);
  }

  const errorMessage = <p className={`text-danger`}>An error occurred!</p>;

  const component = (
    <div className={classes["upload-form"]}>
      <Form onSubmit={submitHandler}>
        <div className={classes["form-items"]}>
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

          <FormGroup>
            <Form.Label>Category</Form.Label>
            <CategoriesDropdown className={classes.dropdown} onSelect={setCategory} categories={categories} default={category} />
          </FormGroup>
        </div>

          <Spinner className={`${classes.spinner} ${submitting ? classes.visible : ""}`} variant="primary" animation="border" />

          <ButtonGroup className={classes.buttons}>
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

      {isError && errorMessage}
    </div>
  )

  return [component, errorHandler, setValues] as const;
}