import { FormEvent, useEffect, useState } from "react";
import classes from "./UploadForm.module.scss";
import { Button, ButtonGroup, Form, FormControl, FormGroup, Spinner } from "react-bootstrap";
import { useFormField } from "./useFormField";
import { useNavigate } from "react-router";
import { categories } from "../types/category";
import DropDown from "../Components/DropDown";
import { Category } from "../types";

/**
 * @typedef {(title: string, description: string, image: File | null, category: Category) => Promise<void>} UploadFormSubmitEvent
 */

/**
 * @typedef {{
 *  title?: string;
 *  description?: string;
 *  updating?: boolean;
 *  id?: number
 *  onSubmit: UploadFormSubmitEvent;
 *  category?: Category;
 * }} UploadFormProps
 */

/**
 * @param {UploadFormProps} props
 * @returns {[JSX.Element, () => void, (title: string, description: string, category: Category) => void]}
 */

type UploadFormProps = {
  title?: string;
  description?: string;
  updating?: boolean;
  id?: number;
  onSubmit: (title: string, description: string, image: File, category: Category) => Promise<void>;
  category?: Category;

}

// Do not mistake this for a component, it was converted from a component to a hook
export function useUploadForm(props: UploadFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState(props.category ?? "Other");
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

  /**
   * @template T
   * @param {T} value
   * @returns {{
   *  touched: boolean;
   *  isValid: boolean;
   *  value: T;
   *  errorMessage: string | undefined;
   * }}
   */
  function makeInitialState(value) {
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
    { type: "file", accept: "image/png, image/jpeg, image/jpg" },
    makeInitialState(null),
    (event) => event.target.files[0],
    (value) => {
      if (!value) {
        if (props.updating) return undefined;

        return "Image is required";
      }

      const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validImageTypes.includes(value.type)) {
        return "Image must be a png, jpeg, or jpg";
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

  /**
   * @param {string} title 
   * @param {string} description 
   * @param {Category} category 
   */
  const setValues = (title, description, category) => {
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
            <DropDown className={classes.dropdown} onSelect={setCategory} categories={categories} defaultValue={category} />
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

          {props.updating && <Button className={`${classes.btn} btn-danger`} type="button" onClick={() => navigate(`/views?id=${props.id}`)}>Cancel</Button>}
        </ButtonGroup>
      </Form>

      {isError && errorMessage}
    </div>
  )

  return [component, errorHandler, setValues];
}